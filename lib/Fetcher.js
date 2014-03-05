var requestLib = require('request'),
    qs = require('querystring'),
    u = require('underscore'),
    Q = require('q'),
    fs = require('fs')

function Fetcher(config) {
    this.config = config;
    this.defaultRequestParams = {
        availability: 'available',
        lang: 'en',
        rights: 'web',
        api_key: config.apiKey
    }
    this.importantParams = [
        'availability',
        'initial_child_count',
        'lang'
    ];

    this.feeds = {};
}

Fetcher.prototype._request = function (feedName, params) {
    var defer = Q.defer(),
        that = this,
        params = u.extend({}, this.defaultRequestParams, params),
        url = this.config.iblUrl + feedName + '.json?' + qs.stringify(params),
        requestOptions = u.extend({}, this.config.requestLibOptions, {url:url});

    cached = that.getFromCache(feedName, params);

    if (cached === false) {
        requestLib(requestOptions, function (err, response, body) {
            if (err || response.statusCode !== 200) {
                console.error('Failed getting feed', feedName, err, body);
                defer.reject(err);
            } else {
                that.addToCache(feedName, params, body);
                defer.resolve(JSON.parse(body));
            }
        });
    } else {
        defer.resolve(cached);
    }

    return defer.promise;
};

Fetcher.prototype.fetch = function(feed, params) {
    return this._request(feed, params);
};

Fetcher.prototype.addToCache = function(feedName, params, feed) {
    var fileName = this.getCachedName(feedName, params);
    fs.writeFileSync(this.config.cacheDir + fileName, feed);
    return true;
};

Fetcher.prototype.getFromCache = function(feedName, params) {
    var fileName = this.getCachedName(feedName, params);
    // console.log('Looking in CACHE for', fileName)

    // Anything that goes wrong here can just be treated as a cache MISS
    try {
        feed = fs.readFileSync(this.config.cacheDir + fileName, {encoding: 'utf-8'});
        feed = JSON.parse(feed);
        created = new Date(feed.timestamp)
        if (created.getTime() > this.config.cacheExpireTime) {
            // console.log('CACHE HIT!')
            return feed;
        } else {
            // console.log('CACHE EXPIRED', created.getTime(), this.config.cacheExpireTime)
            return false;
        }
    } catch (e) {
        // console.log('CACHE MISS because of error', e)
        return false;
    }
    // console.log('CACHE MISS', fileName)
    return false;
};

Fetcher.prototype.getCachedName = function (feedName, params) {
    paramsToConcat = [];
    this.importantParams.forEach(function (param) {
        if (params[param] !== undefined) {
            paramsToConcat.push(param + '_' + params[param]);
        }
    });

    return feedName.replace(/\//g, '_') + '_' + paramsToConcat.join('_');
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
                })
            );

            feedPromises.push(
                that._request(programmes).then(function (json) {
                    that.feeds[programmes] = json;
                })
            );
        });

        feeds[1].channels.forEach(function (channel) {
            var highlights = 'channels/' + channel.id + '/highlights';

            feedPromises.push(
                that._request(highlights, {live:true}).then(function (json) {
                    that.feeds[highlights] = json;
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
