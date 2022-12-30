const fs = require('fs');
const {EnvironmentPlugin} = require('webpack');
const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const dotenv = require("dotenv").config();

const PORT_DEFAULT = process.env.HMR_PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// TODO: rewrite as pure webpack
// https://github.com/dalinarkholin/example-typescript-monorepo/blob/master/packages/web/webpack.config.ts

// otherwise it complains about /dist/hot not existing
if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}

mix.options({
    publicPath: "dist",
    terser: {
        extractComments: false,
    },
    hmrOptions: {
        host: 'localhost',
        port: PORT_DEFAULT
    }
});

if (mix.inProduction()) {
    mix.version();
}

mix.ts('src/sdk.ts', 'dist/assets/sdk.js').version();
mix.ts('src/chat', 'dist/assets/embed.js').vue().options({
    processCssUrls: false,
    postCss: [tailwindcss('./tailwind.config.js')],
});

// mix.js('src/admin', 'dist/assets/admin.js').vue();

mix.before(() => {
    mix.copyDirectory('public', 'dist');
});

mix.webpackConfig({
    resolve: {
        fallback: {
            buffer: false
        }
    },
    devServer: {
        devMiddleware: {
            writeToDisk: (filePath) => {
                return !/hot-update/i.test(filePath);
            },
        },
        host: '0.0.0.0',
        port: PORT_DEFAULT,
        proxy: {
            '/api': {
                target: BACKEND_URL,
                pathRewrite: {'^/api': ''}
            }
        }
    },
    plugins: [
        new EnvironmentPlugin({
            'APP_URL': process.env.APP_URL || "",
            'BACKEND_URL': process.env.BACKEND_URL || "",
            'WEBSOCKET_URL': process.env.WEBSOCKET_URL || ""
        }),
        new HtmlWebpackPlugin({
            template: "public/embed.html",
            filename: 'embed2.html',
            inject: true,
            minify: false,
            hash: true
        })
    ]
});

mix.disableSuccessNotifications();
