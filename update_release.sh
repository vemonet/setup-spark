#!/bin/bash

TAG=${1:-v1}

echo "⏩️ Updating the tag $TAG to the latest commit"

# assuming you are in the branch referencing currently the right new commit:
git tag -f -m "Update" -a $TAG

# push your new commit:
git push 

# force push your moved tag:
git push origin -f $TAG