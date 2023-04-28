const Utils = {
    mixins: {},
    addMixin(name, properties) {
        Utils.mixins[name] = properties;
    }, 
    removeMixin(name) {
        delete Utils.mixins[name];
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

            if(key == "include"){
                let mixin = Utils.mixins[value];
                for(j = 0; j < Object.keys(mixin).length; j++) {
                    let mixinKey = Object.keys(mixin)[j]
                    let mixinValue =  Object.values(mixin)[j]
                    if(el[mixinKey] == undefined){
                        el.style[mixinKey] = mixinValue;
                    } else {
                        el[mixinKey] = mixinValue;
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
    },
}

setTimeout(() => {document.body.appendChild(Utils.create("div"));}, 1);