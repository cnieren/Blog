#!/bin/bash

# Push the _site directory content to a Google Cloud Platform Bucket
# that serves this site, and make all of the files publicly accessable

site=/site
static=/site/_site
gcp_bucket=gs://www.chadnierenhausen.com

echo 'Building site'
cd "${site}"
jekyll build

echo 'Remove existing files'
gsutil -m rm "${gcp_bucket}/**"

echo 'Rsync to Bucket'
cd "${site}/_site"
gsutil -m rsync -R "${static}" "${gcp_bucket}"

echo 'Set all files to Public'
gsutil -m acl ch -u AllUsers:R `gsutil ls -r "${gcp_bucket}/**"`
