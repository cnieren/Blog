+++
author = "Chad Nierenhausen"
date = "2015-05-13T00:00:00Z"
title = "Hello World"
description = "Rigging the Kickball Prom King and Queen Election."
thumbnail = "trophy"

tags = [ "python", "kickball", "prom", "surveymonkey", "automation" ]
+++

This is the start to my blogging journey. My intent is to use this as a place to post about the things I am working on, both to possibly help others out there on the internets, and to help future me when I run into a problem that I solved before, but have since forgotten what the solution was.

For my initial post, and to test the syntax highlighter, I want to post two little scripts I wrote to rig the results of a Kickball Prom King and Queen voting campaign.

## Round 1 <small>- Make sure Adam and Whitney WIN!!</small>

The first round was a multiple choice Survey Monkey poll that let you chose both King and Queen choices on the same page. So it was simply a matter of finding the two checkboxes on the page, selecting them and submitting the form. I used a Python library [Mechanical Soup][ms] which opens a 'browser object' points it to the specified url, finds the two inputs for the people I wanted to vote for and checks them, then submits the form. This doesn't actually open a browser window, so it voted 439 times in about 7 minutes\.\.\. I'm betting that they won't run analytics here.

~~~ py
import mechanicalsoup

for i in range(1, 439):
    br = mechanicalsoup.Browser()

    page = br.get('https://www.surveymonkey.com/r/SURVEY-ID')
    form = page.soup.form

    form.find("input", {"name": "788222012[]", "value": "8873191506"})['checked'] = "checked"


    form.find("input", {"name": "788223053[]", "value": "8873193002"})['checked'] = "checked"

    response = br.submit(form, page.url)
~~~


## Round 2 <small>- They can not stop me!</small>

When the people your script voted for win by a margin of 400 votes you don't need analytics to prove that someone isn't playing by the rules. For round two the survey creators split the voting across two pages, and enabled the 'One vote per computer' option on survey monkey. What Survey Monkey does when this option is set, is to put a cookie on your machine after you complete the survey, so if you return to the survey again it gives you a 'You can only vote once' message. Chrome Incognito (the Web Developer's best friend) to the rescue!

[Selenium][se] is a framework for automating testing of web user interfaces, and conveniently has a Python library. I also wanted to try and reduce the chance that if they did run analytics that they would see 70 submissions all at the same time. So I decide to try and make the votes a little more random, this script will vote once randomly every 15 - 45 minutes and it only will do that up to 70 times, or as many times as it can before the survey closes. This one actually opens a Chrome Incognito window, points it to the survey URL votes for the King, moves to the second page and votes for the Queen, submits the form and closes the browser.

~~~ py
import time
import random
from selenium import webdriver

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--incognito")

for i in range(1, 70):
    wait = random.randint(15, 45) * 60
    time.sleep(wait)
    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.get("https://www.surveymonkey.com/r/SURVEY-ID")

    whitney = driver.find_element_by_css_selector("label[for='793400743_8907718403']")
    whitney.click()
    whitney.submit()

    adam = driver.find_element_by_css_selector("label[for='793403175_8907737022']")
    adam.click()
    done = driver.find_element_by_class_name("done-button")
    done.click()
    driver.close()
~~~

### Round 3 <small>- They can stop me <i class="fas fa-sad-cry"></i></small>

For round three they decided to have everyone vote on the fields using 'Physical Paper' and somehow our whole team didn't know that this was happening and Adam and Whitney didn't make it to the final four. Congratulations to our 2015 Waka Kickball Prom King and Queen Paul and Patrick.

This was the first web automation attempt I have ever made, and the first project (if you can call it that) I have ever written in Python. It was a fun excuse to try and game a system that didn't really matter much to anyone, and I learned some things along the way. I'm also starting to suspect that you really can solve most programming problems in Python with a simple import statement.

[ms]: https://github.com/hickford/MechanicalSoup
[se]: https://selenium-python.readthedocs.org/
