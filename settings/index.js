import { settings } from './setting.js';
import { SliderItem, ToggleItem, ButtonItem} from './components/index.js';


//	全局初始化鼠标滚轮/移动端滑动坐标
var yCoord=0,previousTouchYCoord=0;
window.addEventListener('DOMContentLoaded',()=>{
	if (window.localStorage.length==0) {
		document.querySelector('#backBtn').addEventListener('click',()=>{
			location.href='../whilePlaying/index.html?play=introduction&l=ez&c=official';
		});
	}else{
		document.querySelector('#backBtn').addEventListener('click',()=>{
			location.href='../chapterSelect/index.html';
		});
	}
	// loadSettings();
	//	添加桌面端鼠标滚轮滚动
	document.body.addEventListener("wheel", (e) => {
		console.log("Scrolling", e.wheelDeltaY);
		let newYCoord = yCoord + e.wheelDeltaY / 3;
		// 到顶不可再向上滚动
		if (newYCoord <= 0 || e.wheelDeltaY < 0) {
			document
				.querySelector("#settingItems")
				.setAttribute("style", "margin-top:" + newYCoord + "px");
			yCoord = newYCoord;
		}
	});
	//	添加移动端触屏滑动
	document.body.addEventListener("touchstart", (e) => {
		//	console.log(1);
		var touchYCoord = e.changedTouches["0"].clientY;
		previousTouchYCoord = touchYCoord;
		//	console.log('prev',previousTouchYCoord);
	});
	document.body.addEventListener("touchmove", (e) => {
		//	console.log(2)
		var touchYCoord = e.changedTouches["0"].clientY;
		window.touchYCoord = e.changedTouches["0"].clientY;
		//	console.log((previousTouchYCoord- touchYCoord)*10);
		//	console.log(yCoord)
		//	console.log((previousTouchYCoord- touchYCoord)*10+parseFloat(yCoord))
		//	console.log(previousTouchYCoord- touchYCoord);
		let newYCoord =
			-0.1 * (previousTouchYCoord - touchYCoord) + parseFloat(yCoord);
		// 到顶不可再向上滚动
		if (newYCoord <= 0 || e.wheelDeltaY < 0) {
			document
				.querySelector("#settingItems")
				.setAttribute("style", "margin-top:" + newYCoord + "px");
			yCoord = newYCoord;
		}
	});

	//创建设置条目
	settings.forEach((setting) => {
		let item;
		switch (setting.type) {
			case "slide":
				setting.defaultValue = parseFloat(window.localStorage.getItem(setting.codename))||setting.defaultValue
				item = SliderItem(setting)
				break;
			case "toggle":
				setting.defaultValue = window.localStorage.getItem(setting.codename)=='true' ? true : false||setting.defaultValue
				item = ToggleItem(setting)
				break;
			case "button":
				item = ButtonItem(setting)
				break;
			default:
				throw new Error("Unknown setting: " + setting);
		}
		document.getElementById("settingItems").appendChild(item.element);
	});
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
