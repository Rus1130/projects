class Genogram {
    static nodes = {};
    static links = [];

    constructor(){}

    createNode(name){
        let node = {
            name: name,
            type: "node",
            description: '',
            parents: [],
            partners: [],
            children: [],
            isChildOf(parent){
                if(parent.type == "node" && typeof parent === "object") parent = parent.name;
                else throw new TypeError(`Node "${parent}" is not type of Node`);
                return this.parents.includes(parent);
            },
            isParentOf(child){
                if(child.type == "node" && typeof child === "object") child = child.name;
                else throw new TypeError(`Node "${child}" is not type of Node`);
                return this.children.includes(child);
            },
            isOffspringOf(parent1, parent2){
                if(parent1.type == "node" && typeof parent1 === "object") parent1 = parent1.name;
                else throw new TypeError(`Node "${parent1}" is not type of Node`);

                if(parent2.type == "node" && typeof parent2 === "object") parent2 = parent2.name;
                else throw new TypeError(`Node "${parent2}" is not type of Node`);
                
                return this.parents.includes(parent1) && this.parents.includes(parent2);
            }
        }

        if(Genogram.nodes[name] !== undefined) throw new Error(`Node "${name}" already exists`);
        Genogram.nodes[name] = node;
        return node;
    }

    getNode(name){
        if(Genogram.nodes[name] == undefined) throw new Error(`Node "${name}" does not exist`);
        else return Genogram.nodes[name];
    }

    createPlink(node1, node2){
        let firstNode = node1;
        let secondNode = node2;
        
        if(node1.type == "node" && typeof node1 === "object") firstNode = node1.name;
        else throw new TypeError(`Node "${node1}" is not type of Node`);

        if(node2.type == "node" && typeof node2 === "object") secondNode = node2.name;
        else throw new TypeError(`Node "${node2}" is not type of Node`);

        let link = {
            type: 'plink',
            node1: firstNode,
            node2: secondNode,
            id: Genogram.links.length,
        }

        for(var i = 0; i < Genogram.links.length; i++){
            if(Genogram.links[i].node1 == firstNode && Genogram.links[i].node2 == secondNode) throw new Error(`Partner Link between "${firstNode}" and "${secondNode}" already exists`);
        }

        if(Genogram.nodes[node1.name] == undefined) throw new Error(`Node "${node1.name}" does not exist`);
        if(Genogram.nodes[node2.name] == undefined) throw new Error(`Node "${node2.name}" does not exist`);

        Genogram.nodes[node1.name].partners.push(node2.name);
        Genogram.nodes[node2.name].partners.push(node1.name);
        Genogram.links.push(link)
        return link;
    }

    createMonoParLink(parentNode, ...childrenNodes){
        let parent = parentNode;
        let children = [];
        
        if(parentNode.type == "node" && typeof parentNode === "object") parent = parentNode.name;
        else throw new TypeError(`Node "${parentNode}" is not type of Node`);

        for(let i = 1; i < arguments.length; i++){
            if(arguments[i].type == "node" && typeof arguments[i] === "object") children.push(arguments[i].name);
            else throw new TypeError(`Node "${arguments[i]}" is not type of Node`);
        }

        let link = {
            type: "parlink-m",
            parent: parent,
            children: children,
            id: Genogram.links.length
        }

        // check if link already exists
        for(let i = 0; i < Genogram.links.length; i++){
            if(Genogram.links[i].parent == parent && Genogram.links[i].children == children) throw new Error(`Mono-Parental Link between "${parent}" and "${children}" already exists`);
        }

        if(Genogram.nodes[parent] === undefined) throw new Error(`Node "${parent}" does not exist`);


        for(let i = 0; i < children.length; i++){
            if(Genogram.nodes[children[i]] === undefined) throw new Error(`Node "${children[i]}" does not exist`);
            Genogram.nodes[children[i]].parents.push(parent);
            Genogram.nodes[parent].children.push(children[i]);
        }

        Genogram.links.push(link);
        return link;
    }

    createDualParLink(linkID, ...childrenNodes){
        let monolink = Genogram.links[linkID];
        
        if(monolink.type != "plink") throw new TypeError(`Link "${linkID}" is not type of Plink`);

        let children = []

        for(let i = 1; i < arguments.length; i++){
            if(arguments[i].type == "node" && typeof arguments[i] === "object") children.push(arguments[i].name);
            else throw new TypeError(`Node "${arguments[i]}" is not type of Node`);
        }

        let parents = [monolink.node1, monolink.node2];

        let link = {
            type: "parlink-d",
            parents: parents,
            children: children,
            id: Genogram.links.length
        }

        // check if link already exists
        for(let i = 0; i < Genogram.links.length; i++){
            if(Genogram.links[i].parent == monolink.node1 && Genogram.links[i].children == children) throw new Error(`Dual-Parental Link between "${monolink.node1}" and "${children}" already exists`);
        }

        if(Genogram.nodes[monolink.node1] === undefined) throw new Error(`Node "${monolink.node1}" does not exist`);

        for(let i = 0; i < parents.length; i++){
            for(let j = 0; j < children.length; j++){
                if(Genogram.nodes[children[j]] === undefined) throw new Error(`Node "${children[j]}" does not exist`);
                Genogram.nodes[children[j]].parents.push(parents[i]);
                Genogram.nodes[parents[i]].children.push(children[j]);
            }
        }


        Genogram.links.push(link);
        return link;
    }


}