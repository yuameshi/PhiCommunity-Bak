/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
Renderer = { //存放谱面
	chart: null,
	bgImage: null,
	bgImageBlur: null,
	bgMusic: null,
	lines: [],
	notes: [],
	taps: [],
	drags: [],
	flicks: [],
	holds: [],
	reverseholds: [],
	tapholds: []
};
qwq=[];
var chartLine,chartLineData;
window.addEventListener('DOMContentLoaded',()=>{
	loadPhiCommunityResources();
	document.getElementById('backInPlayingBtn').addEventListener('click',()=>{
		const playExitSoundXHR=new XMLHttpRequest();
		playExitSoundXHR.open('GET', '../assets/audio/Exit.mp3', true);
		playExitSoundXHR.responseType = 'arraybuffer';
		playExitSoundXHR.onload = function() {
			const actx= new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext);
			actx.decodeAudioData(this.response, function(buffer) {
				let source = actx.createBufferSource();
				source.buffer = buffer;
				source.connect(actx.destination);
				source.start(0);
			});
		};
		playExitSoundXHR.send();
		setTimeout(() => {
			location.href=`../songSelect/index.html?c=${new URLSearchParams(new URL(location.href).search).get('c')}`;
		}, 500);
	});
	//	获取游玩谱面和难度信息
	const play  = new URLSearchParams(new URL(location.href).search).get('play');
	var level  = new URLSearchParams(new URL(location.href).search).get('l');
	//	添加加载页面覆盖层
	let loadingEmbedFrame=document.createElement('iframe');
	loadingEmbedFrame.src='../loadingChartScreen/index.html?c='+play+'&l='+level;
	loadingEmbedFrame.classList.add('loadingEmbedFrame');
	document.body.appendChild(loadingEmbedFrame);
	//	不断检测直到加载完成
	var loadCompleteDetectInterval=setInterval(()=>{
		var LoadCompleteItems=0;
		for ( i in Renderer){
			if(Renderer[i]!=undefined){
				LoadCompleteItems++;
			}
		}
		if (LoadCompleteItems==12&&window.ResourcesLoad>=100) {
			loadingEmbedFrame.remove();
			clearInterval(loadCompleteDetectInterval);
		}
	});
	
	//	获取元数据
	console.log('Fetching MetaData:',play);
	var chartMetaXHR=new XMLHttpRequest();
	chartMetaXHR.open('GET','https://charts.phi.han-han.xyz/'+play+'/meta.json',true);
	chartMetaXHR.addEventListener('error',()=>{
		alert('谱面信息获取失败！');
	});
	chartMetaXHR.addEventListener('load',()=>{
		window.chartMetadata=JSON.parse(chartMetaXHR.responseText);
		document.getElementById('input-name').value=chartMetadata.name;	//歌名
		document.getElementById('input-level').value=level.toUpperCase()+' Lv.'+Math.floor(chartMetadata[level.toLowerCase()+'Ranking']||0);	//难度
		var chartDesigner;
		if(chartMetadata.chartDesigner!=undefined){	//谱面设计者
			chartDesigner=chartMetadata.chartDesigner;
		}else{
			chartDesigner=chartMetadata[level+'ChartDesigner'];
		}
		document.getElementById('input-designer').value=chartDesigner;
		document.getElementById('input-illustrator').value=chartMetadata.illustrator;	//曲绘
		//	获取谱面
		console.log('Fetching Chart:',play);
		var chartXHR=new XMLHttpRequest();
		chartXHR.open('GET','https://charts.phi.han-han.xyz/'+play+'/'+chartMetadata['chart'+level.toUpperCase()],true);
		chartXHR.addEventListener('load',()=>{
			window.chartString=chartXHR.responseText;
			try {
				window.Renderer.chart=chart123(JSON.parse(chartXHR.responseText));
			} catch (error) {
				//	JSON解析出错了就换PEC解析（
				window.Renderer.chart=chart123(chartp23(chartXHR.responseText, undefined));
			}
			// prerenderChart(window.Renderer.chart);
		});
		chartXHR.addEventListener('error',()=>{
			alert('谱面获取失败！');
		});
		chartXHR.send();
	
		//	获取曲绘
		console.log('Fetching illustration:',chartMetadata['illustration']);
		document.body.setAttribute('style','--background: url('+encodeURI('https://charts.phi.han-han.xyz/'+chartMetadata['codename']+'/'+chartMetadata['illustration'])+')');
		fetch('https://charts.phi.han-han.xyz/'+chartMetadata['codename']+'/'+chartMetadata['illustration']).then(response => {
			response.blob().then(blob => {
				createImageBitmap(blob).then(img => {
					window.Renderer.bgImage=img;
					createImageBitmap(imgBlur(img)).then(imgBlur=>{
						window.Renderer.bgImageBlur=imgBlur;
					}
					);
				});
			});
		})
			.catch(error => {
				alert('无法获取曲绘，原因是：\n'+error);
			});
		//	判定线贴图
		window.chartLine=[];
		window.chartLineData=[];
		window.chartLineTextureDecoded = new Array(window.chartLine.length);
	
		if (chartMetadata.lineTexture) {
			console.log('Line Texture Detected');
			var chartLineDataXHR = new XMLHttpRequest();
			chartLineDataXHR.open(
				'GET',
				'https://charts.phi.han-han.xyz/' +
					chartMetadata['codename'] +
					'/' +
					chartMetadata['lineTexture'],
				true
			);
			chartLineDataXHR.addEventListener('error',()=>{
				alert('判定线贴图获取失败！');
			});
			chartLineDataXHR.addEventListener('load',()=>{
				window.chartLineData = JSON.parse(chartLineDataXHR.responseText);
				window.chartLine = JSON.parse(chartLineDataXHR.responseText);
				window.chartLineTextureDecoded = new Array(window.chartLine.length);
				for (let i = 0; i < window.chartLine.length; i++) {
					console.log(
						'Fetching chart line texture:',
						'https://charts.phi.han-han.xyz/' +
							chartMetadata['codename'] +
							'/' +
							chartLine[i].Image.toString()
					);
					fetch(
						'https://charts.phi.han-han.xyz/' +
							chartMetadata['codename'] +
							'/' +
							chartLine[i].Image.toString()
					).then((response) => {
						response.blob().then((blob) => {
							createImageBitmap(blob).then((img) => {
								window.chartLineTextureDecoded[i] = img;
								window.bgs[chartLine[i].Image.toString()] = img;
							});
						});
					}).catch((error) => {
						alert('无法获取判定线贴图#'+i.toString()+'，原因是：\n'+error);
					});
				}
			});
			chartLineDataXHR.send();
		}
		//	获取图片并写入对象bgs
		window.bgs={};
		//	获取歌曲
		console.log('Fetching Audio:',chartMetadata['musicFile']);
		fetch('https://charts.phi.han-han.xyz/'+chartMetadata['codename']+'/'+chartMetadata['musicFile']).then(response => {
			response.arrayBuffer().then(arrayBuffer => {
				actx.decodeAudioData(arrayBuffer).then(audioBuff=>{
					window.Renderer.bgMusic=audioBuff;
				});
			});
		})
			.catch(error => {
				alert('无法获取歌曲，原因是：\n'+error);
			});
		var tapToStartFrame=document.createElement('div');
		tapToStartFrame.classList.add('tapToStartFrame');
		tapToStartFrame.innerHTML=`
		<div class="songName">${chartMetadata.name}</div>
		<div class="judgeLine"></div>
		<div class="detail">
			Illustration designed by ${chartMetadata.illustrator} <br />
			Level designed by ${chartDesigner}
		</div>
		<div style="display:flex;flex-direction:row;">点按以开始 <div style="color:#6cf;" onclick="alert('移动端浏览器禁止了无手势自动播放音频，所以我们需要你的手势来开始播放音频并全屏网页')"> 为什么？ </div></div>
		`;
		tapToStartFrame.addEventListener('click',()=>{
			var LoadCompleteItems=0;
			for ( i in Renderer){
				if(Renderer[i]!=undefined){
					LoadCompleteItems++;
				}
			}
			if (LoadCompleteItems==12&&window.ResourcesLoad>=100) {
				tapToStartFrame.remove();
				if (localStorage.autoFullscreen!='false') {
					full.toggle();	
				}
				document.getElementById('btn-play').click();	
			}else{
				console.log('LoadNotComplete');
			}
		});
		// 应用设置
		for (let i = 0; i < Object.keys(localStorage).length; i++) {
			const key=Object.keys(localStorage)[i];
			const value = localStorage[Object.keys(localStorage)[i]];
			if (key=='phi') {
				continue;
			}
			if (key.match('eruda')) {
				continue;
			}
			console.log('Applying settings:',key,value);
			const elem=document.querySelector('#'+key);
			try {
				// console.log(elem.type);
				if (elem.type=='checkbox') {
					if (value=='true') {
						elem.setAttribute('checked',value);
					}else{
						elem.removeAttribute('checked');
					}
					continue;
				}
				if (elem.type=='text'||elem.type=='number') {
					elem.setAttribute('value',value);
					continue;
				}
				if (elem.type=='select-one') {
					for (let j = 0; j < elem.children.length; j++) {
						// console.log(elem.children[j].getAttribute("selected"))
						// 先遍历删掉原来的选项
						if (elem.children[j].getAttribute('selected')!=null) {
							elem.children[j].removeAttribute('selected');
						}
						
					}
					// console.log(elem)
					// console.log(elem.children[parseFloat(value)-1])
					elem.children[parseFloat(value)-1].setAttribute('selected','true');
					continue;
				}
			} catch (error) {
				console.warn('Error occured when applying settings \''+key+'\':\n',error);
			}
		}
		if (window.localStorage.getItem('useOldUI')=='true') {
			document.body.setAttribute('style','background: #000 !important;');
			document.querySelector('#select-global-alpha').children[0].selected=true;
		}
		document.body.appendChild(tapToStartFrame);
	});
	chartMetaXHR.send();
});

function replay() {
	document
		.querySelector('div#pauseOverlay.pauseOverlay')
		.classList.remove('visable');
	btnPlay.click();
	try {
		window.Renderer.chart=chart123(JSON.parse(window.chartString));
	} catch (e) {
		window.Renderer.chart=chart123(chartp23(window.chartString, undefined));
	}
	btnPlay.click();
}
document.getElementById('btn-play').addEventListener('click', async function () {
	Renderer=window.Renderer;
	btnPause.value = '暂停';
	if (this.value == '播放') {
		stopPlaying.push(playSound(res['mute'], true, false, 0)); //播放空音频(防止音画不同步)
		('lines,notes,taps,drags,flicks,holds,reverseholds,tapholds').split(',').map(i => Renderer[i] = []);
		// Renderer.chart = prerenderChart(charts[selectchart.value]); //fuckqwq
		Renderer.chart = prerenderChart(window.Renderer.chart); //fuckqwq
		stat.reset(Renderer.chart.numOfNotes, Renderer.chart.md5);
		for (let j = 0; j < window.chartLineData.length; j++) {
		// }
		// for (var i of window.chartLineData) {
			i = window.chartLineData[j];
			// if (selectchart.value == i.Chart) {
			console.log(window.chartLineData.indexOf(i));
			Renderer.chart.judgeLineList[i.LineId].image=new Array();
			Renderer.chart.judgeLineList[i.LineId].images[0] = bgs[i.Image];
			Renderer.chart.judgeLineList[i.LineId].images[1] = await createImageBitmap(imgShader(bgs[i.Image], '#feffa9'));
			Renderer.chart.judgeLineList[i.LineId].images[2] = await createImageBitmap(imgShader(bgs[i.Image], '#a3ffac'));
			Renderer.chart.judgeLineList[i.LineId].images[3] = await createImageBitmap(imgShader(bgs[i.Image], '#a2eeff'));
			Renderer.chart.judgeLineList[i.LineId].imageH = Number(i.Vert);
			Renderer.chart.judgeLineList[i.LineId].imageW = Number(i.Horz);
			Renderer.chart.judgeLineList[i.LineId].imageB = Number(i.IsDark);
			// }
		}
		// Renderer.bgImage = bgs[selectbg.value] || res["NoImage"];
		// Renderer.bgImageBlur = bgsBlur[selectbg.value] || res["NoImage"];
		// Renderer.bgMusic = bgms[selectbgm.value];
		resizeCanvas();
		console.log(Renderer);
		duration = Renderer.bgMusic.duration;
		isInEnd = false;
		isOutStart = false;
		isOutEnd = false;
		isPaused = false;
		timeBgm = 0;
		if (!showTransition.checked) qwqIn.addTime(3000);
		// canvas.classList.remove("fade");
		// mask.classList.add("fade");
		// btnPause.classList.remove("disabled");
		// for (const i of document.querySelectorAll(".disabled-when-playing")) i.classList.add("disabled");
		loop();
		qwqIn.play();
		this.value = '停止';
	} else {
		while (stopPlaying.length) stopPlaying.shift()();
		cancelAnimationFrame(stopDrawing);
		// resizeCanvas();
		// canvas.classList.add("fade");
		// mask.classList.remove("fade");
		for (const i of document.querySelectorAll('.disabled-when-playing')) i.classList.remove('disabled');
		// btnPause.classList.add("disabled");
		//清除原有数据
		fucktemp = false;
		fucktemp2 = false;
		clickEvents0.length = 0;
		clickEvents1.length = 0;
		qwqIn.reset();
		qwqOut.reset();
		qwqEnd.reset();
		curTime = 0;
		curTimestamp = 0;
		duration = 0;
		this.value = '播放';
	}
});

function getRks() {
	if(stat.accNum>=0.7){
		return (Math.pow(((stat.accNum*100-55)/45),2)*chartMetadata[new URLSearchParams(new URL(location.href).search).get('l').toLowerCase()+'Ranking']).toFixed(2);
	}else{
		return 0;
	}
}
document.addEventListener('visibilitychange', () => document.visibilityState == 'hidden' && btnPause.value == '暂停' && btnPause.click());
async function loadPhiCommunityResources() {
	const loadItems={
		JudgeLine: 'assets/JudgeLine.png',
		ProgressBar: 'assets/ProgressBar.png',
		SongsNameBar: 'assets/SongNameBar.png',
		Pause: 'assets/Pause.png',
		clickRaw: 'assets/clickRaw.png',
		Tap: 'assets/Tap.png',
		Tap2: 'assets/Tap2.png',
		TapHL: 'assets/TapHL.png',
		Drag: 'assets/Drag.png',
		DragHL: 'assets/DragHL.png',
		HoldHead: 'assets/HoldHead.png',
		HoldHeadHL: 'assets/HoldHeadHL.png',
		Hold: 'assets/Hold.png',
		HoldHL: 'assets/HoldHL.png',
		HoldEnd: 'assets/HoldEnd.png',
		Flick: 'assets/Flick.png',
		FlickHL: 'assets/FlickHL.png',
		NoImage: 'assets/0.png',
		mute: 'assets/mute.ogg',
		HitSong0: 'assets/Tap.ogg',
		HitSong1: 'assets/Drag.ogg',
		HitSong2: 'assets/Flick.ogg'
	};
	if (localStorage.getItem('usePlayerFriendlyUI')=='true') {
		loadItems.FlickHL='assets/playerFirendlyNote/FlickHL.png';
		loadItems.HoldHL='assets/playerFirendlyNote/HoldHL.png';
		loadItems.HoldHeadHL='assets/playerFirendlyNote/HoldHeadHL.png';
		loadItems.TapHL='assets/playerFirendlyNote/TapHL.png';
	}
	if (localStorage.getItem('useOldUI')=='true') {
		loadItems.clickRaw='assets/oldui/clickRaw.png';
		loadItems.Drag='assets/oldui/Drag.png';
		loadItems.DragHL='assets/oldui/Drag2HL.png';
		loadItems.Flick='assets/oldui/Flick.png';
		loadItems.FlickHL='assets/oldui/Flick2HL.png';
		loadItems.Hold='assets/oldui/HoldBody.png';
		loadItems.HoldHL='assets/oldui/HoldBody.png';
		loadItems.HoldHead='assets/oldui/Tap.png';
		loadItems.HoldHeadHL='assets/oldui/Tap2HL.png';
		loadItems.HoldEnd='assets/oldui/HoldEnd.png';
		loadItems.Tap='assets/oldui/Tap.png';
		loadItems.Tap2='assets/oldui/Tap2.png';
		loadItems.TapHL='assets/oldui/Tap2HL.png';
	}
	let loadedNum = 0;
	await Promise.all((obj => {
		const arr = [];
		for (const i in obj) arr.push([i, obj[i]]);
		return arr;
	})(loadItems).map(([name, src], _i, arr) => {
		const xhr = new XMLHttpRequest();
		xhr.open('get', src, true);
		xhr.responseType = 'arraybuffer';
		xhr.addEventListener('error',()=>{
			alert('内部资源加载失败，请刷新页面重试');
		});
		xhr.send();
		return new Promise(resolve => {
			xhr.onload = async () => {
				if (/\.(mp3|wav|ogg)$/i.test(src)) res[name] = await actx.decodeAudioData(xhr.response);
				else if (/\.(png|jpeg|jpg)$|data:image\//i.test(src)) res[name] = await createImageBitmap(new Blob([xhr.response]));
				window.ResourcesLoad=Math.floor(++loadedNum / arr.length * 100);
				message.sendMessage(`加载资源：${window.ResourcesLoad}%`);
				resolve();
			};
		});
	}));
	res['JudgeLineMP'] = await createImageBitmap(imgShader(res['JudgeLine'], '#feffa9'));
	res['JudgeLineAP'] = await createImageBitmap(imgShader(res['JudgeLine'], '#a3ffac'));
	res['JudgeLineFC'] = await createImageBitmap(imgShader(res['JudgeLine'], '#a2eeff'));
	res['TapBad'] = await createImageBitmap(imgShader(res['Tap2'], '#6c4343'));
	res['Clicks'] = {};
	//res["Clicks"].default = await qwqImage(res["clickRaw"], "white");
	// res["Ranks"] = await qwqImage(res["Rank"], "white");
	if (localStorage.getItem('useOldUI')=='true') {
		res['Clicks']['rgba(255,236,160,0.8823529)'] = await qwqImage(res['clickRaw'], 'rgba(232, 148, 101,0.8823529)');	//#e89465e1
		res['Clicks']['rgba(168,255,177,0.9016907)'] = await qwqImage(res['clickRaw'], 'rgba(123, 193, 253,0.9215686)');	//#7bc1fdeb
		res['Clicks']['rgba(180,225,255,0.9215686)'] = await qwqImage(res['clickRaw'], 'rgba(123, 193, 253,0.9215686)');	//#7bc1fdeb
	}else{
		res['Clicks']['rgba(255,236,160,0.8823529)'] = await qwqImage(res['clickRaw'], 'rgba(255,236,160,0.8823529)'); //#fce491
		res['Clicks']['rgba(168,255,177,0.9016907)'] = await qwqImage(res['clickRaw'], 'rgba(168,255,177,0.9016907)'); //#97f79d
		res['Clicks']['rgba(180,225,255,0.9215686)'] = await qwqImage(res['clickRaw'], 'rgba(180,225,255,0.9215686)'); //#9ed5f3
	}
	message.sendMessage('核心资源加载完成!');
}