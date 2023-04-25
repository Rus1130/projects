const Utils = {
    classes: {},
    classAdd(name, properties) {
        Utils.classes[name] = properties;
    }, 
    classRemove(name) {
        delete Utils.classes[name];
    },
    create(tag, properties) {
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
        let b = Utils.create("bundle");
        for(i = 0; i < elements.length; i++) {
            b.appendChild(elements[i])
        }
        return b;
    },
    get(id){
    	return document.getElementById(id)
    }
}

setTimeout(() => {document.body.appendChild(Utils.create("div"));}, 1);