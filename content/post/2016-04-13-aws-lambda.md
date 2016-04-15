+++
author = "Chad Nierenhausen"
date = "2016-04-12T16:36:26-07:00"
title = "AWS Lambda"
description = "Automating scheduled tasks with AWS Lambda"
thumbnail = "calendar"

tags = ["aws", "python", "api", "REST"]
draft = true
+++

When it comes to scheduling a some code to run on a regular schedule, and not as a response to some external action, e.g. User input, or a file upload etc. There are only two solutions I have ever known: use a chron job in a database or use a scheduled task in an Operating System. Both of these solutions are imperfect and bring a lot of baggage with them.

Our department uses one vendor provided software suite to manage housing for students on campus, and a different vendor provided software suite to manage conduct violations. So if a student who lives in a dorm is evicted the conduct system is used to facilitate that process. But there isn't an automated way to alert the housing system that this person has been evicted so it is possible for the student to apply to live in the dorms again next semester. This is the problem I set out to solve, and the basic solution is to get a list of students who have been evicted in the conduct system, find them in the housing system and mark a flag to indicate that they have been evicted to prevent them from applying for housing for a later term.

At re:Invent this last year, Amazon announced that they have added time based triggers to Lambda, this is exactly the lightweight solution I was looking for to run some code at the same time every day, without having to worry about running a Database or setting it up as a scheduled task on a random server.

When I set out to build this interface Lambda only had support for Python, Java, and Javascript.
