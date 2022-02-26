const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const WriteFilePlugin = require('write-file-webpack-plugin');
const path = require('path');
const pages = require('./webpack.pages');

const entry = {};

pages.forEach(({ name, path }) => (entry[name] = `${path}/index.js`));

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
	plugins: [
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
			patterns: [
				path.join(__dirname, 'public'),
				{
					from: path.join(__dirname, 'src/whilePlaying'),
					to: 'whilePlaying',
				},
			],
		}),
		// new WriteFilePlugin(),
	],
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
				/* use: [
					{
						loader: "file-loader",
						options: {
							name: "[path][name].[ext]",
						},
					},
					{
						loader: "url-loader",
						options: {
							name: "[path][name].[ext]",
						},
					},
				], */
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
