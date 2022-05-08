import * as core from '@actions/core';
import { exec, execSync } from 'child_process';
import * as fs from 'fs'

// See docs to create JS action: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

const getTimestamp = () => {
  return new Date().toLocaleTimeString('fr-FR').toString()
}

try {
  const sparkVersion = core.getInput('spark-version');
  var sparkUrl = core.getInput('spark-url');
  const hadoopVersion = core.getInput('hadoop-version');
  const scalaVersion = core.getInput('scala-version');
  const py4jVersion = core.getInput('py4j-version');

  let installFolder: any = '/home/runner/work'
  try {
    fs.accessSync(installFolder, fs.constants.R_OK);
  } catch (err) {
    console.log(`${getTimestamp} - Using $GITHUB_WORKSPACE to store Spark (${installFolder} not writable)`);
    installFolder = process.env.GITHUB_WORKSPACE
  }

  // fs.access(installFolder, fs.constants.W_OK, (err) => {
  //   console.log(new Date().toLocaleTimeString('fr-FR') + ' - Using $GITHUB_WORKSPACE to store Spark (parent not writable)');
  //   installFolder = process.env.GITHUB_WORKSPACE
  // });

  // Download Spark from the official Apache mirrors using the Spark and Hadoop versions 
  // Based on jupyter/spark-notebooks Dockerfile
  let scalaBit = "";
  if (scalaVersion) {
    scalaBit = `-scala${scalaVersion}`
  }
  if (!sparkUrl) {
    sparkUrl = `https://archive.apache.org/dist/spark/spark-${sparkVersion}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}${scalaBit}.tgz`
  }
  var command = `cd /tmp &&
  wget -q -O spark.tgz ${sparkUrl} &&
  tar xzf spark.tgz -C ${installFolder} &&
  rm "spark.tgz" &&
  ln -s "${installFolder}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}" ${installFolder}/spark`

  // var command = `cd /tmp &&
  // wget -q $(wget -qO- "https://www.apache.org/dyn/closer.lua/spark/spark-${sparkVersion}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz?as_json" | python -c "import sys, json; content=json.load(sys.stdin); print(content['preferred']+content['path_info'])") &&
  // tar xzf "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" -C ${installFolder} &&
  // rm "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" &&
  // ln -s "${installFolder}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}" ${installFolder}/spark`
  console.log(getTimestamp + ' - Downloading the binary from ' + sparkUrl);
  // exec(command, (err: any, stdout: any, stderr: any) => {
  //   if (err || stderr) {
  //     console.log('Error running the command to download the Spark binary');
  //     throw new Error(err);
  //   }
  // });
  try {
    execSync(command);
  } catch (error) {
    console.log('Error running the command to download the Spark binary');
    // @ts-ignore
    throw new Error(error.message);
  }

  if (!fs.existsSync(`${installFolder}/spark/bin/spark-submit`)) {
    // throw new Error(`The Spark binary was not properly downloaded from ${sparkUrl}`);
    console.log('Could not find spark-submit file with fs')
  }

  // fs.access(`${installFolder}/spark/bin/spark-submit`, fs.constants.R_OK, (err) => {
  //   throw new Error(`The Spark binary was not properly downloaded from ${sparkUrl}`);
  // });

  // fs.stat(`${installFolder}/spark/bin/spark-submit`, (err, stat) => {
  //   if(err == null) {
  //     console.log(getTimestamp + ' - Binary downloaded, setting up environment variables');
  //   } else {
  //     throw new Error(`The Spark binary was not properly downloaded from ${sparkUrl}`);
  //   }
  // });

  console.log(getTimestamp + ' - Binary downloaded, setting up environment variables');

  const sparkHome = installFolder + '/spark';
  const SPARK_OPTS = `--driver-java-options=-Xms1024M --driver-java-options=-Xmx2048M --driver-java-options=-Dlog4j.logLevel=info`
  const PYTHONPATH = `${sparkHome}/python:${sparkHome}/python/lib/py4j-${py4jVersion}-src.zip`;
  const PYSPARK_PYTHON = 'python';

  // Set environment variables in the workflow
  // See https://github.blog/changelog/2020-10-01-github-actions-deprecating-set-env-and-add-path-commands/
  exec(`echo "HADOOP_VERSION=${hadoopVersion}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "APACHE_SPARK_VERSION=${sparkVersion}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "SPARK_HOME=${sparkHome}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "PYSPARK_PYTHON=${PYSPARK_PYTHON}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "PYSPARK_DRIVER_PYTHON=${PYSPARK_PYTHON}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "PYTHONPATH=${PYTHONPATH}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "SPARK_OPTS=${SPARK_OPTS}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  // core.exportVariable('envVar', 'Val');

  // Add Spark to path
  exec(`echo "PATH=$PATH:${sparkHome}/bin" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  // core.addPath('/path/to/mytool');

  core.setOutput("spark-version", sparkVersion);
} catch (error) {
  console.log('\nIssue installing Spark: check if the Spark version and Hadoop versions you are using is part of the one proposed in the Spark download page at https://spark.apache.org/downloads.html')
  console.log(error);
  // @ts-ignore
  core.setFailed(error.message);
}
