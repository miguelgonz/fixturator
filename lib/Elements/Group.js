var BaseElement = require('./BaseElement')

function Group (data, Fixture) {
    this.constructor(data, Fixture)
}

Group.prototype = new BaseElement();

Group.prototype.getChild = function (num) {
    num = (num === undefined ? 0 : num);
    var ele = this.data.initial_children[num]
    if (ele)
        return this.Fixture.Factory(ele);
    else
        console.error('Could not find Element',num,'in initial_children')
}


Group.prototype.addChild = function (num) {
    num = (num === undefined ? 0 : num);

    var newElement = this.Fixture.elementPool.getMe('Episode');
    this.data.initial_children.splice(num, 0, newElement);
    return this.getChild(num);

}

Group.prototype.removeAllItems = function() {
    this.data.initial_children.splice(0,this.data.initial_children.length);
    return this;
};


module.exports = Group;
