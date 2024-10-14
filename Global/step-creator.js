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
                radio.oninput = function(){
                    if(typeof json.radioIds[i] === "string") document.getElementById(json.radioIds[i]).style.display = "block";
                    else if(typeof json.radioIds[i] === "object"){
                        for(let j = 0; j < json.radioIds[i].length; j++){
                            document.getElementById(json.radioIds[i][j]).style.display = "block";
                        }
                    }
                };

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
        } else if (json.nodeType === "text"){
            step = document.createElement('input');
            step.type = "text";
            step.id = json.nodeId;
            step.placeholder = json.nodeText;
            step.setAttribute('autocomplete', 'off');
            step.addEventListener('keydown', function(e){
                if(e.key == "Enter"){
                    if(json.pattern !== undefined){
                        let regex = new RegExp(json.pattern);
                        if(regex.test(this.value)){
                            this.disabled = true;
                            if(json.onsubmit !== undefined){
                                document.getElementById(json.onsubmit).style.display = "block";
                            }
                        } else {
                            alert(`Invalid input`);
                        }
                    } else {
                        this.disabled = true;
                        if(json.onsubmit !== undefined){
                            document.getElementById(json.onsubmit).style.display = "block";
                        }
                    }
                }
            });

        }
        StepCreator.StepElements.push(step);
        if(StepCreator.StepElements.length > 1) step.style.display = "none";
        
        this.element.appendChild(step);
        return this;
    }

    addSteps(arr){
        for(let i = 0; i < arr.length; i++){
            this.addStep(arr[i]);
        }
    }

    getData(){
        let data = {};
        for(let i = 0; i < StepCreator.StepElements.length; i++){
            let step = StepCreator.StepElements[i];
            let elements = step.getElementsByTagName('input');
            for(let j = 0; j < elements.length; j++){
                if(elements[j].checked){
                    data[step.id] = elements[j].value;
                }
            }
            // get all text inputs
            if(step.tagName === "INPUT" && step.type === "text"){
                if(step.style.display === "none") continue;
                data[step.id] = step.value;
            }
        }
        return data;
    }
}

class StepNode {
    constructor(type) {
        if(!["text", "radio", "note", "button"].includes(type)) return console.error(`${type} is invalid type`);
        this.nodeType = type;
        return this;
    }
    id(id){
        this.nodeId = id;
        return this;
    }
    description(text){
        if(this.nodeType === "text") return console.error(`${this.nodeType} invalid type`);
        this.nodeText = text;
        return this;
    }
    placeholder(text){
        if(this.nodeType !== "text") return console.error(`${this.nodeType} invalid type`);
        this.nodeText = text;
        return this;
    }
    /**
     * 
     * @param {string} name the name of the radio group
     * @param {string[]} values the internal values of the radio buttons
     * @param {string[]} texts the display text of the radio buttons
     * @param {string[]|string[][]} ids what the radio buttons will reveal when clicked
     */
    addRadio(name, values, texts, ids){
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
    onSubmit(id){
        if(this.nodeType !== "text") return console.error(`${this.nodeType} invalid type`);
        this.onsubmit = id;
        return this;
    }
    pattern(regex){
        if(this.nodeType !== "text") return console.error(`${this.nodeType} invalid type`);
        this.pattern = regex;
        return this;
    }
}