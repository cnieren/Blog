/**
 *
 * Provides a stable dedupelication function for a list of items
 *
 */
var Dedupe = (function() {

    var dedupe = {};
    var _root = null;

    /**
     * Removes duplicate items from the input array
     * in a new array, while preserving the origional ordering
     * Note: Keeps the first occurrence of any duplicate item
     */
    dedupe.clean = function(arr) {
        var i, test;
        var result = [];

        // Clear tree from previous run
        _root = null;

        for (i in arr) {
            if(_add(arr[i])) {
                result.push(arr[i]);
            }
        }

        return result;
    }

    /**
     * Attempt to add the value to the tree of items.
     * Returns true if the item was not already in the tree, false otherwise
     */
    _add = function(val) {
        var current;

        // Create new node
        var newNode = {
            data: val,
            left: null,
            right: null
        };

        // If the tree is empty, add the node to the root
        if(!_root) {
            _root = newNode;
            return true;
        }

        // Use helper function to add node
        return _addHelper(_root, newNode);
    }

    /**
     * Use recursion to try and add the node to the list
     */
    _addHelper = function(root, node) {
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
            return _addHelper(root.left, node);
        }

        // Add to right sub-tree
        if(!root.right) {
            root.right = node;
            return true;
        }
        return _addHelper(root.right, node);
    }

    return dedupe;

})();

/**
 *
 * Module to generate test data for this example
 * Can create a random list of numbers or email addresses
 *
 */
var Generator = (function() {
    var generator = {};

    /**
     * Return a list of random numbers
     *
     * Param: num - the number of items to generate
     * Return: A suffled list of random numbers
     */
    generator.getNumbers = function(num, dupPercent) {
        var result = [], i, numDups, numOrig;

        numDups = Math.ceil(num * dupPercent);
        numOrig = Math.ceil(num - numDups);

        for (i = 0; i < numOrig; i++) {
            result.push(i);
        }

        for (i = 0; i < numDups; i++) {
            result.push(result[i]);
        }

        return _shuffle(result);
    }

    /**
     * Return a list of random email addresses
     *
     * Param: num - the number of items to generate
     * Return: A suffled list of random email addresses
     */
    generator.getAddresses = function(num, percent) {
        var result = [], i, numDups, numOrig;

        numDups = Math.ceil(num * percent);
        numOrig = Math.ceil(num - numDups);

        for(i = 0; i < numOrig; i++) {
            result.push(_createAddress());
        }

        for(i = 0; i < numDups; i++) {
            result.push(result[i]);
        }

        return _shuffle(result);
    }

    /**
     * Generate a random email name, and pick a random domain to go with it
     */
    _createAddress = function() {
        var domains = ['@gmail.com', '@hotmail.com', '@yahoo.com', '@aol.com', '@chefsteps.com'];
        var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var i, name = '', domainIdx;

        for(i = 0; i < 7; i++) {
            name = name + letters[_getRandomNumber(0, 25)];
        }

        domainIdx = _getRandomNumber(0, 4);

        return name + domains[domainIdx];
    }

    /**
     * Get a random number between min and max (inclusive)
     */
    _getRandomNumber = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Shuffle the list of numbers to distribute duplicates.
     * Uses the Fisher-Yates shuffle algorithm
     */
    _shuffle = function(arr) {
        var i, tmp, rand;

        for(i = arr.length - 1; i > 0; i--) {
            rand = _getRandomNumber(0, i);
            tmp = arr[i];
            arr[i] = arr[rand];
            arr[rand] = tmp;
        }

        return arr;
    }

    return generator;
})();

/**
 *
 * Module to provide application functionality
 *
 */
var App = (function($) {
    var app = {},
        resultTemplate,
        msgTemplate;

    /**
     * Initialize the click handler on the button
     */
    app.init = function() {
        $('#go').on('click', _run);
    }

    /**
     * Go button entry point
     * Does some basic error checking and starts the generation
     * and dedupelication process.
     */
    _run = function() {
        var numStr = $('#number').val();
        var filter = new RegExp(',', 'g');
        numStr = numStr.replace(filter, '');

        var number = parseInt(numStr, 10);
        var percent = parseFloat($('#percent').val());

        // Close any existing alert or results
        $('.alert').alert('close');
        $('#result').remove();

        // Sanity checks
        if(isNaN(number)) {
            _showError('Invalid Number.');
        } else if (isNaN(percent)) {
            _showError('Invalid Percent.');
        } else if (number < 1 || number > 100000) {
            _showError('Number out of range 1 <= number <= 100,000.');
        } else if (percent < .1 || percent > .5) {
            _showError('Percent out of range .1 <= percent <= .5');
        }

        _dedupe(number, percent);
    }

    /**
     * Display the specified error message to the user
     */
    _showError = function(message) {
        var tmpl = Handlebars.compile($('#error-msg-template').html());

        $('#form').prepend(tmpl({msg: message}));
    }

    /**
     * Performs the work of generating the data, removing the duplicates,
     * and records the stats for the output.
     */
    _dedupe = function(num, percent) {
        var context = {
            input: [],
            output: [],
            stats: {
                inSize: 0,
                outSize: 0,
                time: 0
            }
        };

        var t0, t1, itemType;

        itemType = $('option').filter(':selected').val();

        if(itemType === 'email') {
            context.input = Generator.getAddresses(num, percent);
        } else if (itemType === 'number') {
            context.input = Generator.getNumbers(num, percent);
        } else {
            _showError('Invalid item type.');
            return;
        }

        context.stats.inSize = context.input.length;

        // Record the time it takes to remove duplicates
        t0 = performance.now();
        context.output = Dedupe.clean(context.input);
        t1 = performance.now();

        context.stats.outSize = context.output.length;
        context.stats.time = (t1 - t0) / 1000.0

        _printResult(context);
    }

    /**
     * Show the results to the user
     */
    _printResult = function(data) {
        var tmpl = Handlebars.compile($('#result-template').html());

        $('#form').after(tmpl(data));
    }

    return app;

})(jQuery);

// Start this thang
App.init();
