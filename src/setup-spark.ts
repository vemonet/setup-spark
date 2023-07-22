import * as core from '@actions/core';
import { execSync } from 'child_process';
import * as fs from 'fs';

// See docs to create JS action: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
const log = (msg: string) => {
  console.log(`${new Date().toLocaleTimeString('fr-FR')} - ${msg}`);
}

try {
  const sparkVersion = core.getInput('spark-version');
  let sparkUrl = core.getInput('spark-url');
  const hadoopVersion = core.getInput('hadoop-version');
  const scalaVersion = core.getInput('scala-version');
  const py4jVersion = core.getInput('py4j-version');

  // Try to write to the parent folder of the workflow workspace
  const workspaceFolder: string = process.env.GITHUB_WORKSPACE || '/home/runner/work';
  let installFolder: any = workspaceFolder.split('/').slice(0, -1).join('/');
  try {
    fs.accessSync(installFolder, fs.constants.R_OK);
  } catch (err) {
    log(`Using $GITHUB_WORKSPACE to store Spark (${installFolder} not writable)`);
    installFolder = workspaceFolder;
  }
  log(`Spark will be installed to ${installFolder}`);

  const scalaBit = scalaVersion ? `-scala${scalaVersion}` : '';

  // Check if the official download URL exists, otherwise fall back to Apache Archives (slower)
  // https://spark.apache.org/downloads.html
  if (!sparkUrl) {
    // If URL not provided directly, we try to download from official
    sparkUrl = `https://dlcdn.apache.org/spark/spark-${sparkVersion}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}${scalaBit}.tgz`
    try {
      download(sparkUrl, installFolder);
    } catch (error: any) {
      log(`Official download URL not found. Falling back to Apache Archives.`);
      sparkUrl = `https://archive.apache.org/dist/spark/spark-${sparkVersion}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}${scalaBit}.tgz`;
      download(sparkUrl, installFolder);
    }
  } else {
    // URL provided directly by user
    download(sparkUrl, installFolder);
  }

  const symlinkCommand = `cd /tmp && ln -sf "${installFolder}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}${scalaBit}" ${installFolder}/spark`;
  try {
    execSync(symlinkCommand);
  } catch (error: any) {
    log(`Error running the command to create the symbolic link to the Spark binary`);
    throw new Error(error.message);
  }

  if (!fs.existsSync(`${installFolder}/spark/bin/spark-submit`)) {
    throw new Error(`The Spark binary was not properly downloaded from ${sparkUrl}`);
  }

  log(`Binary downloaded, setting up environment variables`);
  const sparkHome = installFolder + '/spark';
  const SPARK_OPTS = `--driver-java-options=-Xms1024M --driver-java-options=-Xmx2048M --driver-java-options=-Dlog4j.logLevel=info`;
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

  // Add Spark to path
  core.addPath(`${sparkHome}/bin`);

  core.setOutput('spark-version', sparkVersion);
} catch (error: any) {
  log(`Issue installing Spark: check if the Spark version and Hadoop versions you are using are part of the ones proposed on the Spark download page at https://spark.apache.org/downloads.html`);
  console.log(error);
  core.setFailed(error.message);
}

// Helper function to download and unzip spark binary
function download(url: string, installFolder: string) {
  log(`Downloading Spark binary from ${url} to ${installFolder}`)
  const zipFile = 'spark.tgz';
  const downloadCommand = `cd /tmp && wget -q -O ${zipFile} ${url}`;
  const untarCommand = `cd /tmp && tar xzf ${zipFile} -C ${installFolder}`;
  try {
    execSync(downloadCommand);
    log(`Unpacking the binary from /tmp/${zipFile}`);
    execSync(untarCommand);
  } catch (error: any) {
    log(`Error running the command to download the Spark binary`);
    throw new Error(error.message);
  }
}
