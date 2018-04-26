module.exports = {
    apps: [{
        name: 'mars',
        script: 'src/main.ts',
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
            'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js',
        }
    },
};
