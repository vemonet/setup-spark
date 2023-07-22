# ✨ setup-spark

[![Test setup-spark action](https://github.com/vemonet/setup-spark/actions/workflows/test.yml/badge.svg)](https://github.com/vemonet/setup-spark/actions/workflows/test.yml)

This action sets up Apache Spark in your environment for use in GitHub Actions by:

- installing and adding `spark-submit` and `spark-shell` to the `PATH`
- setting required environment variables such as `SPARK_HOME`, `PYSPARK_PYTHON` in the workflow

This enables to test applications using a local Spark context in GitHub Actions.

# Usage

You will need to setup **Python** and **Java** in the job before setting up **Spark**

Check for the latest Spark versions at https://spark.apache.org/downloads.html

Basic workflow:
```yaml
steps:
- uses: actions/setup-python@v3
  with:
    python-version: '3.10'

- uses: actions/setup-java@v3
  with:
    java-version: '17'
    distribution: temurin

- uses: vemonet/setup-spark@v1
  with:
    spark-version: '3.4.1'
    hadoop-version: '3'

- run: spark-submit --version
```

See the [action.yml](action.yml) file for a complete rundown of the available parameters.

You can also provide a specific URL to download the Spark `.tgz` and/or a use specific scala version:

```yaml
- uses: vemonet/setup-spark@v1
  with:
    spark-version: '3.4.1'
    hadoop-version: '3'
    scala-version: '2.13'
    spark-url: 'https://archive.apache.org/dist/spark/spark-3.4.1/spark-3.4.1-bin-hadoop3-scala2.13.tgz'
```

# Available versions

Check for the latest Spark versions at https://spark.apache.org/downloads.html

The Hadoop version stays quite stable.

The `setup-spark` action is tested for various versions of Spark and Hadoop in `.github/workflows/test-setup-spark.yml`

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

# Contributions

Contributions are welcome! Feel free to test other Spark versions, and submit [issues](/issues), or [pull requests](https://github.com/vemonet/setup-spark/blob/main/CONTRIBUTING.md).

See the [contributor's guide](https://github.com/vemonet/setup-spark/blob/main/CONTRIBUTING.md) for more details.
