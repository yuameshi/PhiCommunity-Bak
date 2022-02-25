window.addEventListener('DOMContentLoaded', () => {
	var tipsXHR = new XMLHttpRequest();
	tipsXHR.open('GET', '../assets/tips.json', true);
	tipsXHR.addEventListener('load', () => {
		var tipsArray = JSON.parse(tipsXHR.responseText);
		var rndNum = parseInt(Math.random() * (tipsArray.length + 1), 10);
		const tip = tipsArray[rndNum];
		console.log(tip);
		document.querySelector('#tipConteiner').innerText = tip;
	});
	tipsXHR.send();
});
