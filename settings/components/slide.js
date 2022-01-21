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

	const container = document.createElement("div");
	container.className = "item";

	const titleElement = document.createElement("div");
	titleElement.className = "title";
	titleElement.dataset["name"] = title;
	titleElement.dataset["value"] = currentValue;

	const slider = Slider({ range, defaultValue, offset, onValueChange });

	container.appendChild(titleElement);
	container.appendChild(slider.element);

	return { element: container, getValue: () => currentValue };

	function onValueChange(value) {
		titleElement.dataset["value"] = value;
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

	const element = document.createElement("div");
	element.className = "slider";
	const slideBlock = document.createElement("div");
	slideBlock.className = "slideBlock";
	element.appendChild(slideBlock);

	element.addEventListener("click", (e) => {
		if (e.offsetX > e.target.offsetWidth - 35) {
			add(offset);
		}
		if (e.offsetX < 35) {
			add(0 - offset);
		}
	});

	set(defaultValue);

	return { element, set, add };

	/**
	 * @param {number} value
	 */
	function set(newValue) {
		if (newValue < range[0]) newValue = range[0];
		if (newValue > range[1]) newValue = range[1];

		slideBlock.style.marginLeft =
			((newValue - (range[0] + range[1]) / 2) / total) * 2 * marginRange +
			"%";

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
