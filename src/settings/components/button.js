/**
 * @param {import('../setting').ButtonSetting} option
 */
export function ButtonItem({ title, onClick }) {
	const container = document.createElement('div');
	container.className = 'item';

	const button = document.createElement('button');
	button.innerText = title;
	button.className = 'button';

	container.appendChild(button);

	button.onclick = onClick;

	return { element: container };
}
