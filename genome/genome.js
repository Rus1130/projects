class Genome {
    static dominantTraits = {}
    static recessiveTraits = {}
    static shuffleArray(d) {
        for(var c = d.length - 1; c > 0; c--){
            var b = Math.floor(Math.random() * (c + 1));
            var a = d[c];
            d[c] = d[b];
            d[b] = a;
        }
        return d
    };

    constructor(genes){
        let letters = Object.keys(genes);
        let dominantTraits = Object.values(genes).map(x => x[0]);
        let recessiveTraits = Object.values(genes).map(x => x[1]);

        for(let i = 0; i < letters.length; i++){
            Genome.dominantTraits[letters[i].toUpperCase()] = dominantTraits[i];
            Genome.recessiveTraits[letters[i].toLowerCase()] = recessiveTraits[i];
        }
    }

    random(amount, len){
        let traits = [...Object.keys(Genome.recessiveTraits)];
        let length = len || traits.length;
        

        // randomize the traits array
        traits = Genome.shuffleArray(traits);

        let genotypes = [];

        for(let i = 0; i < amount; i++){
            let genotype = '';
            for(let j = 0; j < traits.length; j++){
                if(j >= length) break;
                let gene = '';
                let randomTrait1 = Math.floor(Math.random() * 2);
                let randomTrait2 = Math.floor(Math.random() * 2);
                if(randomTrait1 == 0) gene += traits[j].toLowerCase();
                else gene += traits[j].toUpperCase();

                if(randomTrait2 == 0) gene += traits[j].toLowerCase();
                else gene += traits[j].toUpperCase();

                if(gene[0] == gene[0].toLowerCase() && gene[1] == gene[1].toUpperCase()){
                    gene = gene.split("").reverse().join("");

                }

                genotype += gene;
            }

            genotypes.push(genotype);
        }

        if(genotypes.length == 1) return genotypes[0];
        else return genotypes
    }

    cross(parent1, parent2){
        let parent1Genes = parent1.match(/.{1,2}/g);
        let parent2Genes = parent2.match(/.{1,2}/g);

        let recessiveTraits = Object.keys(Genome.recessiveTraits)

        let genePool = {};
        let punnetSquares = {};

        for(let i = 0; i < recessiveTraits.length; i++){
            genePool[recessiveTraits[i]] = [];
            punnetSquares[recessiveTraits[i]] = [];
        }

        for(let i = 0; i < parent1Genes.length; i++){
            if(genePool[parent1Genes[i][0].toLowerCase()] == undefined) throw new Error("Invalid gene: " + parent1Genes[i][0]);
            genePool[parent1Genes[i][0].toLowerCase()].push(parent1Genes[i]);
        }

        for(let i = 0; i < parent2Genes.length; i++){
            if(genePool[parent2Genes[i][0].toLowerCase()] == undefined) throw new Error("Invalid gene: " + parent2Genes[i][0]);
            genePool[parent2Genes[i][0].toLowerCase()].push(parent2Genes[i]);
        }

        for(let i = 0; i < recessiveTraits.length; i++){
            if(genePool[recessiveTraits[i]].length == 0){
                delete genePool[recessiveTraits[i]];
                delete punnetSquares[recessiveTraits[i]];
            }
        }

        let childrenGenes = [];

        let usedGenes = Object.keys(genePool);

        for(let i = 0; i < usedGenes.length; i++){
            let square = [];
            let genes = genePool[usedGenes[i]];
            try {
                square.push(genes[0][0] + genes[1][0]);
                square.push(genes[0][0] + genes[1][1]);
                square.push(genes[0][1] + genes[1][0]);
                square.push(genes[0][1] + genes[1][1]);

                for(let j = 0; j < square.length; j++){
                    if(square[j][0] == square[j][0].toLowerCase() && square[j][1] == square[j][1].toUpperCase()){
                        square[j] = square[j].split("").reverse().join("");
                    }

                }
            } catch (e) {
                childrenGenes.push(genes[0])
            }

            punnetSquares[usedGenes[i]] = square;

        }

        for(let i = 0; i < Object.values(punnetSquares).length; i++){
            let genes = Object.values(punnetSquares)[i];
            if(genes.length == 0) continue;

            // choose a random gene
            let randomGene = Math.floor(Math.random() * genes.length);
            childrenGenes.push(genes[randomGene]);
        }

        return childrenGenes.sort().join("")
    }

    bulkCross(parent1, parent2, amountOfChildren){
        let children = [];
        for(let i = 0; i < amountOfChildren; i++){
            children.push(this.cross(parent1, parent2));
        }

        return children
    }

    getPhenotype(genotype){
        let phenotype = [];
        let genes = genotype.match(/.{1,2}/g);

        for(let i = 0; i < genes.length; i++){
            if(genes[i][0] == genes[i][0].toUpperCase()){
                phenotype.push(Genome.dominantTraits[genes[i][0]]);
            } else {
                phenotype.push(Genome.recessiveTraits[genes[i][0]]);
            }
        }

        return phenotype.join(", ")
    }

    chainCross(startingParent, partners){
        let children = [];

        let parent1 = startingParent;
        let parent2 = partners[0];

        for(let i = 0; i < partners.length; i++){
            parent2 = partners[i];
            children.push(this.cross(parent1, parent2));
            parent1 = parent2;

        }

        return children
    }

    quantify(children){
        let phenotypes = {};
        let phenotypeArray = [];
        for(let i = 0; i < children.length; i++){
            let phenotype = this.getPhenotype(children[i]).split(", ");
            for(let j = 0; j < phenotype.length; j++){
                if(!phenotypeArray.includes(phenotype[j])){
                    phenotypeArray.push(phenotype[j]);
                }
            }
        }

        for(let i = 0; i < phenotypeArray.length; i++){
            phenotypes[phenotypeArray[i]] = 0;
        }

        for(let i = 0; i < children.length; i++){
            let phenotype = this.getPhenotype(children[i]).split(", ");
            for(let j = 0; j < phenotype.length; j++){
                phenotypes[phenotype[j]]++;
            }
        }

        let total = 0;
        for(let i = 0; i < Object.values(phenotypes).length; i++){
            total += Object.values(phenotypes)[i];
        }

        let returnArray = [];

        for(let i = 0; i < Object.keys(phenotypes).length; i++){
            phenotypes[Object.keys(phenotypes)[i]] = (phenotypes[Object.keys(phenotypes)[i]] / total) * 100;
            // remove floating point errors
            phenotypes[Object.keys(phenotypes)[i]] = Math.round(phenotypes[Object.keys(phenotypes)[i]] * 1000) / 1000;
            phenotypes[Object.keys(phenotypes)[i]] += "%";

        }

        for(let i = 0; i < Object.keys(phenotypes).length; i++){
            returnArray.push(Object.keys(phenotypes)[i] + ": " + Object.values(phenotypes)[i]);
        }

        return returnArray
    }


}