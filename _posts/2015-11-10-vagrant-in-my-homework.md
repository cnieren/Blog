---
layout:     post
author:     Chad Nierenhausen
title:      A Vagrant Built My Homework
date:       2015-10-23
summary:    How I use Vagrant to mimic the remote access server used by the Computer Science Department at the University of Arizona.
categories: vagrant
thumbnail: cogs
tags:
 - vagrant
 - homework
 - school
---

## The Problem
This semester I am taking the [Principals of Operating Systems][class] course at the University of Arizona. In this class students write a layered operating system that runs on top of an instructor provided hardware abstraction called USLOSS. Students are given USLOSS as a compiled library that was built using the departments Remote Access machine Lectura which is currently running Ubuntu 12.04 LTS. My instructor also offers a compiled version of the USLOSS library for Mac computers.

The two computers that I spend the majority of my time working on are Windows computers, so the provided compiled versions of USLOSS won\'t work for me natively. The first solution I came up with was to work on the project while connected to Lectura via SSH. I consider myself to be fairly competent when it comes to working inside of a Linux terminal, but I don\'t want to **have** to live inside of an SSH session with VIM or Emacs as my only good options for text editing. I do know that VIM is just the bees-knees and is an incredibly capable editor, I would much rather have access to an editor like Sublime Text or Atom that give me the best parts of VIM (hjkl movement and motions) while not sacrificing the convenience of a modern editor to do the bulk of my work.

I decided that running an Ubuntu 12.04 Vagrant box to compile and run my project while having the ability to edit my code using Sublime or Atom was a much more acceptable solution. It gives me all the convenience I want for editing, while providing a platform to test on that is nearly identical to the one that will be used to grade my project. Now I don\'t have to worry so much that the environment I am developing on is different than the one that I will be graded on. So the hour before the project is due when I finally get around to running it on Lectura shouldn\'t find out that there is some quirk of gcc on Ubuntu 12.04 that causes my code to not compile.

## How I solved it
I first needed to determine what version of Ubuntu and gcc Lectura is currently running:
{% highlight bash %}
cnieren@lectura:~|$  lsb_release -dc
Description:    Ubuntu 12.04.5 LTS
Codename:       precise

cnieren@lectura:~|$  gcc --version
gcc (Ubuntu/Linaro 4.6.3-1ubuntu5) 4.6.3
{% endhighlight %}

Next I needed to find a vagrant box running Ubuntu 12.04 (Precise 64). You can search for public Vagrant boxes [here][boxCloud], and it just so happens that the fine folks at Ubuntu keep an official repository of boxes and [Precise 64 is one of them][precise]. Conveniently the version of gcc on Lectura is the same the the gcc version on the ubuntu/precise64 Vagrant box!

I added this Vagrantfile to the top level directory of my project:
{% highlight ruby %}
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/precise64"
end
{% endhighlight %}

Now if I run ```vagrant up``` from any directory in my project Vagrant will start up an Ubuntu 12.04 virtual machine and map my project directory from the host machine to the ```/vagrant``` directory on the virtual machine. Running ```vagrant ssh``` from a terminal window will open a connection to the virtual machine as expected. I can now open my project folder on the host machine using Sublime Text or Atom or any other editor I like, and modified files are automatically sync\'ed with the virtual machine.

Then things got a bit tricky, USLOSS is a collection of .h files and a compiled .a file. They are contained in a folder on lectura that is accessible to students in the class. Instructions for getting this folder into your project on Lectura are to run ```ln -s <remote usloss directory> <project directory>``` this will create a soft link to the USLOSS library files in your project folder. Having the usloss folder in your project directory is what the provided Makefile expects, and is how our programs are tested.

To keep things in my project as close to the environment on Lectura I copied the usloss folder from Lectura to the root directory of my project. Then from the terminal in my virtual machine ran:

{% highlight bash %}
vagrant@vagrant-ubuntu-precise-64:/vagrant/phase1$ ln -s /vagrant/usloss /vagrant/phase1/usloss
ln: failed to create symbolic link '/vagrant/phase1/usloss': Protocol error
vagrant@vagrant-ubuntu-precise-64:/vagrant/phase1$
{% endhighlight %}

Here is where running a linux virtual machine on a Windows host machine with directory mapping from one to the other is a problem. That ```ln``` command expect to find a unix file system, but instead gets a Windows file system and they don\'t do soft links the same. So this isn\'t going to work. The only option I have here is to copy the usloss folder directly into my phase1 folder and skip the soft link. Which almost works...

If we look into the usloss folder we see the following:

{% highlight bash %}
cnieren@lectura:/home/cs452/fall15/usloss/linux|$  ls -lR
.:
total 8
drwxrwxr-x 2 patrick 452f15 4096 Nov  4 10:18 include
drwxrwxr-x 2 patrick 452f15 4096 Aug 25 22:32 lib

./include:
total 12
-rw-rw-r-- 1 patrick 452f15    0 Aug 21 10:16 mmu.h
-rw-rw-r-- 1 patrick 452f15 7699 Aug 21 10:16 usloss.h
-rw-rw-r-- 1 patrick 452f15 1076 Aug 21 10:16 usyscall.h

./lib:
total 152
-rw-rw-r-- 1 patrick 452f15 151002 Aug 21 10:16 libusloss2.9.a
lrwxrwxrwx 1 patrick 452f15     14 Aug 21 10:16 libusloss.a -> libusloss2.9.a
{% endhighlight %}

That last line is a problem, it shows that the libusloss.a file is actually an alias (ln -s) for libusloss2.9.a which is a convenience if we ever get a new version of the library we can replace the versioned file and all references to libusloss.a will automagically update to the new version of the code. But as we found before the Windows file system doesn\'t know how to handle soft links like this. So I remove the libusloss.a link and rename libusloss2.9.a to libusloss.a and we are in business!

I have been using this set up for the first three phases of this project and it works wonderfully. To get started working all I have to do is open my project in a text editor and run ```vagrant up && vagrant ssh``` in a terminal window. I can then work on the host windows machine and as soon as I save changes they are sync\'ed to the Ubuntu virtual machine. At which point I can run make or a test shell script to run my code. Most importantly I have not had any problems getting my code to run on Lectura when I am ready to turn my project in.

[class]: http://www.cs.arizona.edu/courses/cs452.html
[boxCloud]: https://atlas.hashicorp.com/boxes/search
[precise]: https://atlas.hashicorp.com/ubuntu/boxes/precise64
