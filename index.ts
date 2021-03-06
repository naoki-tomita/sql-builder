function escapeString(string: string) {
  return string.replace(/'/g, "''")
}

function buildFactory(sql: string) {
  return function() {
    return `${sql};`;
  };
}

function compareable<T>(sql: string) {
  return {
    in: inFactory<T>(sql),
    equal: equalFactory<T>(sql),
    like: likeFactory<T>(sql),
    notEqual: notEqualFactory<T>(sql),
    between: betweenFactory<T>(sql),
    isNull: isNullFactory<T>(sql),
    isNotNull: isNotNullFactory<T>(sql)
  };
}

function isNotNullFactory<T>(prefix: string) {
  return function() {
    const sql = `${prefix} IS NOT NULL`;
    return {
      and: andFactory<T>(sql),
      or: orFactory<T>(sql),
      orderBy: orderByFactory<T>(sql),
      build: buildFactory(sql)
    };
  };
}

function connectable<T>(sql: string) {
  return {
    and: andFactory<T>(sql),
    or: orFactory<T>(sql)
  };
}

function executable(sql: string) {
  return {
    build: buildFactory(sql)
  };
}

function isNullFactory<T>(prefix: string) {
  return function() {
    const sql = `${prefix} IS NULL`;
    return {
      ...connectable<T>(sql),
      orderBy: orderByFactory<T>(sql),
      ...executable(sql)
    };
  };
}

function orderByFactory<T>(prefix: string) {
  return function(columnName: keyof T) {
    const sql = `${prefix} ORDER BY ${columnName}`;
    return executable(sql);
  };
}

function andFactory<T>(prefix: string) {
  return function(columnName: keyof T) {
    const sql = `${prefix} AND ${columnName}`;
    return compareable<T>(sql);
  };
}

function orFactory<T>(prefix: string) {
  return function(columnName: keyof T) {
    const sql = `${prefix} OR ${columnName}`;
    return compareable<T>(sql);
  };
}

function inFactory<T>(prefix: string) {
  return function(...parameters: Array<number | string>) {
    const sql = `${prefix} IN (${parameters.map(wrap).join(", ")})`;
    return {
      ...connectable<T>(sql),
      orderBy: orderByFactory<T>(sql),
      ...executable(sql)
    };
  };
}

function wrap(parameter: number | string | boolean | null | undefined) {
  if (parameter == null) {
    return "NULL";
  }
  return typeof parameter === "string" ? `'${escapeString(parameter)}'` : `${parameter}`;
}

function betweenAndFactory<T>(prefix: string) {
  return function(columnName: number | string) {
    const sql = `${prefix} AND ${columnName}`;
    return {
      and: andFactory<T>(sql)
    };
  };
}

function betweenFactory<T>(prefix: string) {
  return function(parameter: number | string) {
    const sql = `${prefix} BETWEEN ${wrap(parameter)}`;
    return {
      and: betweenAndFactory<T>(sql)
    };
  };
}

function createCompareFactory(compareMethod: string) {
  return function<T>(prefix: string) {
    return function(parameter: number | string | null | undefined) {
      const sql = parameter == null
        ? `${prefix} IS ${compareMethod === "=" ? "" : "NOT"} NULL`
        : `${prefix} ${compareMethod} ${wrap(parameter)}`;
      return {
        ...connectable<T>(sql),
        orderBy: orderByFactory<T>(sql),
        ...executable(sql)
      };
    };
  };
}

const notEqualFactory = createCompareFactory("<>");
const likeFactory = createCompareFactory("LIKE");
const equalFactory = createCompareFactory("=");

function whereFactory<T>(prefix: string) {
  return function(columnName: keyof T) {
    const sql = `${prefix} WHERE ${columnName}`;
    return compareable<T>(sql);
  };
}

function fromFactory(prefix: string) {
  return function<T>(tableName: string) {
    const sql = `${prefix} FROM ${tableName}`;
    return {
      where: whereFactory<T>(sql),
      orderBy: orderByFactory<T>(sql),
      ...executable(sql)
    };
  };
}

function distinctFactory(...params: string[]) {
  return function() {
    const sql = `SELECT DISTINCT ${params.join(", ")}`;
    return {
      from: fromFactory(sql)
    };
  };
}

export function select(...params: string[]) {
  const sql = `SELECT ${params.join(", ")}`;
  return {
    from: fromFactory(sql),
    distinct: distinctFactory(...params)
  };
}

function valuesFactory(prefix: string) {
  return function(...values: Array<string | number | boolean | null | undefined>) {
    const sql = `${prefix} VALUES(${values.map(wrap).join(", ")})`;
    return {
      build: buildFactory(sql),
    };
  };
}

function keysFactory<T>(prefix: string) {
  return function(...keys: (keyof T)[]) {
    const sql = `${prefix} (${keys.join(", ")})`;
    return {
      values: valuesFactory(sql)
    };
  };
}

export function insertInto<T>(tableName: string) {
  const sql = `INSERT INTO ${tableName}`;
  return {
    keys: keysFactory<T>(sql)
  };
}

function nextable<T>(sql: string) {
  return {
    autoIncrement: autoIncrementFactory<T>(sql),
    autoincrement: autoincrementFactory<T>(sql),
    primaryKey: primaryKeyFactory<T>(sql),
    notNull: notNullFactory<T>(sql),
    unique: uniqueFactory<T>(sql),
    column: constructorFactory<T>(`${sql},`),
    build: buildFactory(`${sql})`),
  };
}

function uniqueFactory<T>(prefix: string) {
  return function() {
    const sql = `${prefix} UNIQUE`;
    return nextable<T>(sql);
  };
}

function serialFactory<T>(prefix: string) {
  return function() {
    const sql = `${prefix} SERIAL`;
    return nextable<T>(sql);
  };
}

function autoIncrementFactory<T>(prefix: string) {
  return function() {
    const sql = `${prefix} AUTO_INCREMENT`;
    return nextable<T>(sql);
  };
}

function autoincrementFactory<T>(prefix: string) {
  return function() {
    const sql = `${prefix} AUTOINCREMENT`;
    return nextable<T>(sql);
  };
}

function primaryKeyFactory<T>(prefix: string) {
  return function() {
    const sql = `${prefix} PRIMARY KEY`;
    return nextable<T>(sql);
  };
}

function notNullFactory<T>(prefix: string) {
  return function() {
    const sql = `${prefix} NOT NULL`;
    return nextable<T>(sql);
  };
}

type DataType = "TEXT" | "INTEGER" | "BLOB" | "BOOLEAN";
function typeFactory<T>(prefix: string) {
  return function(type: DataType) {
    const sql = `${prefix} ${type}`;
    return nextable<T>(sql);
  };
}

function constructorFactory<T>(prefix: string) {
  return function(key: keyof T) {
    const sql = `${prefix} ${key}`;
    return {
      serialForPostgres: serialFactory<T>(sql),
      type: typeFactory<T>(sql)
    };
  };
}

function ifNotExistFactory<T>(tableName: string) {
  return function() {
    return {
      column: constructorFactory<T>(
        `CREATE TABLE IF NOT EXISTS ${tableName} (`
      )
    };
  };
}

export function createTable<T>(tableName: string) {
  return {
    ifNotExist: ifNotExistFactory<T>(tableName),
    column: constructorFactory<T>(`CREATE TABLE ${tableName} (`)
  };
}

function innerSetFactory<T>(prefix: string) {
  return function(key: keyof T, value: number | string | boolean) {
    value = wrap(value);
    const q = `${prefix}, ${key} = ${value}`;
    return {
      and: innerSetFactory<T>(q),
      where: whereFactory<T>(q),
      build: buildFactory(q)
    }
  }
}

function setFactory<T>(prefix: string) {
  return function(key: keyof T, value: number | string | boolean) {
    value = wrap(value);
    const q = `${prefix} SET ${key} = ${value}`;
    return {
      and: innerSetFactory<T>(q),
      where: whereFactory<T>(q),
      build: buildFactory(q)
    }
  }
}

export function update<T>(tableName: string) {
  return {
    set: setFactory<T>(`UPDATE ${tableName}`)
  }
}
