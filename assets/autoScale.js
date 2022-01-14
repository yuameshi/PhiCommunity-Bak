window.addEventListener('DOMContentLoaded',()=>{
	autoResize();
});
window.addEventListener('resize',()=>{
	autoResize();
})
function autoResize() {
	document.body.children[0].style.transform="scale("+window.outerHeight/480+")";
	console.log('Resize:',document.body.children[0].style.transform);
}