class Genome {
    static dominantTraits = {}
    static recessiveTraits = {}
    static mutationRate = 0
    static shuffleArray(d) {
        for(var c = d.length - 1; c > 0; c--){
            var b = Math.floor(Math.random() * (c + 1));
            var a = d[c];
            d[c] = d[b];
            d[b] = a;
        }
        return d
    };

    constructor(genes, mutationRate){
        if(genes == undefined) throw new Error("No genes provided");
        if(mutationRate == undefined) throw new Error("No mutation rate provided");
        if(typeof genes != "object") throw new Error("Genes must be an object");
        if(typeof mutationRate != "number") throw new Error("Mutation rate must be a number");

        Genome.mutationRate = mutationRate;

        let letters = Object.keys(genes);
        let dominantTraits = Object.values(genes).map(x => x[0]);
        let recessiveTraits = Object.values(genes).map(x => x[1]);

        for(let i = 0; i < letters.length; i++){
            Genome.dominantTraits[letters[i].toUpperCase()] = dominantTraits[i];
            Genome.recessiveTraits[letters[i].toLowerCase()] = recessiveTraits[i];
        }
    }

    random(len){
        
    }
}