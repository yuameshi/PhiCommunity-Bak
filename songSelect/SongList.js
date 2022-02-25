import { gameLevels } from '../constants.js';

function SongList({ defaultLevel = 'ez' }) {
	const listElement = document.createElement('div');
	listElement.id = 'songList';
	listElement.classList.add('songList');

	const items = [];
	let selected,
		level = defaultLevel;

	return {
		element: listElement,
		items,
		createSong,
		switchSong,
		switchLevel,
		setOrder,
	};

	function createSong(id, songMeta, codename) {
		const container = new SongContainer(items.length, songMeta, codename, {
			onClick: switchSong,
			level,
		});
		listElement.appendChild(container.element);
		items[id] = container;
	}

	function switchSong(id) {
		if (id === selected) return;
		document.querySelector('#loadingBar').classList.remove('hidden');
		const playTapSoundXHR = new XMLHttpRequest();
		playTapSoundXHR.open('GET', '../assets/audio/selectSongItem.mp3', true);
		playTapSoundXHR.responseType = 'arraybuffer';
		playTapSoundXHR.onload = function () {
			const actx = new (window.AudioContext ||
				window.webkitAudioContext ||
				window.mozAudioContext ||
				window.msAudioContext)();
			actx.decodeAudioData(this.response, function (buffer) {
				let source = actx.createBufferSource();
				source.buffer = buffer;
				source.connect(actx.destination);
				source.start(0);
			});
		};
		playTapSoundXHR.send();
		if (selected !== undefined) items[selected].unSelect();

		if (!listElement.classList['selected'])
			listElement.classList.add('selected');

		items[id].select();

		console.log('Song', id, 'Selected');
		const { songMeta, codename } = items[id];
		var currentLevelSelected = window.levelSelected || ['ez'];
		while (
			songMeta['chart' + currentLevelSelected[0].toUpperCase()] == null
		) {
			var nextLevelCode = gameLevels[currentLevelSelected[0]] + 1;
			if (nextLevelCode == 4) nextLevelCode = 0;
			var nextLevel = Object.keys(gameLevels)[nextLevelCode];
			console.log(
				'Chart of level',
				currentLevelSelected[0],
				'is NULL! Switching to next level: ',
				nextLevel
			);
			document
				.querySelector(`div.levelItem.${currentLevelSelected[0]}`)
				.classList.add('disabled');
			document
				.querySelector(`div.levelItem.${currentLevelSelected[0]}`)
				.classList.remove('selected');
			switchLevel(nextLevel.match(nextLevel));
			document
				.querySelector(`div.levelItem.${nextLevel}`)
				.classList.add('selected');
			document
				.querySelectorAll(
					'#songList > div.songItemContainer.selected > div.level'
				)
				.forEach((element) => {
					element.classList.remove(currentLevelSelected[0]);
					element.classList.add(nextLevel);
				});
			currentLevelSelected = [nextLevel];
		}
		fetch(
			`https://charts.phi.han-han.xyz/${codename}/${songMeta['illustration']}`
		)
			.then((response) => response.blob())
			.then((blob) => {
				const imgUrl = URL.createObjectURL(blob);
				document.children[0].setAttribute(
					'style',
					`--background: url(${imgUrl});`
				);
				document.querySelector('img.illustration').src = imgUrl;
			})
			.catch((err) => {
				console.err(
					'获取曲绘失败!',
					`url: https://charts.phi.han-han.xyz/${codename}/${songMeta['illustration']}`,
					err
				);
			});
		fetch(
			`https://charts.phi.han-han.xyz/${codename}/${songMeta['musicFile']}`
		)
			.then((response) => response.blob())
			.then((blob) => {
				const songUrl = URL.createObjectURL(blob);
				try {
					window.playSongXHRObj.abort();
				} catch (e) {
					null;
				}
				window.playSongXHRObj = new XMLHttpRequest();
				window.playSongXHRObj.open('GET', songUrl, true);
				window.playSongXHRObj.responseType = 'arraybuffer';
				window.playSongXHRObj.onload = function () {
					const gainNode = window.slicesAudioContext.createGain();
					window.slicesAudioContext.decodeAudioData(
						this.response,
						function (buffer) {
							try {
								window.sliceAudioContextSource.stop();
							} catch (e) {
								null;
							}
							window.sliceAudioContextSource =
								window.slicesAudioContext.createBufferSource();
							window.sliceAudioContextSource.buffer = buffer;
							window.sliceAudioContextSource.connect(gainNode);
							gainNode.connect(
								window.slicesAudioContext.destination
							);
							window.sliceAudioContextSource.start(
								0,
								songMeta['sliceAudioStart']
							);
							gainNode.gain.setValueAtTime(
								0.01,
								window.slicesAudioContext.currentTime
							);
							gainNode.gain.linearRampToValueAtTime(
								1,
								window.slicesAudioContext.currentTime + 1
							);
							clearInterval(window.sliceAudioInterval);
							window.sliceAudioInterval = setInterval(() => {
								gainNode.gain.linearRampToValueAtTime(
									0.01,
									window.slicesAudioContext.currentTime + 1
								);
								setTimeout(() => {
									window.sliceAudioContextSource.stop();
									window.sliceAudioContextSource =
										window.slicesAudioContext.createBufferSource();
									window.sliceAudioContextSource.buffer =
										buffer;
									window.sliceAudioContextSource.connect(
										gainNode
									);
									window.sliceAudioContextSource.start(
										0,
										songMeta['sliceAudioStart']
									);
									gainNode.gain.linearRampToValueAtTime(
										1,
										window.slicesAudioContext.currentTime +
											1
									);
								}, 500);
							}, 15000);
						}
					);
					document.querySelector('#loadingBar').classList.add('hidden');
				};
				window.playSongXHRObj.send();
			})
			.catch((err) => {
				console.err(
					'获取歌曲失败!',
					`url: https://charts.phi.han-han.xyz/${codename}/${songMeta['musicFile']}`,
					err
				);
			});

		selected = id;
	}

	function switchLevel(newLevel) {
		if (level === newLevel) return;
		window.levelSelected = newLevel;
		items.forEach(({ switchLevel }) => switchLevel(newLevel));
		level = newLevel;
	}

	function sort(fn) {
		[...items]
			.sort((a, b) => fn(a, b))
			.forEach(({ element }, idx) => {
				// console.log(items, element.style.order, idx);
				element.style.order = idx;
			});
	}

	/**
	 *
	 * @param {'default'|'level'|'name'} order
	 */
	function setOrder(order) {
		switch (order) {
		case 'level':
			sort((a, b) =>
				a.songMeta[`${level}Ranking`] <
					b.songMeta[`${level}Ranking`]
					? 1
					: -1
			);
			break;
		case 'name':
			sort((a, b) => {
				return a.songMeta.name > b.songMeta.name ? 1 : -1;
			});
			break;
		default:
			items.forEach(({ element }) => (element.style.order = ''));
			break;
		}
		listElement.style.top = -items[selected].element.offsetTop + 'px';
	}
}

function SongContainer(index, songMeta, codename, { level, onClick }) {
	const container = document.createElement('div');
	container.classList.add('songItemContainer');

	const songItem = SongItem(songMeta, codename),
		songLevel = SongLevel(songMeta, level);
	container.appendChild(songItem);
	container.appendChild(songLevel.element);

	container.addEventListener('click', () => onClick(index));

	const select = () => {
		songItem.classList.add('selected');
		container.classList.add('selected');
		for (const level in gameLevels) {
			document
				.querySelector(`div.levelItem.${level}`)
				.classList.remove('disabled');
			if (songMeta['chart' + level.toUpperCase()] == null) {
				document
					.querySelector(`div.levelItem.${level}`)
					.classList.add('disabled');
				document
					.querySelector(`div.levelItem.${level}`)
					.classList.remove('selected');
				// continue;
			}
			document.querySelector(`div.levelItem.${level}`).setAttribute(
				'data-level',
				// Math.floor(songMeta[`${level}Ranking`] || 0)
				Math.floor(
					songMeta[level + 'Ranking'] ||
						songMeta['ezRanking'] ||
						songMeta['hdRanking'] ||
						songMeta['inRanking'] ||
						songMeta['atRanking'] ||
						0
				)
			);
		}
	};

	const unSelect = () => {
		songItem.classList.remove('selected');
		container.classList.remove('selected');
	};

	return {
		element: container,
		songMeta,
		codename,
		select,
		unSelect,
		switchLevel: songLevel.switchLevel,
	};
}

function SongItem(songMeta, codename) {
	//	创建歌曲信息元素
	const songItemElement = document.createElement('div');
	songItemElement.classList.add('songItem');
	songItemElement.setAttribute('data-artist', songMeta.artist);
	songItemElement.setAttribute('data-codename', codename);
	songItemElement.innerText = songMeta.name;

	return songItemElement;
}

function SongLevel(songMeta, defaultLevel = 'ez') {
	//	创建难度元素
	const songItemLevelElement = document.createElement('div');
	songItemLevelElement.classList.add('level');
	switchLevel(defaultLevel);

	return { element: songItemLevelElement, switchLevel };

	function switchLevel(level) {
		songItemLevelElement.classList.remove('ez', 'hd', 'in', 'at');
		songItemLevelElement.classList.add(level);
		songItemLevelElement.setAttribute(
			'data-level',
			Math.floor(
				songMeta[level + 'Ranking'] ||
					songMeta['ezRanking'] ||
					songMeta['hdRanking'] ||
					songMeta['inRanking'] ||
					songMeta['atRanking'] ||
					0
			)
		);
	}
}
export { SongList };
