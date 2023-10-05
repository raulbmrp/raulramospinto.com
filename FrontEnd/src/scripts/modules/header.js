class Header {
	/**
	 * The `.header` element.
	 *
	 * @type {HTMLElement}
	 */
	#header;


	/**
	 * The `.header__layout--menu` element.
	 *
	 * @type {HTMLElement}
	 */
	#menu;


	/**
	 * The `.header__burger` element.
	 *
	 * @type {HTMLButtonElement}
	 */
	#burger;


	/**
	 * The `.header__menu-button` elements.
	 *
	 * @type {NodeList}
	 */
	#menuButtons;


	/**
	 * The `.header__menu-button--current` element.
	 *
	 * @type {HTMLElement}
	 */
	#menuButtonCurrent;


	/**
	 * The `.header__menu-shape` element.
	 *
	 * @type {HTMLElement}
	 */
	#menuShape;


	/**
	 * The `.header__menu-shape-bg` element.
	 *
	 * @type {HTMLElement}
	 */
	#menuShapeBg;


	/**
	 * The `main` element.
	 *
	 * @type {HTMLElement}
	 */
	#main;


	/**
	 * The `footer` element.
	 *
	 * @type {HTMLElement}
	 */
	#footer;


	/**
	 * The `body` element.
	 *
	 * @type {HTMLElement}
	 */
	#body;

	/**
     * Flag to control the first load transition.
     *
     * @type {boolean}
     */
	transitionOcurred = true;

	/**
     * ID of the last observed section.
     *
     * @type {string}
     */
	lastObservedSection = true;

	/**
     * Flag to control the first load transition.
     *
     * @type {boolean}
     */
	firstLoad = true;

	/**
     * Flag to control the Intersection Observer state
     *
     * @type {boolean}
     */
	observerActive = true;


	/**
	 * Instantiates the header.
	 *
	 * @param {HTMLElement} element - The `.header` element.
	 */
	constructor(element) {
		// Store elements in private fields.
		// -------------------------------------------------------------
		this.#header = element;
		this.#menu = this.#header.querySelector('.header__layout--menu');
		this.#burger = this.#header.querySelector('.header__burger');
		this.#menuShape = this.#header.querySelector('.header__menu-shape');
		this.#menuShapeBg = this.#header.querySelector('.header__menu-shape-bg');
		this.#menuButtons = this.#header.querySelectorAll('.header__menu-button');
		this.#menuButtonCurrent = this.#header.querySelector('.header__menu-button--current');
		this.#main = document.querySelector('main');
		this.#footer = document.querySelector('footer');
		this.#body = document.querySelector('body');


		// -------------------------------------------------------------
		// -------------------------------------------------------------
		// Burger Menu Toggle
		// -------------------------------------------------------------
		// -------------------------------------------------------------

		this.#burger.addEventListener('click', () => {
			this.#header.classList.toggle('on');
			this.#burger.classList.toggle('on');
			this.#menu.classList.toggle('on');
			this.#main.classList.toggle('off');
			this.#footer.classList.toggle('off');
			this.#body.classList.toggle('menu-on');
			if (this.#burger.classList.contains('on')) {
				this.#burger.ariaLabel = 'Close menu';
				this.#burger.ariaExpanded = true;
			} else {
				this.#burger.ariaLabel = 'Open menu';
				this.#burger.ariaExpanded = false;
			}
		});


		// -------------------------------------------------------------
		// -------------------------------------------------------------
		// Menu Buttons Transition Effect on Desktop
		// -------------------------------------------------------------
		// -------------------------------------------------------------

		for (const menuButton of this.#menuButtons) {
			menuButton.addEventListener('click', () => {
				this.observerActive = false;
				this.#menuShape.style.justifyContent = Number.parseInt(menuButton.dataset.index, 10) > Number.parseInt(this.#menuButtonCurrent.dataset.index, 10) ? 'flex-end' : '';

				for (const button of this.#menuButtons) {
					button.classList.remove('header__menu-button--current');
				}

				menuButton.classList.add('header__menu-button--current');

				this.handleMenuShapeTransition(menuButton);

				this.#menuButtonCurrent = this.#header.querySelector('.header__menu-button--current');

				this.moveShape(menuButton);

				if (this.#burger.classList.contains('on')) {
					this.#burger.classList.remove('on');
					this.#menu.classList.remove('on');
					this.#header.classList.remove('on');
					this.#main.classList.remove('off');
					this.#footer.classList.remove('off');
					this.#body.classList.remove('menu-on');
				}

				setTimeout(() => {
					this.observerActive = true;
				}, 700);
			});
		}

		// -------------------------------------------------------------
		// -------------------------------------------------------------
		// Initialize Intersection Observer
		// -------------------------------------------------------------
		// -------------------------------------------------------------

		const observerOptions = {
			threshold: 0,
			rootMargin: '-288px 0px -288px 0px', // Adjust the root margin as needed
		};

		const intersectionObserver = new IntersectionObserver(entries => {
			for (const entry of entries) {
				if (entry.isIntersecting && this.observerActive) {
					const targetId = entry.target.id;
					const correspondingLink = this.#menu.querySelector(`[href="#${targetId}"]`);

					// Remove the 'header__menu-button--current' class from all menu links
					for (const button of this.#menuButtons) {
						button.classList.remove('header__menu-button--current');
					}

					// Add the 'header__menu-button--current' class to the corresponding menu link
					correspondingLink.classList.add('header__menu-button--current');

					if (targetId !== this.lastObservedSection) {
						this.transitionOccurred = false;
						this.lastObservedSection = targetId;
					}

					if (!this.transitionOccurred && targetId !== 'intro' && !this.firstLoad) {
						for (const menuButton of this.#menuButtons) {
							this.handleMenuShapeTransition(menuButton);
						}
					} else {
						this.firstLoad = false;
					}

					this.#menuButtonCurrent = this.#header.querySelector('.header__menu-button--current');

					this.moveShape(this.#menuButtonCurrent);

					// Update the URL hash to match the module's ID
					window.history.replaceState(null, null, `#${targetId}`);

					this.transitionOccurred = true;
				}
			}
		},
		observerOptions);

		// Observe each module
		for (const module of this.#main.querySelectorAll('section[id]')) {
			intersectionObserver.observe(module);
		}

		// Run on Load
		// -------------------------------------------------------------

		this.moveShape(this.#menuButtonCurrent);
		this.urlChange();
		this.splitMenuButtonString();

		// Run on Resize
		// -------------------------------------------------------------

		window.addEventListener('resize', () => {
			this.moveShape(this.#menuButtonCurrent);
			this.splitMenuButtonString();
			if (this.#burger.classList.contains('on')) {
				this.#burger.classList.remove('on');
				this.#menu.classList.remove('on');
				this.#header.classList.remove('on');
				this.#main.classList.remove('off');
				this.#footer.classList.remove('off');
				this.#body.classList.remove('menu-on');
			}
		});

		// Run on Toggle Device Toolbar
		// -------------------------------------------------------------

		screen.orientation.addEventListener('change', () => {
			this.moveShape(this.#menuButtonCurrent);
		});

		// Run on URL Change
		// -------------------------------------------------------------

		window.addEventListener('hashchange', () => {
			this.urlChange();
			if (this.#burger.classList.contains('on')) {
				this.#burger.classList.remove('on');
				this.#menu.classList.remove('on');
				this.#header.classList.remove('on');
				this.#main.classList.remove('off');
				this.#footer.classList.remove('off');
				this.#body.classList.remove('menu-on');
			}
		});
	}
	// -------------------------------------------------------------
	// Functions
	// -------------------------------------------------------------

	handleMenuShapeTransition(target) {
		const transitionTime = 350;
		const menuShape = document.querySelector('.header__menu-shape');
		const menuShapeBg = document.querySelector('.header__menu-shape-bg');
		if (Number.parseInt(this.#menuButtonCurrent.dataset.index, 10) !== Number.parseInt(target.dataset.index, 10)) {
			menuShapeBg.style.transition = `width ${transitionTime / 2}ms ease`;
			menuShapeBg.style.width = '130%';
			setTimeout(() => {
				menuShapeBg.style.width = '100%';
			}, transitionTime / 2);
		}

		menuShape.style.transition = `all ${transitionTime}ms ease`;
	}

	urlChange() {
		const url = window.location.href;
		const menuButtons = document.querySelectorAll('.header__menu-button');
		const menuButtonCurrentHref = this.#menuButtonCurrent.href;
		if (url !== menuButtonCurrentHref) {
			this.#menuButtonCurrent.classList.remove('header__menu-button--current');
		}

		for (const menuButton of menuButtons) {
			if (menuButton.href === url) {
				menuButton.classList.add('header__menu-button--current');
				this.#menuButtonCurrent = document.querySelector('.header__menu-button--current');
				this.moveShape(this.#menuButtonCurrent);
			}
		}
	}

	moveShape(target) {
		const buttonWidth = target.offsetWidth;
		const buttonShape = document.querySelector('.header__menu-shape');
		const buttonOffset = target.offsetLeft;
		console.log('offsetLeft of current menu button => ' + target.offsetLeft + 'px');
		buttonShape.style.width = `${buttonWidth}px`;
		buttonShape.style.left = `${buttonOffset}px`;
	}

	splitMenuButtonString() {
		const buttonTexts = document.querySelectorAll('.header__menu-button');

		if (window.matchMedia('(width < 992px)').matches && window.matchMedia('(hover: hover)').matches) {
			for (const button of buttonTexts) {
				const words = button.textContent.trim().split(' '); // Split text into words
				const newContent = words.map(word => {
					const letters = [...word];
					return letters.map(
						(char, i) => `<span class="button__letter button__letter--${i}" style="--index:${i};">${char}</span>`,
					).join('');
				}).join(' '); // Join words back together with spaces
				button.innerHTML = newContent;
			}
		} else {
			for (const button of buttonTexts) {
				button.innerHTML = button.textContent;
			}
		}
	}
}

export default Header;
