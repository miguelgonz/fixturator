var BaseElement = require('./BaseElement')

function Episode (data, Fixture) {
    this.constructor(data, Fixture)
}

Episode.prototype = BaseElement.prototype;

module.exports = Episode;
