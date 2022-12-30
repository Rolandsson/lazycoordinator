const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = {
    mode: "development",
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist")
        },
        compress: true,
        port: 5000
    },
    plugins: [
        new ProvidePlugin({
            $: 'jquery'
        })
    ]
};

