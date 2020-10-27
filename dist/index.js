const core = require('@actions/core');
const { exec } = require('child_process');
const process = require('process');
// const github = require('@actions/github');

// See docs to create JS action: https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/creating-a-javascript-action

try {
  const sparkVersion = core.getInput('spark-version');
  const hadoopVersion = core.getInput('hadoop-version');
  const sparkChecksum = core.getInput('spark-checksum');
  console.log(`Spark version ${sparkVersion}!`);
  console.log(process.env);
  process.chdir('/tmp');

  var command = `sudo apt-get update &&
    cd /tmp &&
    find -type f -printf %T+\\t%p\\n | sort -n &&
    wget -q $(wget -qO- https://www.apache.org/dyn/closer.lua/spark/spark-${sparkVersion}/spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz?as_json | python -c "import sys, json; content=json.load(sys.stdin); print(content['preferred']+content['path_info'])") &&
    echo "${sparkChecksum} *spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" | sha512sum -c - && \
    sudo tar xzf "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" -C /usr/local &&
    rm "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" &&
    sudo ln -s "/usr/local/spark-${sparkVersion}-bin-hadoop${hadoopVersion}" /usr/local/spark &&
    sudo chown -R $(id -u):$(id -g) /usr/local/spark*`
  // Was originally: sudo tar xzf "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" -C /usr/local --owner root --group root --no-same-owner &&

  exec(command, (err, stdout, stderr) => {
    console.log('stdout:');
    console.log(stdout);
    console.log('err:');
    console.log(err);
    console.log('stderr:');
    console.log(stderr);
  });
  
  const sparkHome = '/usr/local/spark';
  const py4jVersion = core.getInput('py4j-version');
  const PYTHONPATH = `${sparkHome}/python:${sparkHome}/python/lib/py4j-${py4jVersion}-src.zip`;
  // const PYSPARK_PYTHON = '/opt/conda/bin/python3';

  // Set environment variable for the job
  // See https://github.blog/changelog/2020-10-01-github-actions-deprecating-set-env-and-add-path-commands/
  // echo "HADOOP_VERSION=${hadoopVersion}" >> $GITHUB_ENV
  exec(`echo "HADOOP_VERSION=${hadoopVersion}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "APACHE_SPARK_VERSION=${sparkVersion}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "SPARK_HOME=${sparkHome}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "PYTHONPATH=${PYTHONPATH}" >> $GITHUB_ENV`, 
        (err, stdout, stderr) => { });
  exec(`echo "SPARK_OPTS=--driver-java-options=-Xms1024M --driver-java-options=-Xmx2048M --driver-java-options=-Dlog4j.logLevel=info" >> $GITHUB_ENV`, 
        (err, stdout, stderr) => { });
  exec(`echo "PATH=$PATH:${sparkHome}/bin" >> $GITHUB_ENV`, (err, stdout, stderr) => { });

  exec(`echo "PYSPARK_PYTHON=${PYTHONPATH}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });
  exec(`echo "PYSPARK_DRIVER_PYTHON=${PYTHONPATH}" >> $GITHUB_ENV`, (err, stdout, stderr) => { });

  core.setOutput("spark-version", sparkVersion);
} catch (error) {
  core.setFailed(error.message);
}
