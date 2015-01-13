var BaseElement = require('./BaseElement');

function Version (data, Fixture) {
    this.constructor(data, Fixture);
}

Version.prototype = new BaseElement();

module.exports = Version;
