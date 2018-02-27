// Globals
const {init} = require('bak');
const Config = require('config');

// Plugins
const MongoosePlugin = require('bak/lib/mongoose');
const LoggingPlugin = require('bak/lib/logging');
const Scooter = require('scooter');

init({
    plugins: [
        // Mongoose
        {register: MongoosePlugin, options: Config.get('mongo')},

        // User Agent
        {register: Scooter},
    ],

    routes: [
        // Public API
        {prefix: '/api', routes: () => require('./controllers/public')}
    ]

});
