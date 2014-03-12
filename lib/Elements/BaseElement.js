var objectMerge = require('../objectMerge');

function BaseElement () {}

BaseElement.prototype.constructor = function (data, Fixture) {
    this.data = data;
    this.Fixture = Fixture;
}

BaseElement.prototype.setMasterbrand = function (brand) {
    this.data.master_brand.id = brand
    this.data.master_brand.titles.small = brand + ' small'
    this.data.master_brand.titles.medium = brand + ' medium'
    this.data.master_brand.titles.large = brand + ' large'
    this.data.master_brand.attribution = brand + '_attr'

    return this;
}

BaseElement.prototype.set = function (data) {
    objectMerge(true, this.data, data);
    return this;
}

BaseElement.prototype.clone = function() {
    return this.Fixture.Factory(JSON.parse(JSON.stringify(this.data)));
};

module.exports = BaseElement
