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
	const urlParams = new URL(location.href).search;
	const parsedURLParams = new URLSearchParams(urlParams);
	const chart = parsedURLParams.get('c');
	const level = parsedURLParams.get('l').toLowerCase();
	const songInfoXHR = new XMLHttpRequest();
	songInfoXHR.open(
		'GET',
		encodeURI('https://charts.phi.han-han.xyz/' + chart + '/meta.json'),
		true
	);
	songInfoXHR.addEventListener('load', () => {
		const songInfoObj = JSON.parse(songInfoXHR.responseText);
		document.querySelector('#songNameElem').innerText = songInfoObj.name;
		document.querySelector('#artistElem').innerText = songInfoObj.artist;
		if (songInfoObj.chartDesigner != undefined) {
			document.querySelector('#chartDesignerElem').innerText =
				songInfoObj.chartDesigner;
		} else {
			document.querySelector('#chartDesignerElem').innerText =
				songInfoObj[level + 'ChartDesigner'];
		}
		document.querySelector('#illustratorElem').innerText =
			songInfoObj.illustrator;
		document
			.querySelector('#songImgElem')
			.setAttribute(
				'src',
				encodeURI(
					'https://charts.phi.han-han.xyz/' +
						chart +
						'/' +
						songInfoObj.illustration
				)
			);
		document.body.setAttribute(
			'style',
			'--background: url(' +
				encodeURI(
					'https://charts.phi.han-han.xyz/' +
						chart +
						'/' +
						songInfoObj.illustration
				) +
				');'
		);
		document
			.querySelector('#levelInfoElem')
			.setAttribute(
				'data-level',
				Math.floor(songInfoObj[level + 'Ranking'] || 0)
			);
		document.querySelector('#levelInfoElem').classList.add(level);
	});
	songInfoXHR.send();
});
