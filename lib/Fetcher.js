var requestLib = require('request'),
    qs = require('querystring'),
    u = require('underscore'),
    Q = require('q'),
    fs = require('fs')

function Fetcher(config) {
    this.config = config;
    this.defaultParams = {
        availability: 'available',
        lang: 'lang',
        rights: 'web',
        api_key: config.apiKey
    }
    this.feeds = {};
}

Fetcher.prototype._request = function (feedName, params) {
    var defer = Q.defer(),
        that = this,
        params = u.extend({}, this.defaultParams, params),
        url = this.config.iblUrl + feedName + '.json?' + qs.stringify(params);

    requestLib(url, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            console.error('Failed getting feed', feedName, err, body);
            defer.reject(err);
        } else {
            defer.resolve(JSON.parse(body));
        }
    });

    return defer.promise;
};

Fetcher.prototype.fetch = function(feed, params) {
    return this._request(feed, params);
};

Fetcher.prototype.prefetch = function() {
    var defer = Q.defer(),
        that = this;

    Q.all([
        that._request('categories'),
        that._request('channels')
    ]).then(function (feeds) {
        var feedPromises = [];

        feeds[0].categories.forEach(function (category) {
            var highlights = 'categories/' + category.id + '/highlights';
            var programmes = 'categories/' + category.id + '/programmes';

            feedPromises.push(
                that._request(highlights).then(function (json) {
                    that.feeds[highlights] = json;
                    // fs.writeFile('./feeds/categories_' + category.id + '_highlights.json', JSON.stringify(json), function (){});
                })
            );

            feedPromises.push(
                that._request(programmes).then(function (json) {
                    that.feeds[programmes] = json;
                    // fs.writeFile('categories_' + category.id + '.json', JSON.stringify(json), function (){});
                })
            );
        });

        feeds[1].channels.forEach(function (channel) {
            var highlights = 'channels/' + channel.id + '/highlights';

            feedPromises.push(
                that._request(highlights, {live:true}).then(function (json) {
                    that.feeds[highlights] = json;
                    fs.writeFile('./feeds/channels_' + channel.id + '_highlights.json', JSON.stringify(json), function (){});
                })
            );
        });

        feedPromises.push(
            that._request('home/highlights').then(function (json) {
                that.feeds['home/highlights'] = json
            })
        )

        Q.all(feedPromises).then(function () {
            defer.resolve(that.feeds);
        }, function (err) {
            defer.reject(err);
        }).done();
    }).done()


    return defer.promise;
};


module.exports = Fetcher
