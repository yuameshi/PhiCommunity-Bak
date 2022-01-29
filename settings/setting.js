/**
 * @typedef {{
 * 	title: string,
 * 	codename: string
 * }} BaseSetting
 *
 * @typedef { BaseSetting & {
 *  range: [number,number],
 * 	defaultValue?: number = range[0],
 * 	offset: number = 1,
 * }} SlideSetting
 *
 *  @typedef { BaseSetting & {
 * 	defaultValue:boolean = false,
 * }} ToggleSetting
 *
 *  @typedef {{
 * 	title: string,
 * 	onClick: (this: GlobalEventHandlers, ev: MouseEvent) => any
 * }} ButtonSetting
 * 
 */

/**
 * @type {Array <
 * (SlideSetting & {type: 'slide'})|
 * (ToggleSetting & {type: 'toggle'}|
 * (ButtonSetting & {type: 'button'})>
 * }
 */
export const settings = [
	{
		type: "slide",
		title: "谱面延时(MS)",
		codename: "input-offset",
		range: [-500, 500],
		defaultValue: 0,
		offset: 5,
	},
	{
		type: "button",
		title: "根据声音调整偏移率",
		onClick() {
			location.href = "./calibrate.html";
		},
	},
	{
		type: "slide",
		title: "按键缩放",
		codename: "select-scale-ratio",
		range: [1, 5],
		defaultValue: 3,
	},
	{
		type: "slide",
		title: "背景亮度",
		codename: "select-global-alpha",
		range: [1, 5],
		defaultValue: 3,
	},
	{
		type: "toggle",
		title: "开启多押辅助",
		codename: "highLight",
		defaultValue: true,
	},
	{
		type: "toggle",
		title: "开启打击音效",
		codename: "hitSong",
		defaultValue: true,
	},
	{
		type: "toggle",
		title: "游玩时自动全屏",
		codename: "autoFullscreen",
		defaultValue: true,
	},
	{
		type: "toggle",
		title: "开启FC/AP指示器",
		codename: "lineColor",
	},
	//下面就是模拟器其他的功能了
	{
		type: "toggle",
		title: "开启HyperMode",
		codename: "hyperMode",
	},
	{
		type: "toggle",
		title: "启用旧版本打歌界面UI",
		codename: "useOldUI",
	},
	{
		type: "toggle",
		title: "背景模糊显示",
		codename: "imageBlur",
		defaultValue: true,
	},
	/* {
		type: "toggle",
		title: "显示过渡动画",
		codename: "showTransition",
	}, */
	{
		type: "toggle",
		title: "开启触摸反馈",
		codename: "feedback",
	},
	{
		type: "toggle",
		title: "显示定位点",
		codename: "showPoint",
	},
	{
		type: "button",
		title: "观看教学",
		onClick() {
			location.href = "../whilePlaying/index.html?play=introduction&l=ez&c=official";
		},
	},
	{
		type: "button",
		title: "关于我们",
		onClick() {
			location.href = "../aboutUs/index.html";
		},
	},
	{
		type: "button",
		title: "清除全部数据",
		onClick() {
			window.localStorage.clear();
			location.href = "../index.html";
		},
	},
];
