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

Episode.prototype.addVersion = function (num) {
    num = (num === undefined ? 0 : num);

    var newElement = this.Fixture.elementPool.getMe('Version');
    this.data.versions.splice(num, 0, newElement);

    return this.getVersion(num);
}

Episode.prototype.removeAllVersions = function() {
    if (this.data.versions.length > 0)
        this.data.versions.splice(0,this.data.versions.length);
    return this;
};

module.exports = Episode;
