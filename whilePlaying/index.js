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
	document.getElementById('backBtn').addEventListener('click',()=>{
		document.querySelector('#tap2').play();
		setTimeout(() => {
			location.href=`../songSelect/index.html?c=${new URLSearchParams(new URL(location.href).search).get('c')}`
		}, 500);
	});
	// var script = document.createElement('script'); 
	// script.src="//cdn.jsdelivr.net/npm/eruda"; 
	// document.body.appendChild(script); 
	// script.onload = function () { eruda.init() };

	//	获取游玩谱面和难度信息
	const play  = new URLSearchParams(new URL(location.href).search).get('play');
	var level  = new URLSearchParams(new URL(location.href).search).get('l');
	//	添加加载页面覆盖层
	let loadingEmbedFrame=document.createElement('iframe');
	loadingEmbedFrame.src="../loadingChartScreen/index.html?c="+play+"&l="+level;
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
		if (LoadCompleteItems==12&&window.ResourcesLoad==200) {
			loadingEmbedFrame.remove();
			clearInterval(loadCompleteDetectInterval);
		}
	});
	
	//	获取元数据
	console.log('Fetching MetaData:',play);
	var chartMetaXHR=new XMLHttpRequest();
	chartMetaXHR.open('GET','../charts/'+play+'/meta.json',false);
	chartMetaXHR.send();
	window.chartMetadata=JSON.parse(chartMetaXHR.responseText);
	document.getElementById("input-name").value=chartMetadata.name;	//歌名
	document.getElementById("input-level").value=level.toUpperCase()+" Lv."+chartMetadata[ level.toLowerCase()+'Ranking'];	//难度
	document.getElementById("input-designer").value=chartMetadata.chartDesigner;	//普师
	document.getElementById("input-illustrator").value=chartMetadata.illustrator;	//曲绘

	//	获取谱面
	console.log('Fetching Chart:',play);
	var chartXHR=new XMLHttpRequest();
	chartXHR.open('GET','../charts/'+play+"/"+chartMetadata["chart"+level.toUpperCase()],true);
	chartXHR.send();
	chartXHR.addEventListener('load',()=>{
		window.chartString=chartXHR.responseText;
		try {
			window.Renderer.chart=JSON.parse(chartXHR.responseText);
		} catch (error) {
			//	JSON解析出错了就换PEC解析（
			window.Renderer.chart=chart123(chartp23(chartXHR.responseText, undefined));
		}
		// prerenderChart(window.Renderer.chart);
	});

	//	获取曲绘
	console.log('Fetching illustration:',chartMetadata["illustration"]);
	document.body.setAttribute('style','background: url('+'../charts/'+chartMetadata["codename"]+"/"+chartMetadata['illustration']+') center center no-repeat;');
	fetch('../charts/'+chartMetadata["codename"]+"/"+chartMetadata["illustration"]).then(response => {
		response.blob().then(blob => {
			createImageBitmap(blob).then(img => {
				window.Renderer.bgImage=img;
				createImageBitmap(imgBlur(img)).then(imgBlur=>{
						window.Renderer.bgImageBlur=imgBlur;
					}
				);
			});
		});
	});
	//	判定线贴图
	window.chartLine=[];
	window.chartLineData=[];
	window.chartLineTextureDecoded = new Array(window.chartLine.length);

	if (chartMetadata.lineTexture) {
		console.log("Line Texture Detected");
		var chartLineDataXHR = new XMLHttpRequest();
		chartLineDataXHR.open(
			"GET",
			"../charts/" +
				chartMetadata["codename"] +
				"/" +
				chartMetadata["lineTexture"],
			false
		);
		chartLineDataXHR.send();
		window.chartLineData = JSON.parse(chartLineDataXHR.responseText);
		window.chartLine = JSON.parse(chartLineDataXHR.responseText);
		window.chartLineTextureDecoded = new Array(window.chartLine.length);
		for (let i = 0; i < window.chartLine.length; i++) {
			console.log(
				"Fetching chart line texture:",
				"../charts/" +
					chartMetadata["codename"] +
					"/" +
					chartLine[i].Image.toString()
			);
			fetch(
				"../charts/" +
					chartMetadata["codename"] +
					"/" +
					chartLine[i].Image.toString()
			).then((response) => {
				response.blob().then((blob) => {
					createImageBitmap(blob).then((img) => {
						window.chartLineTextureDecoded[i] = img;
						window.bgs[chartLine[i].Image.toString()] = img;
					});
				});
			});
		}
	}
	//	获取图片并写入对象bgs
	window.bgs={};
	//	获取歌曲
	console.log('Fetching Audio:',chartMetadata["musicFile"]);
	fetch('../charts/'+chartMetadata["codename"]+"/"+chartMetadata["musicFile"]).then(response => {
		response.arrayBuffer().then(arrayBuffer => {
			actx.decodeAudioData(arrayBuffer).then(audioBuff=>{
				window.Renderer.bgMusic=audioBuff;
			});
		});
	});
	var tapToStartFrame=document.createElement('div');
	tapToStartFrame.classList.add('tapToStartFrame');
	tapToStartFrame.innerHTML=`
	<div class="songName">${chartMetadata.name}</div>
	<div class="judgeLine"></div>
	<div class="detail">
		Illustration designed by ${chartMetadata.chartDesigner} <br />
		Level designed by ${chartMetadata.illustrator}
	</div>
	<div style="display:flex;flex-direction:row;">点按以开始<div style="color:#6cf;" onclick="alert('移动端浏览器禁止了无手势自动播放音频，所以我们需要你的手势来开始播放音频并全屏网页')"> 为什么？ </div></div>
	`
	tapToStartFrame.addEventListener('click',()=>{
		var LoadCompleteItems=0;
		for ( i in Renderer){
			if(Renderer[i]!=undefined){
				LoadCompleteItems++;
			}
		}
		if (LoadCompleteItems==12&&window.ResourcesLoad==200) {
			tapToStartFrame.remove();
			if (localStorage.autoFullscreen=='true') {
				full.toggle();	
			}
			document.getElementById('btn-play').click();	
		}else{
			console.log("LoadNotComplete");
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
					elem.removeAttribute('checked')
				}
				continue;
			}
			if (elem.type=='text'||elem.type=='number') {
				elem.setAttribute('value',value);
				continue
			}
			if (elem.type='select-one') {
				for (let j = 0; j < elem.children.length; j++) {
					// console.log(elem.children[j].getAttribute("selected"))
					// 先遍历删掉原来的选项
					if (elem.children[j].getAttribute("selected")!=null) {
						elem.children[j].removeAttribute("selected")
					}
					
				}
				// console.log(elem)
				// console.log(elem.children[parseFloat(value)-1])
				elem.children[parseFloat(value)-1].setAttribute('selected','true');
				continue;
			}
		} catch (error) {
			console.warn('Error occured when applying settings \''+key+'\':\n',error)
		}
	}
	document.body.appendChild(tapToStartFrame);
});

function replay() {
	document
		.querySelector("div#pauseOverlay.pauseOverlay")
		.classList.remove("visable");
	btnPlay.click();
	try {
		window.Renderer.chart = chart123(
			chartp23(window.chartString, undefined)
		);
	} catch (e) {}
	btnPlay.click();
}
document.getElementById('btn-play').addEventListener("click", async function () {
	Renderer=window.Renderer;
	btnPause.value = "暂停";
	if (this.value == "播放") {
		stopPlaying.push(playSound(res["mute"], true, false, 0)); //播放空音频(防止音画不同步)
		("lines,notes,taps,drags,flicks,holds,reverseholds,tapholds").split(",").map(i => Renderer[i] = []);
		// Renderer.chart = prerenderChart(charts[selectchart.value]); //fuckqwq
		Renderer.chart = prerenderChart(window.Renderer.chart); //fuckqwq
		stat.reset(Renderer.chart.numOfNotes, Renderer.chart.md5);
		for (let j = 0; j < window.chartLineData.length; j++) {
		// }
		// for (var i of window.chartLineData) {
			i = window.chartLineData[j];
			if (true) {
			// if (selectchart.value == i.Chart) {
				console.log(window.chartLineData.indexOf(i));
				Renderer.chart.judgeLineList[i.LineId].image=new Array();
				Renderer.chart.judgeLineList[i.LineId].images[0] = bgs[i.Image];
				Renderer.chart.judgeLineList[i.LineId].images[1] = await createImageBitmap(imgShader(bgs[i.Image], "#feffa9"));
				Renderer.chart.judgeLineList[i.LineId].images[2] = await createImageBitmap(imgShader(bgs[i.Image], "#a3ffac"));
				Renderer.chart.judgeLineList[i.LineId].images[3] = await createImageBitmap(imgShader(bgs[i.Image], "#a2eeff"));
				Renderer.chart.judgeLineList[i.LineId].imageH = Number(i.Vert);
				Renderer.chart.judgeLineList[i.LineId].imageW = Number(i.Horz);
				Renderer.chart.judgeLineList[i.LineId].imageB = Number(i.IsDark);
			}
		}
		// Renderer.bgImage = bgs[selectbg.value] || res["NoImage"];
		// Renderer.bgImageBlur = bgsBlur[selectbg.value] || res["NoImage"];
		// Renderer.bgMusic = bgms[selectbgm.value];
		resizeCanvas();
		console.log(Renderer)
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
		this.value = "停止";
	} else {
		while (stopPlaying.length) stopPlaying.shift()();
		cancelAnimationFrame(stopDrawing);
		// resizeCanvas();
		// canvas.classList.add("fade");
		// mask.classList.remove("fade");
		for (const i of document.querySelectorAll(".disabled-when-playing")) i.classList.remove("disabled");
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
		this.value = "播放";
	}
	// window.LevelOverTimeOut=
	// 	setTimeout(()=>{
	// 		// location.href=`../levelOver/index.html?play=sample&l=${new URLSearchParams(new URL(location.href).search).get('l')}&score=${stat.scoreStr}&mc=${stat.maxcombo}&p=${stat.perfect}&g=${stat.good}&b=${stat.bad}&e=${stat.noteRank[7]}&m=${stat.noteRank[2]}`;
	// 	},(Renderer.bgMusic.duration-actx.currentTime)*1000+3500);
});