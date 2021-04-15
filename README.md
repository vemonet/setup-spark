# setup-spark ✨

[![Run setup-spark action](https://github.com/vemonet/setup-spark/actions/workflows/test-setup-spark.yml/badge.svg)](https://github.com/vemonet/setup-spark/actions/workflows/test-setup-spark.yml) [![CodeQL analysis](https://github.com/vemonet/setup-spark/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/vemonet/setup-spark/actions/workflows/codeql-analysis.yml)

This action sets up Apache Spark in your environment for use in GitHub Actions by:

- installing and adding `spark-submit` and `spark-shell` to `PATH`
- setting `SPARK_HOME`, `PYSPARK_PYTHON` environment variable (and others) in the workflow

This enables to test applications using a local Spark context in GitHub Actions.

# Usage

You will need to setup **Python** and **Java** in the job before setting up **Spark**

Basic workflow:
```yaml
steps:
- uses: actions/setup-python@v2
  with:
    python-version: '3.8'
- uses: actions/setup-java@v1
  with:
    java-version: '11'

- uses: vemonet/setup-spark@v1
  with:
    spark-version: '3.0.2'
    hadoop-version: '3.2'

- run: spark-submit --version
```

See the [action.yml](action.yml) file for a complete rundown of the available parameters.

# Available versions

Check for the available Spark and Hadoop versions at https://spark.apache.org/downloads.html

The `setup-spark` action is tested in `.github/workflows/test-setup-spark.yml` for:

* Apache Spark version `3.0.2` and `3.1.1` 
* Hadoop version `3.2` 
* Ubuntu runners

This action has only been used with python PySpark jobs, feel free to submit [issues](/issues) to help improving the setup for other uses (e.g. R, Scala)

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

# Contributions

Contributions are welcome! Feel free to test other Spark versions, and submit [issues](/issues), or [pull requests](https://github.com/vemonet/setup-spark/blob/main/CONTRIBUTING.md).

See the [contributor's guide](https://github.com/vemonet/setup-spark/blob/main/CONTRIBUTING.md) for more details.