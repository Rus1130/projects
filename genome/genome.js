class Genome {
    static dominantTraits = {}
    static recessiveTraits = {}
    static parents = {}

    constructor(genes){
        let letters = Object.keys(genes);
        let dominantTraits = Object.values(genes).map(x => x[0]);
        let recessiveTraits = Object.values(genes).map(x => x[1]);

        for(let i = 0; i < letters.length; i++){
            Genome.dominantTraits[letters[i].toUpperCase()] = dominantTraits[i];
            Genome.recessiveTraits[letters[i].toUpperCase()] = recessiveTraits[i];
        }
    }

    createParent(parentName, genotype){
        Genome.parents[parentName] = {
            name: parentName,
            genotype: genotype,
        }
        return Genome.parents[parentName];
    }

    randomParent(parentName){
        let traits = [...Object.keys(Genome.recessiveTraits)];
        let genotype = '';

        for(let i = 0; i < traits.length; i++){
            let gene = '';
            let randomTrait1 = Math.floor(Math.random() * 2);
            let randomTrait2 = Math.floor(Math.random() * 2);
            if(randomTrait1 == 0) gene += traits[i].toLowerCase();
            else gene += traits[i].toUpperCase();

            if(randomTrait2 == 0) gene += traits[i].toLowerCase();
            else gene += traits[i].toUpperCase();

            // if the second letter is uppercase and the first letter is lowercase

            if(gene[0] == gene[0].toLowerCase() && gene[1] == gene[1].toUpperCase()){
                gene = gene.split("").reverse().join("");

            }

            genotype += gene;
        }

        Genome.parents[parentName] = {
            name: parentName,
            genotype: genotype,
        }

        return Genome.parents[parentName]
    }
}