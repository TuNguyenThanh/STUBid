exports.PORT = process.env.PORT || 3000;
exports.DIRNAME = __dirname;
exports.DOMAIN_NAME = 'https://sbid.herokuapp.com';
exports.ALLOW_ORIGIN = 'https://sbid.herokuapp.com';
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
exports.MAILER_OPTIONS = {
    service: 'gmail',
    auth: {
        user: 'user',
        pass: 'pass'
    }
}
exports.BUCKET = {
    BUCKET_NAME: process.env.BUCKETEER_BUCKET_NAME || 'bucketeer-3e7cc0b0-31f8-48bc-bbd5-61b10b93d664',
    PUBLIC_URL: 'https://bucketeer-3e7cc0b0-31f8-48bc-bbd5-61b10b93d664.s3.amazonaws.com/public',
}
exports.AWS_AUTH = {
    accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-1'
}