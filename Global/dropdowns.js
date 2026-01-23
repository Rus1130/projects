class Dropdown {
    /**
     * @param {HTMLElement} element
     * @param {Object[]} options
     * 
     * @param {string} [options[].label] Display label (defaults to `string([value])`)
     * @param {*} options[].value The option value
     * @param {*} [options[].key] Defaults to `option-[index]`
     * 
     * @param {{
     *  defaultText? string
     * }} settings
     */
    constructor(element, options, settings = {}) {
        this.container = element;
        this.buttonElement = null;
        this.dropdownElement = null;
        this.options = options;

        this.settings = {
            defaultText: settings.defaultText || 'Select an option',
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
        
        button.textContent = this.settings.defaultText + " ▼";

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

            optionContainer.appendChild(optionElement);
            optionContainer.appendChild(labelElement);

            optionContainer.classList.add('dropdown-option');

            optionsContainer.appendChild(optionContainer);
        }

        optionsContainer.classList.add('dropdown-options-container');
        optionsContainer.classList.add('hide');

        this.container.appendChild(button);
        this.container.appendChild(optionsContainer);

        button.addEventListener('click', () => {
            optionsContainer.classList.toggle('hide');
            optionsContainer.style.minWidth = `${button.offsetWidth - 16 - 1.5}px`;
        });
    }
}