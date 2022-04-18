const RusPK = {
    encloser : {
        check: (string, leftEncloser, rightEncloser) => {
            return Boolean (string[0] == leftEncloser && string[string.length - 1] == rightEncloser)
        },
        add: (string, leftEncloser, rightEncloser) => {
            return leftEncloser + string + rightEncloser
        },
        un: (string) => {
            return string.slice(1,-1)
        },
        return: (string) => {
            return {left: string[0], right: string[string.length - 1]}
        }
    },
    randomizer: (object) => {
        const errMessage = `${object} is not an object with a value and a probability. Must be an array of objects as such: [{v: index_value, p: index_probability},{v: index_value, p: index_probability},{v: index_value, p: index_probability}]`
        console.log(RusPK.encloser.return(JSON.stringify(object)))

        if(typeof object !== 'object') return console.error(errMessage)
        for(i = 0; i < object.length; i++) {
            if(!object[i].v || !object[i].p) return console.error(errMessage)
            if(typeof object[i].p !== 'number') return console.error(`Probability of ${object[i].v} must be a number`)
            if(object[i].p < 0) return console.error(`Probability of ${object[i].value} must be a positive number`)
        }


        return object
    }
}