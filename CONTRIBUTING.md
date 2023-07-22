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

## 👩‍💻 How to contribute

Checkout the only important file! The mighty [`src/setup-spark.ts` ✨](https://github.com/vemonet/setup-spark/blob/main/src/setup-spark.ts)

The Spark installation has been built based on the [jupyter/docker-stack PySpark notebook Dockerfile](https://github.com/jupyter/docker-stacks/blob/master/pyspark-notebook/Dockerfile)

In order to avoid uploading `node_modules/` to the repository, we use [vercel/ncc](https://github.com/vercel/ncc) to create a single `index.js` file that gets saved in `dist/`.

### Development

1. Install with [Licensed](https://github.com/github/licensed) to check dependencies:

```bash
npm install
wget -O licensed.tar.gz https://github.com/github/licensed/releases/download/3.1.0/licensed-3.1.0-linux-x64.tar.gz
tar -xzf licensed.tar.gz && rm -f licensed.tar.gz
```

2. Build the `index.js` file:

```bash
npm run build
```

This also generates the javascript files from TypeScript files. Any files generated using `tsc` will be added to `lib/`, however those files also are not uploaded to the repository and are excluded using `.gitignore`.

3. Commit and push the generated `index.js` file with the rest of the modified files

### Testing

We use the `test-setup-spark.yml` GitHub Actions workflow in `.github/workflows` to test setting up Spark versions

If you are making a substantive change try to link to a successful run that utilizes the changes you are working on.

You can use [`act`](https://github.com/nektos/act) to test running the action locally:

```bash
act -j test-setup-spark
# Build and run act:
npm run dev
```

Format:

```bash
npm run fmt
```

### Pull request process

1. Before sending a pull request, make sure the project still work as expected with the new changes properly integrated
2. [Send a pull request](https://github.com/vemonet/setup-spark/compare) to the `main` branch 📤
3. Project contributors will review your change, and answer the pull request as soon as they can

## 📜 Check dependencies licenses

This repository uses a tool called [Licensed](https://github.com/github/licensed) to verify third party dependencies. 

Download licensed on Linux:

```bash
wget -O licensed.tar.gz https://github.com/github/licensed/releases/download/3.1.0/licensed-3.1.0-linux-x64.tar.gz
tar -xzf licensed.tar.gz && rm -f licensed.tar.gz
```

Run `licensed` locally and generate the license dependencies in `.licenses` use:

```bash
./licensed cache
```

If you have not licensed installed, this is not a problem, we will do it the next time we pull the changes.

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

## 🏷️ Publish new version

Create a new release on GitHub following semantic versioning, e.g. `v1.2.0`

Then update the `v1` tag to the latest commit (`v1` should always be sync to the latest version)

```bash
git tag -fa v1
git push -f origin --tags
```

