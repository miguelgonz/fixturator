var u = require('underscore');

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
    u.extend(this.data, data);
    return this;
}



module.exports = BaseElement
