+++
author = "Chad Nierenhausen"
date = "2016-01-22T00:00:00Z"
title = "(Super) Dedup-er"
description = "Stable deduplication of an unsorted collection of email addresses."
thumbnail = "code"

tags = ["algorithm", "computer science", "javascript"]
+++

I was recently asked to use JavaScript to solve the following problem:

> Given an unsorted list of email addresses, write a function to remove all duplicates while maintaining the original ordering of the list. The solution should be able to run in well under a second on and list of 100,000 items with up to 50% duplication in the list.

## TL;DR
Insertion into a binary tree is much faster than doubly nested loops and insertion into a hash table is faster yet. Who knew?
Here is a live [demo][Demo] you can play with and the code that powers the demo can be found [here][DemoCode].

## The easy solution
Let's start with the obvious answer, doubly nested loops! For each element in the list we visit every other element to see if we find a duplicate. 100,000 items sounds big, but modern computers are super-fast. Maybe it will be fast enough, let's test.

~~~ js
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
~~~

For 10 items it's definitely fast enough, but how will it work with 1,000, 10,000, or 100,000 items? I'm not about to type a 1,000 item array manually, so  the next thing we need is something to generate arrays for us to test with.


~~~ js
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
~~~

This is looking really good. 10,000 items with 50% duplication only takes about 47 milliseconds, and one more zero can't make that much of a difference can it? Wrong, 100,000 items takes 4.5 seconds on my fairly powerful desktop computer. For fun I added one more zero just to see how long it would take for 1,000,000 items. **7.5 minutes!** We knew this wasn't the best solution, doubly nested loops run in O(n<sup>2</sup>) time, but they are really easy to write and as we showed, for small enough inputs, they work just fine.

## The better solution

Instead of searching for each item in the list, let's use a binary tree to help. It isn't the most intuitive solution, but it goes something like this: attempt to add every item in the list to a binary tree. While we are trying to find the location in the tree for a particular item, if we find that the tree already contains that item, report that it was a duplicate and don't add it to the result. Inserting _n_ items into a binary tree on average runs in O(n log n) time. Just to drive this point home, for 20 items using the doubly nested loops  we would execute about 400 operations, using the tree method we would execute just 26! Here is the important code and the results of running the same tests as before using the tree solution.

~~~ js
var root = null;


function dedupe(arr) {
    var i, test;
    var result = [];

    for (i in arr) {
        if(add(arr[i])) {
            result.push(arr[i]);
        }
    }

    return result;
}

function add(val) {
    var current;

    // Create new node
    var newNode = {
        data: val,
        left: null,
        right: null
    };

    // If the tree is empty, add the node to the root
    if(!root) {
        root = newNode;
        return true;
    }

    // Use helper function to add node
    return addHelper(root, newNode);
}

function addHelper(root, node) {
    if (root.data === node.data) {
        // Duplicate found
        return false;
    }

    // Add to left sub-tree
    if(node.data < root.data) {
        if(!root.left) {
            root.left = node;
            return true;
        }
        return addHelper(root.left, node);
    }

    // Add to right sub-tree
    if(!root.right) {
        root.right = node;
        return true;
    }
    return addHelper(root.right, node);
}

// Results
// Before: 100
// After: 50
// Took: 0.001 seconds.

// Before: 1000
// After: 500
// Took: 0.0009950000000000046 seconds.

// Before: 10000
// After: 5000
// Took: 0.013000000000000015 seconds.
~~~

Clearly this method is faster (100,000 items with this code took 0.137 seconds), but even the doubly nested loops finished 10,000 items in under a second. The 'just for fun' test from before of 1,000,000 items that took 7.5 minutes now only takes 1.5 seconds! But if we push it by just one more zero again to 10,000,000, we jump to 22.5 seconds.

## Even bigger

Let's assume we are trying to solve this problem in the same amount of time, but instead of only 100,000 items we had 100 million or 1 billion; how could we change our solution to work for these kinds of data sets? We could change the structure we insert all of the items into from a  binary tree to a hash table. In general, insertion into a hash table runs in O(1) or constant time, which would be possible to process in JavaScript on the client side in a reasonable time. Once we get into the billions it makes more sense to move the computation to the database. Database servers generally have significantly more processing power than a typical consumer computer, and they are optimized to run these kinds of computations.  

You can find a demo of this code [here][Demo], and the full version of the code that powers that demo can be found [here][DemoCode].

[Demo]: /dedupe
[DemoCode]: https://gist.github.com/cnieren/eef196769425143c9bd1
