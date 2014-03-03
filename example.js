var FixtureCreator = require('./lib/creator')

creator = new FixtureCreator({
    savePath: './fixtures/'
})
// console.log(path.basename(process.argv[1]))

// fetcher.createFixture('categories/music/highlights').then(function (fixture) {
//      fixture.getElement(5).setMasterbrand('Hai_Guys');

//      fixture.save();
// }).done();

// fetcher.createFixture('home/highlights').then(function (fixture) {
//     fixture.getElement(2).getChild(0).data.title = 'New Episode title in group';
// }).done();

// fetcher.createFixture('home/highlights').then(function (fixture) {
//     fixture.getElement(1).getVersion().data.kind = 'audio-described';

//     fixture.save();
// }).done();

// fetcher.createFixture('categories/sport/programmes').then(function (fixture) {

// }).done();


