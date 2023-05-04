class Genogram {
    static nodes = {};

    static analyze(){

    }

    constructor(){}

    createNode(name){
        let node = {
            name: name,
            description: '',
            parents: [],
            partners: [],
            children: [],
            addChild(childName){
                if(typeof childName === "string"){
                    if(Genogram.nodes[childName] == undefined) throw new Error(`Node "${childName}" does not exist`);
                    this.children[childName] = Genogram.nodes[childName]
                } else {
                    if(typeof childName === "object"){
                        if(Genogram.nodes[childName.name] == undefined) throw new Error(`Node "${childName.name}" does not exist`);
                        this.children[childName.name] = Genogram.nodes[childName.name]
                    }
                }
                return this;
            },
            addPartner(partnerName){
                if(typeof partnerName === "string"){
                    if(Genogram.nodes[partnerName] == undefined) throw new Error(`Node "${partnerName}" does not exist`);
                    this.partners[partnerName] = Genogram.nodes[partnerName]
                } else {
                    if(typeof partnerName === "object"){
                        if(Genogram.nodes[partnerName.name] == undefined) throw new Error(`Node "${partnerName.name}" does not exist`);
                        this.partners[partnerName.name] = Genogram.nodes[partnerName.name]
                    }
                }
                return this;
            }
        }
        Genogram.nodes[name] = node;
        return node;
    }

    getNode(name){
        if(Genogram.nodes[name] == undefined) throw new Error(`Node "${name}" does not exist`);
        else return Genogram.nodes[name];
    }
}
