# knex-schema
[![Build Status](https://travis-ci.org/lemonde/knex-schema.svg?branch=master)](https://travis-ci.org/lemonde/knex-schema)
[![Dependency Status](https://david-dm.org/lemonde/knex-schema.svg?theme=shields.io)](https://david-dm.org/lemonde/knex-schema)
[![devDependency Status](https://david-dm.org/lemonde/knex-schema/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/knex-schema#info=devDependencies)

Knex sync utility.

## Install

```
npm install knex-schema
```

## Usage

```js
var database = require('knex').initialize({ client: 'pg' });
var manager = require('knex-schema')(database);
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

### knexSchema(database)

Create a new manager.

```js
var manager = require('knex-schema')(database);
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