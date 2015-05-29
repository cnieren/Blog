#!/bin/bash

# Variables
gsutil_url_base=https://storage.googleapis.com/pub
gsutil_file=gsutil.tar.gz
gsutil_folder=gsutil

# Install ruby-dev
echo 'Installing Dependencies'
sudo apt-get update -qq && sudo apt-get install -yqq ruby-dev \
    nodejs \
    python3-pip \
    > /dev/null

echo 'Installing Pygments'
pip3 install -q Pygments > /dev/null

echo 'Installing Jekyll'
sudo gem install -q jekyll > /dev/null

echo 'Installing execjs'
sudo gem install -q execjs > /dev/null

echo 'Installing gsutil'
wget -q "${gsutil_url_base}/${gsutil_file}" > /dev/null
tar xfz "${gsutil_file}" > /dev/null
rm "${gsutil_file}" > /dev/null

# rename the folder to bin so that it is included in $PATH
mv "${gsutil_folder}" bin > /dev/null

echo "TODO: run 'gsutil config' to configure Google Cloud Platform Tools"
echo 'Done'