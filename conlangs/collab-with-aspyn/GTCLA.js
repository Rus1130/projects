/*dictionary model:

english-word : {
    partOfSpeech: "",
    Romanization: "",
    IPA: "",
    Script: ""
}

grammar model:
gloss : {
    prefix: true/false,
    intermed-n: true/false,
    Romanization: "",
    IPA: "",
    Script: ""
}
*/

const intermed_n = {
    Romanization: "n",
    IPA: "n",
    Script: "ᱰ"
}

const vowels = {
    Romanization: /i|u|o|e|a|í|á|ú/g,
    IPA: /i|u|o|ɛ|ɑ|ɨ|ɔ|y/g,
    Script: /᱑|᱒|᱔|᱖|᱕|ᱽ|᱗|᱙/g
}

const consonants = {
    Romanization: /p|t|k|m|mh|n|nh|h|ħ|f|ť|s|ś|x|g|ć|j|ŕ|r|l|w/g,
    IPA: /p|t|k|m|m̥|n|n̥|h|ɦ|f|θ|s|ç|x|ɣ|t͡ɕ|j|r|ɾ|l|w/g,
    Script: /ᱚ|ᱜ|ᱟ|ᱦ|ᱬ|ᱰ|ᱵ|ᱧ|ᱞ|ᱥ|ᱱ|ᱤ|ᱴ|ᱡ|ᱢ|ᱶ|ᱳ|ᱯ|ᱝ|ᱮ|ᱩ/g
}

let invalidLexemeError = false;
let invalid_lexemes = []

function analyze(gloss, returnType){
    invalidLexemeError = false;
    invalid_lexemes = [];
    if (returnType != "IPA" && returnType != "Romanization" && returnType != "Script") {
        return console.error("invalid returnType")
    } else {
        if(gloss.trim() == "") return document.getElementById('output').value = `Input cannot be empty`
        let totalGloss = gloss.replaceAll(".","_").trim().split(/-| /)
        let output = ""
        let glossToAnalyze = []
        for(i = 0; i < totalGloss.length; i++){
            if(grammar[totalGloss[i]]){
                glossToAnalyze.push(grammar[totalGloss[i]][returnType])
            } else if (dictionary[totalGloss[i]]){
                if(dictionary[totalGloss[i]].intermed_n){
                    glossToAnalyze.push(dictionary[totalGloss[i]][returnType] + "--")
                } else {
                    glossToAnalyze.push(dictionary[totalGloss[i]][returnType])
                }
            } else {
                invalidLexemeError = true
                invalid_lexemes.push(totalGloss[i])
            }

            invalid_lexemes = [...new Set(invalid_lexemes)]
        }
        if(invalidLexemeError){
            return document.getElementById('output').value = `Invalid lexeme(s): ${invalid_lexemes.join(", ")}`
        }

        let rawTranslatedText = glossToAnalyze.join(" ").replaceAll("-- ++",intermed_n[returnType]).replaceAll(/ \+\+|\+\+| --|--/g,"")

        if(returnType == 'Romanization' || returnType == 'Script' ){
            let translatedText = rawTranslatedText.split(`${grammar["||"][returnType]} `).map(function(word){
                return word.charAt(0).toUpperCase() + word.slice(1)
            }).join(`${grammar["||"][returnType]} `) + grammar["||"][returnType]
        
            output = translatedText.replaceAll(` ${grammar["||"][returnType]}`, grammar["||"][returnType]).replaceAll(" ,",",")
        } else {
            output = rawTranslatedText
        }

        if(returnType == "IPA"){
            output = "[" + output + "]"
        }

        return output
    }
}

function print_output(input, returnType){
    document.getElementById('output').value = analyze(input, returnType)
}

// WORDS && GRAMMAR ===========================================================================================================================

const grammar = {
    "|": {
        Romanization: ",",
        IPA: "|",
        Script: "᱿"
    },
    "||": {
        Romanization: ".",
        IPA: "||",
        Script: "᱾"
    },
    PST: {
        Romanization: "++ia",
        IPA: "++iɑ̯",
        Script: "++᱑᱒"
    },
    PRS: {
        Romanization: "++",
        IPA: "++",
        Script: "++"
    },
    FUT: {
        Romanization: "++iśi",
        IPA: "++içi",
        Script: "++᱑ᱴ᱑"
    },
    HYPO_PST: {
        Romanization: "++ást",
        IPA: "++ɔst",
        Script: "++᱗ᱤᱜ"
    }

}

const dictionary = {
    test: {
        intermed_n: false,
        partOfSpeech: "verb",
        Romanization: "wít",
        IPA: "wɨt",
        Script: "ᱩᱽᱜ"
    },
    book: {
        intermed_n: true,
        partOfSpeech: "noun",
        Romanization: "ana",
        IPA: "ɑnɑ",
        Script: "᱕ᱰ᱕"
    }
}