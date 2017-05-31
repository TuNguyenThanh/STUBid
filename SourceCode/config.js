exports.PORT = process.env.PORT || 3000;
exports.DIRNAME = __dirname;
exports.DOMAIN_NAME = 'https://sbid.herokuapp.com';
exports.ALLOW_ORIGIN = 'https://sbid.herokuapp.com,http://localhost:4200';
exports.PG = {
    user: 'user',
    database: 'database',
    password: 'password',
    host: 'host',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    ssl: true
};
exports.eSMS = {
    API_KEY: 'API_KEY',
    SECRET_KEY: 'SECRET_KEY'
}