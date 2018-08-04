import * as webpack from "webpack";
import * as webpackDevServer from "webpack-dev-server";
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
	plugins: [new htmlPlugin()],
	output: {
		path: path.resolve("dist")
	},
	devtool: isProduction ? false : "source-map",
	devServer: {
		port: 3000
	} as webpackDevServer.Configuration
};

module.exports = config;
