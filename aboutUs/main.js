//	自动滚动，通过持续修改CSS的Margin Top实现
// window.addEventListener('DOMContentLoaded',()=>{
// 	autoScroll();
// });
function autoScroll() {
	audioElem=document.getElementById('audioElement');
	audioElem.src='./AboutUs0.mp3';
	audioElem.play();
	audioElem.addEventListener('ended', ()=> {  
		audioElem.pause();
		if (audioElem.getAttribute('src')=='./AboutUs0.mp3') {
			audioElem.src='./AboutUs1.mp3';
		}else{
			audioElem.src='./AboutUs0.mp3';
		}
		audioElem.play();
	});
	document.body.scrollTo(0,0);
	document.body.style.marginTop='0px';
	var topSize=0;
	window.autoScrollInterval=setInterval(()=>{
		// console.log(document.body.style.marginTop);
		// console.log(topSize)
		if (document.body.offsetHeight + parseFloat( document.body.style.marginTop.replace('px',''))<(window.screenX/4)) {
			console.log('The END!');
			clearInterval(window.autoScrollInterval);
			setTimeout(()=>{
				document.querySelector('div.blackOverlay').style.opacity=1;
				setTimeout(()=>{
					location.href='../chapterSelect/index.html';
				},1000);
					},3000);
				};
		document.body.style.marginTop=topSize+'px';
		topSize-=0.5;
	},12);//	此数字改小同时topSize需要相应改小，改小后滑动更细腻，但是资源占用会增大
}
//	连续点击6次跳过（5s内）
var clickToExitCounter=6;
document.body.addEventListener('click',()=>{
	clickToExitCounter--;
	document.querySelector('div.clickToExitTag').innerText='再点击'+clickToExitCounter+'次以跳过';
	document.querySelector('div.clickToExitTag').style.opacity='0.'+(10-clickToExitCounter);
	if(clickToExitCounter==0){
		document.querySelector('div.blackOverlay').style.opacity=1;
		setTimeout(()=>{
			location.href='../chapterSelect/index.html';
		},1000);
	}
	setTimeout(()=>{
		clickToExitCounter=6;
		setTimeout(() => {
			document.querySelector('div.clickToExitTag').innerText='再点击'+clickToExitCounter+'次以跳过';
		}, 300);
		document.querySelector('div.clickToExitTag').style.opacity=0;
	},5000);
});
