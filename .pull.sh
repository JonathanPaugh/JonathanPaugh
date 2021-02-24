#!/usr/bin/bash

git fetch origin
git checkout main
git reset --hard origin/main
git clean -dfx