class Dropdown extends EventTarget {
    static styleElement = null;
    static CSS = `    .dropdown {
        position: relative;
        display: inline-block;
        font-size: 12px;
        font-family: "Arial";
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        padding: 6px 8px;
        user-select: none;
        cursor: pointer;
    }

    .dropdown-hover {
        background-color: #e0e0e0;
    }

    .dropdown-options-container {
        font-family: "Arial";
        user-select: none;
        padding: 4px 8px;
        background-color: white;
        border: 1px solid #ccc;
        position: relative;
        width: max-content;
        white-space: nowrap;
    }

    .dropdown-options-container.hide {
        display: none;
    }

    .dropdown-option {
        font-size: 12px;
        display: flex;
        align-items: center;
    }

    .dropdown-checkbox {
        cursor: pointer;
    }`

    static ensureStyle() {
        if (!Dropdown.styleElement) {
            let el = document.querySelector('style[data-dropdown-css]');
            if (!el) {
                const styleElement = document.createElement('style');
                styleElement.dataset.dropdownCss = "true";
                styleElement.textContent = Dropdown.CSS;
                Dropdown.styleElement = styleElement;
                document.head.appendChild(styleElement);
            }
            Dropdown.styleElement = el;
        }

        return Dropdown.styleElement;
    }

        
    /**
     * @param {string} selector
     * @param {Object<string,string|number>} rules
     */
    static addCSSRules(selector, rules) {
        const style = this.ensureStyle();

        let body = '';
        for (const prop in rules) {
            const cssProp = prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            body += `${cssProp}: ${rules[prop]};`;
        }

        style.textContent += `\n${selector}{${body}}`;
    }

    static removeCSSRules(selector) {
        const style = this.ensureStyle();
        const regex = new RegExp(`${selector}\\s*{[^}]*}`, 'g');
        style.textContent = style.textContent.replace(regex, '');
    }

    static editCSSRules(selector, rules) {
        this.removeCSSRules(selector);
        this.addCSSRules(selector, rules);
    }


    /**
     * @param {HTMLElement} element
     * @param {Object[]} options
     * 
     * @description
     * Each option object may contain:
     * - label: Display label (defaults to `string([value])`)
     * - value: The option value
     * - key: Defaults to `option-[index]`
     * 
     * events:
     * - optionchange: Fired when an option is selected or unselected
     * - optionselect: Fired when an option is selected
     * - optionunselect: Fired when an option is unselected
     * 
     * @param {{label?: string, value: any, key?: string}[]}
     * 
     * @param {{
     *  defaultText?: string,
     *  dropdownOpenRightText?: string,
     *  dropdownClosedRightText?: string
     * }} settings
     */
    constructor(element, options, settings = {}) {
        super();
        Dropdown.ensureStyle();

        this.container = element;
        this.buttonElement = null;
        this.dropdownElement = null;
        this.dropdownContainerElement = null;
        this.options = options;

        this.settings = {
            defaultText: settings.defaultText || 'Select an option',
            dropdownOpenRightText: settings.dropdownOpenRightText || '▼',
            dropdownClosedRightText: settings.dropdownClosedRightText || '▼',
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('dropdown');

        button.addEventListener("mouseover", () => {
            button.classList.toggle('dropdown-hover');
        });
        button.addEventListener("mouseout", () => {
            button.classList.toggle('dropdown-hover');
        });
        
        button.textContent = this.settings.defaultText + " " + this.settings.dropdownClosedRightText;

        this.buttonElement = button;

        const optionsContainer = document.createElement('div');

        for(let i = 0; i < options.length; i++) {
            const optionContainer = document.createElement('div');

            const option = options[i];
            const optionElement = document.createElement('input');

            optionElement.type = "checkbox";
            optionElement.dataset.key = option.key || `option-${i}`;
            optionElement.value = option.value;
            optionElement.classList.add('dropdown-checkbox');

            optionElement.addEventListener('change', (event) => {
                optionElement.style.outline = "none";
            });

            const labelElement = document.createElement('label');

            labelElement.htmlFor = optionElement.id;
            labelElement.textContent = option.label || String(option.value);

            labelElement.addEventListener('click', () => {
                optionElement.checked = !optionElement.checked;
                optionElement.dispatchEvent(new Event('change'));
            });


            optionElement.addEventListener('change', () => {
                this.dispatchEvent(new CustomEvent("optionchange", {
                    detail: {
                        key: optionElement.dataset.key,
                        value: option.value,
                        checked: optionElement.checked,
                        element: optionElement
                    },
                    bubbles: true,
                }));

                this.dispatchEvent(new CustomEvent(
                    optionElement.checked ? "optionselect" : "optionunselect",
                    {
                        detail: {
                            key: optionElement.dataset.key,
                            value: option.value,
                            element: optionElement
                        },
                        bubbles: true,
                    }
                ));
            });

            optionContainer.appendChild(optionElement);
            optionContainer.appendChild(labelElement);

            optionContainer.classList.add('dropdown-option');

            optionsContainer.appendChild(optionContainer);
        }

        optionsContainer.classList.add('dropdown-options-container');
        optionsContainer.classList.add('hide');

        this.container.appendChild(button);
        this.container.appendChild(optionsContainer);
        this.dropdownContainerElement = optionsContainer;

        button.addEventListener('click', (e) => {
            optionsContainer.classList.toggle('hide');
            button.textContent = this.settings.defaultText + " " + (optionsContainer.classList.contains('hide') ? this.settings.dropdownClosedRightText : this.settings.dropdownOpenRightText);


            optionsContainer.style.minWidth = `${button.offsetWidth - 16 - 1.5}px`;
        });

        document.body.addEventListener('click', (event) => {
            if (!this.container.contains(event.target) && !optionsContainer.classList.contains('hide')) {
                optionsContainer.classList.add('hide');
            }
        });
    }


    /**
     * sets the option with the given key to the given value
     * @param {boolean} key
     * @param {boolean} value
     */
    set(key, value){
        const optionElement = this.container.querySelector(`.dropdown-checkbox[data-key="${key}"]`);
        if(optionElement){
            optionElement.checked = value;
            optionElement.dispatchEvent(new Event('change'));
        }
    }

    /**
     * selects the option with the given key
     * @param {boolean} key 
     */
    select(key){
        this.set(key, true);
    }

    /**
     * unselects the option with the given key
     * @param {boolean} key
     */
    unselect(key){
        this.set(key, false);
    }

    /**
     * @returns {{key: string}}
     */
    selectedKeys(){
        const selectedKeys = {};
        const optionElements = this.container.querySelectorAll('.dropdown-checkbox');
        optionElements.forEach((optionElement) => {
            selectedKeys[optionElement.dataset.key] = optionElement.checked ? true: false;
        });
        return selectedKeys;
    }

    /**
     *
     * @returns {Array<{key: string, value: *, element: HTMLInputElement}>}
     */
    selected(){
        const selectedOptions = [];
        const optionElements = this.container.querySelectorAll('.dropdown-checkbox');
        optionElements.forEach((optionElement) => {
            if(optionElement.checked){
                selectedOptions.push({
                    key: optionElement.dataset.key,
                    value: optionElement.value,
                    element: optionElement
                });
            }
        });
        return selectedOptions;
    }
}