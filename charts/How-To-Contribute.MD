# 快速上手

首先，您需要PhiEditor创建的JSON格式文件或者PEC文件，没有就别说了（

首先创建一个具有正确名称的新文件夹，例如 `rrhar` 或 `rrharil` 指的是 `Rrhar'il`。（不要包含特殊字符，如 `' / \ ` 等，不能以.开头）

在其中创建或粘贴以下文件
```
meta.json			必须-元数据		(名称不可变更)
base.mp3			必选-音乐		(名称可变更)
chart.json			必须-铺面		(名称可变更)
line.json			可选-判定线贴图	 (名称可变更)
illustration.jpg 	必须-曲绘		 (名称可变更)
```
在`meta.json`内填入歌曲元信息（见下），注意要删除注释
```javascript
{
	"name":"Spasmodic(Haocore Mix)",	//曲名
	"codename":"sample",				//你的文件夹名称
	"artist":"姜米條-天利",				//曲师
	"musicFile":"SpasmodicSP.ogg",		//音乐文件
	"ezRanking":1,						//EZ定数（可带小数）
	"hdRanking":1,						//HD定数（可带小数,可与上一个相同）
	"inRanking":1,						//IN定数（可带小数,可与上一个相同）
	"atRanking":1,						//AT定数（可带小数,可与上一个相同）
	"lineTexture":"line.json",			//可选-判定线贴图
	"chartEZ":"SpasmodicSP.json",		//EZ谱面（可与上一个相同）
	"chartHD":"SpasmodicSP.json",		//HD谱面（可与上一个相同）
	"chartIN":"SpasmodicSP.json",		//IN谱面（可与上一个相同）
	"chartAT":"SpasmodicSP.json",		//AT谱面（可与上一个相同）
	"chartLegacy":"SpasmodicSP.json",	//Legacy谱面（可与上一个相同）
	"illustration":"SpasmodicSP.png",	//曲绘
	"chartDesigner":"Phigros Spasming Team \"無極病院\"",//谱师
	"illustrator":"笔记RE",				//曲绘制作者
	"sliceAudioStart":"10",				//预览音频切片开始时间（秒）
	"sliceAudioDuration":"3"			//预览音频切片持续时间（秒）
}
```