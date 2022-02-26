import './style.css';
import chapterSelect0_mp3 from './ChapterSelect0.mp3';

window.addEventListener('DOMContentLoaded', () => {
	document
		.querySelector('div#startToPlayBtn')
		.addEventListener('click', () => {
			location.href = '../songSelect';
		});
	document.querySelector('div#settingBtn').addEventListener('click', () => {
		location.href = '../settings';
	});
	document
		.querySelector('div#uploadChartsBtn')
		.addEventListener('click', () => {
			location.href =
				'https://github.com/HanHan233/PhiCommunity-Charts-Repo';
		});
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chapterSelect0_mp3, true);
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
