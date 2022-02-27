import { imgShader, qwqImage } from './index';

import JudgeLine from 'assets/whilePlaying/JudgeLine.png';
import ProgressBar from 'assets/whilePlaying/ProgressBar.png';
import SongsNameBar from 'assets/whilePlaying/SongNameBar.png';
import Pause from 'assets/whilePlaying/Pause.png';
import Tap from 'assets/whilePlaying/Tap.png';
import Tap2 from 'assets/whilePlaying/Tap2.png';
import TapHL from 'assets/whilePlaying/TapHL.png';
import Drag from 'assets/whilePlaying/Drag.png';
import DragHL from 'assets/whilePlaying/DragHL.png';
import HoldHead from 'assets/whilePlaying/HoldHead.png';
import HoldHeadHL from 'assets/whilePlaying/HoldHeadHL.png';
import Hold from 'assets/whilePlaying/Hold.png';
import HoldHL from 'assets/whilePlaying/HoldHL.png';
import HoldEnd from 'assets/whilePlaying/HoldEnd.png';
import Flick from 'assets/whilePlaying/Flick.png';
import FlickHL from 'assets/whilePlaying/FlickHL.png';
import hitPerfect from 'assets/whilePlaying/hitPerfect.png';
import hitGood from 'assets/whilePlaying/hitGood.png';
import NoImage from 'assets/whilePlaying/0.png';
import mute from 'assets/whilePlaying/mute.ogg';
import HitSong0 from 'assets/whilePlaying/Tap.ogg';
import HitSong1 from 'assets/whilePlaying/Drag.ogg';
import HitSong2 from 'assets/whilePlaying/Flick.ogg';

export const loadItems = {
	JudgeLine,
	ProgressBar,
	SongsNameBar,
	Pause,
	// clickRaw,
	Tap,
	Tap2,
	TapHL,
	Drag,
	DragHL,
	HoldHead,
	HoldHeadHL,
	Hold,
	HoldHL,
	HoldEnd,
	Flick,
	FlickHL,
	hitPerfect,
	hitGood,
	NoImage,
	mute,
	HitSong0,
	HitSong1,
	HitSong2,
};

export async function loadPhiCommunityResources(res, actx, message) {
	if (localStorage.getItem('usePlayerFriendlyUI') == 'true') {
		loadItems.FlickHL = await import(
			'assets/whilePlaying/playerFirendlyNote/FlickHL.png'
		);
		loadItems.HoldHL = await import(
			'assets/whilePlaying/playerFirendlyNote/HoldHL.png'
		);
		loadItems.HoldHeadHL = await import(
			'assets/whilePlaying/playerFirendlyNote/HoldHeadHL.png'
		);
		loadItems.TapH = await import(
			'assets/whilePlaying/playerFirendlyNote/TapHL.png'
		);
	}
	if (localStorage.getItem('useOldUI') == 'true') {
		loadItems.clickRaw = await import(
			'assets/whilePlaying/oldui/clickRaw.png'
		);
		loadItems.Drag = await import('assets/whilePlaying/oldui/Drag.png');
		loadItems.DragHL = await import(
			'assets/whilePlaying/oldui/Drag2HL.png'
		);
		loadItems.Flick = await import('assets/whilePlaying/oldui/Flick.png');
		loadItems.FlickHL = await import(
			'assets/whilePlaying/oldui/Flick2HL.png'
		);
		loadItems.Hold = await import('assets/whilePlaying/oldui/HoldBody.png');
		loadItems.HoldHL = await import(
			'assets/whilePlaying/oldui/HoldBody.png'
		);
		loadItems.HoldHead = await import('assets/whilePlaying/oldui/Tap.png');
		loadItems.HoldHeadHL = await import(
			'assets/whilePlaying/oldui/Tap2HL.png'
		);
		loadItems.HoldEnd = await import(
			'assets/whilePlaying/oldui/HoldEnd.png'
		);
		loadItems.Tap = await import('assets/whilePlaying/oldui/Tap.png');
		loadItems.Tap2 = await import('assets/whilePlaying/oldui/Tap2.png');
		loadItems.TapHL = await import('assets/whilePlaying/oldui/Tap2HL.png');
	}
	let loadedNum = 0;
	await Promise.all(
		((obj) => {
			const arr = [];
			for (const i in obj) arr.push([i, obj[i]]);
			return arr;
		})(loadItems).map(([name, src], _i, arr) => {
			const xhr = new XMLHttpRequest();
			xhr.open('get', src, true);
			xhr.responseType = 'arraybuffer';
			xhr.addEventListener('error', () => {
				alert('内部资源加载失败，请刷新页面重试');
			});
			xhr.send();
			return new Promise((resolve) => {
				xhr.onload = async () => {
					if (/\.(mp3|wav|ogg)$/i.test(src))
						res[name] = await actx.decodeAudioData(xhr.response);
					else if (/\.(png|jpeg|jpg)$/i.test(src))
						res[name] = await createImageBitmap(
							new Blob([xhr.response])
						);
					window.ResourcesLoad = Math.floor(
						(++loadedNum / arr.length) * 100
					);
					message.sendMessage(`加载资源：${window.ResourcesLoad}%`);
					resolve();
				};
			});
		})
	);
	res['JudgeLineMP'] = await createImageBitmap(
		imgShader(res['JudgeLine'], '#feffa9')
	);
	res['JudgeLineAP'] = await createImageBitmap(
		imgShader(res['JudgeLine'], '#a3ffac')
	);
	res['JudgeLineFC'] = await createImageBitmap(
		imgShader(res['JudgeLine'], '#a2eeff')
	);
	res['TapBad'] = await createImageBitmap(imgShader(res['Tap2'], '#6c4343'));
	res['Clicks'] = {};
	//res["Clicks"].default = await qwqImage(res["clickRaw"], "white");
	// res["Ranks"] = await qwqImage(res["Rank"], "white");
	if (localStorage.getItem('useOldUI') == 'true') {
		res['Clicks']['rgba(255,236,160,0.8823529)'] = await qwqImage(
			res['clickRaw'],
			'rgba(232, 148, 101,0.8823529)'
		); //#e89465e1
		res['Clicks']['rgba(168,255,177,0.9016907)'] = await qwqImage(
			res['clickRaw'],
			'rgba(123, 193, 253,0.9215686)'
		); //#7bc1fdeb
		res['Clicks']['rgba(180,225,255,0.9215686)'] = await qwqImage(
			res['clickRaw'],
			'rgba(123, 193, 253,0.9215686)'
		); //#7bc1fdeb
	} else {
		res['Clicks']['rgba(255,236,160,0.8823529)'] = await qwqImage(
			res['hitPerfect'],
			'rgba(255,236,160,0.8823529)'
		); //#fce491
		res['Clicks']['rgba(168,255,177,0.9016907)'] = await qwqImage(
			res['hitGood'],
			'rgba(168,255,177,0.9016907)'
		); //#97f79d
		res['Clicks']['rgba(180,225,255,0.9215686)'] = await qwqImage(
			res['hitGood'],
			'rgba(180,225,255,0.9215686)'
		); //#9ed5f3
	}
	message.sendMessage('核心资源加载完成!');
}
