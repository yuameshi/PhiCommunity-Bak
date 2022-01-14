//	全局初始化鼠标滚轮/移动端滑动坐标
var yCoord=0,previousTouchYCoord=0;
window.addEventListener('DOMContentLoaded',()=>{
	loadSettings();
	//	添加桌面端鼠标滚轮滚动
	document.body.addEventListener('wheel',(e)=>{
		console.log('Scrolling',e.wheelDeltaY);
		yCoord+=e.wheelDeltaY/8;
		document.querySelector("#settingItems").setAttribute('style','margin-top:'+yCoord+'px')
	});
	//	添加移动端触屏滑动
	document.body.addEventListener('touchstart',(e)=>{
		//	console.log(1);
		var touchYCoord=e.changedTouches["0"].clientY;
		previousTouchYCoord=touchYCoord;
		//	console.log('prev',previousTouchYCoord);
	});
	document.body.addEventListener('touchmove',(e)=>{
		//	console.log(2)
		var touchYCoord=e.changedTouches["0"].clientY;
		window.touchYCoord=e.changedTouches["0"].clientY;
		//	console.log((previousTouchYCoord- touchYCoord)*10);
		//	console.log(yCoord)
		yCoord=-0.1*(previousTouchYCoord- touchYCoord)+parseFloat(yCoord);
		//	console.log((previousTouchYCoord- touchYCoord)*10+parseFloat(yCoord))
		//	console.log(previousTouchYCoord- touchYCoord);
		document.querySelector("#settingItems").setAttribute('style','margin-top:'+yCoord+'px')
	});
	const sliders=document.querySelectorAll('div.slider');
	for (let i = 0; i < sliders.length; i++) {
		sliders[i].addEventListener('click',(e)=>{
			var offset=0;
			// console.log(e)
			if (e.offsetX > (e.target.offsetWidth - 35)) {	//	若鼠标点击相对坐标大于宽度-加号长度则算点击右侧按钮
				// console.log('right')
				offset=1;
			}
			if (e.offsetX < 35) {	//同上
				// console.log('left')
				offset=-1;
			}
			// window.e=e;
			if (e.target.children[0]) {
				prevValue=parseFloat(e.target.children[0].style.marginLeft);
				if (isNaN(prevValue)) {
					prevValue=0;
				}
				if ((prevValue>=80&&offset==1)||(prevValue<=-80&&offset==-1)) {
					console.log('Reached frontier, action blocked.');
					return;
				}
				total=parseFloat(e.target.children[0].getAttribute('data-total'));
				e.target.children[0].style.marginLeft=parseFloat(prevValue)+(offset/total)*200+"%";
				prevValueDisplayed=parseFloat(e.target.parentElement.children[0].getAttribute('data-value'));
				if (isNaN(prevValueDisplayed)) {
					prevValueDisplayed=0;
				}
				console.log(prevValueDisplayed)
				prevValueDisplayed+=offset;
				window.localStorage.setItem(e.target.parentElement.children[0].getAttribute('data-codename'),prevValueDisplayed);
				e.target.parentElement.children[0].setAttribute('data-value',prevValueDisplayed);
			}
		});
		
	}
	const toggles=document.querySelectorAll('div.toggle');
	for (let i = 0; i < toggles.length; i++) {
		toggles[i].addEventListener('click',(e)=>{
			window.e=e;
			if (e.target.classList.toString().match('checked')) {
				e.target.classList.remove('checked');
				window.localStorage.setItem(e.target.parentElement.children[0].getAttribute('data-codename'),false);
			}else{
				e.target.classList.add('checked');
				window.localStorage.setItem(e.target.parentElement.children[0].getAttribute('data-codename'),true);
			}
		});
	}
});
function loadSettings() {
	const settingItems=document.querySelector("#settingItems").children;
	//	首次启动的话什么都不干（
	if (window.localStorage.length==0) {
		return;
	}
	for (let i = 0; i < settingItems.length; i++) {
		// console.log(settingItems[i]);
		// console.log(settingItems[i].nodeName)
		//	如果是按钮则直接返回，不处理
		if ( settingItems[i].children[0].nodeName=="BUTTON") {
			continue;
		}
		const codename=settingItems[i].children[0].getAttribute('data-codename');
		var value=settingItems[i].children[0].getAttribute('data-value');
		console.log(codename,value)
		if (value==null) {
			if (window.localStorage.getItem(codename)=='true') {
				settingItems[i].children[1].classList.add('checked');
				value=true;
				continue;
			}else{
				settingItems[i].children[1].classList.remove('checked');
				value=false;
				continue;
			}
		}
		var initialValue=settingItems[i].children[0].getAttribute('data-value');
		var value=window.localStorage.getItem(codename);
		var total=settingItems[i].children[1].children[0].getAttribute('data-total');
		console.log(initialValue,value,total)
		settingItems[i].children[0].setAttribute('data-value',window.localStorage.getItem(codename));
		settingItems[i].children[1].children[0].style.marginLeft=(window.localStorage.getItem(codename) - initialValue)/total*200+"%";
	}
	
}
function saveSettings() {
	const settingItems=document.querySelector("#settingItems").children;
	for (let i = 0; i < settingItems.length; i++) {
		// console.log(settingItems[i]);
		// console.log(settingItems[i].nodeName)
		if ( settingItems[i].children[0].nodeName=="BUTTON") {
			return;
		}
		const codename=settingItems[i].children[0].getAttribute('data-codename');
		var value=settingItems[i].children[0].getAttribute('data-value');
		if (value==null) {
			if (settingItems[i].children[1].classList.toString().match('checked')) {
				value=true;
			}else{
				value=false;
			}
		}
		window.localStorage.setItem(codename,value);
	}
}