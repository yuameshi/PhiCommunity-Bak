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
		type: 'slide',
		title: '谱面延时(MS)',
		codename: 'input-offset',
		range: [-500, 500],
		defaultValue: 0,
		offset: 5,
	},
	{
		type: 'button',
		title: '根据声音调整偏移率',
		onClick() {
			location.href = './calibrate.html';
		},
	},
	{
		type: 'slide',
		title: '按键缩放',
		codename: 'select-scale-ratio',
		range: [1, 5],
		defaultValue: 3,
	},
	{
		type: 'slide',
		title: '背景亮度',
		codename: 'select-global-alpha',
		range: [1, 5],
		defaultValue: 3,
	},
	{
		type: 'toggle',
		title: '开启多押辅助',
		codename: 'highLight',
		defaultValue: true,
	},
	{
		type: 'toggle',
		title: '开启打击音效',
		codename: 'hitSong',
		defaultValue: true,
	},
	{
		type: 'toggle',
		title: '游玩时自动全屏',
		codename: 'autoFullscreen',
		defaultValue: true,
	},
	{
		type: 'toggle',
		title: '开启FC/AP指示器',
		codename: 'lineColor',
	},
	//下面就是模拟器其他的功能了
	{
		type: 'toggle',
		title: '使用游玩友好型Note',
		codename: 'usePlayerFriendlyUI',
	},
	{
		type: 'slide',
		title: '界面宽高比',
		codename: 'select-aspect-ratio',
		range: [1, 8],
		defaultValue: 8,
	},
	{
		type: 'button',
		title: '界面宽高比数值说明',
		onClick() {
			alert(
				'1=>5:4     (1.25)\n2=>4:3     (1.333333)\n3=>10:7   (1.428571)\n4=>19:13 (1.461538)\n5=>8:5     (1.6)\n6=>5:3     (1.666667)\n7=>22:13 (1.692308)\n8=>16:9   (1.777778)'
			);
		},
	},
	{
		type: 'toggle',
		title: '开启HyperMode',
		codename: 'hyperMode',
	},
	{
		type: 'toggle',
		title: '启用旧版本打歌界面UI',
		codename: 'useOldUI',
	},
	{
		type: 'toggle',
		title: '背景模糊显示',
		codename: 'imageBlur',
		defaultValue: true,
	},
	// {
	// 	type: 'toggle',
	// 	title: '显示过渡动画',
	// 	codename: 'showTransition',
	// },
	{
		type: 'toggle',
		title: '启用AutoPlay',
		codename: 'autoplay',
	},
	{
		type: 'toggle',
		title: '开启触摸反馈',
		codename: 'feedback',
	},
	{
		type: 'toggle',
		title: '显示定位点',
		codename: 'showPoint',
	},
	// {
	// 	type: 'button',
	// 	title: '观看教学',
	// 	onClick() {
	// 		location.href = '../whilePlaying/index.html?play=introduction&l=ez&c=official';
	// 	},
	// },
	{
		type: 'button',
		title: '修改玩家昵称',
		onClick() {
			const name = prompt('输入昵称', 'GUEST');
			localStorage.setItem('playerName', name);
		},
	},
	{
		type: 'button',
		title: '关于我们',
		onClick() {
			location.href = '../aboutUs/index.html';
		},
	},
	{
		type: 'button',
		title: '清除全部数据',
		onClick() {
			window.localStorage.clear();
			location.href = '../index.html';
		},
	},
	{
		type: 'button',
		title: '导出本地数据到剪贴板',
		onClick() {
			navigator.clipboard.writeText(JSON.stringify(localStorage));
			this.innerHTML = '<img src="../assets/images/Tick.svg"> 成功';
			const timeout = setTimeout(() => {
				this.innerHTML = '导出本地数据到剪贴板';
				clearTimeout(timeout);
			}, 2000);
		},
	},
	{
		type: 'button',
		title: '从剪贴板导入数据',
		onClick() {
			navigator.clipboard.readText().then((clipText) => {
				try {
					const clipTextObj = JSON.parse(clipText);
					const clipTextObjKeys = Object.keys(clipTextObj);
					for (const keys in clipTextObjKeys) {
						console.log(keys, clipTextObj[keys]);
						localStorage.setItem(
							clipTextObjKeys[keys],
							clipTextObj[clipTextObjKeys[keys]]
						);
					}
					this.innerHTML =
						'<img src="../assets/images/Tick.svg"> 成功';
					const timeout = setTimeout(() => {
						this.innerHTML = '导出本地数据到剪贴板';
						clearTimeout(timeout);
					}, 2000);
					location.reload();
				} catch (error) {
					alert('导入失败，请检查剪贴板内容是否正确\n' + error);
				}
			});
		},
	},
];
