/**
 * @typedef {Object} HTMLElement an HTML element
 */

/**
 * @typedef {{displayText: string}} DecisionObject an object representing a decision
 */

class DecisionTree {
    /** 
     * @param {HTMLElement} element the element to append the decision tree to
     */
    constructor(element) {
        this.parent = element;
        this.element = document.createElement('decision-tree');
        this.parent.appendChild(this.element);
    }

    /**
     * @param {DecisionObject} decisionObject the decision to add to the decision tree
     */
    addDecision(decisionObject){
        let element = document.createElement('div');
        element.textContent = decisionObject.text;
        this.element.appendChild(element);
    }
}

/**
 * @description easily creates a decision tree object. can be done manually through JSON
 */
class DecisionTreeObject {
    /**
     * @param {string} type 
     */
    constructor(inputType){
        let validTypes = ['radio', 'text'];
        if(!validTypes.includes(inputType)) throw new Error('Invalid input type');
        
        this.type = inputType;
    }

    addText(text){
        this.text = text;
    }
}