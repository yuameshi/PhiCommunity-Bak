// Register service worker to control making site work offline

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("sw.js").then(function () {
		console.log("Service Worker Registered");
	});
}

// Code to handle install prompt on desktop

let deferredPrompt;
const addBtn = document.querySelector(".add-button");
addBtn.style.display = "none";
document.querySelector("#add-cache-button").addEventListener("click", () => {
	caches.open("video-store").then(function (cache) {
		return cache.addAll([
			"/tapToStart/TouchToStart0.mp3",
			"/chapterSelect/ChapterSelect0.mp3",
			"/assets/images/chapterImages/Single.png",
			"/assets/audio/LevelOver0.wav",
			"/assets/audio/LevelOver1.wav",
			"/assets/audio/LevelOver2.wav",
			"/assets/audio/LevelOver3.wav",
			"/assets/audio/Tap1.wav",
			"/assets/audio/Tap2.wav",
			"/assets/audio/Tap3.wav",
			"/assets/audio/Tap4.wav",
			"/assets/audio/Tap5.wav",
			"/assets/audio/Tap6.wav",
			"/assets/audio/Tap7.wav",
			"/charts/ouroVoros/meta.json",
			"/charts/ouroVoros/ouroVoros.jpg",
			"/charts/ouroVoros/ouroVoros.ogg",
			"/charts/ouroVoros/ouroVoros.pec",
			"/charts/sample/meta.json",
			"/charts/sample/0.png",
			"/charts/sample/1.png",
			"/charts/sample/2.png",
			"/charts/sample/3.png",
			"/charts/sample/line.json",
			"/charts/sample/SpasmodicSP.json",
			"/charts/sample/SpasmodicSP.ogg",
			"/charts/sample/SpasmodicSP.png",
			"/charts/samplePec/meta.json",
			"/charts/samplePec/temp.jpg",
			"/charts/samplePec/temp.mp3",
			"/charts/samplePec/Tempestissimo.pec",
			// "/charts/terrasphere/meta.json",
			// "/charts/terrasphere/Terrasphere.jpg",
			// "/charts/terrasphere/Terrasphere.mp3",
			// "/charts/terrasphere/Terrasphere.pec",
		]);
	});
});
window.addEventListener("beforeinstallprompt", (e) => {
	// Prevent Chrome 67 and earlier from automatically showing the prompt
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	// Update UI to notify the user they can add to home screen
	addBtn.style.display = "block";

	addBtn.addEventListener("click", (e) => {
		// hide our user interface that shows our A2HS button
		addBtn.style.display = "none";
		// Show the prompt
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === "accepted") {
				console.log("User accepted the A2HS prompt");
			} else {
				console.log("User dismissed the A2HS prompt");
			}
			deferredPrompt = null;
		});
	});
});
