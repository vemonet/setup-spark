// const exec = util_1.promisify(childProcess.exec);
// Use the exec command:
// if (yield ioUtil.isDirectory(inputPath, true)) {
//   yield exec(`apt-get update "${inputPath}"`);
// }

// See docs to create JS action: https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/creating-a-javascript-action

const core = require('@actions/core');
// const github = require('@actions/github');
const { exec } = require('child_process');
const process = require('process');

try {
  const sparkVersion = core.getInput('spark-version');
  const hadoopVersion = core.getInput('hadoop-version');
  console.log(`Spark version ${sparkVersion}!`);
  process.env['APACHE_SPARK_VERSION'] = sparkVersion;
  process.env['HADOOP_VERSION'] = hadoopVersion;

  var command = `apt-get update &&
    cd /tmp &&
    find -type f -printf %T+\\t%p\\n | sort -n &&
    wget -q $(wget -qO- https://www.apache.org/dyn/closer.lua/spark/spark-${APACHE_SPARK_VERSION}/spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz\?as_json | \
    python -c "import sys, json; content=json.load(sys.stdin); print(content['preferred']+content['path_info'])") && \
    echo "${spark_checksum} *spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz" | sha512sum -c - && \
    tar xzf "spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz" -C /usr/local --owner root --group root --no-same-owner && \
    rm "spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz" &&
    cd /usr/local &&
    ln -s "spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}" spark`

  exec(command, (err, stdout, stderr) => {
    console.log('stdout:');
    console.log(stdout);
    console.log('err:');
    console.log(err);
    console.log('stderr:');
    console.log(stderr);
  });
  
  process.env['SPARK_HOME'] = '/usr/local/spark';
  process.env['PYTHONPATH'] = `${SPARK_HOME}/python:${SPARK_HOME}/python/lib/py4j-${py4j_version}-src.zip`;
  process.env['SPARK_OPTS'] = `--driver-java-options=-Xms1024M --driver-java-options=-Xmx2048M --driver-java-options=-Dlog4j.logLevel=info`;
  process.env['PATH'] = process.env['PATH'] + `${SPARK_HOME}/bin`;

  // const time = (new Date()).toTimeString();
  core.setOutput("spark-version", sparkVersion);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
