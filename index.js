var BaseFixture = require('./lib/BaseFixture'),
    ElementPool = require('./lib/ElementPool'),
    q = require('q'),
    fs = require('fs'),
    feedsPath = '../iblfetcher/feeds/'

function FixtureCreator(config) {
    this.fixtureConfig = config;
    this.feeds = {};
    this.elementPool = new ElementPool();
    that = this;

    var files = fs.readdirSync(feedsPath);

    files.forEach(function (file, i) {
        if (file.indexOf('.json') == -1)
            return null;
        jsonString = fs.readFileSync(feedsPath + file, {encoding: "utf-8"});
        feedName = that.fileToFeedName(file);
        that.feeds[feedName] = jsonString;

        that.elementPool.processFeed(JSON.parse(jsonString));
    });

    console.log('Processed feeds, found the following elements for use')
    console.log('Episodes:', that.elementPool.pools.Episode.length)
    console.log('Group:',that.elementPool.pools.Group.length)
    console.log('Programmes:',that.elementPool.pools.Programme.length)

}

FixtureCreator.prototype.fileToFeedName = function(feedName) {
    return feedName.replace(/_/g, '/').substr(0, feedName.length - 5);
};

FixtureCreator.prototype.createFixture = function(feedName, params) {
    var defer = q.defer(),
        that = this,
        path = feedName;

    feedJson = this.feeds[feedName];
    if (feedJson === undefined)
        defer.reject('Feed not found: ' + feedName);
    else {
        feed = JSON.parse(feedJson);

        fixture = new BaseFixture(feedName, feed, that.elementPool, that.fixtureConfig);

        defer.resolve(fixture);
    }
    return defer.promise
};

module.exports = FixtureCreator
