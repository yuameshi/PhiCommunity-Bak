window.addEventListener('DOMContentLoaded',() => {
	var bubbleNum = 0;
	var clearedBubble = 0;
	document.querySelector('#audio').play();
	setInterval(() => {
		var bubble = document.createElement("div");
		bubble.classList.add("bubbles");
		var bottomSize = Math.round(Math.random() * 100);
		if (bottomSize >= 50) {
			bottomSize -= 35;
		}
		
		bubble.style.left = Math.round(Math.random() * 100) + "%";
		bubble.style.bottom = bottomSize + "%";
		bubble.id = bubbleNum;
		bubbleNum++;
		document.body.appendChild(bubble);
		console.log("Generated:", bubble);
		setTimeout(() => {
			clearedBubble += 1;
			document.getElementById(clearedBubble - 1).remove();
		}, 11950);
	}, 2000);
	document.body.addEventListener("click", () => {
		console.log("Clicked! Redirecting to MainPage");
		var fadeInElem=document.createElement('div');
		fadeInElem.classList.add('fadeIn');
		for (let i=clearedBubble;i > bubbleNum; i++) {
			console.log("Manually Removing:", i);
			document.getElementById(i - 1).remove();
		}
		document.body.appendChild(fadeInElem)
		setInterval(()=>{
			document.querySelector("#audio").volume-=.1;
		},10)
		setTimeout(()=>{
			if (window.localStorage.length==0) {
				location.href="../settings/index.html";
			}else{
				location.href="../chapterSelect/index.html";
			}
		},510);
	});
});