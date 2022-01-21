/**
 * @param {import('../setting').ButtonSetting} option
 */
export function ButtonItem({ title, onClick }) {
	const container = document.createElement("div");
	container.className = "item";

	const titleElement = document.createElement("div");
	titleElement.className = "title";
	titleElement.dataset["name"] = title;

	const button = document.createElement("div");
	button.innerText = title;
	button.className = "button";

	container.appendChild(titleElement);
	container.appendChild(button);

	button.onclick = onClick;

	return { element: container };
}
