# webcheck-wait
A [webcheck](https://github.com/atd-schubert/node-webcheck) plugin to raise wait parameter by delay

## How to install

```bash
npm install --save @atd/webcheck-wait
```

## How to use

```js
/*jslint node:true*/

'use strict';

var WaitPlugin = require('@atd/webcheck-wait');

var Webcheck = require('webcheck');

var webcheck = new Webcheck();
var plugin = new WaitPlugin({
    delay: 10000,
    deviation: 5000
});

webcheck.addPlugin(plugin);
plugin.enable();


```

## Options
- `delay`: Number of milliseconds to elay.
- `deviation`: Deviation of delay (random).
- `filterUrl`: Follow only **in** matching url.


### Note for filters

Filters are regular expressions, but the plugin uses only the `.test(str)` method to proof. You are able to write
your own and much complexer functions by writing the logic in the test method of an object like this:

```js
opts = {
   filterSomething: {
       test: function (val) {
           return false || true;
       }
   }
}
```
