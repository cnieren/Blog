# [The Blog](http://blog.chadnierenhausen.com)

Jekyll based blog
* Edited in a docker container
* Hosted on Github Pages
* Delivered with love to your eyeballs

## To Edit

### On Windows
```sh
docker run --rm -it --volume=//<path_to_repo>://srv/jekyll -p 4000:4000 jekyll/jekyll jekyll serve --force_polling --drafts
```

### On Linux/OSX
```sh
docker run --rm -it --volume=$(pwd):/srv/jekyll -p 4000:4000 jekyll/jekyll jekyll serve --drafts
```

***If you do not provide a command then it will default to booting `jekyll s` for you***
