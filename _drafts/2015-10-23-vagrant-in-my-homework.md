---
layout:     post
author:     Chad Nierenhausen
title:      A Vagrant built my homework
date:       2015-10-23
summary:    How I use Vagrant to mimic the remote access server used by the Computer Science Department at the University of Arizona.
categories: vagrant
thumbnail: cogs
tags:
 - vagrant
 - homework
 - school
---
# A Vagrant built my homework
This semester I am taking the [Principals of Operating Systems][class] course at the University of Arizona. In this class students write a layered operating system that runs on top of an instructor provided hardware abstraction called USLOSS. Students are given USLOSS as a compiled library that was built using the departments Remote Access machine Lectura which is currently running Ubuntu 12.04 LTS. My instructor also offers a compiled version of the USLOSS library for Mac computers.

The two computers that I spend the majority of my time working on are Windows computers, so the provided compiled versions of USLOSS won't work for me. The first solution to this was to work on the project while connected to Lectura via SSH. I consider myself to be fairly competent when it comes to working inside of a Linux terminal, I don't want to have to live inside of an SSH session with VIM or Emacs as my only good options for text editing. While I do believe that VIM is the bees-knees, I would much rather have access to an editor like Sublime Text or Atom that give me the best parts of VIM while not sacrificing the convenience of a modern editor to do the bulk of my work.

I decided that running an Ubuntu 12.04 Vagrant box to compile and run my project while having the ability to edit my code using Sublime or Atom was a much more acceptable solution. It gives me all the convenience I want for editing, while providing a platform to test on that is nearly identical to the one that will be used to grade my project. Now I don't have to worry that the hour before the project is due when I finally get around to running it on Lectura I will find out there is some quirk of gcc on Ubuntu 12.04 that causes my code to not compile.

{% highlight bash %}
cnieren@lectura:~|⇒  lsb_release -dc
Description:    Ubuntu 12.04.5 LTS
Codename:       precise
{% endhighlight %}

[class]: http://www.cs.arizona.edu/courses/cs452.html
[boxCloud]: https://atlas.hashicorp.com/boxes/search
