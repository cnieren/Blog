---
layout:     post
title:      About this Blog
date:       2015-06-18
summary:    The technology behind this blog
categories: jekyll
thumbnail: flask
tags:
 - jekyll
 - docker
 - blog
 - git
 - github
---

## Jekyll
About a year ago I started to get interested in [static site generators](https://www.staticgen.com/). These systems allow developers to use templates, partials, data structures and control flow statements to build websites, but don\'t require a database backend. There is a build step that turns all of the templates into simple HTML, CSS and JavaScript files. [Octopress](http://octopress.org/) was the first generator that I got excited about, but by the time I got around to actually building this site Octopress was smack in the middle of moving to version 3.0, which is a backwards-compatibility breaking change.

[Jekyll](http://jekyllrb.com/) is the second most popular static site generator, and has great documentation and tons of plugins from a very active community. To me it felt like the obveous choice. The biggest problem with Jekyll is that it runs on Ruby, and I develop mainly on Windows. While it is possible to get Ruby running on Windows, I really wasn\'t interested in that fight. Additionally I wanted to be able to work on the blog from multiple machines whithout having to get a Ruby environment configured on each of them.

## Vagrant
The first solution I came up with was to package Jekyll and all of its dependencies into an Ubuntu [Vagrant](https://www.vagrantup.com/) box. It\'s much simpler to set up a Ruby environment on Ubuntu, and I would only have to configure the environment once. The Vagrant file and the scripts to provision it could all be checked into a Git repository and shared across all the machines I want to develop on, and the only two tools I would need installed are [VirtualBox](https://www.virtualbox.org/) and Vagrant. There are a few gotcha\'s when working with Jekyll in a Vagrant environment:

1. jekyll serve starts a webserver and hosts your site on 127.0.0.1:4000. This works great when your web browser is running on the same machine as Jekyll, but not when Jekyll is inside of a Vagrant box. To get around this issue you can either
    1.  Add the line ``` host: 0.0.0.0 ``` to your _config.yml, which holds all of the site specific configuration settings or,
    2.  Run ``` jekyll serve -h 0.0.0.0 ```, which has the same effect, but lets you opt in at runtime instead of being the default configuration.
2.  As of version 2.4 the serve command will watch the file system of your site and when it detects a change it will automatically rebuild the site and a refresh of the browser will show you the result. This works great on a *nix system, but when you run Jekyll in Vagrant on Windows NTFS doesn\'t provide the same file update notifications. This can be fixed by adding ``` --force_polling ``` to the ``` jekyll serve ``` command.

At this point we have Jekyll running inside of a Vagrant box, and all of the dependencies are hidden away inside of that container. The project is checked into a Git repository and any machine I want to develop on only needs to have Vagrant and VirtualBox installed. To work on the project all I need to do is:
{% highlight sh %}
git clone https://github.com/cnieren/blag.git blag
cd blag
vagrant up
vagrant ssh
cd /site
jekyll serve --force_polling
{% endhighlight %}
Then point my browser to 0.0.0.0:4000 and I will see the generated result!

## Docker

## Google Cloud Platform
