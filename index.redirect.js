window.addEventListener('DOMContentLoaded', () => {
	fetch('https://api.github.com/repos/Yuameshi/PhiCommunity/commits').then(
		(response) => {
			response.json().then((data) => {
				const changeLogFrame=document.querySelector('div#changelogContainer');
				data.forEach(commit => {
					const item=document.createElement('a');
					item.classList.add('item');
					item.href=commit.html_url;
					item.setAttribute('data-sha',commit.sha.slice(0,7));
					item.innerText=commit.commit.message;
					changeLogFrame.appendChild(item);
				});
			});
		}
	);
	const addBtn = document.querySelector('#installPWA');
	addBtn.style.display = 'none';
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		addBtn.style.display = 'unset';
		addBtn.addEventListener('click', () => {
			e.prompt();
			e.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
					console.log('准备添加到主屏幕');
				} else {
					console.log('用户拒绝了添加到主屏幕');
				}
			});
		});
	});
	
	document.querySelector('button#go').addEventListener('click',()=>{
		location.href='../tapToStart/index.html';
	});
	document.querySelector('button#gotoCFPages').addEventListener('click',()=>{
		location.href='https://cf.phi.han-han.xyz';
	});
	document.querySelector('button#gotoGHPages').addEventListener('click',()=>{
		location.href='https://phi.han-han.xyz';
	});
	if (location.href.match('cf.phi.han-han.xyz')) {	//	检测是否为CF节点
		document.querySelector('button#gotoCFPages').style.display='none';
	}else{
		document.querySelector('button#gotoGHPages').style.display='none';
	}
	document.querySelector('button#ghRepo').addEventListener('click',()=>{
		window.open('https://github.com/Yuameshi/PhiCommunity');
	});
	document.querySelector('button#deviceReq').addEventListener('click',()=>{
		document.querySelector('div#devRequirementPopupoverlay').classList.add('show');
	});
	document.querySelector('div#devRequirementPopupoverlay').addEventListener('click',(e)=>{
		if(e.target!=document.querySelector('#devReq')){
			document.querySelector('div#devRequirementPopupoverlay').classList.remove('show');
		}
	});
	document.querySelector('button#changeLog').addEventListener('click',()=>{
		document.querySelector('div#changeLogContainerPopupOverlay').classList.add('show');
	});
	document.querySelector('div#changeLogContainerPopupOverlay').addEventListener('click',(e)=>{
		if(e.target!=document.querySelector('#changelogContainer')){
			document.querySelector('div#changeLogContainerPopupOverlay').classList.remove('show');
		}
	});
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js').then(function () {
		console.log('Service Worker Registered');
	});
}