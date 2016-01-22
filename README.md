# [The Blog](http://blog.chadnierenhausen.com)

Jekyll based blog
* Edited in a docker container or Vagrant box
* Hosted on Github Pages
* Delivered with love to your eyeballs

## To Edit with Docker

### On Windows
```sh
docker run --rm -it --volume=//<path_to_repo>://srv/jekyll -p 4000:4000 jekyll/jekyll jekyll serve --force_polling --drafts
```

### On Linux/OSX
```sh
docker run --rm -it --volume=$(pwd):/srv/jekyll -p 4000:4000 jekyll/jekyll jekyll serve --drafts
```

***If you do not provide a command then it will default to booting `jekyll s` for you***

## To Edit with Vagrant

```sh
vagrant up && vagrant ssh
cd /vagrant
jekyll serve -H 0.0.0.0 --force_polling --drafts
```
