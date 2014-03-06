iBL Fixture Generator
=====================

Script fixtures to be generated from live data. Modify only the data you care about and keep fixtures up to date.

Quick start
-----------
Create a new fixture by providing a feed name:

```javascript
creator.createFixture('categories/films/highlights')
```

Listen for when it's finished retreiving data:

```javascript
creator.createFixture('categories/films/highlights').then(function (fixture) {

}).done()
```

Modify the first items title:

```javascript
creator.createFixture('categories/films/highlights').then(function (fixture) {
    fixture.getEpisode().data.title = 'Hai from the fixture';
}).done()
```

Save it to a file ready for the app to use:

```javascript
creator.createFixture('categories/films/highlights').then(function (fixture) {
    fixture.getEpisode().data.title = 'Hai from the fixture';
    fixture.getEpisode().data.labels = {
        time: 'WATCH ME!'
    }
    fixture.save();
}).done()
```

#API

## Fixture

The base object you operate on has the following methods:
    
#### getEpisode(n) / getProgramme(n) / getElement(n)

Fetches the `n`th item from the feed, will return the relevant class object.

Use the most semantically correct for your situation.

e.g. Programmes feed should use `getProgramme(2)` whereas highlights feed should use `getElement` as it could be a group.



#### insertEpisode(n) / insertProgramme(n) / insertGroup(n) / insertMostPopular(n)

Inserts the given type into that position in the feed. The item it will insert is randomly selected from the pool of items seen in all other iBL feeds.
If you use this method you will need to assert that everything on the new item is as you are expecting (availability, labels, stacked group etc.).

#### save()

Save the fixture to a folder specified in config. Default file name is the feed name with `/` replaced with `_`.

## Elements
All elements can be modified with the `set()` function. Pass in an object containing the attributes you want to modify:

```javascript

    group.set({
        title: 'New Group title for me!',
        stacked: true
    })
```

Or chain together to modify other attributes too:

```javascript
    group.set({
        title: 'New Group title for me!',
        stacked: true
    }).getChild(0).set({
        synopses: {
            small: 'A brand new synopses'
        }
    });
```

Elements should also provide helper methods which need to modify multiple attributes to be consistent such as availability (which should modify `status` and `availability` information at the same time to be useful).

### All elements inherit some base fuctions

#### set()
Pass in an object of data you want to  merge **into** the element, it will override/add any properties from the object to the element. Also useful for chaining methods as it returns the element again.

#### setMasterbrand
Pass in a masterbrand ID shaped thing and it will prefil fields with the ID plus the field size etc.

### Programme

#### getEpisode(n)
Retrevie the `n`th Episode for the programme, returns a `Episode` object.

#### addEpisode(n)
Add an episode in position `n`, plucked randomly from the Pool, also ups the count for the programme. Returns the episode added.

#### removeAllItems()
Removes all child episodes and sets the count of episodes to 0.

### Group

#### getChild(n)
Retrevie the `n`th child for the group, returns a `Episode` or `Programme`object.

### Episode

#### getVersion(n)
Retrevie the `n`th version for the episode, returns a `Version` object.

### Version

Currently has no methods.

### Construction

```javascript
Fixtures = require('ibl-fixture-generator');

creator = new Fixtures({
    savePath: './webapp/php/lib/test/fixtures/bamboo/'
});
```
