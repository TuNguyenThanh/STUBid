const   PORT = process.env.PORT || 3000,
        DIRNAME = __dirname,
        DOMAIN_NAME = 'https://sbid.herokuapp.com';
        ALLOW_ORIGIN = 'https://sbid.herokuapp.com,http://localhost:4200';

module.exports = { PORT, DIRNAME, DOMAIN_NAME, ALLOW_ORIGIN };