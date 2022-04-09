import { SongList } from './SongList.js';
// import { gameLevels } from '../constants.js';

const songList = SongList({ defaultLevel: 'ez' });

window.addEventListener('DOMContentLoaded', () => {
	let loadingEmbedFrame = document.createElement('iframe');
	loadingEmbedFrame.src = '../loadingScreen/index.html';
	loadingEmbedFrame.classList.add('loadingEmbedFrame');
	document.body.appendChild(loadingEmbedFrame);
	const sortMode = [
			['default', '默认'],
			['level', '难度'],
			['name', '名称'],
		],
		defaultOrder = 2;

	document.querySelector('div.settingBtn').addEventListener('click', () => {
		location.href = '../settings/index.html';
	});
	document.querySelector('div#avatarBar').addEventListener('click', (e) => {
		var _element = e.target;
		if (_element.classList.toString().match('avatarBar') == null) {
			_element = e.target.parentElement;
		}
		if (_element.classList.toString().match('expand')) {
			_element.classList.remove('expand');
		} else {
			_element.classList.add('expand');
		}
	});
	if (window.localStorage.getItem('playerName') != null) {
		console.log(
			'Setting player name: ',
			window.localStorage.getItem('playerName')
		);
		document
			.querySelector('div#avatarBar')
			.setAttribute(
				'data-name',
				window.localStorage.getItem('playerName')
			);
	}
	//	获取歌曲列表并生成元素
	window.chapterName = new URLSearchParams(new URL(location.href).search).get(
		'c'
	);
	var songListXHR = new XMLHttpRequest();
	songListXHR.open(
		'GET',
		'https://api.github.com/repos/Yuameshi/PhiCommunity-Charts-Repo/contents',
		// "https://charts.pgr.han-han.xyz/" + chapterName + ".json",
		true
	);
	songListXHR.addEventListener('load', () => {
		const response = JSON.parse(songListXHR.responseText);
		window.songCodeNameList = new Array();
		// console.log(response);
		for (let i = 0; i < response.length; i++) {
			if (
				response[i].name.match(/.github|README.md|CNAME|_headers/) !=
				null
			) {
				continue;
			}
			window.songCodeNameList.push(response[i].name);
		}
		// window.songCodeNameList = JSON.parse(songListXHR.responseText);
		window.songMetaList = new Array();

		for (let i = 0; i < window.songCodeNameList.length; i++) {
			window.songMetaList.push(getSongMeta(window.songCodeNameList[i]));
		}

		const songListElement = songList.element;
		document
			.getElementsByClassName('leftArea')[0]
			.appendChild(songListElement);

		for (let i = 0; i < window.songMetaList.length; i++) {
			songList.createSong(
				i,
				window.songMetaList[i],
				window.songCodeNameList[i]
			);
		}

		let currentOrder = defaultOrder;
		document.querySelector('div.sortMode').innerText =
			sortMode[defaultOrder][1];
		document
			.querySelector('div.sortMode')
			.addEventListener('click', (e) => {
				currentOrder = (currentOrder + 1) % sortMode.length;
				songList.setOrder(sortMode[currentOrder][0]);
				e.target.innerText = sortMode[currentOrder][1];
			});
		window.slicesAudioContext = new (window.AudioContext ||
			window.webkitAudioContext ||
			window.mozAudioContext ||
			window.msAudioContext)();
		//	强行切换成第一首歌
		songList.switchSong(0);
		// songList.switchLevel('in'.match('in'));
		loadingEmbedFrame.remove();
		// songList.setOrder(sortMode[currentOrder][0]);
		//	调整宽度/缩放
		document
			.querySelector('#rightArea')
			.style.setProperty(
				'--scale',
				Math.round(window.devicePixelRatio) / 3.5
			);
		// console.log(
		// 	"Resize:",(window.innerHeight / window.innerWidth)*
		// 	Math.round(window.devicePixelRatio)
		// );
		// window.onresize = function () {
		// 	document
		// 			.querySelector("#rightArea")
		// 			.style.setProperty(
		// 				"--scale",
		// 				window.devicePixelRatio
		// 			);
		// };
		//	添加桌面端鼠标滚轮滚动
		document.body.addEventListener('wheel', (e) => {
			/* console.log(
				"Scrolling",
				e.wheelDeltaY,
				parseFloat(songList.element.style.top || 0)
			); */
			let newYCoord =
				parseFloat(songList.element.style.top || 0) + e.wheelDeltaY / 3;
			if (newYCoord <= 0 || e.wheelDeltaY < 0)
				songList.element.style.top = newYCoord + 'px';
		});

		//	添加移动端触屏滑动
		let pY, cY;
		document.body.addEventListener('touchstart', (e) => {
			pY = e.changedTouches['0'].clientY;
		});

		document.body.addEventListener('touchmove', (e) => {
			cY = e.changedTouches['0'].clientY;
			let nY =
				parseFloat(songList.element.style.top || 0) - 0.1 * (pY - cY);
			if (nY < 0) songList.element.style.top = nY + 'px';
		});
	});
	songListXHR.addEventListener('error', () => {
		alert('曲目列表获取失败！');
	});
	songListXHR.send();
});

function getSongMeta(songCodeName) {
	var getSongMetaXHR = new XMLHttpRequest();
	getSongMetaXHR.open(
		'GET',
		'https://charts.phi.han-han.xyz/' + songCodeName + '/meta.json',
		false
	);
	getSongMetaXHR.send();
	return JSON.parse(getSongMetaXHR.responseText);
}

function changeLevel(event) {
	const e = event;
	//	0S：原选中添加淡出
	try {
		document
			.querySelector('div.levelItem.selected')
			.classList.add('fadeOut');
	} catch (e) {
		null;
	}
	setTimeout(() => {
		//	300ms后动画结束后移除选中样式，给后来选中的添加选中和淡入选择器
		try {
			document
				.querySelector('div.levelItem.selected')
				.classList.remove('selected');
		} catch (e) {
			null;
		}
		e.target.classList.add('fadeIn');
		e.target.classList.add('selected');
	}, 300);
	const levelStr = e.target.classList.toString();

	//	切换所有难度
	songList.switchLevel(levelStr.match(/ez|hd|in|at/));

	//	最后把所有的fade选择器都删掉
	const fadeInElems = document.querySelectorAll('div.levelItem.fadeIn');
	for (let i = 0; i < fadeInElems.length; i++) {
		fadeInElems[i].classList.remove('fadeIn');
	}
	const fadeOutElems = document.querySelectorAll('div.levelItem.fadeOut');
	for (let i = 0; i < fadeInElems.length; i++) {
		fadeOutElems[i].classList.remove('fadeOut');
	}
}

document
	.querySelectorAll('div.levelItem')
	.forEach((element) => element.addEventListener('click', changeLevel));

document.querySelector('div.playBtn').addEventListener('click', () => {
	clearInterval(window.sliceAudioInterval);
	try {
		window.sliceAudioContextSource.stop();
	} catch (error) {
		null;
	}
	document.querySelector('#readyToLoadOverlay').classList.add('go');
	const playClickedSound = new XMLHttpRequest();
	playClickedSound.open('GET', '../assets/audio/Start.mp3', true);
	playClickedSound.responseType = 'arraybuffer';
	playClickedSound.onload = function () {
		const actx = new (window.AudioContext ||
			window.webkitAudioContext ||
			window.mozAudioContext ||
			window.msAudioContext)();
		actx.decodeAudioData(this.response, function (buffer) {
			let source = actx.createBufferSource();
			source.buffer = buffer;
			source.connect(actx.destination);
			source.start(0);
		});
	};
	playClickedSound.send();
	setTimeout(() => {
		location.href =
			'../whilePlaying/index.html?play=' +
			document
				.querySelector('div.songItem.selected')
				.getAttribute('data-codename') +
			'&l=' +
			window.levelSelected +
			'&c=fanmade';
	}, 2000);
});
