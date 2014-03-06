    var Fixture = require('./Fixture')

function ElementPool () {
    this.pools = {
        Episode: [],
        Group: [],
        Programme: [],
        Version: [],
        MostPopular: [],
        Live: [],
        Offair: []
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
    if (this.pools[type].length == 0)
        return false;

    num = Math.floor(Math.random() * this.pools[type].length);
    return JSON.parse(JSON.stringify(this.pools[type][num]));
};

ElementPool.prototype.processElement = function(element) {
    elementType = Fixture.typeToClass(element.type);
    if (elementType === '')
        return true;

    if (elementType === 'Group') {
        if (element.id === 'popular')
            elementType = 'MostPopular'

        if (element.id === 'live')
            elementType = 'Live'

        if (element.id === 'offair')
            elementType = 'Offair'

    }

    if (elementType === 'Episode' && element.versions && element.versions[0]) {
        this.pools['Version'][0] = element.versions[0];
    }

    this.pools[elementType].push(element);

    return true;
};

module.exports = ElementPool;
