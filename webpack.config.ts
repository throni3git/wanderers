import * as path from "path";
import * as webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
const copyWebpackPlugin = require("copy-webpack-plugin");

const timestamp = JSON.stringify(new Date().toISOString());

const config: webpack.Configuration = {
	// webpack will take the files from ./src/index
	entry: "./src/index.ts",

	// adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
	resolve: {
		extensions: [".js", ".ts", ".tsx"]
	},

	module: {
		rules: [
			// we use babel-loader to load our jsx and tsx files
			{
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			}
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			BUILD_TIMESTAMP: timestamp,
			IS_PRODUCTION: true
		}),
		new HtmlWebpackPlugin({ title: "SOJUS3000", favicon: "favicon.png" }),
		new copyWebpackPlugin({
			patterns: [
				{ from: "src/mail_api_send.php", to: "." },
				{ from: "assets/", to: "assets/" },
				{ from: "data/", to: "data/" },
				{ from: "media/", to: "media/" }
			]
		})
	],

	// and output it into /dist as bundle.js with hash
	output: {
		path: path.resolve("dist"),
		filename: "js/bundle.[contenthash].js",
		clean: true
	},

	mode: "production",

	devtool: false
};

export default config;
