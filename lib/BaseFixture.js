var elementTypes = {
    Episode: require('./Episode'),
    Programme: require('./Programme'),
    Group: require('./Group'),
    Version: require('./Version')
},
    fs = require('fs')

function BaseFixture(name, data, elementPool, config) {
    this.feedName = name;
    this.elementPool = elementPool;
    this.data = data;
    this.config = config || {
        savePath: './fixtures/'
    }

    this.elementsArray = BaseFixture.findElementsArray(this.data)
}

/* Instance Methods */

BaseFixture.prototype.getElement = function (num) {
    var data = this.elementsArray[num]
    return this.Factory(data);
};

//BaseFixture.prototype.getEpisode = BaseFixture.prototype.getElement;

BaseFixture.prototype.insertEpisode = function (num) {
    var newElement,
        currentElement = this.getElement(num);

    if (currentElement.type === 'episode')
        return currentElement;

    this.elementsArray.splice(num, 0, this.elementPool.getMe('Group'));

    return this.getElement(num);
}

BaseFixture.prototype.insertElement = function (type, num) {
    var newElement,
        currentElement = this.getElement(num);

    if (currentElement.constructor.name === type)
        return currentElement;

    this.elementsArray.splice(num, 0, this.elementPool.getMe(type));

    return this.getElement(num);
}

BaseFixture.prototype.insertEpisode = function (num) {
    return this.insertElement('Episode', num)
}
BaseFixture.prototype.insertProgramme = function (num) {
    return this.insertElement('Programme', num)
}
BaseFixture.prototype.insertGroup = function (num) {
    return this.insertElement('Group', num)
}

BaseFixture.prototype.Factory = function (data) {
    objectType = BaseFixture.typeToClass(data.type)
    if (objectType && elementTypes[objectType]) {
        return new elementTypes[objectType](data, this);
    } else {
        console.error('Unknown element type of', data.type, 'when getting element')
        return undefined;
    }
};

BaseFixture.prototype.save = function() {
    var name = this.feedName.replace(/\//g, '_'),
        path = this.config.savePath + name + '.json',
        headers = "HTTP/1.1 200 OK\nServer: Fixture\nContent-Language: en-GB\nContent-Type: application/json;charset=UTF-8\n\n",
        fileContents = headers + JSON.stringify(this.data)


    fs.writeFileSync(path, fileContents)
};


/* Static Methods */

BaseFixture.findElementsArray = function (feed) {
    var elementsArray;

    if (feed.elements !== undefined)
        elementsArray = feed.elements;

    if (feed.home_highlights !== undefined)
        elementsArray = feed.home_highlights;

    if (feed.highlights !== undefined)
        elementsArray = feed.highlights;

    if (feed.category_highlights !== undefined)
        elementsArray = feed.category_highlights;

    if (feed.programmes !== undefined)
        elementsArray = feed.programmes;

    if (feed.category_programmes !== undefined)
        elementsArray = feed.category_programmes;

    if (feed.episodes !== undefined)
        elementsArray = feed.episodes;

    if (elementsArray === undefined)
        return false;

    return elementsArray.elements;
}

BaseFixture.typeToClass = function (type) {
    switch (type) {
        case 'episode':
            return 'Episode';
            break;
        case 'episode_large':
            return 'Episode';
            break;
        case 'programme':
            return 'Programme';
            break;
        case 'programme_large':
            return 'Programme';
            break;
        case 'group':
            return 'Group';
            break;
        case 'group_large':
            return 'Group';
            break;
        case 'version':
            return 'Version';
            break;
    }

    return '';
}

module.exports = BaseFixture;
