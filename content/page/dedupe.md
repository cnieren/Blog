+++
author = "Chad Nierenhausen"
date = "2016-02-03T17:42:23-07:00"
description = "Remove duplicates from a list"
js = ["http://code.jquery.com/jquery-1.12.0.min.js", "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js",  "/js/dedupe.js"]
title = "(Super) Dedup-er"
slug = "dedupe"

+++

<section>
    <h3>Instrictions</h3>
    <ol>
        <li>Select the type of item you want to generate</li>
        <li>Enter the number of items to generate, between 1 and 100,000</li>
        <li>Enter the percent of that total that should be duplicated, between .1 and .5</li>
        <li>Hit Go!</li>
    </ol>

    <p>The specified number of items will be generated with the specified percent of duplicates. That list will then have all duplicates removed, while maintaining the original ordering of the list. You will be shown the original list that was generated, the list with duplicates removed, and some stats about how long it took to remove the duplicates, the original number of items, and the number of duplicates that were in the list.</p>
    <hr />

    <div class="flex" id="form">
        <div class="row center">
            <div class="flex-item">
                <label for="dataType">Item Type</label>
                <select class="form-control" id="dataType" name="dataType">
                    <option value="email" selected="selected">Emails</option>
                    <option value="number">Numbers</option>
                </select>
            </div>
        </div>
        <div class="row around bottom">
            <span class="flex-item">
                <label for="number">Number of Items</label>
                <input class="form-control" id="number" type="number" name="number" min="0" max="100000" value="10"></input>
            </span>
            <span class="flex-item">
                <label for="percent">Percent duplication</label>
                <input class="form-control" id="percent" type="number" name="percent" min="0" max="0.5" value="0.25" step=".05"></input>
            </span>
            <span class="flex-item">
                <button class="btn" id="go">Go!</button>
            </span>
        </div>
    </div>
</section>

<script id="error-msg-template" type="text/x-handlebars-template">
    <div class="alert alert-danger">{{msg}}</div>
</script>
<script id="result-template" type="text/x-handlebars-template">
    <div class="flex">
        <div id="result" class="row around top">
            <div>
                <h3>Input</h3>
                <ul>
                    {{#each input}}
                    <li>{{this}}</li>
                    {{/each}}
                <ul>
            </div>
            <div>
                <h3>Output</h3>
                <ul>
                    {{#each output}}
                    <li>{{this}}</li>
                    {{/each}}
                <ul>
            </div>
            <div>
                <h3>Stats</h3>
                <ul>
                    <li>Input size: {{stats.inSize}}</li>
                    <li>Output size: {{stats.outSize}}</li>
                    <li>Time spent (seconds): {{stats.time}}</li>
                </ul>
            </div>
        </div>
    </div>
</script>
