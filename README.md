# sql-query-factory

A typed SQL query builder.

## how to use

### SELECT

#### SELECT all

```js
select("*").from("foo").build();
// => "SELECT * FROM foo;"
```

#### WHERE

```js
select("*").from("foo").where("foo").like("bar").build();
// => `SELECT * FROM foo WHERE foo LIKE 'bar';`
```

```js
select("*").from("table_name")
  .where("column1").between(5).and(8)
  .and("column2").in("foo", 2, "bar")
  .build();
  // => `SELECT * FROM table_name WHERE column1 BETWEEN 5 AND 8 AND column2 IN ('foo', 2, 'bar');`
```

#### ORDER BY

```js
select("*").from("table_name")
  .where("column1").equal("foo")
  .orderBy("colimn1")
  .build();
  // => `SELECT * FROM table_name WHERE column1 = 'foo' ORDER BY colimn1;`
```

### INSERT

```js
insertInto("table_name")
  .keys("foo", "bar", "hoge")
  .values("foo", 2, "bar")
  .build();
  // => `INSERT INTO table_name (foo, bar, hoge) VALUES('foo', 2, 'bar');`
```

### CREATE TABLE

```js
createTable("table_name")
  .column("column1").type("TEXT").notNull().primaryKey().unique()
  .column("column2").type("INTEGER").autoIncrement()
  .build();
  // => `CREATE TABLE table_name ( column1 TEXT NOT NULL PRIMARY KEY UNIQUE, column2 INTEGER AUTO_INCREMENT);`
```
