# bookshelf-sync
[![Build Status](https://travis-ci.org/lemonde/bookshelf-sync.svg?branch=master)](https://travis-ci.org/lemonde/bookshelf-sync)
[![Dependency Status](https://david-dm.org/lemonde/bookshelf-sync.svg?theme=shields.io)](https://david-dm.org/lemonde/bookshelf-sync)
[![devDependency Status](https://david-dm.org/lemonde/bookshelf-sync/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/bookshelf-sync#info=devDependencies)

Bookshelf sync utility.

## Install

```
npm install bookshelf-sync
```

## Usage

```js
var database = require('bookshelf').initialize({ client: 'pg' });
var manager = require('bookshelf-sync')(database);
var articles = {
  tableName: 'articles',
  build: function (table) {
    table.increments('id').primary();
    table.string('title');
  },
  populate: function (database) {
    return db.knex('articles').insert([
      { title: 'First article' }
    ]);
  }
};
manager.sync([articles]); // Create / Update tables articles.
manager.populate([articles]); // Populate table articles.
manager.reset([articles]); // Remove all data from articles.
manager.drop([articles]); // Drop table articles.
```

### bookshelfSync(database)

Create a new manager.

```js
var manager = require('bookshelf-sync')(database);
```

### manager.sync(schemas)

Create and update tables specified in schemas.

```js
manager.sync([articles]);
```

### manager.populate(schemas)

Populate tables specified in schemas.

```js
manager.populate([articles]);
```

### manager.reset(schemas)

Remove all rows in tables specified in schemas.

```js
manager.reset([articles]);
```

### manager.drop(schemas)

Drop tables specified in schemas.

```js
manager.drop([articles]);
```

## License

MIT