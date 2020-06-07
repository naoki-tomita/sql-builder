"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function escapeString(string) {
    return string.replace(/'/g, "''");
}
function buildFactory(sql) {
    return function () {
        return sql + ";";
    };
}
function compareable(sql) {
    return {
        in: inFactory(sql),
        equal: equalFactory(sql),
        like: likeFactory(sql),
        notEqual: notEqualFactory(sql),
        between: betweenFactory(sql),
        isNull: isNullFactory(sql),
        isNotNull: isNotNullFactory(sql)
    };
}
function isNotNullFactory(prefix) {
    return function () {
        var sql = prefix + " IS NOT NULL";
        return {
            and: andFactory(sql),
            or: orFactory(sql),
            orderBy: orderByFactory(sql),
            build: buildFactory(sql)
        };
    };
}
function connectable(sql) {
    return {
        and: andFactory(sql),
        or: orFactory(sql)
    };
}
function executable(sql) {
    return {
        build: buildFactory(sql)
    };
}
function isNullFactory(prefix) {
    return function () {
        var sql = prefix + " IS NULL";
        return __assign(__assign(__assign({}, connectable(sql)), { orderBy: orderByFactory(sql) }), executable(sql));
    };
}
function orderByFactory(prefix) {
    return function (columnName) {
        var sql = prefix + " ORDER BY " + columnName;
        return executable(sql);
    };
}
function andFactory(prefix) {
    return function (columnName) {
        var sql = prefix + " AND " + columnName;
        return compareable(sql);
    };
}
function orFactory(prefix) {
    return function (columnName) {
        var sql = prefix + " OR " + columnName;
        return compareable(sql);
    };
}
function inFactory(prefix) {
    return function () {
        var parameters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parameters[_i] = arguments[_i];
        }
        var sql = prefix + " IN (" + parameters.map(wrap).join(", ") + ")";
        return __assign(__assign(__assign({}, connectable(sql)), { orderBy: orderByFactory(sql) }), executable(sql));
    };
}
function wrap(parameter) {
    if (parameter == null) {
        return "NULL";
    }
    return typeof parameter === "string" ? "'" + escapeString(parameter) + "'" : "" + parameter;
}
function betweenAndFactory(prefix) {
    return function (columnName) {
        var sql = prefix + " AND " + columnName;
        return {
            and: andFactory(sql)
        };
    };
}
function betweenFactory(prefix) {
    return function (parameter) {
        var sql = prefix + " BETWEEN " + wrap(parameter);
        return {
            and: betweenAndFactory(sql)
        };
    };
}
function createCompareFactory(compareMethod) {
    return function (prefix) {
        return function (parameter) {
            var sql = parameter == null
                ? prefix + " IS " + (compareMethod === "=" ? "" : "NOT") + " NULL"
                : prefix + " " + compareMethod + " " + wrap(parameter);
            return __assign(__assign(__assign({}, connectable(sql)), { orderBy: orderByFactory(sql) }), executable(sql));
        };
    };
}
var notEqualFactory = createCompareFactory("<>");
var likeFactory = createCompareFactory("LIKE");
var equalFactory = createCompareFactory("=");
function whereFactory(prefix) {
    return function (columnName) {
        var sql = prefix + " WHERE " + columnName;
        return compareable(sql);
    };
}
function fromFactory(prefix) {
    return function (tableName) {
        var sql = prefix + " FROM " + tableName;
        return __assign({ where: whereFactory(sql), orderBy: orderByFactory(sql) }, executable(sql));
    };
}
function distinctFactory() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    return function () {
        var sql = "SELECT DISTINCT " + params.join(", ");
        return {
            from: fromFactory(sql)
        };
    };
}
function select() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    var sql = "SELECT " + params.join(", ");
    return {
        from: fromFactory(sql),
        distinct: distinctFactory.apply(void 0, params)
    };
}
exports.select = select;
function valuesFactory(prefix) {
    return function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var sql = prefix + " VALUES(" + values.map(wrap).join(", ") + ")";
        return {
            build: buildFactory(sql),
        };
    };
}
function keysFactory(prefix) {
    return function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var sql = prefix + " (" + keys.join(", ") + ")";
        return {
            values: valuesFactory(sql)
        };
    };
}
function insertInto(tableName) {
    var sql = "INSERT INTO " + tableName;
    return {
        keys: keysFactory(sql)
    };
}
exports.insertInto = insertInto;
function nextable(sql) {
    return {
        autoIncrement: autoIncrementFactory(sql),
        autoincrement: autoincrementFactory(sql),
        primaryKey: primaryKeyFactory(sql),
        notNull: notNullFactory(sql),
        unique: uniqueFactory(sql),
        column: constructorFactory(sql + ","),
        build: buildFactory(sql + ")"),
    };
}
function uniqueFactory(prefix) {
    return function () {
        var sql = prefix + " UNIQUE";
        return nextable(sql);
    };
}
function serialFactory(prefix) {
    return function () {
        var sql = prefix + " SERIAL";
        return nextable(sql);
    };
}
function autoIncrementFactory(prefix) {
    return function () {
        var sql = prefix + " AUTO_INCREMENT";
        return nextable(sql);
    };
}
function autoincrementFactory(prefix) {
    return function () {
        var sql = prefix + " AUTOINCREMENT";
        return nextable(sql);
    };
}
function primaryKeyFactory(prefix) {
    return function () {
        var sql = prefix + " PRIMARY KEY";
        return nextable(sql);
    };
}
function notNullFactory(prefix) {
    return function () {
        var sql = prefix + " NOT NULL";
        return nextable(sql);
    };
}
function typeFactory(prefix) {
    return function (type) {
        var sql = prefix + " " + type;
        return nextable(sql);
    };
}
function constructorFactory(prefix) {
    return function (key) {
        var sql = prefix + " " + key;
        return {
            serialForPostgres: serialFactory(sql),
            type: typeFactory(sql)
        };
    };
}
function ifNotExistFactory(tableName) {
    return function () {
        return {
            column: constructorFactory("CREATE TABLE IF NOT EXISTS " + tableName + " (")
        };
    };
}
function createTable(tableName) {
    return {
        ifNotExist: ifNotExistFactory(tableName),
        column: constructorFactory("CREATE TABLE " + tableName + " (")
    };
}
exports.createTable = createTable;
function innerSetFactory(prefix) {
    return function (key, value) {
        value = wrap(value);
        var q = prefix + ", " + key + " = " + value;
        return {
            and: innerSetFactory(q),
            where: whereFactory(q),
            build: buildFactory(q)
        };
    };
}
function setFactory(prefix) {
    return function (key, value) {
        value = wrap(value);
        var q = prefix + " SET " + key + " = " + value;
        return {
            and: innerSetFactory(q),
            where: whereFactory(q),
            build: buildFactory(q)
        };
    };
}
function update(tableName) {
    return {
        set: setFactory("UPDATE " + tableName)
    };
}
exports.update = update;
//# sourceMappingURL=index.js.map