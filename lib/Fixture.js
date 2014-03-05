var elementTypes = {
    Episode: require('./Elements/Episode'),
    Programme: require('./Elements/Programme'),
    Group: require('./Elements/Group'),
    Version: require('./Elements/Version')
},
    fs = require('fs')

function Fixture(name, data, elementPool, config) {
    this.feedName = name;
    this.elementPool = elementPool;
    this.data = data;
    this.config = config || {
        savePath: './fixtures/'
    }

    this.elementsArray = Fixture.findElementsArray(this.data)
}

/* Instance Methods */

Fixture.prototype.getElement = function (num) {
    var data = this.elementsArray[num]
    return this.Factory(data);
};

Fixture.prototype.getEpisode = Fixture.prototype.getElement;
Fixture.prototype.getProgramme = Fixture.prototype.getElement;

Fixture.prototype._insertElement = function (type, num) {
    var newElement,
        currentElement = this.elementsArray[num];

    if (Fixture.typeToClass(currentElement.type) === type)
        return currentElement;

    newElement = this.elementPool.getMe(type);

    if (newElement === false)
    {
        throw new Error('Couldn\'t find a ' + type + ' item to insert into the fixture!')
    }

    this.elementsArray.splice(num, 0, newElement);

    return this.getElement(num);
}

Fixture.prototype.insertEpisode = function (num) {
    return this._insertElement('Episode', num)
}
Fixture.prototype.insertProgramme = function (num) {
    return this._insertElement('Programme', num)
}
Fixture.prototype.insertGroup = function (num) {
    return this._insertElement('Group', num)
}
Fixture.prototype.insertMostPopular = function (num) {
    return this._insertElement('MostPopular', num)
}

Fixture.prototype.Factory = function (data) {
    objectType = Fixture.typeToClass(data.type)
    if (objectType && elementTypes[objectType]) {
        return new elementTypes[objectType](data, this);
    } else {
        console.error('Unknown element type of', data.type, 'when getting element')
        return undefined;
    }
};

Fixture.prototype.save = function() {
    var name = this.feedName.replace(/\//g, '_'),
        path = this.config.savePath + name + '.json',
        headers = "HTTP/1.1 200 OK\nServer: Fixture\nContent-Language: en-GB\nContent-Type: application/json;charset=UTF-8\n\n",
        fileContents = headers + JSON.stringify(this.data)

    if (this.config.debug)
        console.log('Saving fixture', name)

    fs.writeFileSync(path, fileContents)
};


/* Static Methods */

Fixture.findElementsArray = function (feed) {
    var elementsArray;

    if (feed.elements !== undefined)
        return feed.elements;

    if (feed.home_highlights !== undefined)
        elementsArray = feed.home_highlights;

    if (feed.highlights !== undefined)
        elementsArray = feed.highlights;

    if (feed.channel_highlights !== undefined)
        elementsArray = feed.channel_highlights;

    if (feed.category_highlights !== undefined)
        elementsArray = feed.category_highlights;

    if (feed.programmes !== undefined)
        elementsArray = feed.programmes;

    if (feed.category_programmes !== undefined)
        elementsArray = feed.category_programmes;

    if (feed.episodes !== undefined)
        elementsArray = feed.episodes;

    if (feed.atoz_programmes !== undefined)
        elementsArray = feed.atoz_programmes;

    if (elementsArray === undefined)
        return false;

    if (elementsArray === undefined)
        return false;

    return elementsArray.elements;
}

Fixture.typeToClass = function (type) {
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

module.exports = Fixture;
