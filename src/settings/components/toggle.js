/**
 * @param {import('./setting').ToggleSetting} option
 */
export function ToggleItem({ title, codename, defaultValue = false }) {
	let isChecked = defaultValue;

	const container = document.createElement('div');
	container.className = 'item';

	const titleElement = document.createElement('div');
	titleElement.className = 'title';
	titleElement.dataset['name'] = title;

	const toggleElement = document.createElement('div');
	toggleElement.classList.add('toggle');
	if (isChecked) toggleElement.classList.add('checked');

	container.appendChild(titleElement);
	container.appendChild(toggleElement);

	container.addEventListener('click', () => {
		if (isChecked) {
			toggleElement.classList.remove('checked');
			window.localStorage.setItem(codename, false);
		} else {
			toggleElement.classList.add('checked');
			window.localStorage.setItem(codename, true);
		}
		isChecked = !isChecked;
	});

	return { element: container };
}
