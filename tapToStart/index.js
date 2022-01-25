window.addEventListener('DOMContentLoaded',() => {
	document.querySelector('#audio').play();
	
	var w = document.body.clientWidth,
		h = document.body.clientHeight,
		bw = w * 0.8;
	var bubbles = [];
	var ctx = document.querySelector("#bubbles").getContext("2d");
	function renderBubbles() {
		ctx.clearRect(0, 0, w, h);
		ctx.shadowColor = "white";
		ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 10;
		var markedRemove = [];
		for (var bubble of bubbles) {
			ctx.fillStyle = "rgba(255, 255, 255, " + bubble.opacity + ")";
			ctx.beginPath();
			ctx.ellipse(bubble.x, bubble.y, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
			ctx.fill();
			bubble.y -= 1.5;
			bubble.opacity += 0.02;
			if (bubble.opacity > 0.8) {
				bubble.opacity = 0.8;
			}
			if (bubble.y <= -10) {
				markedRemove.push(bubble);
			}
		}
		for (var removal of markedRemove) {
			bubbles.splice(bubbles.indexOf(removal), 1); // GC handles it
		}
		requestAnimationFrame(renderBubbles);
	}
	function resize() {
		w = document.body.clientWidth;
		h = document.body.clientHeight;
		var el = document.querySelector("#bubbles");
		el.width = w;
		el.height = h;
	}
	setInterval(() => {
		if (bubbles.length >= 4) return;
		bubbles.push({
			x: Math.random() * bw + (w - bw) / 2,
			y: h - h * 0.1 - Math.random() * (h * 0.5),
			opacity: 0
		})
	}, 2000);
	resize();
	renderBubbles();
	window.addEventListener("resize", resize);
	
	document.body.addEventListener("click", () => {
		console.log("Clicked! Redirecting to MainPage");
		var fadeInElem=document.createElement('div');
		fadeInElem.classList.add('fadeIn');
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