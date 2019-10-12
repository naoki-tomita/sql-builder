export declare function select(...params: string[]): {
    from: <T>(tableName: string) => {
        build: () => string;
        where: (columnName: keyof T) => {
            in: (...parameters: (string | number)[]) => {
                build: () => string;
                orderBy: (columnName: keyof T) => {
                    build: () => string;
                };
                and: (columnName: keyof T) => any;
                or: (columnName: keyof T) => any;
            };
            equal: (parameter: string | number) => {
                build: () => string;
                orderBy: (columnName: keyof T) => {
                    build: () => string;
                };
                and: (columnName: keyof T) => any;
                or: (columnName: keyof T) => any;
            };
            like: (parameter: string | number) => {
                build: () => string;
                orderBy: (columnName: keyof T) => {
                    build: () => string;
                };
                and: (columnName: keyof T) => any;
                or: (columnName: keyof T) => any;
            };
            notEqual: (parameter: string | number) => {
                build: () => string;
                orderBy: (columnName: keyof T) => {
                    build: () => string;
                };
                and: (columnName: keyof T) => any;
                or: (columnName: keyof T) => any;
            };
            between: (parameter: string | number) => {
                and: (columnName: string | number) => {
                    and: (columnName: keyof T) => any;
                };
            };
            isNull: () => {
                build: () => string;
                orderBy: (columnName: keyof T) => {
                    build: () => string;
                };
                and: (columnName: keyof T) => any;
                or: (columnName: keyof T) => any;
            };
            isNotNull: () => {
                and: (columnName: keyof T) => any;
                or: (columnName: keyof T) => any;
                orderBy: (columnName: keyof T) => {
                    build: () => string;
                };
                build: () => string;
            };
        };
        orderBy: (columnName: keyof T) => {
            build: () => string;
        };
    };
    distinct: () => {
        from: <T>(tableName: string) => {
            build: () => string;
            where: (columnName: keyof T) => {
                in: (...parameters: (string | number)[]) => {
                    build: () => string;
                    orderBy: (columnName: keyof T) => {
                        build: () => string;
                    };
                    and: (columnName: keyof T) => any;
                    or: (columnName: keyof T) => any;
                };
                equal: (parameter: string | number) => {
                    build: () => string;
                    orderBy: (columnName: keyof T) => {
                        build: () => string;
                    };
                    and: (columnName: keyof T) => any;
                    or: (columnName: keyof T) => any;
                };
                like: (parameter: string | number) => {
                    build: () => string;
                    orderBy: (columnName: keyof T) => {
                        build: () => string;
                    };
                    and: (columnName: keyof T) => any;
                    or: (columnName: keyof T) => any;
                };
                notEqual: (parameter: string | number) => {
                    build: () => string;
                    orderBy: (columnName: keyof T) => {
                        build: () => string;
                    };
                    and: (columnName: keyof T) => any;
                    or: (columnName: keyof T) => any;
                };
                between: (parameter: string | number) => {
                    and: (columnName: string | number) => {
                        and: (columnName: keyof T) => any;
                    };
                };
                isNull: () => {
                    build: () => string;
                    orderBy: (columnName: keyof T) => {
                        build: () => string;
                    };
                    and: (columnName: keyof T) => any;
                    or: (columnName: keyof T) => any;
                };
                isNotNull: () => {
                    and: (columnName: keyof T) => any;
                    or: (columnName: keyof T) => any;
                    orderBy: (columnName: keyof T) => {
                        build: () => string;
                    };
                    build: () => string;
                };
            };
            orderBy: (columnName: keyof T) => {
                build: () => string;
            };
        };
    };
};
export declare function insertInto<T>(tableName: string): {
    keys: (...keys: (keyof T)[]) => {
        values: (...values: (string | number)[]) => {
            build: () => string;
        };
    };
};
declare type DataType = "TEXT" | "INTEGER" | "BLOB";
export declare function createTable<T>(tableName: string): {
    ifNotExist: () => {
        column: (key: keyof T) => {
            type: (type: DataType) => {
                autoIncrement: () => any;
                primaryKey: () => any;
                notNull: () => any;
                unique: () => any;
                column: any;
                build: () => string;
            };
        };
    };
    column: (key: keyof T) => {
        type: (type: DataType) => {
            autoIncrement: () => any;
            primaryKey: () => any;
            notNull: () => any;
            unique: () => any;
            column: any;
            build: () => string;
        };
    };
};
export {};
//# sourceMappingURL=index.d.ts.map