'use strict'
const User = require('./user') // 1. require the model

async function init() {
    await User.sync(); // 2. sync the model
};
init();

module.exports = {
    User, // 3. export the model
};