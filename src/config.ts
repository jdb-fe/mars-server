export const Config = {
    port: 3000,
    jwtSecret: 'heodxx_D998sds12',
    cookie: {
        secret: 'mars_fjgEXFf4ITw9'
    },
    session: {
        name: 'mars',
        secret: 'mars_dFEd1233wXw',
        resave: false,
        saveUninitialized: false
    },
    bodyParser: {
        limit: '500kb'
    }
};
export default Config;
