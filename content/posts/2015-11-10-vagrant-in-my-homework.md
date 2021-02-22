+++
author = "Chad Nierenhausen"
date = "2015-11-10T00:00:00Z"
title = "A Vagrant Built My Homework"
description = "How I use Vagrant to mimic the remote access server used by the Computer Science Department at the University of Arizona."
thumbnail = "fas fa-cogs"

tags = [ "vagrant", "homework", "school", "C" ]
+++

## The Problem
This semester I am taking the [Principals of Operating Systems][class] course at the University of Arizona. In this class, students write a layered operating system that runs on top of an instructor-provided hardware abstraction called USLOSS. Students are given USLOSS as a compiled library that was built using the department's Remote Access machine Lectura, which is currently running Ubuntu 12.04 LTS. My instructor also offers a compiled version of the USLOSS library for Mac computers.

The two computers that I spend the majority of my time working on are Windows computers, so the provided compiled versions of USLOSS won't work for me natively. The first solution I came up with was to work on the project while connected to Lectura via SSH. I consider myself to be fairly competent when it comes to working inside of a Linux terminal, but I don't want to **have** to live inside of an SSH session with VIM or Emacs as my only good options for text editing. While I do know that VIM is just the bees-knees and is an incredibly capable editor, I would much rather have access to an editor like Sublime Text or Atom that gives me the best parts of VIM (hjkl movement and motions) without sacrificing the convenience of a modern editor to do the bulk of my work.

The second solution I came up with was to run an Ubuntu 12.04 Vagrant box to compile and run my project. This gives me the ability to edit my code using Sublime Text or Atom, while providing a platform to test on that is nearly identical to the one that will be used to grade my project, and thus helps me avoid the "it works on my computer but not on Lectura" panic that could result when, an hour before the project is due, I find out that there is some quirk of gcc on Ubuntu 12.04 that causes my code to not compile.

## How I Solved It
I first need to determine what version of Ubuntu and gcc Lectura is currently running. I can do that by running the following two commands:

~~~ bash
cnieren@Lectura:~|$  lsb_release -dc
Description:    Ubuntu 12.04.5 LTS
Codename:       precise

cnieren@Lectura:~|$  gcc --version
gcc (Ubuntu/Linaro 4.6.3-1ubuntu5) 4.6.3
~~~

Next I need to find a Vagrant box for Ubuntu 12.04 (Precise 64). I found one [here][precise], and it just so happens that this is the official repository maintained by the fine folks at Ubuntu. Conveniently the version of gcc on Lectura is the same as the version of gcc on the ubuntu/precise64 Vagrant box!

To use this Vagrant box I add this Vagrantfile to the top level directory of my project:

~~~ ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/precise64"
end
~~~

Now when I run ```vagrant up``` from any directory in my project, Vagrant will start up an Ubuntu 12.04 virtual machine and map my project directory from the host machine to the ```/vagrant``` directory on the virtual machine. Running ```vagrant ssh``` from a terminal window will open a connection to the virtual machine as expected. I can now open my project folder on the host machine using Sublime Text or Atom or any other editor I like, and as I modify files, they are automatically synced with the virtual machine.

The last thing I need to solve is how to get the USLOSS library included in my project. The instructions for getting this folder into my project on Lectura are to run ```ln -s <remote usloss directory> <project directory>```. This command is some Linux trickery which includes the contents of one folder in another without having to make a copy of the files directly. This folder has to be included in our projects in order for them to compile. To keep things in my Vagrant environment as close to the Lectura environment as possible, I copy the USLOSS folder from Lectura to the root directory of my project. Then from the terminal in my virtual machine,I run:

~~~ bash
vagrant@vagrant-ubuntu-precise-64:/vagrant/phase1$ ln -s /vagrant/usloss /vagrant/phase1/usloss
ln: failed to create symbolic link '/vagrant/phase1/usloss': Protocol error
vagrant@vagrant-ubuntu-precise-64:/vagrant/phase1$
~~~

Here is where running a Linux virtual machine on a Windows host machine with directory mapping from one to the other is a problem. That ```ln``` command expects to find a unix file system, but instead gets a Windows file system and Windows doesn't do soft links. So this isn't going to work. The only option I have here is to copy the USLOSS folder directly into my phase1 folder and skip the soft links all together. This isn't technically different from the soft link method except it uses more disk space because I have a bunch of copies of the USLOSS folder, one in each phase of the project.

There is one sneaky link left, if we look into the USLOSS folder we see the following:

~~~ bash
cnieren@Lectura:/home/cs452/fall15/usloss/Linux|$  ls -lR
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
~~~

That last line is a problem; it shows that the libusloss.a file is actually an alias (ln -s) for libusloss2.9.a. This trick lets us change the version of the USLOSS library we are using by changing the file with a version number, but  all references to libusloss.a will automagically update to the new version of the code. As we found before, the Windows file system doesn't know how to handle soft links like this. Instead, I remove the libusloss.a link and rename libusloss2.9.a to libusloss.a and we are in business!

I have been using this setup for the first three phases of this project and it works wonderfully. To get started working, all I have to do is open my project in a text editor and run ```vagrant up && vagrant ssh``` in a terminal window. I can then work on the host Windows machine and as soon as I save changes they are synced to the Ubuntu virtual machine. At which point I can run ```make``` or a test shell script to run my code. Most importantly, I have not had any problems getting my code to run on Lectura when I am ready to turn my project in.

[class]: http://www.cs.arizona.edu/courses/cs452.html
[precise]: https://atlas.hashicorp.com/ubuntu/boxes/precise64
