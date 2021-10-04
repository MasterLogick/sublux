const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main/js/index.js',
    output: {
        path: __dirname,
        filename: './target/classes/static/js/bundle.js'
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }]
            }, {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    }
                }]
            }
        ]
    },
    devtool: 'source-map'
};