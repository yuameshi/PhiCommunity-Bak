window.addEventListener('DOMContentLoaded', () => {
	document
		.querySelector('#delAllCache')
		.addEventListener('click', delAllCache);
	const container = document.querySelector('div#container');
	caches.open('phi-charts-cache').then(function (cache) {
		cache.keys().then(function (keys) {
			keys.forEach(function (request, index, array) {
				window.cacheList = array;
				const item = document.createElement('div');
				item.classList.add('item');
				item.setAttribute('data-url', request.url);
				item.setAttribute(
					'data-file-name',
					new URL(request.url).pathname.split('/')[
						new URL(request.url).pathname.split('/').length - 1
					]
				);
				const delBtn = document.createElement('button');
				delBtn.classList.add('deleteBtn');
				delBtn.innerText = '删除';
				delBtn.addEventListener('click', delCache);
				delBtn.setAttribute('data-index', index);
				container.appendChild(item);
				item.appendChild(delBtn);
				// console.log(request);
			});
		});
	});
});
function delCache(e) {
	const index = parseInt(e.target.getAttribute('data-index'));
	caches.open('phi-charts-cache').then(function (cache) {
		cache.delete(window.cacheList[index]).then(function () {
			document
				.querySelector('div#container')
				.children[index + 1].remove();
		});
	});
}
function delAllCache() {
	caches.open('phi-charts-cache').then(function (cache) {
		cache.keys().then(function (keys) {
			keys.forEach(function (request) {
				cache.delete(request);
			});
			location.reload();
		});
	});
}
