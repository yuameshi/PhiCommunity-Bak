window.addEventListener('DOMContentLoaded', () => {
	document
		.querySelector('div#startToPlayBtn')
		.addEventListener('click', () => {
			location.href = '../songSelect/index.html';
		});
	document
		.querySelector('div#cacheControl')
		.addEventListener('click', () => {
			location.href = '../cacheControl/index.html';
		});
	document.querySelector('div#settingBtn').addEventListener('click', () => {
		location.href = '../settings/index.html';
	});
	document
		.querySelector('div#uploadChartsBtn')
		.addEventListener('click', () => {
			location.href =
				'https://github.com/Yuameshi/PhiCommunity-Charts-Repo';
		});
	var xhr = new XMLHttpRequest();
	xhr.open('GET', './ChapterSelect0.mp3', true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function () {
		const actx = new (window.AudioContext ||
			window.webkitAudioContext ||
			window.mozAudioContext ||
			window.msAudioContext)();
		actx.decodeAudioData(this.response, function (buffer) {
			var source = actx.createBufferSource();
			source.buffer = buffer;
			source.loop = true;
			source.connect(actx.destination);
			source.start(0);
		});
	};
	xhr.send();
	const body = document.getElementById('body');
	if (window.DeviceOrientationEvent) {
		console.log(
			'DeviceOrientationEvent detected, attaching event listener.'
		);
		window.addEventListener(
			'deviceorientation',
			(event) => {
				const { gamma, beta } = event;
				body.style.setProperty('--gamma', gamma);
				body.style.setProperty('--beta', beta);
				// console.log(gamma, beta);
			},
			true
		);
	}
});
