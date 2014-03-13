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
    };
    requestOptions = {
        timeout: 10000
    };

    if (config.proxy)
        requestOptions.proxy = config.proxy;

    this.request = requestLib.defaults(requestOptions);

    this.requestOptions = {
        headers: {
            'user-agent': 'Fixturator fetcher github.com/iplayer/fixturator'
        }
    };

    this.importantParams = [
        'availability',
        'initial_child_count',
        'lang',
        'live'
    ];

    this.feeds = {};
}

Fetcher.prototype._request = function (feedName, params) {
    var defer = Q.defer(),
        that = this,
        params = u.extend({}, this.defaultRequestParams, params),
        url = this.config.iblUrl + feedName + '.json?' + qs.stringify(params),
        requestOptions = u.extend({}, this.requestOptions, {url:url});

    cached = that.getFromCache(feedName, params);

    if (cached === false) {
        this.request(requestOptions, function (err, response, body) {
            if (err || response.statusCode !== 200) {
                console.log('[WARN] Failed getting feed', feedName, err, body);
                defer.reject(err);
            } else {
                that.addToCache(feedName, params, body);
                try {
                    feedOb = JSON.parse(body);
                } catch (e) {
                    defer.reject('Could not parse feed response as JSON')
                }

                if (feedOb)
                    defer.resolve(feedOb);
            }
        });
    } else {
        defer.resolve(cached);
    }

    return defer.promise;
};

Fetcher.prototype.fetch = function(feed, params) {
    return this._request(feed, params).fail(function () {
        console.error('[ERROR] Failed to get feed',feed)
    });
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
            }).fail(function (){
                defer.reject('[ERROR] Couldn\'t load home/highlights feed')
            })
        )

        Q.allSettled(feedPromises).then(function () {
            defer.resolve(that.feeds);
        }).done();
    }).done()


    return defer.promise;
};


module.exports = Fetcher
