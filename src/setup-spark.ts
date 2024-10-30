import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';

// See docs to create gh action: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
const log = (msg: string) => {
  core.info(`${new Date().toLocaleTimeString('fr-FR')} - ${msg}`);
};

async function run() {
  try {
    const sparkVersion = core.getInput('spark-version');
    const hadoopVersion = core.getInput('hadoop-version');
    const scalaVersion = core.getInput('scala-version');
    const py4jVersion = core.getInput('py4j-version');
    const xmx = core.getInput('xmx');
    const xms = core.getInput('xms');
    const logLevel = core.getInput('log-level');
    let sparkUrl = core.getInput('spark-url');

    // Try to write to the parent folder of the workflow workspace
    const workspaceFolder = process.env.GITHUB_WORKSPACE || '/home/runner/work';
    let installFolder = core.getInput('install-folder') || workspaceFolder.split('/').slice(0, -1).join('/');
    try {
      fs.accessSync(installFolder, fs.constants.R_OK);
    } catch (error) {
      if (core.getInput('install-folder')) throw new Error(`The install folder ${installFolder} is not writable`);
      log(`Using $GITHUB_WORKSPACE to store Spark (${installFolder} not writable)`);
      installFolder = workspaceFolder;
    }
    log(`Spark will be installed to ${installFolder}`);

    const scalaBit = scalaVersion ? `-scala${scalaVersion}` : '';
    let sparkHome = `${installFolder}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}${scalaBit}`;

    const cachedSpark = tc.find('spark', sparkVersion);
    if (cachedSpark) {
      log(`Using Spark from cache ${cachedSpark}`);
      sparkHome = cachedSpark;
    } else if (sparkUrl) {
      // URL provided directly by user
      await download(sparkUrl, installFolder);
    } else {
      // If URL not provided directly, we try to download from official recommended https://spark.apache.org/downloads.html
      sparkUrl = `https://dlcdn.apache.org/spark/spark-${sparkVersion}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}${scalaBit}.tgz`;
      try {
        await download(sparkUrl, installFolder);
      } catch (error) {
        log(`Faster recommended download URL not available, downloading from Apache Archives.`);
        sparkUrl = `https://archive.apache.org/dist/spark/spark-${sparkVersion}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}${scalaBit}.tgz`;
        await download(sparkUrl, installFolder);
      }
    }

    if (!fs.existsSync(`${sparkHome}/bin/spark-submit`)) {
      throw new Error(`The Spark binary downloaded from ${sparkUrl} could not be found in ${sparkHome}`);
    }

    log(`Spark binary downloaded, setting up environment variables and cache`);
    const SPARK_OPTS = `--driver-java-options=-Xms${xms} --driver-java-options=-Xmx${xmx} --driver-java-options=-Dlog4j.logLevel=${logLevel}`;
    const PYTHONPATH = `${sparkHome}/python:${sparkHome}/python/lib/py4j-${py4jVersion}-src.zip`;
    const PYSPARK_PYTHON = 'python';

    // Set environment variables in the workflow
    core.exportVariable('SPARK_HOME', sparkHome);
    core.exportVariable('HADOOP_VERSION', hadoopVersion);
    core.exportVariable('APACHE_SPARK_VERSION', sparkVersion);
    core.exportVariable('PYSPARK_PYTHON', PYSPARK_PYTHON);
    core.exportVariable('PYSPARK_DRIVER_PYTHON', PYSPARK_PYTHON);
    core.exportVariable('PYTHONPATH', PYTHONPATH);
    core.exportVariable('SPARK_OPTS', SPARK_OPTS);

    // Add Spark to path and cache it
    core.addPath(`${sparkHome}/bin`);
    await tc.cacheDir(sparkHome, 'spark', sparkVersion);

    core.setOutput('spark-version', sparkVersion);
  } catch (error) {
    log(
      `Issue installing Spark: check if the Spark version and Hadoop versions you are using are part of the ones proposed on the Spark download page at https://spark.apache.org/downloads.html`
    );
    const err = <Error>error;
    core.error(err);
    core.setFailed(err.message);
  }
}

// Helper function to download and unzip spark binary
async function download(url: string, installFolder: string) {
  log(`Downloading Spark binary from ${url} to ${installFolder}`);
  const zipPath = await tc.downloadTool(url);
  await tc.extractTar(zipPath, installFolder);
}

run();
