var BaseElement = require('./BaseElement')

function Programme (data, Fixture) {
    this.constructor(data, Fixture)
}

Programme.prototype = new BaseElement();

Programme.prototype.getEpisode = function (num) {
    num = (num === undefined ? 0 : num);
    var ele = this.data.initial_children[num]
    if (ele)
        return this.Fixture.Factory(ele);
    else
        console.error('Could not find Element',num,'in initial_children')
}

Programme.prototype.addEpisode = function (num) {
    num = (num === undefined ? 0 : num);

    var newElement = this.Fixture.elementPool.getMe('Episode');
    this.data.initial_children.splice(num, 0, newElement);
    this.data.count++;
    return this.getEpisode(num);

}

Programme.prototype.removeAllItems = function() {
    this.data.initial_children.splice(0,this.data.initial_children.length);
    this.data.count = 0;
    return this;
};

module.exports = Programme;
