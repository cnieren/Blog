# [The Blog](http://chadnierenhausen.com)

Jekyll based blog, run out of a docker container.

## Gems Included in the Docker image

* therubyracer
* pygments.rb
* jekyll-sitemap
* jekyll-coffeescript
* jekyll-sass-converter
* jekyll-redirect-from
* jekyll-mentions
* jekyll-compose
* jekyll-feed
* rdiscount
* redcarpet
* kramdown
* jemoji
* RedCloth
* maruku
* pry


## Running

```sh
docker run --rm -it --volume=$(pwd)/site:/srv/jekyll -p 4000:4000 \
  jekyll/jekyll jekyll serve --force_polling
```

***If you do not provide a command then it will default to booting `jekyll s` for you***