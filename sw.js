const cacheFileList = [
	'/assets/audio/Exit.mp3',
	'/assets/audio/Pause.mp3',
	'/assets/audio/selectSongItem.mp3',
	'/assets/audio/Start.mp3',
	'/assets/css/fonts/Exo-Regular.otf',
	'/assets/css/fonts/fonts.css',
	'/assets/css/fonts/Source Han Sans & Saira Hybrid-Regular.ttf',
	'/assets/images/A15A.svg',
	'/assets/images/AppIcon.png',
	'/assets/images/AppIcon.svg',
	'/assets/images/Avatar.svg',
	'/assets/images/B15B.svg',
	'/assets/images/Back.svg',
	'/assets/images/C15C.svg',
	'/assets/images/ElementSqare.Half.Size.png',
	'/assets/images/ElementSqare.Half.Size.webp',
	'/assets/images/ElementSqare.png',
	'/assets/images/ElementSqare.webp',
	'/assets/images/F15F.svg',
	'/assets/images/phi15phi.svg',
	'/assets/images/Restart.svg',
	'/assets/images/Resume.svg',
	'/assets/images/S15S.svg',
	'/assets/images/Settings.svg',
	'/assets/images/showgirl_Half.png',
	'/assets/images/showgirl.png',
	'/assets/images/Sort.svg',
	'/assets/images/Tick.svg',
	'/assets/images/Title.svg',
	'/assets/images/V15FC.svg',
	'/assets/images/V15V.svg',
	'/chapterSelect/ChapterSelect0.mp3',
	'/LevelOver/LevelOver.mp3',
	'/settings/calibrate.mp3',
	'/tapToStart/TapToStart.mp3',
	'/whilePlaying/assets/oldui/clickRaw.png',
	'/whilePlaying/assets/oldui/Drag.png',
	'/whilePlaying/assets/oldui/Drag2HL.png',
	'/whilePlaying/assets/oldui/Flick.png',
	'/whilePlaying/assets/oldui/Flick2HL.png',
	'/whilePlaying/assets/oldui/HoldBody.png',
	'/whilePlaying/assets/oldui/HoldEnd.png',
	'/whilePlaying/assets/oldui/Tap.png',
	'/whilePlaying/assets/oldui/Tap2.png',
	'/whilePlaying/assets/oldui/Tap2HL.png',
	'/whilePlaying/assets/playerFirendlyNote/FlickHL.png',
	'/whilePlaying/assets/playerFirendlyNote/HoldHeadHL.png',
	'/whilePlaying/assets/playerFirendlyNote/HoldHL.png',
	'/whilePlaying/assets/playerFirendlyNote/TapHL.png',
	'/whilePlaying/assets/0.png',
	'/whilePlaying/assets/Back.svg',
	'/whilePlaying/assets/Drag.ogg',
	'/whilePlaying/assets/Drag.png',
	'/whilePlaying/assets/DragHL.png',
	'/whilePlaying/assets/Flick.ogg',
	'/whilePlaying/assets/Flick.png',
	'/whilePlaying/assets/FlickHL.png',
	'/whilePlaying/assets/clickRaw.png',
	'/whilePlaying/assets/Hold.png',
	'/whilePlaying/assets/HoldEnd.png',
	'/whilePlaying/assets/HoldHead.png',
	'/whilePlaying/assets/HoldHeadHL.png',
	'/whilePlaying/assets/HoldHL.png',
	'/whilePlaying/assets/JudgeLine.png',
	'/whilePlaying/assets/mute.ogg',
	'/whilePlaying/assets/oggmented-bundle.js',
	'/whilePlaying/assets/Pause.png',
	'/whilePlaying/assets/ProgressBar.png',
	'/whilePlaying/assets/Restart.svg',
	'/whilePlaying/assets/Resume.svg',
	'/whilePlaying/assets/SongNameBar.png',
	'/whilePlaying/assets/stackblur.min.js',
	'/whilePlaying/assets/stackblur.min.js.map',
	'/whilePlaying/assets/Tap.ogg',
	'/whilePlaying/assets/Tap.png',
	'/whilePlaying/assets/Tap2.png',
	'/whilePlaying/assets/TapHL.png',
];
self.addEventListener('fetch', function (e) {
	if(e.request.url.match('charts.phi')){
		console.log('Fetching charts data event detected, trying to response from cache.');
		e.respondWith(
			caches.open('phi-charts-cache').then((cache) => {
				return cache.match(e.request.url).then((response) => {
					return (
						response ||
						fetch(e.request.url).then((response) => {
							cache.put(e.request.url, response.clone());
							return response;
						})
					);
				});
			})
		);
	}else{
		e.respondWith(
			caches.match(e.request).then((response) => response || fetch(e.request))
		);
	}
});
self.addEventListener('install', function (e) {
	self.skipWaiting();
	console.log('[Service Worker] Install');
	e.waitUntil(
		caches.open('phi-static-cache').then(function (cache) {
			console.log('[Service Worker] Caching all: static assets');
			return cache.addAll(cacheFileList);
		})
	);
});