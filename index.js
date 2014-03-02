var q = require('q'),
    Fetcher = require('./lib/fetcher')

fetcher = new Fetcher()

fetcher.createFixture('categories/programmes/scotland').then(function (fixture) {
    fixture.getElement(5).setMasterbrand('Hai_Guys');

    fixture.getElement(5).getEpisode().data.title = 'boo';
}).done();

fetcher.createFixture('home/highlights').then(function (fixture) {
    fixture.getElement(2).getChild(0).data.title = 'New Episode title in group';
}).done();

fetcher.createFixture('home/highlights').then(function (fixture) {
    fixture.getElement(1).getVersion().data.kind = 'audio-described';
}).done();


