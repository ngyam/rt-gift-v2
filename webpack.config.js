var path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: "bundle.js",
        path: __dirname + "/docs/scripts",
        libraryTarget: 'var',
        library: 'Dapp'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", "jsx", ".json"]
    },
    devServer: {
        contentBase: path.join(__dirname, 'docs'),
        publicPath: '/scripts/',
        compress: false,
        port: 9000
    },
    devtool: "source-map",
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    }
};