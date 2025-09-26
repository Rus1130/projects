class FunctionGuard {
    #allowDevConsole = false;

    getStack(){
        return new Error().stack.split('\n').slice(2).map(line => line.trim().split("at ")[1].split(" (")[0]);
    }

    check(){
        let stack = this.getStack();
        if(!this.#allowDevConsole){
            if(stack[stack.length-1].includes("<anonymous>")) throw new Error("Attempt to call a guarded function from the console.");
        }
    }

    constructor(options = {}) {
        this.#allowDevConsole = options.allowDevConsole || false;
    }
}