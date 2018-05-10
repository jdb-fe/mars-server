const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    type: 'mysql',
    host: '127.0.0.1',
    username: 'news',
    password: 'j8Xq8UgsilLuVghE',
    database: 'news',
    charset: 'utf8mb4_unicode_ci',
    entities: [`${isProd ? 'dist' : 'src' }/**/**.entity{.ts,.js}`],
    cache: true
};
