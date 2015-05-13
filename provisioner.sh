#!/bin/bash

# Install ruby-dev
echo 'Installing Jekyll'
sudo apt-get update -qq && sudo apt-get install -yqq ruby-dev \
    nodejs

sudo gem install -q jekyll
sudo gem install -q execjs

cd /site
jekyll serve