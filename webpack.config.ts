import * as webpack from "webpack";
import * as webpackDevServer from "webpack-dev-server";
import * as copyPlugin from "copy-webpack-plugin";
import * as cleanPlugin from "clean-webpack-plugin";
import * as htmlPlugin from "html-webpack-plugin";
import * as path from "path";

const isProduction = process.env.NODE_ENV === "production";

const config: webpack.Configuration = {
	entry: "./src/index.ts",
	resolve: {
		extensions: [".js", ".ts", ".tsx"]
	},
	module: {
		rules: [
			{
				test: /.tsx?$/,
				loader: "ts-loader"
			}
		]
	},
	plugins: [
		new htmlPlugin({ title: "SOJUS3000", favicon: "favicon.png" }),
		new cleanPlugin(isProduction ? ["dist/**/*"] : []),
		new copyPlugin([
			{ from: "assets/", to: "assets/" },
			{ from: "data/", to: "data/" },
			{ from: "media/", to: "media/" }
		])
	],
	output: {
		path: path.resolve("dist"),
		filename: "js/bundle.[chunkhash].js"
	},
	mode: isProduction ? "production" : "development",
	devtool: isProduction ? false : "source-map",
	devServer: {
		port: 9000
	} as webpackDevServer.Configuration
};

module.exports = config;
