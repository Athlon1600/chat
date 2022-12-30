var path = require('path');
module.exports = {
    // Specify the entry point for our app
    entry: [
        path.join(__dirname, 'browser.js')
    ],
    // Specify the output file containing our bundled code
    output: {
        path: path.join(__dirname, 'dist'), // dist-bundle - diff versions files
        filename: 'bundle.js'
    },
    optimization: {
        minimize: false
    }
}