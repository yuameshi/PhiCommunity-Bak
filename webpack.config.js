const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { GenerateSW } = require('workbox-webpack-plugin');
const path = require('path');
const pages = require('./webpack.pages.config');

const prod = process.env.NODE_ENV === 'production';

const entry = {};

pages.forEach(({ name, path }) => (entry[name] = `${path}/index.js`));

const plugins = [
	new CleanWebpackPlugin(),
	...pages.map(
		({ name, path: pathname, output }) =>
			new HtmlWebpackPlugin({
				template: path.join(pathname, 'index.html'),
				filename: output + '/index.html',
				chunks: [name],
			})
	),
	new CopyWebpackPlugin({
		patterns: [path.join(__dirname, 'public')],
	}),
	new GenerateSW({
		clientsClaim: true,
		skipWaiting: true,
		maximumFileSizeToCacheInBytes: 16 * 1024 * 1024,
	}),
];

module.exports = {
	entry,
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'js/[name].bundle.js',
		assetModuleFilename: '[path][name][ext]',
	},
	resolve: {
		alias: {
			assets: path.resolve(__dirname, 'assets'),
		},
	},
	devtool: 'inline-source-map',
	plugins,
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
					},
				],
			},
			{
				test: /\.(mp3|wav|ogg|png|jpg)$/,
				type: 'asset/resource',
			},
			{
				test: /\.(webp|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
							esModule: false,
						},
					},
					/* 					{
						loader: 'url-loader',
						options: {
							name: '[path][name].[ext]',
							esModule: false,
						},
					}, */
				],
				type: 'javascript/auto',
			},
		],
	},
};
