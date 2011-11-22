/*jslint node: true, vars: true, white: true, regexp: true, forin: true, nomen: true, sloppy: true */
/*global define,require,__dirname,module */
/**
 * Module dependencies.
 */

var spawn  = require('child_process').spawn,
    exec   = require('child_process').exec;

var soda = require('soda'), 
    assert = require('assert'),
    selenium;

var browser = soda.createClient({
    host: 'localhost', 
    port: 4444,
    // url: 'http://unitedstudios.com',
    url: 'http://localhost:3001',
    browser: 'firefox'
});

browser.on('command', function(cmd, args){
  console.log(' \x1b[33m%s\x1b[0m: %s', cmd, args.join(', '));
});

module.exports = {
    start: function(callback){
        selenium = spawn('java', ['-jar', '/Users/davetayls/Dropbox/Work/tools/selenium/selenium2.jar']);
        selenium.stderr.on('data', function(data){
            console.log('stderr: ' + data);
        });
        selenium.stdout.on('data', function(data){
            console.log('stdout: ' + data);
            if (/Started.*jetty.Server/.test(data)){
                callback.call(this);
            }
        });
    },   
    stop: function() {
        selenium.stdin.end();
        selenium.kill();
    },
    run: function(callback){
        browser.chain.session()
            .open('/')
            .assertTextPresent('digital production agency')
            .assertTextPresent('The right people. The right time. The right price')
            .assertTextPresent('always happy to show off our work')
            .assertElementPresent('css=.mod-carousel-nav')
            .assertElementPresent('css=.maps-loaded')
            .open('/?a#services')
            .assertElementPresent('css=.section-on')
            .open('/?b#work')
            .assertElementPresent('css=.section-on')
            .open('/?c#contact')
            .assertElementPresent('css=.section-on')
            .open('/?d#badhash')
            .assertElementPresent('css=.section-on')
            .open('/facebook')
            .assertTextPresent('specialising in Facebook app development')
            .testComplete()
            .end(function(err){
                if (err) {
                    throw err;
                }
                console.log('done');
                if (typeof callback === 'function') {
                    callback.call(browser, arguments);
                }
            });
    }
};
