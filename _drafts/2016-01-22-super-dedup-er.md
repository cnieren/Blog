---
layout:     post
author:     Chad Nierenhausen
title:      (Super) Dedup-er
date:       2016-01-22
summary:    Stable deduplication of an unsorted collection of email addresses.
categories: algorithm
thumbnail:  code
tags:
 - computer science
 - algorithms
---
I was recently asked to use JavaScript to solve the following problem:

> Given an unsorted list of email addresses write a function to remove all duplicates while maintaining the original ordering of the list. The solution should be able to run in well under a second on and list of 100,000 items with up to 50% duplication in the list.

## The easy solution
Let\'s start with the obvious answer, doubly nested loops! 100,000 items sounds big, but modern computers are super-fast, maybe it will be fast enough, let\'s test.

{% highlight javascript %}
function dedupe(arr) {
    var i, j;

    for(i = 0; i < arr.length; i++) {
        for(j = i + 1; j < arr.length; j++) {
            if(arr[i] === arr[j]) {
                arr.splice(j, 1);
            }
        }
    }

    return arr;
}

var input = [1, 2, 0, 3, 4, 3, 2, 4, 1, 0]
    output = [],
    t0,
    t1;

console.log('Before:', input.length, input);

t0 = performance.now();
output = dedupe(input);
t1 = performance.now();

console.log('After:', output.length, output);
console.log('Took:', (t1 - t1) / 1000.0, 'seconds');

// Result
// Before: 10 [1, 2, 0, 3, 4, 3, 2, 4, 1, 0]
// After: 5 [1, 2, 0, 3, 4]
// Took: 0.00013000000000000256 seconds.

{% endhighlight %}

For 10 items it\'s definitely fast enough, but how will it work with 1,000, 10,000, or 100,000 items? I\'m not about to type up a 1,000 item array, so next we need something to generate arrays for us to test with.


{% highlight javascript %}
function generate(num) {
    var i, result = [];

    // Generate half the numbers
    for(i = 0; i < num / 2; i++) {
        result.push(getRandomNumber(1, num));
    }

    // Copy every other number to the end of the existing array
    for(i = 0; i < num / 2; i += 2) {
        result.push(result[i]);
    }

    // Shuffle the array
    return shuffle(result);
}

// Get a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle the list of numbers to distribute duplicates.
function shuffle(arr) {
    var i, tmp, rand;

    for(i = arr.length - 1; i > 0; i--) {
        rand = _getRandomNumber(0, i);
        tmp = arr[i];
        arr[i] = arr[rand];
        arr[rand] = tmp;
    }

    return arr;
}    

var input = generate(100)
    output = [],
    t0,
    t1;

console.log('Before:', input.length);

t0 = performance.now();
output = dedupe(input);
t1 = performance.now();

console.log('After:', output.length);
console.log('Took:', (t1 - t1) / 1000.0, 'seconds');

// Results
// Before: 100
// After: 50
// Took: 0.00014999999999999858 seconds.

// Before: 1000
// After: 500
// Took: 0.00223 seconds.

// Before: 10000
// After: 5000
// Took: 0.04742000000000001 seconds.

{% endhighlight %}

This is looking really good, 10,000 items with 50% duplication only takes about 47 Milliseconds, and one more zero can\'t make that much of a difference can it? Wrong, 100,000 items takes 4.5 seconds on my fairly powerful desktop computer. For fun I added one more zero just to see how long it would take for 1,000,000 items, **7.5 Minutes!** We knew this wasn\'t the best solution, doubly nested loops run in O(n<sup>2</sup>) time, but it is really easy to write and as we showed, for small enough inputs it works just fine.

##The better solution
