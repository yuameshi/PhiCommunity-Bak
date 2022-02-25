const fs = require('fs');
const path = require('path');

listFile(process.cwd());

function listFile(filePath) {
	fs.readdir(filePath, function (err, files) {
		if (err) {
			console.warn(err);
		} else {
			files.forEach(function (filename) {
				var filedir = path.join(filePath, filename);
				fs.stat(filedir, function (eror, stats) {
					if (eror) {
						console.warn('获取文件stats失败');
					} else {
						var isFile = stats.isFile();
						var isDir = stats.isDirectory();
						if (isFile) {
							if (filedir.match(/.git|.github|.vscode/) == null) {
								if (
									filedir
										.replace('phigros-html5', 'ph5')
										.match(/html|js|css/) != null &&
									filedir.match('cfDeploy.js') == null
								) {
									const fileData = fs
										.readFileSync(filedir)
										.toString();
									if (
										fileData.match(
											'https://charts.phi.han-han.xyz/'
										)
									) {
										console.log(
											'Processing file:',
											filedir
										);
										fs.writeFileSync(
											filedir,
											fileData.toString().replaceAll(
												'https://charts.phi.han-han.xyz/',
												'https://cf.charts.phi.han-han.xyz/'
											)
										);
									}
								}
							}
						}
						if (isDir) {
							if (filedir.match(/.git|.github|.vscode/) == null) {
								listFile(filedir);
							}
						}
					}
				});
			});
		}
	});
}
