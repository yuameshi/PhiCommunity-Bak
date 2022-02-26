import './style.css';
import title_svg from 'assets/images/Title.svg';
import aboutUs_mp3 from './AboutUs.mp3';

const titleElem = document.createElement('img');
titleElem.alt = 'PhiCommunity';
titleElem.class = 'title';
titleElem.src = title_svg;

const triggerElem = document.querySelector('div.trigger');
triggerElem.prepend(titleElem);

//	自动滚动，通过持续修改CSS的Margin Top实现
// window.addEventListener('DOMContentLoaded',()=>{
// 	autoScroll();
// });

document.body.addEventListener('click', () => {
	triggerElem.classList.add('fadeout');
	setTimeout(() => {
		triggerElem.remove();
	}, 1000);
	// document.querySelector('div#main').classList.add('actived');
	// document.body.classList.add('actived');
	autoScroll();
});
function autoScroll() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', aboutUs_mp3, true);
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
	var topSize = -0;
	document
		.querySelector('#main')
		.style.setProperty('--topSize', topSize + 'px');

	//	连续点击6次跳过（5s内）
	window.clickToExitCounter = 6;
	document.body.addEventListener('click', () => {
		window.clickToExitCounter--;
		document.querySelector('div.clickToExitTag').innerText =
			'再点击' + window.clickToExitCounter + '次以跳过';
		document.querySelector('div.clickToExitTag').style.opacity =
			'0.' + (10 - window.clickToExitCounter);
		if (window.clickToExitCounter <= 0) {
			setTimeout(() => {
				location.href = '../chapterSelect';
			}, 1000);
		}
		const bactToMinScreenTimeOut = setTimeout(() => {
			window.clickToExitCounter = 6;
			setTimeout(() => {
				document.querySelector('div.clickToExitTag').innerText =
					'再点击' + window.clickToExitCounter + '次以跳过';
			}, 300);
			document.querySelector('div.clickToExitTag').style.opacity = 0;
			clearTimeout(bactToMinScreenTimeOut);
		}, 5000);
	});
	// var topSize=window.innerHeight;
	const autoScrollInterval = setInterval(() => {
		if (
			document.querySelector('#main').getBoundingClientRect().bottom -
				window.innerHeight <
				-100 ==
			true
		) {
			console.log('The END!');
			clearInterval(autoScrollInterval);
			setTimeout(() => {
				location.href = '../chapterSelect';
			}, 3000);
		}
		document
			.querySelector('#main')
			.style.setProperty('--topSize', topSize + 'px');
		// document.body.style.marginTop=topSize+'px';
		topSize -= 0.5;
	}, 12); //	此数字改小同时topSize需要相应改小，改小后滑动更细腻，但是资源占用会增大
}
