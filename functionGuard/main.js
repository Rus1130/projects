class FunctionGuard {
    /**
     * @param {Array<Function>} functions An array of function references
     * @param {Object} scope The scope to search in (default: globalThis)
     */
    constructor(functions, scope = globalThis) {
        functions.forEach(fn => {
            if (typeof fn !== 'function') {
                throw new TypeError('All elements in the array must be functions');
            }

            // Find the property name(s) in the scope that point to this function
            for (let key of Object.keys(scope)) {
                if (scope[key] === fn) {
                    const original = fn;
                    scope[key] = (...args) => {
                        console.log(`Function "${key}" called with arguments:`, args);
                        return original(...args);
                    };
                }
            }
        });
    }
}