var BaseFixture = require('./BaseFixture'),
    q = require('q'),
    fs = require('fs'),
    fixturePath = '../iblfetcher/feeds/'


function Fetcher() {

}

Fetcher.prototype.createFixture = function(feedName, params) {
    var defer = q.defer(),
        path = fixturePath + feedName + '.json';

    fs.readFile(path, function (err, data) {
        if (err)
            return defer.reject(err)
        defer.resolve( new BaseFixture(feedName, JSON.parse(data)));
    });

    return defer.promise
};

module.exports = Fetcher
