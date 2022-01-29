
import { gameLevels } from "../constants.js";

window.addEventListener('DOMContentLoaded',()=>{
	document.querySelector('div#avatarBar').addEventListener('click',(e)=>{
		var _element=e.target;
		if (_element.classList.toString().match('avatarBar')==null) {
			_element=e.target.parentElement;
		}
		if (_element.classList.toString().match('expand')) {
			_element.classList.remove('expand');
		} else {
			_element.classList.add('expand');
		}
	});
	if (window.localStorage.getItem('playerName')!=null) {
		console.log('Setting player name: ', window.localStorage.getItem('playerName'));
		document.querySelector('div#avatarBar').setAttribute('data-name',window.localStorage.getItem('playerName'));
	}
	resize('div.mainContent');
	resize('body > div.extraInfo','skew(-15deg)');
	const urlParams=new URL(location.href).search;
	const parsedURLParams=new URLSearchParams(urlParams)
	//	获取各种数据
	const play=parsedURLParams.get('play');
	const playLevel=gameLevels[parsedURLParams.get('l')];
	const playLevelString=parsedURLParams.get('l');
	const score=parseInt(parsedURLParams.get('score'));
	// const score=
	const maxCombo=parsedURLParams.get('mc');
	const perFect=parsedURLParams.get('p');
	const good=parsedURLParams.get('g');
	const bad=parsedURLParams.get('b');
	const miss=parsedURLParams.get('m');
	const early=parsedURLParams.get('e');
	const accuracy=Math.round((parseInt(perFect)+parseInt(good)*0.65)/(parseInt(perFect)+parseInt(good)+parseInt(bad)+parseInt(miss)+0)*10000)/100;
	const late=good-early;
	var grade;
	document.getElementById('retryBtn').addEventListener('click',()=>{
		location.href='../whilePlaying/index.html?play='+play+'&l='+playLevelString+'&c='+parsedURLParams.get('c');
	});
	document.getElementById('backBtn').addEventListener('click',()=>{
		location.href='../songSelect/index.html?c='+parsedURLParams.get('c');
	})
	//	判断等级（范围来自萌娘百科）
	if (score==0) {
		console.log('No grade');
		grade='';
	}
	if (score<699999&&score!=0) {
		console.log('Grade: False');
		grade='F15F';
	}
	if (700000<=score&&score<=819999) {
			console.log('Grade:C');
			grade='C15C';
	}
	if (820000<=score&&score<=879999) {
			console.log('Grade:B');
			grade='B15B';
	}
	if (880000<=score&&score<=919999) {
			console.log('Grade:A');
			grade='A15A';
	}
	if (920000<=score&&score<=959999) {
			console.log('Grade:S');
			grade='S15S';
	}
	if (960000<=score&&score<=999999) {
			console.log('Grade:V');
			grade='V15V';
	}
	if (bad==0&&miss==0) {
		console.log("Grade: V wih Full Combo")
		grade='V15FC'
	}
	if (1000000<=score) {
			console.log('Grade:Phi');
			grade='phi15phi';
	}
	// switch (score) {
	// 	default:
	// 		console.log('Error, Fallback to False');
	// 		grade='F15F';
	// 		break;
	// }
	// gradeImage
	//	获取歌曲信息
	var songInfoXHR=new XMLHttpRequest();
	songInfoXHR.open('GET',"https://charts.pgr.han-han.xyz/"+play+"/meta.json",false);
	songInfoXHR.send();
	window.playResult={
		"score":score,
		"grade": grade,
		"play":play,
		"playLevel":playLevel,
		"songInfo":JSON.parse(songInfoXHR.responseText),
		"maxCombo":maxCombo,
		"accuracy":accuracy,
		"perFect":perFect,
		"good":good,
		"bad":bad,
		"miss":miss,
		"early":early,
		"late":late,
		"playLevelString": playLevelString
	}
	console.log(playResult);
	//	操作DOM修改可见部分数据
	document.querySelector("#levelOverAudio").setAttribute('src',"./LevelOver"+playLevel+".ogg");
	document.querySelector("#levelOverAudio").play();
	document.body.setAttribute('style',`background:url(https://charts.pgr.han-han.xyz/${playResult.play}/${playResult.songInfo.illustration}) center center no-repeat;`);
	document.querySelector("#songImg").setAttribute("src","https://charts.pgr.han-han.xyz/"+play+"/"+playResult.songInfo.illustration.replaceAll('#',"%23"));
	document.querySelector("#score").innerText=score.toString().padStart(7,'0');;
	document.querySelector('#gradeImage').src='../assets/images/'+grade+'.png';
	document.querySelector("#maxCombo").innerText=maxCombo;
	document.querySelector("#accuracy").innerText=accuracy+"%";
	document.querySelector("#perfect").innerText=perFect;
	document.querySelector("#good").innerText=good;
	document.querySelector("#bad").innerText=bad;
	document.querySelector("#miss").innerText=miss;
	document.querySelector("#early").innerText=early;
	document.querySelector("#late").innerText=late;
	document.querySelector('div.songName#songName').innerText=playResult.songInfo.name;
	document.querySelector('div.levelString#levelString').innerText=playResult.playLevelString.toUpperCase()+' Lv.'+Math.floor(playResult.songInfo[playResult.playLevelString.toLowerCase()+'Ranking']);
	// 加载歌曲元信息（计算RKS等）
	var deltaRKS,deltaData;
	if(playResult.accuracy>=70){
		deltaRKS= (Math.pow(((playResult.accuracy-55)/45),2)*playResult.songInfo[playResult.playLevelString.toLowerCase()+'Ranking']).toFixed(2);
	}else{
		deltaRKS=0
	}
	if (playResult.score<880000) {
		deltaData=0
	}
	document.querySelector("#rks").innerText=deltaRKS;
	console.log('ΔRKS:',deltaRKS);
	console.log('ΔData(KB):',deltaData);
});
window.onresize=function(){
	//	自动缩放
	resize('div.mainContent');
	resize('body > div.extraInfo','skew(-15deg)');
}
function resize(selector,transformDefaultString) {
	// document.body.querySelector(selector).style.transform="scale("+window.outerHeight/600+transformDefaultString+")";
	// console.log('Resize:',document.body.querySelector(selector).style.transform);
}