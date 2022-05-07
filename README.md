# setup-spark ✨

[![Run setup-spark action](https://github.com/vemonet/setup-spark/actions/workflows/test-setup-spark.yml/badge.svg)](https://github.com/vemonet/setup-spark/actions/workflows/test-setup-spark.yml) [![CodeQL analysis](https://github.com/vemonet/setup-spark/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/vemonet/setup-spark/actions/workflows/codeql-analysis.yml)

This action sets up Apache Spark in your environment for use in GitHub Actions by:

- installing and adding `spark-submit` and `spark-shell` to `PATH`
- setting `SPARK_HOME`, `PYSPARK_PYTHON` environment variable (and others) in the workflow

This enables to test applications using a local Spark context in GitHub Actions.

# Usage

You will need to setup **Python** and **Java** in the job before setting up **Spark**

Check for the latest Spark versions at https://spark.apache.org/downloads.html

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
    spark-version: '3.2.3'
    hadoop-version: '3.3'

- run: spark-submit --version
```

See the [action.yml](action.yml) file for a complete rundown of the available parameters.

You can also provide a specific URL to download the Spark `.tgz`:

```yaml
- uses: vemonet/setup-spark@v1
  with:
    spark-version: '3.1.1'
    hadoop-version: '3.2'
    spark-url: 'https://archive.apache.org/dist/spark/spark-3.1.1/spark-3.1.1-bin-hadoop3.2.tgz'
```

# Available versions

The Hadoop versions stay quite stable (latest is 3.2)

Check for the latest Spark versions at https://spark.apache.org/downloads.html

The `setup-spark` action is tested in `.github/workflows/test-setup-spark.yml`

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

# Contributions

Contributions are welcome! Feel free to test other Spark versions, and submit [issues](/issues), or [pull requests](https://github.com/vemonet/setup-spark/blob/main/CONTRIBUTING.md).

See the [contributor's guide](https://github.com/vemonet/setup-spark/blob/main/CONTRIBUTING.md) for more details.