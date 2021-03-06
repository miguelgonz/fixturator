var elementTypes = {
    Episode: require('./Elements/Episode'),
    Programme: require('./Elements/Programme'),
    Group: require('./Elements/Group'),
    Version: require('./Elements/Version')
},
    fs = require('fs');

function Fixture(name, data, elementPool, config, fixtureName) {
    this.feedName = name;
    this.elementPool = elementPool;
    this.data = data;
    this.fixtureName = fixtureName;
    this.config = config || {
        savePath: './fixtures/',
        spaces: '  '
    };

    this.elementsArray = Fixture.findElementsArray(this.data);

    if (!this.elementsArray && this.config.debug) {
        console.error('[ERROR] Couldn\'t find elements array for feed:', name, ' fixture:',fixtureName);
    }
}

/* Instance Methods */

Fixture.prototype.removeAllItems = function() {
    this.elementsArray.splice(0,this.elementsArray.length);
};

Fixture.prototype.getElement = function (num) {
    num = (num === undefined ? 0 : num);
    var data = this.elementsArray[num];
    if (data === undefined) {
        console.error('Couldn\'t get element',num,'from feed.',this.elementsArray.length,'total elements');
    } else {
        return this.Factory(data);
    }
};

Fixture.prototype.getEpisode = Fixture.prototype.getElement;
Fixture.prototype.getProgramme = Fixture.prototype.getElement;

Fixture.prototype._insertElement = function (type, num) {
    num = (num === undefined ? 0 : num);

    var newElement,
        currentElement = this.elementsArray[num];

    if (currentElement && Fixture.typeToClass(currentElement.type) === type)
        return this.getElement(num);

    return this._addElement(type, num);
};

Fixture.prototype.insertEpisode = function (num) {
    return this._insertElement('Episode', num);
};

Fixture.prototype.insertProgramme = function (num) {
    return this._insertElement('Programme', num);
};

Fixture.prototype.insertGroup = function (num) {
    return this._insertElement('Group', num);
};

Fixture.prototype.insertMostPopular = function (num) {
    return this._insertElement('MostPopular', num);
};

Fixture.prototype._addElement = function (type, num) {
    num = (num === undefined ? 0 : num);

    var newElement;

    newElement = this.elementPool.getMe(type);

    if (newElement === false)
    {
        throw new Error('Couldn\'t find a ' + type + ' item to insert into the fixture!');
    }

    this.elementsArray.splice(num, 0, newElement);
    return this.getElement(num);
};

Fixture.prototype.addEpisode = function (num) {
    return this._addElement('Episode', num);
};

Fixture.prototype.addProgramme = function (num) {
    return this._addElement('Programme', num);
};

Fixture.prototype.addGroup = function (num) {
    return this._addElement('Group', num);
};

Fixture.prototype.addMostPopular = function (num) {
    return this._addElement('MostPopular', num);
};

Fixture.prototype.Factory = function (data) {
    objectType = Fixture.typeToClass(data.type);

    if (objectType && elementTypes[objectType]) {
        return new elementTypes[objectType](data, this);
    } else {
        console.error('Unknown element type of', data.type, 'when getting element');
        return undefined;
    }
};

Fixture.prototype.save = function(name) {
    var path = this.config.savePath + name + '.json',
        headers = "HTTP/1.1 200 OK\nServer: Fixture\nContent-Language: en-GB\nContent-Type: application/json;charset=UTF-8\n\n",
        fileContents = headers + JSON.stringify(this.data, null, this.config.spaces);

    if (this.config.debug) {
        console.log('Saving fixture', name);
    }

    fs.writeFileSync(path, fileContents);
};


/* Static Methods */

Fixture.findElementsArray = function (feed) {
    var elementsArray;

    if (feed.elements !== undefined)
        return feed.elements;

    if (feed.episodes !== undefined)
        return feed.episodes;

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

    if (feed.atoz_programmes !== undefined)
        elementsArray = feed.atoz_programmes;

    if (feed.group_episodes !== undefined)
        elementsArray = feed.group_episodes;

    if (elementsArray === undefined)
        return false;

    return elementsArray.elements;
};

Fixture.typeToClass = function (type) {
    switch (type) {
        case 'episode':
            return 'Episode';
        case 'episode_large':
            return 'Episode';
        case 'programme':
            return 'Programme';
        case 'programme_large':
            return 'Programme';
        case 'group':
            return 'Group';
        case 'group_large':
            return 'Group';
        case 'version':
            return 'Version';
    }

    return '';
};

module.exports = Fixture;
