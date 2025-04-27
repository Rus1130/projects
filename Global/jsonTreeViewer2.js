// i pulled this from a random stack overflow thread lol
class DeepProxy {
    constructor(target, handler) {
        this._preproxy = new WeakMap();
        this._handler = handler;
        return this.proxify(target, []);
    }

    makeHandler(path) {
        let dp = this;
        return {
            set(target, key, value, receiver) {
                if (typeof value === 'object') {
                    value = dp.proxify(value, [...path, key]);
                }
                target[key] = value;

                if (dp._handler.set) {
                    dp._handler.set(target, [...path, key], value, receiver);
                }
                jtv2.render();
                jtv2.render();
                return true;
            },

            deleteProperty(target, key) {
                if (Reflect.has(target, key)) {
                    dp.unproxy(target, key);
                    let deleted = Reflect.deleteProperty(target, key);
                    if (deleted && dp._handler.deleteProperty) {
                        dp._handler.deleteProperty(target, [...path, key]);
                    }
                    return deleted;
                }
                jtv2.render();
                jtv2.render();
                return false;
            }
        }
    }

    unproxy(obj, key) {
        if (this._preproxy.has(obj[key])) {
            // console.log('unproxy',key);
            obj[key] = this._preproxy.get(obj[key]);
            this._preproxy.delete(obj[key]);
        }

        for (let k of Object.keys(obj[key])) {
            if (typeof obj[key][k] === 'object') {
                this.unproxy(obj[key], k);
            }
        }

    }

    proxify(obj, path) {
        for (let key of Object.keys(obj)) {
            if (typeof obj[key] === 'object') {
                obj[key] = this.proxify(obj[key], [...path, key]);
            }
        }
        let p = new Proxy(obj, this.makeHandler(path));
        this._preproxy.set(p, obj);
        return p;
    }
}

class JsonTreeViewer2 {
    static CSS = `
ul { list-style-type: none; padding-left: 1em; font-family: monospace; }
li { margin: 3px 0; font-family: monospace; }
.key { font-weight: bold; font-family: monospace; }
.collapsible { cursor: pointer; user-select: none; font-family: monospace; }
.collapsed > ul { display: none; font-family: monospace; }
.closed::after { content: '…'; font-family: monospace; }
.opened::after { content: '↴'; font-family: monospace; }`
    static injectCSS() {
        if (document.getElementById('json-tree-style')) return; // only inject once

        const style = document.createElement('style');
        style.id = 'json-tree-style';
        style.textContent = JsonTreeViewer2.CSS;
        document.head.appendChild(style);
    }

    constructor(container, data) {
        let iframe = document.createElement('iframe');
        container.appendChild(iframe);
        this.container = iframe;

        iframe.style.height = '100%';
        iframe.style.width = '100%';

        this.data = data;
        this.openPaths = new Set();
        this._isRendering = false;
        this.initClickHandler();
        JsonTreeViewer2.injectCSS();
        this.render();
    }

    get iframe() {
        return this.container.contentDocument || this.container.contentWindow.document;
    }

    pathToString(path) {
        return path.join('.');
    }

    getDataByPath(data, pathArray) {
        let current = data;
        for (const key of pathArray) {
            current = current?.[key];
            if (current === undefined) break;
        }
        return current;
    }
    
    recursivelyOpenPath(path = [], obj) {
        const recurse = (currentObj, currentPath) => {
            if (typeof currentObj === 'object' && currentObj !== null) {
                const pathStr = this.pathToString(currentPath);
                this.openPaths.add(pathStr);
    
                for (const key in currentObj) {
                    recurse(currentObj[key], [...currentPath, key]);
                }
            }
        };
        recurse(obj, path);
    }

    recursivelyClosePath(path = [], obj) {
        const recurse = (currentObj, currentPath) => {
            if (typeof currentObj === 'object' && currentObj !== null) {
                const pathStr = this.pathToString(currentPath);
                this.openPaths.delete(pathStr);
    
                for (const key in currentObj) {
                    recurse(currentObj[key], [...currentPath, key]);
                }
            }
        };
        recurse(obj, path);
    }

    formatValue(value) {
        if (value === undefined) return '<i>undefined</i>';
        if (value === null) return '<i>null</i>';
        if (typeof value === 'string') {
            value = value.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')

            return `"${value}"`;
        }
        return value;
    }

    createTree(data, path = []) {
        const ul = document.createElement('ul');
        const isObject = (val) => typeof val === 'object' && val !== null;

        const addNode = (key, value) => {
            const fullPath = [...path, key];
            const pathStr = this.pathToString(fullPath);
            const li = document.createElement('li');

            if (isObject(value)) {
                const isEmpty = Object.keys(value).length === 0;
                if (isEmpty) {
                    let isArray = Array.isArray(value);
                    li.innerHTML = `<span class="key">${key}</span>: <i>empty (${isArray ? "Array" : "Object"})</i>`;
                } else {
                    li.classList.add('collapsed');
                    if (this.openPaths.has(pathStr)) li.classList.remove('collapsed');

                    const isOpen = this.openPaths.has(pathStr);
                    li.classList.toggle('collapsed', !isOpen);

                    li.innerHTML = `<span class="collapsible key" data-path="${pathStr}">
                                    ${key}: <span class="affix${isOpen ? ' opened' : ' closed'}"></span>
                    </span>`;
                    li.appendChild(this.createTree(value, fullPath));
                }
            } else {
                li.innerHTML = `<span class="key">${key}</span>: ${this.formatValue(value)}`;
            }

            ul.appendChild(li);
        };

        if (Array.isArray(data)) {
            data.forEach((item, index) => addNode(index, item));
        } else {
            for (const key in data) {
                addNode(key, data[key]);
            }
        }

        return ul;
    }


    async render() {
        if (this._isRendering) return;
        this._isRendering = true;
    
        const doc = this.iframe;
    
        // Clear the iframe safely
        doc.documentElement.innerHTML = '<html><head></head><body></body></html>';
    
        // Add CSS
        const style = doc.createElement('style');
        style.textContent = JsonTreeViewer2.CSS;
        doc.head.appendChild(style);
    
        // Append JSON tree
        const tree = this.createTree(this.data);
        doc.body.appendChild(tree);

        this.bindIframeEvents(); // Bind events after rendering
    
        this._isRendering = false;
    }

    staticUpdate(data) {
        this.data = data;
        this.render();
        this.render();
    }

    /**
     * Dynamic update of the data with a new DeepProxy instance.
     * @example
     * const data = { key: 'value' };
     * const viewer = new JsonTreeViewer2(container, data);
     * const newData = { key: 'newValue' };
     * viewer.dynamicUpdate(newData);
     * 
     * // or
     * 
     * const data = { key: 'value' };
     * const viewer = new JsonTreeViewer2(container, data);
     * const newData = { key: 'newValue' };
     * let proxy = viewer.dynamicUpdate(newData);
     * proxy.key = "anotherNewValue"; // This will also trigger a re-render
     * @param {Object} data 
     * @returns {DeepProxy}
     */
    dynamicUpdate(data) {
        if(this._isRendering) return false;
            // Deep comparison function to check if data has changed
        function deepEqual(obj1, obj2) {

            if(obj1 === obj2) // it's just the same object. No need to compare.
                return true;
        
            if(isPrimitive(obj1) && isPrimitive(obj2)) // compare primitives
                return obj1 === obj2;
        
            if(Object.keys(obj1).length !== Object.keys(obj2).length)
                return false;
        
            // compare objects with same number of keys
            for(let key in obj1)
            {
                if(!(key in obj2)) return false; //other object doesn't have this prop
                if(!deepEqual(obj1[key], obj2[key])) return false;
            }
        
            return true;
        }
        
        //check if value is primitive
        function isPrimitive(obj){
            return (obj !== Object(obj));
        }

        // Check if the data has changed
        if (deepEqual(data, this.data)) return false;

        this.data = new DeepProxy(data, {});
        this.render();
        this.render();
        return this.data;
    }

    initClickHandler() {
        this.container.addEventListener('load', () => {
            this.bindIframeEvents();
        });
    }
    
    bindIframeEvents() {
        const doc = this.iframe;
    
        // Remove old listeners if needed (optional enhancement)
    
        doc.addEventListener('click', (e) => {
            if (e.target.classList.contains('collapsible')) {
                const parentLi = e.target.parentElement;
                const path = e.target.getAttribute('data-path');
    
                if (this.openPaths.has(path)) {
                    this.openPaths.delete(path);
                } else {
                    this.openPaths.add(path);
                }
    
                parentLi.classList.toggle('collapsed');
    
                const affix = e.target.querySelector('.affix');
                if (affix) {
                    affix.classList.toggle('opened');
                    affix.classList.toggle('closed');
                }
            }
        });
    
        doc.addEventListener('contextmenu', (e) => {
            if (e.target.classList.contains('collapsible')) {
                e.preventDefault();
                const path = e.target.getAttribute('data-path');
                const pathArray = path.split('.');
                const targetData = this.getDataByPath(this.data, pathArray);
    
                if (this.openPaths.has(path)) {
                    this.recursivelyClosePath(pathArray, targetData);
                } else {
                    this.recursivelyOpenPath(pathArray, targetData);
                }
    
                this.render(); // After opening/closing, rerender
            }
        });
    }

    openAll() {
        const openAllPaths = (obj, path = []) => {
            if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    const newPath = [...path, key];
                    this.openPaths.add(this.pathToString(newPath));
                    openAllPaths(obj[key], newPath);
                }
            }
        };
        openAllPaths(this.data);
        this.render();
    }

    collapseAll() {
        this.openPaths.clear();
        this.render();
    }
}