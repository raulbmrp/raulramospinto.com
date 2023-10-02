// /* eslint-disable unicorn/prefer-at */
class Homepage {
	/**
	 * The `homepage` element.
	 *
	 * @type {HTMLElement}
	 */
	#homepage;

	/**
	 * The `main` element.
	 *
	 * @type {HTMLElement}
	 */
	#main;

	/**
	 * The `blur-circle--blue` element.
	 *
	 * @type {HTMLElement}
	 */
	#blurCircleBlue;

	/**
	 * The `blur-circle--orange` element.
	 *
	 * @type {HTMLElement}
	 */
	#blurCircleOrange;

	/**
	 * The `modules` element.
	 *
	 * @type {NodeList}
	 */
	#modules;

	/**
	 * Instantiates the Facts module.
	 *
	 * @param {HTMLElement} element - The `body` element.
	 */
	constructor(element) {
		// Store elements in private fields.
		// -----------------------------------------------------------------------------
		this.#homepage = element;
		this.#main = this.#homepage.querySelector('.main');
		this.#blurCircleBlue = this.#homepage.querySelector('.blur-circle--blue');
		this.#blurCircleOrange = this.#homepage.querySelector('.blur-circle--orange');
		this.#modules = this.#homepage.querySelectorAll('.module');

		const observerOptions = {
			threshold: 0,
			rootMargin: '-288px 0px -288px 0px', // Adjust the root margin as needed
		};

		const intersectionObserver = new IntersectionObserver(entries => {
			for (const entry of entries) {
				if (entry.isIntersecting && entry.target.id === 'intro') {
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueTop', 'calc(50% + 20vh)');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueLeft', 'calc(50% + 5vw)');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueWidth', '90vh');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueHeight', '90vh');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueOpacity', '1');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeTop', 'calc(50% - 25vh)');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeLeft', 'calc(50% + 30vw)');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeWidth', '120vh');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeHeight', '120vh');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeOpacity', '1');
				}

				if (entry.isIntersecting && entry.target.id === 'about') {
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueTop', 'calc(50% + 10vh)');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueLeft', 'calc(50% + 40vw)');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueWidth', '80vh');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueHeight', '80vh');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueOpacity', '1');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeTop', 'calc(50% - 15vh)');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeLeft', 'calc(50% + 25vw)');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeWidth', '50vh');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeHeight', '50vh');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeOpacity', '1');
				}

				if (entry.isIntersecting && entry.target.id === 'resume') {
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueTop', 'calc(50% - 20vh)');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueLeft', 'calc(50% + 40vw)');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueWidth', '50vh');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueHeight', '50vh');
					this.#blurCircleBlue.style.setProperty('--blurCircleBlueOpacity', '0');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeTop', 'calc(50% - 20vh)');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeLeft', 'calc(50% + 25vw)');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeWidth', '50vh');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeHeight', '50vh');
					this.#blurCircleOrange.style.setProperty('--blurCircleOrangeOpacity', '0');
				}
			}
		},
		observerOptions);

		// Observe each module
		for (const module of this.#modules) {
			intersectionObserver.observe(module);
		}
	}
}

export default Homepage;