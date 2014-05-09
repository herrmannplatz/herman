#!/bin/bash

#
# This script will update the gh-pages branch
# 

# Go to gh-pages
git checkout gh-pages

# bring gh-pages up to date
git rebase master

# Push changes to the gh-pages branch on GitHub
git push origin gh-pages

# Go Back to master
git checkout master
