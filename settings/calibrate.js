document.querySelector('button#startBtn').addEventListener('click', function() {
	document.querySelector('button#startBtn').setAttribute("disabled", "disabled");
	document.querySelector("#audio").play();
	document.querySelector("#audio").currentTime=0;
	window.startTime = (new Date).valueOf();
	document.querySelector('button#clickBtn').addEventListener('click', calibrate);
	document.querySelector('#audio').addEventListener('ended', function() {
		document.querySelector('button#startBtn').removeAttribute("disabled");
		document.querySelector('button#clickBtn').removeEventListener('click', calibrate);
	});
});
document.body.addEventListener('keydown',()=>{
	document.querySelector('button#clickBtn').click();
});
function calibrate(e) {
	console.log(e);
	const audio=document.querySelector("#audio");
	// console.log((new Date).valueOf());
	var stage=1;
	if(audio.currentTime>0&&audio.currentTime<=2) {
		console.log('Calibration stage 1');
		stage=1;
	}
	if(audio.currentTime>2&&audio.currentTime<=4) {
		console.log('Calibration stage 2');
		stage=2;
	}
	if(audio.currentTime>4&&audio.currentTime<=6) {
		console.log('Calibration stage 3');
		stage=3;
	}
	if(audio.currentTime>6&&audio.currentTime<=8) {
		console.log('Calibration stage 4');
		stage=4;
	}
	const result=document.querySelector("#result"+stage);
	var deviceOffset=1000;
	if (e.pointerType=="touch") {
		deviceOffset=750;
	}
	result.innerText=(new Date).valueOf() - window.startTime - stage*2000 + deviceOffset;
}
document.querySelector('button#cancelBtn').addEventListener('click', function() {
	console.log('canceled');
	document.querySelector('button#startBtn').removeAttribute("disabled");
	document.querySelector('button#clickBtn').removeEventListener('click', calibrate);
	document.querySelector("#audio").pause();
	const result1=parseFloat(document.querySelector('#result1').innerText.replace('-','-0'));
	const result2=parseFloat(document.querySelector('#result2').innerText.replace('-','-0'));
	const result3=parseFloat(document.querySelector('#result3').innerText.replace('-','-0'));
	const result4=parseFloat(document.querySelector('#result4').innerText.replace('-','-0'));
	const finalResult=Math.round((result1+result2+result3+result4)/4);
	const result=confirm('谱面延时即将被设置为 '+finalResult+' ，是否确认？\n单击“取消”为继续而不保存');
	if(result) {
		localStorage.setItem('input-offset',finalResult);
		location.href="./index.html";
	}
	if (!result) {
		location.href="./index.html";
	}
});