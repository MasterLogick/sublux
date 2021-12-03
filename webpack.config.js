const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: {index: "./src/main/js/index.js"},
    output: {
        path: path.resolve(__dirname, "./target/classes/static/app"),
        filename: "[name].bundle.js",
        publicPath: "/app/"
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, "."),
                exclude: /(node_modules)/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }]
            }, {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [new MiniCssExtractPlugin()]
};