module.exports = {
    apps: [{
        name: 'mars',
        script: 'dist/main.js',
        env: {
            NODE_ENV: 'production',
        },
    }],
    deploy: {
        production: {
            user: 'root',
            host: 'ss.noonme.com',
            ref: 'origin/master',
            repo: 'git@github.com:jdb-fe/mars-server.git',
            path: '/home/wwwroot/mars',
            'post-deploy': 'npm install --production && npm run prestart:prod && pm2 reload ecosystem.config.js',
            env: {
                NODE_ENV: 'production'
            }
        }
    },
};
