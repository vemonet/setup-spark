# setup-spark ✨

[![Run setup-spark action](https://github.com/vemonet/setup-spark/actions/workflows/run-setup-spark.yml/badge.svg)](https://github.com/vemonet/setup-spark/actions/workflows/run-setup-spark.yml) [![CodeQL analysis](https://github.com/vemonet/setup-spark/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/vemonet/setup-spark/actions/workflows/codeql-analysis.yml)

This action sets up Apache Spark in your environment for use in GitHub Actions by:

- installing and adding `spark-submit` and `spark-shell` to `PATH`
- setting `SPARK_HOME`, `PYSPARK_PYTHON` environment variable (and others) in the workflow

This enables to test applications using a local Spark context in GitHub Actions.

# Usage

See [action.yml](action.yml) for a complete rundown of the available parameters.

You will need to setup `python` and `java` in the job before setting up `spark`

Basic:
```yaml
steps:
- uses: actions/checkout@v2
- uses: actions/setup-python@v2
  with:
    python-version: '3.8'
- uses: actions/setup-java@v1
  with:
    java-version: '11'
- uses: vemonet/setup-spark@v1
  with:
    spark-version: '3.0.2'
- run: spark-submit --version
```

> Check for the available Spark and Hadoop versions at https://spark.apache.org/downloads.html

# Available versions of Apache Spark

`setup-spark` is tested for Apache Spark version `3.0.2` and `3.1.1` with Hadoop version `3.2` using a GitHub Action workflow in `.github/workflows`

The installation have only been tested on Ubuntu runners

The Spark installation has been built based on the [jupyter/docker-stack PySpark notebook Dockerfile](https://github.com/jupyter/docker-stacks/blob/master/pyspark-notebook/Dockerfile)

> Feel free to test other Spark version and submit issues or pull requests!

## Developing

1. Install:

```bash
npm install
```

2. Generates JS files, any files generated using `tsc` will be added to `lib/`, however those files also are not uploaded to the repository and are excluded using `.gitignore`.

```bash
tsc
```

3. Build the `index.js` file

```bash
ncc build src/setup-spark.ts
```

4. Commit and push the generated `index.js` file with the rest of the modified files

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

# Contributions

Contributions are welcome! See our [Contributor's Guide](https://github.com/vemonet/setup-spark/blob/main/CONTRIBUTING.md).
