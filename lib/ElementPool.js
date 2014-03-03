var Fixture = require('./Fixture')

function ElementPool () {
    this.pools = {
        Episode: [],
        Group: [],
        Programme: [],
        Version: [],
        MostPopular: []
    };
}

ElementPool.prototype.processFeed = function(feed) {
    var that = this,
        elements = Fixture.findElementsArray(feed);

    if (elements === false)
        return true;

    elements.forEach(function (element, i) {
        that.processElement(element);
    });

    return true;
};

ElementPool.prototype.getMe = function(type) {
    num = Math.floor(Math.random() * this.pools[type].length);
    return JSON.parse(JSON.stringify(this.pools[type][num]));
};

ElementPool.prototype.processElement = function(element) {
    elementType = Fixture.typeToClass(element.type);
    if (elementType === '')
        return true;

    if (elementType === 'Group' && element.id === 'popular')
        elementType = 'MostPopular'

    this.pools[elementType].push(element);

    return true;
};

module.exports = ElementPool;
