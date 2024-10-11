class StepCreator {
    static StepElements = [];
    reveal(id){
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
        StepCreator.StepElements.push(step);

        if(StepCreator.StepElements.length > 1) step.style.display = "none";
        /** custom property stuff */
        // if(json.type === "radio"){
        //     inputs[i].addEventListener('click', function(){
        //         let name = this.name;
        //         let value = this.value;
        //         let allInputs = document.getElementsByName(name);
        //         for (let j = 0; j < allInputs.length; j++){
        //             if (allInputs[j].value !== value){
        //                 allInputs[j].disabled = true;
        //             }
        //         }
        //     });
        // }

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
    /**
     * 
     * @param {string} name the name of the radio group
     * @param {string[]} values the internal values of the radio buttons
     * @param {string[]} ids what the radio buttons will reveal when clicked
     * @param {string[]} texts the display text of the radio buttons
     */
    addRadio(name, values, ids, texts){
        if(this.type !== "radio") return console.error("Invalid type");
        if(values.length !== ids.length || values.length !== texts.length) return console.error("length mismatch");

        let container = document.getElementById(this._id);

        for(let i = 0; i < values.length; i++){
            let radio = document.createElement('input');
            radio.type = "radio";
            radio.name = name;
            radio.value = values[i];
            radio.oninput = this.reveal(ids[i]);
            container.appendChild(radio);
        }
    }
}