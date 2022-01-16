//	全局初始化鼠标滚轮/移动端滑动坐标
var yCoord=0,previousTouchYCoord=0;
window.addEventListener('DOMContentLoaded',()=>{
	document.querySelector('div.settingBtn').addEventListener("click",()=>{
		location.href='../settings/index.html';
	});
	//	获取歌曲列表并生成元素
	window.chapterName=new URLSearchParams(new URL(location.href).search).get('c')
	var songListXHR=new XMLHttpRequest();
	songListXHR.open("GET",'../charts/'+chapterName+'.json',false)
	songListXHR.send();
	window.songCodeNameList=JSON.parse(songListXHR.responseText);
	window.songList=new Array();
	for (let i = 0; i < window.songCodeNameList.length; i++) {
		window.songList.push(getSongMeta(window.songCodeNameList[i]));
	}
	const songListElement=document.querySelector('div#songList.songList')
	for (let i = 0; i < window.songList.length; i++) {
		var songItem = window.songList[i];
		//创建外框架
		var songItemContainerElement=document.createElement('div');
		songItemContainerElement.classList.add('songItemContainer');
		songItemContainerElement.setAttribute('data-itemNum',i);
		songListElement.appendChild(songItemContainerElement);
		//	创建歌曲信息元素
		var songItemElement=document.createElement('div');
		songItemElement.classList.add('songItem');
		songItemElement.setAttribute('data-artist',songItem.artist);
		songItemElement.setAttribute('data-codename',window.songCodeNameList[i]);
		songItemElement.innerText=songItem.name;
		//	如果是第一个则添加选中选择器
		if (i==0) {
			window.levelChoosed=0;
			songItemElement.classList.add('choosed');
			songItemContainerElement.classList.add('choosed');
			document.querySelector('div.levelItem.ez').setAttribute('data-level',Math.floor(songItem["ezRanking"]));
			document.querySelector('div.levelItem.hd').setAttribute('data-level',Math.floor(songItem["hdRanking"]));
			document.querySelector('div.levelItem.in').setAttribute('data-level',Math.floor(songItem["inRanking"]));
			document.querySelector('div.levelItem.at').setAttribute('data-level',Math.floor(songItem["atRanking"]));
		}
		songItemContainerElement.appendChild(songItemElement);
		//	创建难度元素
		var songItemLevelElement=document.createElement('div');
		songItemLevelElement.classList.add('level');
		songItemLevelElement.classList.add('ez');
		songItemLevelElement.setAttribute('data-level',Math.floor(songItem.ezRanking));
		songItemContainerElement.appendChild(songItemLevelElement);
	}
	//	设置默认难度
	window.levelChoosed=0;
	//	强行切换成第一首歌
	changeSong({"target": document.querySelector("div.songList#songList").children[0]});
	//	调整宽度/缩放
	document.querySelector('#rightArea').style.right=0.2*( document.body.clientHeight/document.body.clientWidth )*document.body.clientWidth;
	document.querySelector('#rightArea').setAttribute('style',"transform:skew(-15deg) scale("+window.innerHeight/400/Math.round(window.devicePixelRatio/2)+") !important;"+'right:'+0.2*( document.body.clientHeight/document.body.clientWidth )*document.body.clientWidth+'px');
	console.log('Resize:',document.querySelector('#rightArea').style.transform);
	console.log('Right:',document.querySelector('#rightArea').style.right);
	//	添加切歌事件
	var songItems=document.querySelector('div#songList').children;
	for (let i = 0; i < songItems.length; i++) {
		songItems[i]=document.querySelector('#illustration');
		songItems[i].addEventListener('click',(e)=>{
			changeSong(e);
		});
	}
	//	添加桌面端鼠标滚轮滚动
	document.body.addEventListener('wheel',(e)=>{
		console.log('Scrolling',e.wheelDeltaY);
		yCoord+=e.wheelDeltaY/8;
		document.querySelector("#songList").setAttribute('style','position: absolute;top:'+yCoord+'px')
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
		document.querySelector("#songList").setAttribute('style','position: absolute;top:'+yCoord+'px')
	});
	document.body.addEventListener('touchend',(e)=>{
		//	console.log(3)
		//	var touchYCoord=e.changedTouches["0"].clientY;
		//	console.log(previousTouchYCoord - touchYCoord);
		//	previousTouchYCoord=undefined;
	});
});
window.onresize=function(){
	document.querySelector('#rightArea').setAttribute('style',"transform:skew(-15deg) scale("+window.innerHeight/400/Math.round(window.devicePixelRatio/2)+") !important;"+'right:'+0.2*( document.body.clientHeight/document.body.clientWidth )*document.body.clientWidth+'px');
	console.log('Resize:',document.querySelector('div.rightArea').style.transform);
	console.log('Right:',document.querySelector('div.rightArea').style.right);
}
//	切歌
function changeSong(e) {
	var changeSongAudioElem=document.createElement('audio');
	changeSongAudioElem.src="../assets/audio/Tap5.wav";
	changeSongAudioElem.play();
	console.log(e);
	try {
		document.querySelector('div.songItemContainer.choosed').classList.remove('choosed');
		document.querySelector('div.songItem.choosed').classList.remove('choosed');
	} catch (e) {/*do nothing*/}
	e.target.parentElement.classList.add('choosed');
	e.target.classList.add('choosed');
	try {
		e.target.children[0].classList.add('choosed');
	} catch (e) {/*do nothing*/}
	var itemNum=0;
	itemNum = e.target.getAttribute('data-itemNum');
	if (itemNum==null) {
		itemNum = e.target.parentElement.getAttribute('data-itemNum');
	}
	console.log('Song',itemNum,"Choosed");
	document.children[0].setAttribute('style',`background: url(../charts/${window.songCodeNameList[itemNum]}/${window.songList[itemNum]["illustration"]}) center center no-repeat fixed;`);
	document.querySelector('img.illustration').src='../charts/'+window.songCodeNameList[itemNum]+'/'+songList[itemNum].illustration;
	document.querySelector('div.levelItem.ez').setAttribute('data-level',Math.floor(songList[itemNum]["ezRanking"]))
	document.querySelector('div.levelItem.hd').setAttribute('data-level',Math.floor(songList[itemNum]["hdRanking"]))
	document.querySelector('div.levelItem.in').setAttribute('data-level',Math.floor(songList[itemNum]["inRanking"]))
	document.querySelector('div.levelItem.at').setAttribute('data-level',Math.floor(songList[itemNum]["atRanking"]))
	document.querySelector('audio#slicedAudioElement').src='../charts/'+window.songCodeNameList[itemNum]+'/'+songList[itemNum]["musicFile"];
	clearInterval(window.sliceAudioInterval);
	window.sliceAudioInterval=setInterval(()=>{
		document.querySelector('audio#slicedAudioElement').currentTime=songList[itemNum]["sliceAudioStart"];
		document.querySelector('audio#slicedAudioElement').play();
	},songList[itemNum]["sliceAudioDuration"]*1000);
}
function batchChangeSongLevel(type) {
	const levelItemElements=document.querySelectorAll('div.songItemContainer>div.level');
	for (let i = 0; i < levelItemElements.length; i++) {
		const element = levelItemElements[i];
		element.classList.remove('ez');
		element.classList.remove('hd');
		element.classList.remove('in');
		element.classList.remove('at');
		element.classList.add(type);
		element.setAttribute('data-level',Math.floor(songList[i][type+"Ranking"]));
	}
}
function getSongMeta(songCodeName) {
	var getSongMetaXHR=new XMLHttpRequest();
	getSongMetaXHR.open('GET','../charts/'+songCodeName+"/meta.json",false);
	getSongMetaXHR.send();
	return JSON.parse(getSongMetaXHR.responseText);
}
function changeLevel() {
	const e = window.event || arguments.callee.caller.arguments[0];
	//	0S：原选中添加淡出
	document.querySelector('div.levelItem.choosed').classList.add('fadeOut');
	setTimeout(()=>{
		//	300ms后动画结束后移除选中样式，给后来选中的添加选中和淡入选择器
		document.querySelector('div.levelItem.choosed').classList.remove('choosed');
		e.target.classList.add('fadeIn');
		e.target.classList.add('choosed');
	},300);
	const levelStr=e.target.classList.toString();
	console.log(levelStr);
	//	批量切换所有难度
	if (levelStr.match('ez')) {
		window.levelChoosed=0;
		batchChangeSongLevel('ez');
	}
	if (levelStr.match('hd')) {
		window.levelChoosed=1;
		batchChangeSongLevel('hd');
	}
	if (levelStr.match('in')) {
		window.levelChoosed=2;
		batchChangeSongLevel('in');
	}
	if (levelStr.match('at')) {
		window.levelChoosed=3;
		batchChangeSongLevel('at');
	}
	//	最后把所有的fade选择器都删掉
	const fadeInElems=document.querySelectorAll('div.levelItem.fadeIn');
	for (let i = 0; i < fadeInElems.length; i++) {
		fadeInElems[i].classList.remove('fadeIn');
	}
	const fadeOutElems=document.querySelectorAll('div.levelItem.fadeOut');
	for (let i = 0; i < fadeInElems.length; i++) {
		fadeOutElems[i].classList.remove('fadeOut');
	}
}

function readyToLoadTrigger() {
	document.querySelector('#readyToLoadOverlay').classList.add('go');
	const playClickedSound=document.createElement('audio');
	playClickedSound.src='../assets/audio/Tap7.wav';
	playClickedSound.play();
	setTimeout(()=>{
		location.href="../whilePlaying/index.html?play="+document.querySelector('div.songItem.choosed').getAttribute('data-codename')+"&l="+window.levelChoosed+'&c='+chapterName;
	},2000);
}