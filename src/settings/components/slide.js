const marginRange = 80;

/**
 * @param {import('./setting').SlideSetting} option
 */
export function SliderItem({
	title,
	codename,
	range,
	defaultValue = range[0],
	offset = 1,
}) {
	let currentValue = defaultValue;

	const container = document.createElement('div');
	container.className = 'item';

	const titleElement = document.createElement('div');
	titleElement.className = 'title';
	titleElement.dataset['name'] = title;
	titleElement.dataset['value'] = currentValue;

	const slider = Slider({ range, defaultValue, offset, onValueChange });

	container.appendChild(titleElement);
	container.appendChild(slider.element);

	return { element: container, getValue: () => currentValue };

	function onValueChange(value) {
		titleElement.dataset['value'] = value;
		window.localStorage.setItem(codename, value);
		currentValue = value;
	}
}

/**
 * @param {{
 *  range: [number,number],
 * 	defaultValue?: number = range[0],
 * 	offset: number = 1,
 *  onValueChange:(number) => void
 * }} option
 */
function Slider({ range, defaultValue = range[0], offset = 1, onValueChange }) {
	let currentValue;
	const total = range[1] - range[0];

	const container = document.createElement('div');
	container.className = 'slider';

	const slideBlock = document.createElement('div');
	slideBlock.className = 'slideBlock';
	container.appendChild(slideBlock);

	container.addEventListener('click', (e) => {
		if (e.offsetX > container.offsetWidth - 35) {
			add(offset);
		}
		if (e.offsetX < 35) {
			add(0 - offset);
		}
	});

	//拖曳滚动条
	let isDragStart = false;

	/**
	 * 电脑端
	 * @param {MouseEvent} e
	 */
	const onMouseDrag = (e) => {
		set(
			Math.round(
				range[0] +
					((e.offsetX - 50) / (container.clientWidth - 100)) * total
			)
		);
	};
	slideBlock.addEventListener('mousedown', () => {
		isDragStart = true;
		window.addEventListener('mousemove', onMouseDrag);
	});
	window.addEventListener('mouseup', () => {
		if (!isDragStart) return;
		isDragStart = false;
		window.removeEventListener('mousemove', onMouseDrag);
	});

	/**
	 * 移动端
	 * @param {TouchEvent} e
	 */
	const onTouchDrag = (e) => {
		set(
			Math.round(
				range[0] +
					((e.targetTouches[0].pageX - container.clientLeft - 150) /
						(container.clientWidth - 100)) *
						total
			)
		);
	};

	slideBlock.addEventListener('touchstart', () => {
		isDragStart = true;
		window.addEventListener('touchmove', onTouchDrag);
	});

	window.addEventListener('touchend', () => {
		if (!isDragStart) return;
		isDragStart = false;
		window.removeEventListener('touchmove', onTouchDrag);
	});

	set(defaultValue);

	return { element: container, set, add };

	/**
	 * @param {number} value
	 */
	function set(newValue) {
		if (newValue < range[0]) newValue = range[0];
		if (newValue > range[1]) newValue = range[1];

		slideBlock.style.marginLeft =
			((newValue - (range[0] + range[1]) / 2) / total) * 2 * marginRange +
			'%';

		onValueChange(newValue);

		currentValue = newValue;
		return currentValue;
	}

	/**
	 * @param {number} offset
	 */
	function add(offset) {
		console.log(offset);
		return set(currentValue + offset);
	}
}
