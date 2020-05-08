const mysql = require('mysql');
const utils = require('./utils');
const env = require('./utils').getApiConfig();

const pool = mysql.createPool({
    "connectionLimit" : 1000,
    "user": env.mysql_user,
    "password": env.mysql_password,
    "database": env.mysql_database,
    "host": env.mysql_host,
    "port": env.mysql_port,
});

const pool_multi  = mysql.createPool({
    "connectionLimit" : 1000,
    "user": env.mysql_user,
    "password": env.mysql_password,
    "database": env.mysql_database,
    "host": env.mysql_host,
    "port": env.mysql_port,
    "multipleStatements":true
});

exports.execute = (query, params=[], _pool=pool) => {
    return new Promise((resolve, reject) => {
        _pool.query(query, params, (error, results) => {
            if (utils.getError(error)) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

exports.pool = pool;
exports.pool_multi = pool_multi;