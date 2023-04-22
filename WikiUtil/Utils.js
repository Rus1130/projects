const Utils = {
    classes: {},
    classAdd(name, properties) {
        Utils.classes[name] = properties;
    }, 
    classRemove(name) {
        delete Utils.classes[name];
    },
    createElement(tag, properties) {
        if(properties == undefined) properties = {};
        let el = document.createElement(tag);
        for(i = 0; i < Object.keys(properties).length; i++) {
            let key = Object.keys(properties)[i]
            let value =  Object.values(properties)[i]
            if(el[key] == undefined){
                el.style[key] = value;
            } else {
                el[key] = value;
            }

            if(key == "class"){
                for(j = 0; j < value.split(" ").length; j++) {
                    let className = value.split(" ")[j];
                    if(Utils.classes[className] != undefined){
                        for(k = 0; k < Object.keys(Utils.classes[className]).length; k++) {
                            let key = Object.keys(Utils.classes[className])[k]
                            let value =  Object.values(Utils.classes[className])[k]
                            if(el[key] == undefined){
                                el.style[key] = value;
                            } else {
                                el[key] = value;
                            }
                        }
                    }
                }
            }
            
        }
        return el;
    },
    bundle(elements){
        let p = Utils.createElement("div");
        for(i = 0; i < elements.length; i++) {
            p.appendChild(elements[i])
        }
        return p;
    }
}


setTimeout(() => {document.body.appendChild(Utils.createElement("div"));}, 1);