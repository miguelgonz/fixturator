var q = require('q'),
    Fetcher = require('./lib/fetcher')

fetcher = new Fetcher()

fetcher.createFixture('categories/programmes/scotland').then(function (fixture) {
    console.log(fixture.data.category_programmes.elements[5].master_brand.titles.small)
    fixture.getElement(5).setMasterbrand('Hai_Guys');
    console.log(fixture.data.category_programmes.elements[5].master_brand.titles.small)

    console.log(fixture.data.category_programmes.elements[5].initial_children[0].title)
    fixture.getElement(5).getEpisode().data.title = 'boo';
    console.log(fixture.data.category_programmes.elements[5].initial_children[0].title)
}).done();


