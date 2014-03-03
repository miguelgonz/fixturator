var elementTypes = {
    Episode: require('./Episode'),
    Programme: require('./Programme'),
    Group: require('./Group'),
    Version: require('./Version')
},
    fs = require('fs'),
    savePath = './fixtures/';

function BaseFixture(name, data) {
    this.feedName = name;
    this.data = data;

    if (this.data.elements !== undefined)
        this.elementsArray = this.data.elements;

    if (this.data.home_highlights !== undefined)
        this.elementsArray = this.data.home_highlights;

    if (this.data.highlights !== undefined)
        this.elementsArray = this.data.highlights;

    if (this.data.category_highlights !== undefined)
        this.elementsArray = this.data.category_highlights;

    if (this.data.programmes !== undefined)
        this.elementsArray = this.data.programmes;

    if (this.data.category_programmes !== undefined)
        this.elementsArray = this.data.category_programmes;

    if (this.data.episodes !== undefined)
        this.elementsArray = this.data.episodes;

    this.elementsArray = this.elementsArray.elements
}

BaseFixture.prototype.getElement = function (num) {
    var data = this.elementsArray[num]
    return this.Factory(data);
};
BaseFixture.prototype.getEpisode = BaseFixture.prototype.getElement;

BaseFixture.prototype.Factory = function (data) {
    switch (data.type) {
        case 'episode':
            return new elementTypes.Episode(data, this);
            break;
        case 'episode_large':
            return new elementTypes.Episode(data, this);
            break;
        case 'programme':
            return new elementTypes.Programme(data, this);
            break;
        case 'programme_large':
            return new elementTypes.Programme(data, this);
            break;
        case 'group_large':
            return new elementTypes.Group(data, this);
            break;
        case 'version':
            return new elementTypes.Version(data, this);
            break;

        default:
            console.error('Unknown element type of', data.type, 'when getting element')
            break;
    }
};

BaseFixture.prototype.save = function() {
    var name = this.feedName.replace(/\//g, '_'),
        path = savePath + name + '.json';
    fs.writeFileSync(path, JSON.stringify(this.data))
};

module.exports = BaseFixture;
