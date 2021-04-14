When contributing to this repository, please check the [issues](https://github.com/vemonet/setup-spark/issues) first, and post a new one if relevant.

## Get the source code 📥

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

## How to contribute 👩‍💻

Checkout the only important file! The mighty [`src/setup-spark.ts` ✨](https://github.com/vemonet/setup-spark/blob/main/src/setup-spark.ts)

### NCC

In order to avoid uploading `node_modules/` to the repository, we use [vercel/ncc](https://github.com/vercel/ncc) to create a single `index.js` file that gets saved in `dist/`.

### Developing

If you're developing locally, you can generate the `js` files by running:

```sh
npm install
tsc
ncc build src/setup-spark.ts
```

Any files generated using `tsc` will be added to `lib/`, however those files also are not uploaded to the repository and are excluded using `.gitignore`.

Then use `ncc` will build the `index.js` file

### Testing

We use the `run-setup-spark.yml` GitHub Actions workflow in `.github/workflows` to test setting up Spark versions

If you are making a substantive change try to link to a successful run that utilizes the changes you are working on.

### Pull request process

1. Before sending a pull request, make sure the project still work as expected with the new changes properly integrated
2. [Send a pull request](https://github.com/vemonet/setup-spark/compare) to the `main` branch 📤
3. Project contributors will review your change, and answer the pull request as soon as they can

### Licensed

This repository uses a tool called [Licensed](https://github.com/github/licensed) to verify third party dependencies. You may need to locally install licensed and run `licensed cache` to update the dependency cache if you install or update a production dependency. If licensed cache is unable to determine the dependency, you may need to modify the cache file yourself to put the correct license. You should still verify the dependency, licensed is a tool to help, but is not a substitute for human review of dependencies.

### Releases

There is a `main` branch where contributor changes are merged into. There are also release branches such as `releases/v1` that are used for tagging (for example the `v1` tag) and publishing new versions of the action. Changes from `main` are periodically merged into a releases branch. You do not need to create any PR that merges changes from main into a releases branch.
