const merge = require('webpack-merge');
const common = require('./base.webpack.config.js');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: '[name].js',
    },
    devtool: "source-map",
    devServer: {
        contentBase: "./dist", // Content base
        inline: true, // Enable watch and live reload
        host: "localhost",
        port: 8080,
        stats: "errors-only"
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader",
                options: {
                    useBabel: true,
                    babelCore: "@babel/core" // needed for Babel v7
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "assets/img/[name].[ext]?[hash]"
                }
            }
        ]
    },
});