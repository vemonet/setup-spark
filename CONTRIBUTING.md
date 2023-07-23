When contributing to this repository, please check the [issues](https://github.com/vemonet/setup-spark/issues) first, and post a new one if relevant.

## 📥 Get the source code

1. [Fork this repository](https://github.com/vemonet/setup-spark/fork) 🍴

2. Clone the forked repository (change the URL of the `git clone` for yours)

```bash
git clone https://github.com/vemonet/setup-spark.git
cd setup-spark
```

3. Create a new branch from the `main` branch, and go to this branch 🕊️

```bash
git checkout -b my-branch
```

## 👩‍💻 Development

Checkout the only important file! The mighty [`src/setup-spark.ts` ✨](https://github.com/vemonet/setup-spark/blob/main/src/setup-spark.ts). The Spark installation has been inspired by the [jupyter/docker-stack pyspark Dockerfile](https://github.com/jupyter/docker-stacks/blob/master/pyspark-notebook/Dockerfile)

1. Install:

```bash
npm install
```

2. Build the `dist/index.js` file with [vercel/ncc](https://github.com/vercel/ncc):

```bash
npm run build
```

3. Commit and push the generated `index.js` file with the rest of the modified files

## ☑️ Test

We use the `test.yml` GitHub Actions workflow in `.github/workflows` to test setting up Spark versions. If you are making a substantive change try to link to a successful run that utilizes the changes you are working on.

Install [`act`](https://github.com/nektos/act) to test running the action locally:

```bash
act -j test-setup-spark
# Build and run act:
npm run dev
```

Format the code with prettier:

```bash
npm run fmt
```

Run linting checks:

```bash
npm run test
```

## 📜 Check dependencies licenses

Third party dependencies licenses are checked automatically by a GitHub Action workflow using [Licensed](https://github.com/github/licensed).

## 🔼 Updating dependencies

Update dependencies to latest version:

```bash
npm update
```

Check for vulnerabilities:

```bash
npm audit
```

Fix dependencies with vulnerabilities:

```bash
npm audit fix --force
```

Commit, push and check if the GitHub action tests are passing.

## 🕊️ Pull request process

1. Before sending a pull request, make sure the project still work as expected with the new changes properly integrated
2. [Send a pull request](https://github.com/vemonet/setup-spark/compare) to the `main` branch 📤
3. Project contributors will review your change, and answer the pull request as soon as they can

## 🏷️ Publish new version

Create a new release on GitHub following semantic versioning, e.g. `v1.2.0`

Then update the `v1` tag to the latest commit (`v1` should always be sync to the latest version)

```bash
npm run release
```

