module.exports = {
    mongo: {
        url: 'mongodb://127.0.0.1:27017/ecrm'
    },
    log: {
        level: 'dev'
    },
    jwt: {
        secret: 'secret',
        expiration: 1440 // 24hs = 1440 min
    }
};
