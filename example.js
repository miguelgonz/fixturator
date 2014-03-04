Fixtures = require('ibl-fixture-generator');

creator = new Fixtures({
    savePath: './webapp/php/lib/test/fixtures/bamboo/'
});

creator.createFixture('categories/films/highlights').then(function (fixture) {
    var group = fixture.insertGroup(0)

    group.set({
        title: 'New Group title for me!',
        stacked: true
    }).setMasterbrand('bbc_two').getChild(0).set({
        synopses: {
            small: 'A brand new synopses small just making it long to really try and confuse the truncation'
        }
    })

    fixture.insertMostPopular(1)
    fixture.insertGroup(2)
    fixture.insertGroup(3)
    fixture.insertGroup(4)
    fixture.insertGroup(5)
    fixture.insertGroup(6)
    fixture.insertGroup(7)
    fixture.save()
}).done();

creator.createFixture('categories/sport/programmes').then(function (fixture) {
    fixture.getProgramme(1).getEpisode().set({
        title: 'Hai from fixture',
        labels: {
            time: 'Hai Guys'
        }
    }).setMasterbrand('boo_fart')

    fixture.save()
}).done();

creator.createFixture('home/highlights').then(function (fixture) {

    fixture.getElement(0).set({
        title: 'Hai from fixture'
    });

    fixture.insertGroup(5).set({
        title: 'spanking new group'
    });

    fixture.save()
}).done();
