---
layout:     post
author:     Chad Nierenhausen
title:      About this Blog - Part 2
date:       2015-07-14
summary:    The technology behind this blog
categories: jekyll
thumbnail: flask
tags:
 - docker
 - github
 - blog
---

## History

Before I try to explain the concept of containers, let me start with a story of how we got to where we are now with server technology. Lets assume you have a data\-driven website you want to deploy, you recently graduated college so you don\'t have much money so you buy one moderately powerful computer run the database and webserver on the same machine. Not only is this a security vulnerability, it doesn\'t allow you to scale up if you start to get more traffic than the one computer can handle. As your number of users grow you decide you need to upgrade your infrastructure so you buy another machine, the original runs your database and you move the webserver to the new computer. Now instead of the one machine you had running at an average of 75% resource utilization, you have two machines running at 30% each.

Then one day someone posts one of your blogs on [SlashDot] and the flood of users crashes your site. In a panic you buy 4 new computers one of them you make a secondary database and the other three are web servers this gets you back online, but after a few days the traffic to your site settles back down to the pre-SlashDot rate and you are now running 6 servers all at less than 10% resource utilization. Not ideal, but you should survive the next time a post hits the front page of SlashDot.

Now that your site is internet famous you decide you should have an email address me@my-domain.com, you could install the email server on one of the new web servers you just purchased, but you know best practice is to only have one role installed per server and you don\'t want to risk another crash so you can\'t remove a web server. Your only option is to buy another computer to host your email\.\.\. Or is it?

This is where virtualization starts, instead of buying a new moderately powerful computer for every service you want to run, buy a few really powerful computers and run separate virtual servers on that same set of hardware. Each virtual machine has its own operating system and is sandboxed off from the others so this isn\'t a security vulnerability, and you can get more use out of the hardware that you buy. So you sell off your 6 old computers that were running your site and you buy 2 super powerful computers (virtual hosts) and build out your two databases, 4 web servers and your new email server as separate virtual machines, and now you are now more efficiently using your hardware.

Could we do better? Every virtual machine that is running on your virtual hosts has to have its own operating system installed. In most cases every service is running the same operating system. That means a significant portion of your resource load is being used by the same processes all running on different installs of the same operating system. What if we only needed one operating system installed on our virtual hosts and we could run our applications in sandboxed containers inside of that one OS?

This is where containers come in, now you buy your super powerful hardware, install one operating system on it, then package all of your services (web server, database, email server, etc.) into separate containers and run them on that one operating system. We are now using our hardware even more efficiently because we don\'t have all those redundant operating systems doing the same thing across our virtual machines!


## Docker
> [Docker] containers wrap up a piece of software in a complete filesystem that contains everything it needs to run: code, runtime, system tools, system libraries \- anything you can install on a server. This guarantees that it will always run the same, regardless of the environment it is running in.

Docker is a utility that makes the configuration and management of containers a breeze.

## Github

[Docker]: https://www.docker.com/
[SlashDot]: http://slashdot.org/
