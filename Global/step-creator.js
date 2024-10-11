class StepCreator {
    static reveal(id){
        if(typeof id === "string") document.getElementById(id).style.display = "block";
        else if (typeof id === "object") {
            for (let i = 0; i < id.length; i++){
                document.getElementById(id[i]).style.display = "block";
            }
        }
    }
    
    constructor(parent) {
        this.parent = parent;
        this.element = document.createElement('step-creator');
        this.parent.appendChild(this.element);
    }

    addStep(json) {
        let step = document.createElement('div');
        step.id = json._id;
        step.textContent = json._text;
        this.element.appendChild(step);
        return this;
    }
}

class StepNode {
    constructor(type) {
        if(!["text", "radio"].includes(type)) return console.error("Invalid type");
        this.type = type;
        return this;
    }
    id(id){
        this._id = id;
        return this;
    }
    text(text){
        this._text = text;
        return this;
    }
}