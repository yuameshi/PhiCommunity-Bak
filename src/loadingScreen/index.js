import './style.css';
import tips from 'assets/tips.json';

window.addEventListener('DOMContentLoaded', () => {
	var tipsArray = JSON.parse(tips);
	var rndNum = parseInt(Math.random() * (tipsArray.length + 1), 10);
	const tip = tipsArray[rndNum];
	console.log(tip);
	document.querySelector('#tipConteiner').innerText = tip;
});
