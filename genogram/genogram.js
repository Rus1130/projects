class Genogram {
    static nodeList = {};
    static tree = [];
    static HTMLElement = '';

    static TreeConstruct(){
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

    constructor(id, options){
        options = options || {};
        options.width = options.width || 500;
        options.height = options.height || 500;
        options.fullscreen = options.fullscreen || false;

        Genogram.HTMLElement = document.getElementById(id)

        Genogram.HTMLElement.style.display = 'inline-block';

        Genogram.HTMLElement.classList.add('genogram-tree');

        Genogram.HTMLElement.style.margin = '0px';

        Genogram.HTMLElement.style.width = options.width + 'px';
        Genogram.HTMLElement.style.height = options.height + 'px';

        if(options.fullscreen){
            Genogram.HTMLElement.style.width = '100%';
            Genogram.HTMLElement.style.height = '100%';
        }

        document.body.appendChild(Genogram.HTMLElement);  
    }

    render(){
        for(let i = 0; i < Genogram.tree.length; i++){
            let node = Genogram.tree[i];
            let element = document.createElement('ul');
            let innerElem = document.createElement('li');
            innerElem.innerHTML = `${node.name} (id: ${node.id})`;
            element.setAttribute('data-id', node.id);
            element.appendChild(innerElem);

            Genogram.HTMLElement.appendChild(element);
        }

        for(let i = 0; i < Genogram.tree.length; i++){
            let element = document.querySelector(`[data-id="${Genogram.tree[i].id}"]`);
            let id = Genogram.tree[i].id;
            
            // get the node with that id
            let node = Genogram.tree.filter(node => node.id == id)[0];
            let fid = node.fid;
            let mid = node.mid;

            if(fid != null){
                let fatherElement1 = document.createElement("ul")
                let fatherElement2 = document.createElement("li")

                // get fathers name'
                let fatherName = Genogram.tree.filter(node => node.id == fid)[0].name;
    
                fatherElement1.setAttribute('data-id', node.fid);
                fatherElement2.innerHTML = `father: ${fatherName} (id: ${fid})`;
    
                fatherElement1.appendChild(fatherElement2);
                element.appendChild(fatherElement1);
            }

            if(mid != null){
                let motherElement1 = document.createElement("ul")
                let motherElement2 = document.createElement("li")

                // get mothers name'
                let motherName = Genogram.tree.filter(node => node.id == mid)[0].name;
    
                motherElement1.setAttribute('data-id', node.mid);
                motherElement2.innerHTML = `mother: ${motherName} (id: ${mid})`;
    
                motherElement1.appendChild(motherElement2);
                element.appendChild(motherElement1);
            }



            
        }
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
            },
        }

        if(Genogram.nodeList[name] !== undefined) throw new Error(`Node "${name}" already exists`);
        if(Genogram.tree.filter(node => node.name == name).length > 0) throw new Error(`Node "${name}" already exists in tree`);

        Genogram.nodeList[name] = node;
        Genogram.tree.push(Genogram.treeNode(node.id, node.pid, node.mid, node.fid, node.name, node.details));
        Genogram.TreeConstruct();
        return node;
    }

    getNode(name){
        if(Genogram.nodeList[name] == undefined) throw new Error(`Node "${name}" does not exist`);
        else return Genogram.memberList[name];
    }

    getTree(){
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

        Genogram.TreeConstruct();
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

        Genogram.TreeConstruct();
        return Genogram.tree;
    }

}


