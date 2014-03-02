var BaseElement = require('./BaseElement')

function Programme (data, Fixture) {
    this.constructor(data, Fixture)
}

Programme.prototype = BaseElement.prototype;

Programme.prototype.getEpisode = function (num) {
    num = (num === undefined ? 0 : num);
    var ele = this.data.initial_children[num]
    if (ele)
        return this.Fixture.Factory(ele);
    else
        console.error('Could not find Element',num,'in initial_children')
}

module.exports = Programme;
