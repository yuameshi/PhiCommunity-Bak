//  监测鼠标滚轮滚动，滚动时更改Left值实现左右滑动映射
document.addEventListener("wheel", (e) => {
	// console.log(e,e.wheelDeltaY/1.5)
	if(parseInt(document.body.style.left.replace('px',''))==0&&e.wheelDeltaY>0){	//  左侧距离为零且还想继续滑动则阻止
		console.log('Reached left limit');
		return;
	}
	if(parseInt(document.body.style.left.replace('px',''))<-1*(document.body.offsetWidth-window.innerWidth)&&e.wheelDeltaY<0){	//  右侧距离大于body减去宽度且还想继续滑动则阻止
		console.log('Reached right limit');
		return;
	}
	document.body.style.left=(parseInt(document.body.style.left.replace('px',''))+e.wheelDeltaY/1.5)+'px';
});
//  给所有章节对象添加点击监听器
document.addEventListener('DOMContentLoaded',()=>{
	var chapterContainers=document.querySelectorAll('div.chapterContainer');
	for (let i = 0; i < chapterContainers.length; i++) {
		const element = chapterContainers[i];
		element.addEventListener('click',(e)=>{
			console.log(e)
			if (e.target.src!=null) {
				//Do Nothing
			}else{
				var clickAudioElem=document.createElement('audio');
				clickAudioElem.src="../assets/audio/Tap1.wav";
				clickAudioElem.play();
				document.querySelector('div.darkOverlay').classList.add('fadeIn');
				setTimeout(() => {
					location.href='../songSelect/index.html?c='+e.target.getAttribute('data-codename');
				}, 400);
			}
		});
	}
})