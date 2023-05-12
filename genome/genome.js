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
            Genome.recessiveTraits[letters[i].toUpperCase()] = recessiveTraits[i];
        }
    }

    random(len){
        let traits = [...Object.keys(Genome.recessiveTraits)];
        let length = len || traits.length;
        let genotype = '';

        // randomize the traits array
        traits = Genome.shuffleArray(traits);

        for(let i = 0; i < traits.length; i++){
            if(i >= length) break;
            let gene = '';
            let randomTrait1 = Math.floor(Math.random() * 2);
            let randomTrait2 = Math.floor(Math.random() * 2);
            if(randomTrait1 == 0) gene += traits[i].toLowerCase();
            else gene += traits[i].toUpperCase();

            if(randomTrait2 == 0) gene += traits[i].toLowerCase();
            else gene += traits[i].toUpperCase();

            if(gene[0] == gene[0].toLowerCase() && gene[1] == gene[1].toUpperCase()){
                gene = gene.split("").reverse().join("");

            }

            genotype += gene;
        }

        return genotype
    }

    cross(parent1, parent2){
        
    }


}