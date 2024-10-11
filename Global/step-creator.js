class StepCreator {
    static StepElements = [];
    
    constructor(parent) {
        this.parent = parent;
        this.element = document.createElement('step-creator');
        this.parent.appendChild(this.element);
    }

    addStep(json) {
        let step = document.createElement('div');

        step.id = json.nodeId;
        step.textContent = json.nodeText;

        if(json.nodeType === "radio"){
            for(let i = 0; i < json.radioValues.length; i++){
                let radio = document.createElement('input');
                radio.type = "radio";
                radio.name = json.radioName;
                radio.value = json.radioValues[i];
                radio.oninput = function(){document.getElementById(json.radioIds[i]).style.display = "block";};

                radio.addEventListener('click', function(){
                    let name = this.name;
                    let value = this.value;
                    let allInputs = document.getElementsByName(name);
                    for (let j = 0; j < allInputs.length; j++){
                        if (allInputs[j].value !== value){
                            allInputs[j].disabled = true;
                        }
                    }
                });

                let span = document.createElement('span');
                span.textContent = json.radioTexts[i];

                step.appendChild(radio);
                step.appendChild(span);
            }
        } else if (json.nodeType === "button"){
            step = document.createElement('button');
            step.textContent = json.nodeText;
            step.onclick = json.callback;
            step.id = json.nodeId;
        }
        StepCreator.StepElements.push(step);
        if(StepCreator.StepElements.length > 1) step.style.display = "none";
        
        this.element.appendChild(step);
        return this;
    }

    getData(){
        let data = {};
        for(let i = 0; i < StepCreator.StepElements.length; i++){
            let step = StepCreator.StepElements[i];
            let radios = step.getElementsByTagName('input');
            for(let j = 0; j < radios.length; j++){
                if(radios[j].checked){
                    data[step.id] = radios[j].value;
                    break;
                }
            }
        }
        return data;
    }
}

class StepNode {
    constructor(type) {
        if(!["text", "radio", "description", "button"].includes(type)) return console.error(`${type} is invalid type`);
        this.nodeType = type;
        return this;
    }
    id(id){
        this.nodeId = id;
        return this;
    }
    text(text){
        this.nodeText = text;
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
        if(this.nodeType !== "radio") return console.error(`${this.nodeType} invalid type`);

        this.radioName = name;
        this.radioValues = values;
        this.radioIds = ids;
        this.radioTexts = texts;

        return this;
    }
    addButton(callback){
        if(this.nodeType !== "button") return console.error(`${this.nodeType} invalid type`);
        this.callback = callback;
        return this;
    }
}