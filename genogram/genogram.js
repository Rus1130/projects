class Genogram {
    static nodeList = {};
    static tree = [];
    static HTMLElement = '';
    static HTMLContainer = '';
    static rerenderTree(){
        Genogram.HTMLElement.innerHTML = '';
        for(let i = 0; i < Genogram.tree.length; i++){
            let nodeName = Genogram.tree[i].name;
            Genogram.tree[i].id = Genogram.nodeList[nodeName].id;
            Genogram.tree[i].pid = Genogram.nodeList[nodeName].pid;
            Genogram.tree[i].mid = Genogram.nodeList[nodeName].mid;
            Genogram.tree[i].fid = Genogram.nodeList[nodeName].fid;
            Genogram.tree[i].name = Genogram.nodeList[nodeName].name;
            Genogram.tree[i].details = Genogram.nodeList[nodeName].details;
        }

        return Genogram.tree;
    }

    static treeNode(id, pid, mid, fid, name, details){
        return {
            id: id,
            pid: pid,
            mid: mid,
            fid: fid,
            name: name,
            details: details,
        }
    }

    static treeToHTML(){
        let html = '';
        for(let i = 0; i < Genogram.tree.length; i++){
            let node = Genogram.tree[i];
            if(node == undefined) break;
            let pid = Genogram.tree[node.pid - 1] === undefined ? "none" : Genogram.tree[node.pid - 1].name;
            let fid = Genogram.tree[node.fid - 1] === undefined ? "none" : Genogram.tree[node.fid - 1].name;
            let mid = Genogram.tree[node.mid - 1] === undefined ? "none" : Genogram.tree[node.mid - 1].name;



            let nodeHTML = `<div id="${node.id}" style="display: inline-block">${node.name}</div>`;
            html += nodeHTML;
        }

        return html;
    }

    constructor(element, options){
        options = options || {};
        options.width = options.width || 500;
        options.height = options.height || 500;
        options.fullscreen = options.fullscreen || false;

        Genogram.HTMLElement = document.createElement('div');
        Genogram.HTMLElement.style.display = 'inline-block';

        Genogram.HTMLElement.id = 'genogram';
        Genogram.HTMLElement.style.margin = '0px';

        Genogram.HTMLElement.style.width = options.width + 'px';
        Genogram.HTMLElement.style.height = options.height + 'px';

        if(options.fullscreen){
            Genogram.HTMLElement.style.width = '100%';
            Genogram.HTMLElement.style.height = '100%';
        }

        element.appendChild(Genogram.HTMLElement);        
    }

    createNode(name){
        let node = {
            name: name,
            type: "node",
            details: {
                description: ''
            },
            id: Object.keys(Genogram.nodeList).length + 1,
            pid: null,
            mid: null,
            fid: null,
            setDetails(details){
                let keys = Object.keys(details);
                for(let i = 0; i < keys.length; i++){
                    this.details[keys[i]] = details[keys[i]];
                }
            }
        }

        if(Genogram.nodeList[name] !== undefined) throw new Error(`Node "${name}" already exists`);
        Genogram.nodeList[name] = node;

        return node;
    }

    getNode(name){
        if(Genogram.nodeList[name] == undefined) throw new Error(`Node "${name}" does not exist`);
        else return Genogram.memberList[name];
    }

    getTree(){
        return Genogram.tree;
    }

    addNode(node){
        if(Genogram.nodeList[node.name] == undefined) throw new Error(`Node "${node.name}" does not exist`);

        Genogram.tree.push(Genogram.treeNode(node.id, node.pid, node.mid, node.fid, node.name, node.details));
        return Genogram.tree;
    }

    link(node1, node2){
        if(Genogram.tree.length == 0) throw new Error("Tree does not exist");
        // check if node is in tree
        if(Genogram.tree.filter(node => node.name == node1.name).length == 0) throw new Error(`Node "${node1.name}" does not exist in tree`);
        if(Genogram.tree.filter(node => node.name == node2.name).length == 0) throw new Error(`Node "${node2.name}" does not exist in tree`);

        let node1ID = Genogram.nodeList[node1.name].id;
        let node2ID = Genogram.nodeList[node2.name].id;

        Genogram.nodeList[node1.name].pid = node2ID;
        Genogram.nodeList[node2.name].pid = node1ID;
        Genogram.rerenderTree();
        return Genogram.tree;
    }

    parentalLink(father, mother, children){
        // check if children is array
        if(!Array.isArray(children)) throw new TypeError("Children must be an array");
        if(Genogram.tree.length == 0) throw new Error("Tree does not exist");
        // check if node is in tree
        if(Genogram.tree.filter(node => node.name == father.name).length == 0) throw new Error(`Node "${father.name}" does not exist in tree`);
        if(Genogram.tree.filter(node => node.name == mother.name).length == 0) throw new Error(`Node "${mother.name}" does not exist in tree`);
        for(let i = 0; i < children.length; i++){
            if(Genogram.tree.filter(node => node.name == children[i].name).length == 0) throw new Error(`Node "${children[i].name}" does not exist in tree`);
        }

        let fatherID = Genogram.nodeList[father.name].id;
        let motherID = Genogram.nodeList[mother.name].id;

        for(let i = 0; i < children.length; i++){
            Genogram.nodeList[children[i].name].fid = fatherID;
            Genogram.nodeList[children[i].name].mid = motherID;
        }

        Genogram.rerenderTree();
        return Genogram.tree;
    }

}


