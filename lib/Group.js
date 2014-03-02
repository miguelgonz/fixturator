var BaseElement = require('./BaseElement')

function Group (data, Fixture) {
    this.constructor(data, Fixture)
}

Group.prototype = BaseElement.prototype;

Group.prototype.getChild = function (num) {
    num = (num === undefined ? 0 : num);
    var ele = this.data.initial_children[num]
    if (ele)
        return this.Fixture.Factory(ele);
    else
        console.error('Could not find Element',num,'in initial_children')
}

module.exports = Group;
