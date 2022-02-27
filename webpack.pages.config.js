const path = require('path');

/**
 * @type {Array<{
 * 	name: string		 - 标识
 * 	path: string		 - 文件目录, 默认为src/[name]文件夹
 * 	outputDir: string	 - 打包输出目录, 等同于浏览器访问路径, 默认为[name]
 * }>}
 */
const pages = [
	{ name: 'index', path: '.' },
	{ name: 'aboutUs' },
	{ name: 'chapterSelect' },
	{ name: 'LevelOver' },
	{ name: 'loadingChartScreen' },
	{ name: 'loadingScreen' },
	{ name: 'songSelect' },
	{ name: 'tapToStart' },
	{ name: 'whilePlaying' },
	{ name: 'settings' },
	{
		name: 'calibrate',
		path: 'settings/calibrate',
	},
	{
		name: 'statistic',
		path: 'settings/statistic',
	},
].map(({ name, path: pathname = name, output = pathname }) => ({
	name,
	path: './src/' + pathname,
	output,
}));

module.exports = pages;
