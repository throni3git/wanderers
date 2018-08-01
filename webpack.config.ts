import * as webpack from "webpack";
import * as webpackDevServer from "webpack-dev-server";
import * as htmlPlugin from "html-webpack-plugin";
import * as path from "path";

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
	devtool: "source-map",
	devServer: {
		port: 3000
	} as webpackDevServer.Configuration
};

module.exports = config;
