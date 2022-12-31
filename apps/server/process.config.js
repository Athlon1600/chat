const isProd = process.env.NODE_ENV === 'production';

// TODO: rename pm2.config.js
module.exports = {
    apps: [
        {
            name: "compiler",
            script: "npm run watch",
            env: {
                NODE_ENV: "development",
                TSC_WATCHFILE: 'UseFsEventsWithFallbackDynamicPolling'
            }
        },
        {
            name: "express-app",
            script: "./dist",
            watch: ["./dist"],
            ignore_watch: ['node_modules', 'src'],
            instances: isProd ? 'max' : 1,
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            }
        },
        {
            name: "worker",
            script: "node ./bin/worker"
        }
    ]
}
