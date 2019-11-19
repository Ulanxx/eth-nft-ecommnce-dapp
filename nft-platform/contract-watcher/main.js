var App = require("./app.js");
var utils = require("./utils.js");
var Config = require('./config.js');

// app options
var appOptions = Config;

// watch options
var watchOptions = {
    contractAddress: ''
};

// define entry function
var main = function main(appOptions, watchOptions) {
    let app = new App(appOptions);

    app.init().then(initialized => {
        if (initialized) {
            app.start(watchOptions);
        }
    });
};

// start app
main(appOptions, watchOptions);

