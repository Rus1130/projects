/**
 * @example
 *  let sc = new StepCreator(document.body);
 *  sc.addSteps([
 *      new StepNode("radio").id("step1").description("radio")
 *          .addRadio("radio1")
 *          .radioOption("1", "one", "step2")
 *          .radioOption("2", "two", "step2")
 *          .radioOption("3", "three", "step2")
 *          .radioOption("4", "four", "step2")
 *      ,  
 *      new StepNode("radio").id("step2").description("radio 2")
 *          .addRadio("radio2")
 *          .radioOption("5", "five", ["step3", "step2-note5"])
 *          .radioOption("6", "six", ["step3", "step2-note6"])
 *          .radioOption("7", "seven", ["step3", "step2-note7"])
 *          .radioOption("8", "eight", ["step3", "step2-note8"])
 *      ,
 *      new StepNode("note").id("step2-note5").description("this is a note for 5!")
 *      ,
 *      new StepNode("note").id("step2-note6").description("this is a note for 6!")
 *      ,
 *      new StepNode("note").id("step2-note7").description("this is a note for 7!")
 *      ,
 *      new StepNode("note").id("step2-note8").description("this is a note for 8!")
 *      ,
 *      new StepNode("text").id("step3").placeholder("type something here").revealOnSubmit("step4").pattern(/\w+/)
 *      ,
 *      new StepNode("button").id("step4").description("this is a button!").addButton(() => {console.log(sc.getCurrentData())})
 *  ])
 */
class StepCreator {
    static StepElements = [];
    static Data = [];
    
    constructor(parent) {
        this.parent = parent;
        this.element = document.createElement('step-creator');
        this.parent.appendChild(this.element);
    }

    /**
     * add a step to the step creator
     * @param {StepNode} json
     * @returns {StepCreator}
     */
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

                radio.addEventListener('click', function(e){
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
            step.addEventListener('keyup', function(e){
                if(e.key == "Enter"){
                    if(json.textPattern !== undefined){ 
                        if(json.textPattern.test(this.value) === true){
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

    /**
     * shorthand for multiple addStep calls
     * @alias addStep
     * @param {Array} arr an array of StepNode objects
     */
    addSteps(arr){
        for(let i = 0; i < arr.length; i++){
            this.addStep(arr[i]);
        }
    }

    getCurrentData(){
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

    getAllData(){
        return StepCreator.Data;
    }
    
    /**
     * reset the step creator to a specific id
     * @param {string} id the id to reset to
     * @param {boolean} [include=false] whether or not to include the id in the reset
     */
    resetToId(id, include){
        if(include === undefined) include = false;
        StepCreator.Data.push(this.getCurrentData());
        for(let i = 0; i < StepCreator.StepElements.length; i++){
            if(StepCreator.StepElements[i].id === id){
                StepCreator.StepElements[i].style.display = "block";
            } else {
                if(include === true) StepCreator.StepElements[i].style.display = "block";
                else StepCreator.StepElements[i].style.display = "none";
            }
        }
    }
}

class StepNode {
    /**
     * @example
     * // radio
     * new StepNode("radio").id("step1").description("radio")
     *     .addRadio("radio1")
     *     .radioOption("1", "one", "step2")
     *     .radioOption("2", "two", "step2")
     *     .radioOption("3", "three", "step2")
     *     .radioOption("4", "four", "step2")
     * 
     * // text input
     * new StepNode("text").id("step3").placeholder("type something here").revealOnSubmit("step4").pattern(/\w+/)
     * 
     * // button
     * new StepNode("button").id("step4").description("this is a button!").addButton(() => {console.log(sc.getCurrentData())})
     */
    constructor(type) {
        if(!["text", "radio", "note", "button"].includes(type)) return console.error(`${type} is invalid type`);
        this.nodeType = type;
        return this;
    }

    /**
     * set the id of the node
     * @param {String} id 
     * @returns {StepNode}
     */
    id(id){
        this.nodeId = id;
        return this;
    }
    /**
     * if the type is `text`, set the placeholder text
     * @param {String} text 
     * @returns {StepNode}
     */
    description(text){
        if(this.nodeType === "text") return console.error(`${this.nodeType} invalid type`);
        this.nodeText = text;
        return this;
    }
    /**
     * if the type is not `text`, set the description text
     * @param {String} text
     * @returns {StepNode}
     */
    placeholder(text){
        if(this.nodeType !== "text") return console.error(`${this.nodeType} invalid type`);
        this.nodeText = text;
        return this;
    }
    /**
     * 
     * @param {string} name the name of the radio group
     * @returns {StepNode}
     */
    addRadio(name){
        if(this.nodeType !== "radio") return console.error(`${this.nodeType} invalid type`);

        this.radioName = name;
        this.radioValues = []
        this.radioIds = []
        this.radioTexts = []

        return this;
    }
    /**
     * add a radio option
     * @param {string[]} value the internal values of the radio buttons
     * @param {string[]} text the display text of the radio buttons
     * @param {string[]} ids what the radio buttons will reveal when clicked
     * @returns {StepNode}
    */
    radioOption(value, text, ids){
        if(this.nodeType !== "radio") return console.error(`${this.nodeType} invalid type`);
        this.radioValues.push(value);
        this.radioTexts.push(text);
        this.radioIds.push(ids);
        return this;
    }
    /**
     * add a callback for the button
     * @param {function} callback
     * @returns {StepNode}
     */
    addButton(callback){
        if(this.nodeType !== "button") return console.error(`${this.nodeType} invalid type`);
        this.callback = callback;
        return this;
    }
    /**
     * reveal an element when the text input is submitted
     * @param {string} id the id of the element to reveal
     * @returns {StepNode}
     */
    revealOnSubmit(id){
        if(this.nodeType !== "text") return console.error(`${this.nodeType} invalid type`);
        this.onsubmit = id;
        return this;
    }
    /**
     * set a pattern for the text input
     * @param {Regexp} regex 
     */
    pattern(regex){
        if(this.nodeType !== "text") return console.error(`${this.nodeType} invalid type`);
        this.textPattern = regex;
        return this;
    }
}