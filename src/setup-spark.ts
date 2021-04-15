import * as core from '@actions/core';
import { exec } from 'child_process';
// See docs to create JS action: https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/creating-a-javascript-action

try {
  const sparkVersion = core.getInput('spark-version');
  const hadoopVersion = core.getInput('hadoop-version');
  const py4jVersion = core.getInput('py4j-version');
  const installFolder = '/home/runner'

  // Download Spark using Bash commands, based on jupyter/spark-notebooks Dockerfile
  var command = `cd /tmp &&
    wget -q $(wget -qO- "https://www.apache.org/dyn/closer.lua/spark/spark-${sparkVersion}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz?as_json" | python -c "import sys, json; content=json.load(sys.stdin); print(content['preferred']+content['path_info'])") &&
    tar xzf "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" -C ${installFolder} &&
    rm "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" &&
    ln -s "${installFolder}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}" ${installFolder}/spark`

  exec(command, (err: any, stdout: any, stderr: any) => {
    if(err || stderr){
      console.log('Error downloading the Spark binary');
      throw new Error(err);
    } else {
      console.log('Spark binary downloaded successfully.');
    }
  });
  
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

  // Add Spark to path
  exec(`echo "PATH=$PATH:${sparkHome}/bin" >> $GITHUB_ENV`, (err, stdout, stderr) => { });

  core.setOutput("spark-version", sparkVersion);
} catch (error) {
  console.log(error);
  console.log('\nIssue installing Spark: check if the Spark version and Hadoop versions you are using is part of the one proposed in the Spark download page at https://spark.apache.org/downloads.html')
  core.setFailed(error.message);
}
