var Fixture = require('./lib/Fixture'),
    ElementPool = require('./lib/ElementPool'),
    Fetcher = require('./lib/Fetcher'),
    q = require('q'),
    fs = require('fs'),
    feedsPath = '../iblfetcher/feeds/'

q.longStackSupport = true;

function FixtureCreator(config) {
    that = this;
    that.config = config;
    that.feeds = {};
    that.elementPool = new ElementPool();
    that.fetcher = new Fetcher({
        apiKey: config.apiKey,
        iblUrl: config.iblUrl
    });

    that.prefetch = that.fetcher.prefetch().then(function (feeds) {
        that.feeds = feeds;
        for (name in feeds) {
            var feed = feeds[name];
            that.elementPool.processFeed(feed);
        }

        console.log('Processed feeds, found the following elements for use')
        console.log('Episodes:', that.elementPool.pools.Episode.length)
        console.log('Group:',that.elementPool.pools.Group.length)
        console.log('Programmes:',that.elementPool.pools.Programme.length)

    }, function (err) {
        console.log('Error prefetching feeds', err);
        throw err
    });
}

FixtureCreator.prototype.createFixture = function(feedName, params) {
    var defer = q.defer(),
        that = this,
        path = feedName;

    feed = this.feeds[feedName];
    if (feed === undefined)
        defer.reject('Feed not found: ' + feedName);
    else {

        fixture = new Fixture(feedName, feed, that.elementPool, that.config);

        defer.resolve(fixture);
    }
    return defer.promise
};

module.exports = FixtureCreator
