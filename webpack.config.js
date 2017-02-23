const config = require('./bot.config.js');

const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

const env = require('./src/env.js');
const pkg = require('./package.json');


module.exports = {
	devtool: "source-map",
	entry: {
		vendor: ['react','react-dom','lodash'],
		app: 'main'
	},
	plugins: [
		new CleanWebpackPlugin([config.paths.build]),
		new webpack.ProvidePlugin({
			Promise: 'es6-promise-promise'
		}),
		new webpack.DefinePlugin((function(){
			var rt = {};
			Object.keys(process.env).map(function(key){
				rt['process.env.'+key] = '"'+process.env[key]+'"';
			});
			return rt;
		})()),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.js',
			minChunks : 2
		}),
		new ExtractTextPlugin('[name].css'),
		new HtmlWebpackPlugin({
			title: '👁👄👁☝️',
			template: 'bot.template.ejs',
			filename: 'index.html',
			base: `file://${__dirname}/${config.paths.build}/index.html`
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				include: [
					path.resolve(__dirname, 'src/component')
				],
				loader: ExtractTextPlugin.extract([
					'css-loader?modules&importLoaders=1&localIdentName=tc-[hash:base64:10]',
					'postcss-loader',
					'./tools/randomCssLoader'
				])
			},
			{
				test: /\.(png|jpg)$/,
				use: [{
					loader: 'url-loader',
					options: { limit: 10 }
				}],
			},
			{
				test: /\.css$/,
				exclude: [
					/node_modules/,
					path.resolve(__dirname, 'src/component')
				],
				use: ExtractTextPlugin.extract({
					use: ['css-loader','postcss-loader']
				})
			},
			{
				test: /\.jsx?$/,
				use: [{
					loader: 'babel-loader',
					query: {
						plugins: [
							"transform-decorators-legacy",
							"transform-object-assign"
						],
						presets: [
							['react'],
							['target', {
								presets: ["es2015"],
								targets: [
									{name: "phantom", version: 2}
								],
								modules: false
							}],
						]
					}
				}]
			}
		]
	},
	output: {
		filename: 'post.js',
		path: config.paths.build,
		library: 'Post',
		libraryTarget: 'umd'
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [
			path.resolve('./src'),
			'node_modules'
		]
	}
};