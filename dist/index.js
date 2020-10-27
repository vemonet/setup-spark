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
  const sparkChecksum = core.getInput('spark-checksum');
  console.log(`Spark version ${sparkVersion}!`);
  console.log(process.env);
  process.env.APACHE_SPARK_VERSION = sparkVersion;
  process.env.HADOOP_VERSION = hadoopVersion;

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
  // sudo tar xzf "spark-${sparkVersion}-bin-hadoop${hadoopVersion}.tgz" -C /usr/local --owner root --group root --no-same-owner &&

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
  process.env.SPARK_HOME = sparkHome;
  process.env.PYTHONPATH = `${sparkHome}/python:${sparkHome}/python/lib/py4j-${py4jVersion}-src.zip`;
  process.env.SPARK_OPTS = `--driver-java-options=-Xms1024M --driver-java-options=-Xmx2048M --driver-java-options=-Dlog4j.logLevel=info`;
  process.env.PATH = process.env['PATH'] + `${sparkHome}/bin`;

  var exportCommand = `::set-env name=HADOOP_VERSION::${hadoopVersion} 
    ::set-env name=APACHE_SPARK_VERSION::${sparkVersion} 
    ::set-env name=HADOOP_VERSION::${hadoopVersion} 
    ::set-env name=SPARK_HOME::${sparkHome} 
    ::set-env name=PYTHONPATH::${sparkHome}/python:${sparkHome}/python/lib/py4j-${py4jVersion}-src.zip 
    ::set-env name=SPARK_OPTS::--driver-java-options=-Xms1024M --driver-java-options=-Xmx2048M --driver-java-options=-Dlog4j.logLevel=info 
    ::set-env name=PATH::$PATH:${sparkHome}/bin`

    exec(exportCommand, (err, stdout, stderr) => {
      console.log('exportCommand stdout:');
      console.log(stdout);
      console.log('exportCommand err:');
      console.log(err);
      console.log('exportCommand stderr:');
      console.log(stderr);
      console.log('exportCommand stderr:');
      console.log(stderr);
      console.log('process.env after the exportCommand:');
      console.log(process.env);
    });

  console.log('process.env after the install:');
  console.log(process.env);
  // const time = (new Date()).toTimeString();
  core.setOutput("spark-version", sparkVersion);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
