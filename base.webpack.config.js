var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var path = require('path');
var basePath = __dirname;

module.exports = {
    context: path.join(basePath, 'src'),
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
            core: path.resolve(basePath, "./src/core"),
            components: path.resolve(basePath, "./src/components"),
            pods: path.resolve(basePath, "./src/pods"),
        }
    },
    entry: ["@babel/polyfill", "./index.tsx"],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: /vendor$/,
                    enforce: true,
                },
            },
        },
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
          filename: "index.html", //Name of file in ./dist/
          template: "index.html", //Name of template in ./src
          hash: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css',
            chunkFilename: '[id].css',
        })
      ]
};