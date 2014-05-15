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
manager.populate([articles]); // Populate table with
manager.reset([articles]); // Remove all data from articles.
manager.drop([articles]); // Drop table articles.
```

## License

MIT