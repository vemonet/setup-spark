import * as core from '@actions/core';
import { exec } from 'child_process';
import * as process from 'process';
// import * as os from 'os';

// See docs to create JS action: https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/creating-a-javascript-action

try {
  const sparkVersion = core.getInput('spark-version');
  const hadoopVersion = core.getInput('hadoop-version');
  const sparkChecksum = core.getInput('spark-checksum');
  process.chdir('/tmp');

  // update refs
  // exec('sudo apt-get update', (err, stdout, stderr) => {
  //   if(err || stderr){
  //     console.log(err);
  //     console.log(stderr);
  //     throw new Error("Could not apt update");
  //   }
  // });
  
  // wget -q $(wget -qO- "https://www.apache.org/dyn/closer.lua/spark/spark-3.0.1/spark-3.0.1-bin-hadoop3.2.tgz?as_json" | python -c "import sys, json; content=json.load(sys.stdin); print(content['preferred']+content['path_info'])")
  // Most commands to install Spark, based on jupyter/spark-notebooks Dockerfile
  // find -type f -printf %T+\\t%p\\n | sort -n &&
  // echo "${sparkChecksum} *spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" | sha512sum -c - && \
  var command = `cd /tmp &&
    wget -q $(wget -qO- "https://www.apache.org/dyn/closer.lua/spark/spark-${sparkVersion}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz?as_json" | python -c "import sys, json; content=json.load(sys.stdin); print(content['preferred']+content['path_info'])") &&
    sudo tar xzf "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" -C /usr/local &&
    rm "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" &&
    sudo ln -s "/usr/local/spark-${sparkVersion}-bin-hadoop${hadoopVersion}" /usr/local/spark &&
    sudo chown -R $(id -u):$(id -g) /usr/local/spark*`

  exec(command, (err: any, stdout: any, stderr: any) => {
    if(err || stderr){
      console.log("Error installing Spark");
      console.log(stderr)
      throw new Error(err);
    } else {
      core.info('Spark installed successfully:');
      core.info(stdout);
      // console.log(stdout);
    }
  });
  
  const sparkHome = '/usr/local/spark';
  const py4jVersion = core.getInput('py4j-version');
  
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
  console.log(error)
  core.error(error.message);
  core.setFailed(error.message);
}
