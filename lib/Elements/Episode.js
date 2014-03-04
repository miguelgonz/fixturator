var BaseElement = require('./BaseElement')

function Episode (data, Fixture) {
    this.constructor(data, Fixture)
}

Episode.prototype = new BaseElement();

Episode.prototype.getVersion = function(num) {
    num = (num === undefined ? 0 : num);
    var ele = this.data.versions[num]
    if (ele)
        return this.Fixture.Factory(ele);
    else
        console.error('Could not find Element',num,'in initial_children')

};

module.exports = Episode;
