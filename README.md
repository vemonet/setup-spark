# setup-spark ✨

<p align="left">
  <a href="https://github.com/vemonet/setup-spark/actions"><img alt="GitHub Actions status" src="https://github.com/vemonet/setup-spark/workflows/Main%20workflow/badge.svg"></a>
</p>


This action sets up a Spark environment for use in actions by:

- installing and adding `spark-submit` and `spark-shell` to PATH
- setting `SPARK_HOME` environment variable in the job

# Usage

See [action.yml](action.yml) for complete rundown of the available parameters.

You will need to also setup `python` and `java` in the job before setting up `spark`

Basic:
```yaml
steps:
- uses: actions/checkout@v2
- uses: actions/setup-python@v2
  with:
    python-version: '3.7'
- uses: actions/setup-java@v1
  with:
    java-version: '11'
- uses: vemonet/setup-spark@v1
  with:
    spark-version: '3.0.1' # Exact version
- run: spark-submit --version
```

# Available versions of Spark

`setup-spark` has only been tested for Apache Spark version `3.0.1`

It has been built based on [jupyter/docker-stack pyspark notebook Dockerfile](jupyter/docker-stack pyspark notebook Dockerfile)

> Feel free to test other Spark version and submit issues or pull requests!

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

# Contributions

Contributions are welcome! See our [Contributor's Guide](docs/contributors.md).
