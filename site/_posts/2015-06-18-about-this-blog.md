---
layout:     post
author:     Chad Nierenhausen
title:      About this Blog - Part 1
date:       2015-06-23
summary:    The technology behind this blog
categories: jekyll
thumbnail: flask
tags:
 - jekyll
 - vagrant
 - blog
---

## Jekyll
About a year ago I learned about [Static Site Generators], systems that allow website developers to use templates, partials, data structures, and control flow statements to build websites, but don\'t require a database backend. There is a build step that compiles all of the templates into simple HTML, CSS and JavaScript files. [Octopress] was the first generator that I got excited about, but by the time I got around to actually building this site Octopress was smack in the middle of moving to version 3.0, which is a backwards-compatibility breaking change and at the time of this writing there is no concrete release date.

Octopress, before version 3.0, is really just a set of plugins and some custom modules built on top of [Jekyll], which is the second most popular static site generator, and the one that I chose to power the blog. I ultimately decided to go with Jekyll because of its great documentation, tons of plugins, and a very active community. The biggest problem I had with Jekyll is that it runs on Ruby, and I develop mainly on Windows. While it is possible to get Ruby running on Windows, I really wasn\'t interested in that fight. Additionally I wanted to be able to work on the blog from multiple machines without having to get a Ruby environment configured on each of them.

## Vagrant
> [Vagrant] provides easy to configure, reproducible, and portable work environments built on top of industry-standard technology and controlled by a single consistent workflow to help maximize the productivity and flexibility of you and your team.

Vagrant is essentially a virtual machine management utility, but unlike VirtualBox or V-Shpere, you define the operating system, and any dependencies or utilities you want to exist on the virtual machine in code. This makes it incredibly easy for teams to share development environments because the configuration of the machine is defined in file(s) that are checked into your version controll system. When a new developer checks out the code repo the Vagrant file and any provisioning scripts are included. Then to get the virtual machine running to start development all you have to do is run ``` vagrant up ``` and off you go.

The first solution I came up with to skirt the issue with Ruby on Windows was to package Jekyll and all of its dependencies into an Ubuntu Vagrant box. It\'s much simpler to set up a Ruby environment on Ubuntu, and I would only have to configure the environment once. The Vagrant file and the scripts to provision it could all be checked into a Git repository and shared across all the machines I want to develop on, and the only two tools I would need installed on the development machines are [VirtualBox] and Vagrant. There are a few gotcha\'s when working with Jekyll in a Vagrant environment:

1.  ``` jekyll serve ``` starts a webserver and hosts your site on 127.0.0.1:4000. This works great when your web browser is running on the same machine as Jekyll, but not when Jekyll is inside of a Vagrant box. To get around this issue you can either
    1.  Add the line ``` host: 0.0.0.0 ``` to your _config.yml, which holds all of your site specific configuration settings or,
    2.  Run ``` jekyll serve -h 0.0.0.0 ```, which has the same effect, but lets you opt in at runtime instead of being the default configuration. This would be useful if at some point I wanted to work on this site from a Linux machine directly and didn\'t want to run Jekyll through a virtual machine.
2.  As of Jekyll version 2.4 the serve command will watch the file system of your site and when it detects a change it will automatically rebuild the site and a refresh of the browser will show you the result. This works great on a *nix system, but when you run Jekyll in Vagrant on Windows, NTFS doesn\'t provide the same file update notifications. The work around for this is to run ``` jekyll serve --force_polling ``` which will force the Jekyll server to periodically poll the file system and rebuild the site when it detects a change.

At this point we have Jekyll running inside of a Vagrant box, and all of the dependencies are hidden away inside of that container. The project is checked into a Git repository and any machine I want to develop on only needs to have Vagrant and VirtualBox installed. To work on the project all I need to do is:
{% highlight sh %}
git clone https://github.com/cnieren/blag.git blag
cd blag
vagrant up
vagrant ssh
cd /site
jekyll serve --force_polling <-h 0.0.0.0>
{% endhighlight %}
Then point my browser to 0.0.0.0:4000 and I will see the generated result! Plus each time a make a change to a file and save it, the site is automatically rebuilt and a refresh of the browser window shows the changes.


[Vagrant]: https://www.vagrantup.com/
[Jekyll]: http://jekyllrb.com/
[Octopress]: http://octopress.org/
[Static Site Generators]: http://www.staticgen.com/
[VirtualBox]: https://www.virtualbox.org/