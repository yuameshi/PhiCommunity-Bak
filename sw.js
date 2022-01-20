self.addEventListener('fetch', function(e) {
	//console.log(e.request.url);
	e.respondWith(
		caches.match(e.request).then(function(response) {
			return response || fetch(e.request);
		})
	);
});

self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open('video-store').then(function(cache) {
			return cache.addAll([
				'/tapToStart/TouchToStart0.mp3',
				'/chapterSelect/ChapterSelect0.mp3',
				'/assets/images/chapterImages/Single.png',
				'/assets/audio/LevelOver0.wav',
				'/assets/audio/LevelOver1.wav',
				'/assets/audio/LevelOver2.wav',
				'/assets/audio/LevelOver3.wav',
				'/assets/audio/Tap1.wav',
				'/assets/audio/Tap2.wav',
				'/assets/audio/Tap3.wav',
				'/assets/audio/Tap4.wav',
				'/assets/audio/Tap5.wav',
				'/assets/audio/Tap6.wav',
				'/assets/audio/Tap7.wav',
				'/charts/ouroVoros/meta.json',
				'/charts/ouroVoros/ouroVoros.jpg',
				'/charts/ouroVoros/ouroVoros.ogg',
				'/charts/ouroVoros/ouroVoros.pec',
				'/charts/sample/meta.json',
				'/charts/sample/0.png',
				'/charts/sample/1.png',
				'/charts/sample/2.png',
				'/charts/sample/3.png',
				'/charts/sample/line.json',
				'/charts/sample/SpasmodicSP.json',
				'/charts/sample/SpasmodicSP.ogg',
				'/charts/sample/SpasmodicSP.png',
				'/charts/samplePec/meta.json',
				'/charts/samplePec/temp.jpg',
				'/charts/samplePec/temp.mp3',
				'/charts/samplePec/Tempestissimo.pec',
				// '/charts/terrasphere/meta.json',
				// '/charts/terrasphere/Terrasphere.jpg',
				// '/charts/terrasphere/Terrasphere.mp3',
				// '/charts/terrasphere/Terrasphere.pec',
			]);
		})
	);
});