#!/bin/bash

#
# This script will update the gh-pages branch with any changes that have been made to the steps
# and to the dependencies.
# 

# Exit on error and print each command as it is run
set -ex

ROOT_DIR=`dirname $0`/..

# Get into the correct directory
cd $ROOT_DIR

# Make sure we are on master
git checkout -f master

# Ensure that all the tool dependencies are there
npm install

# Move the snapshot step folders into the gh-pages branch
git checkout -f gh-pages

# Commit any changes
git add --all 
git commit -m"update gh pages" || true

# Display an info message, including the last two commits
echo gh-pages has been updated. See the log below.
git log -2

# Push changes to the gh-pages branch on GitHub
git push origin gh-pages
