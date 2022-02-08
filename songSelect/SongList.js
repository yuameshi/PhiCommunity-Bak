import { gameLevels } from "../constants.js";

function SongList({ defaultLevel = "ez" }) {
	const listElement = document.createElement("div");
	listElement.id = "songList";
	listElement.classList.add("songList");

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
		var changeSongAudioElem = document.createElement("audio");
		changeSongAudioElem.src = "../assets/audio/Tap5.wav";
		changeSongAudioElem.play();

		if (selected !== undefined) items[selected].unSelect();

		if (!listElement.classList["selected"])
			listElement.classList.add("selected");

		items[id].select();

		console.log("Song", id, "Selected");
		const { songMeta, codename } = items[id];

		fetch(
			`https://charts.pgr.han-han.xyz/${codename}/${songMeta["illustration"]}`
		)
			.then((response) => response.blob())
			.then((blob) => {
				const imgUrl = URL.createObjectURL(blob);
				document.children[0].setAttribute(
					"style",
					`--background: url(${imgUrl});`
				);
				document.querySelector("img.illustration").src = imgUrl;
			})
			.catch((err) => {
				console.err(
					"获取曲绘失败!",
					`url: https://charts.pgr.han-han.xyz/${codename}/${songMeta["illustration"]}`,
					err
				);
			});
		fetch(
			`https://charts.pgr.han-han.xyz/${codename}/${songMeta["musicFile"]}`
		)
			.then((response) => response.blob())
			.then((blob) => {
				const songUrl = URL.createObjectURL(blob);
				document.querySelector("audio#slicedAudioElement").src =
					songUrl;
				clearInterval(window.sliceAudioInterval);
				document.querySelector("audio#slicedAudioElement").currentTime =
					songMeta["sliceAudioStart"];
				document.querySelector("audio#slicedAudioElement").play();
				window.sliceAudioInterval = setInterval(() => {
					for (let i = 0; i < 10; i++) {
						setTimeout(() => {
							document.querySelector(
								"audio#slicedAudioElement"
							).volume = (10 - i) / 10;
						}, i * 100);
					}
					setTimeout(() => {
						document.querySelector(
							"audio#slicedAudioElement"
						).currentTime = songMeta["sliceAudioStart"];
						document
							.querySelector("audio#slicedAudioElement")
							.play();
					}, 1000);
					for (let i = 0; i < 10; i++) {
						setTimeout(() => {
							document.querySelector(
								"audio#slicedAudioElement"
							).volume = i / 10;
						}, (i + 10) * 100);
					}
				}, 15000);
			})
			.catch((err) => {
				console.err(
					"获取乐曲失败!",
					`url: https://charts.pgr.han-han.xyz/${codename}/${songMeta["musicFile"]}`,
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
			case "level":
				sort((a, b) =>
					a.songMeta[`${level}Ranking`] <
					b.songMeta[`${level}Ranking`]
						? 1
						: -1
				);
				break;
			case "name":
				sort((a, b) => {
					return a.songMeta.name > b.songMeta.name ? 1 : -1;
				});
				break;
			default:
				items.forEach(({ element }) => (element.style.order = ""));
				break;
		}
		listElement.style.top = -items[selected].element.offsetTop + "px";
	}
}

function SongContainer(index, songMeta, codename, { level, onClick }) {
	const container = document.createElement("div");
	container.classList.add("songItemContainer");

	const songItem = SongItem(songMeta, codename),
		songLevel = SongLevel(songMeta, level);
	container.appendChild(songItem);
	container.appendChild(songLevel.element);

	container.addEventListener("click", () => onClick(index));

	const select = () => {
		songItem.classList.add("selected");
		container.classList.add("selected");
		for (const level in gameLevels) {
			document
				.querySelector(`div.levelItem.${level}`)
				.setAttribute(
					"data-level",
					Math.floor(songMeta[`${level}Ranking`])
				);
		}
	};

	const unSelect = () => {
		songItem.classList.remove("selected");
		container.classList.remove("selected");
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
	const songItemElement = document.createElement("div");
	songItemElement.classList.add("songItem");
	songItemElement.setAttribute("data-artist", songMeta.artist);
	songItemElement.setAttribute("data-codename", codename);
	songItemElement.innerText = songMeta.name;

	return songItemElement;
}

function SongLevel(songMeta, defaultLevel = "ez") {
	//	创建难度元素
	const songItemLevelElement = document.createElement("div");
	songItemLevelElement.classList.add("level");
	switchLevel(defaultLevel);

	return { element: songItemLevelElement, switchLevel };

	function switchLevel(level) {
		songItemLevelElement.classList.remove('ez','hd','in','at');
		songItemLevelElement.classList.add(level);
		songItemLevelElement.setAttribute(
			"data-level",
			Math.floor(songMeta[level + "Ranking"])
		);
	}
}
export { SongList };
