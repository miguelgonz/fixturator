var BaseElement = require('./BaseElement')

function Version (data, Fixture) {
    this.constructor(data, Fixture)
}

Version.prototype = BaseElement.prototype;

module.exports = Version;
