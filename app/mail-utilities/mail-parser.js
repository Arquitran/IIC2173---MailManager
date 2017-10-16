const axios = require('axios')
//WIP while queue is defined
const url = 'http://httpbin.org/post'

module.exports = {
    parseEmail: function(body, subject, email, name, date) {
        //Receive extra information in case it's needed in the future
        let t0 = body.split("\n")
        console.log(t0)
        let jsonB
        for (i = 0; i < t0.length -1; i++) {
            let tl = t0[i].split(/\s+/)
            if (tl[0] === "buy") {
                jsonB = {
                    action: "buy",
                    product: tl[1],
                    ammount: tl[2]
                }
            } else if (tl[0] === "view") {
                jsonB = {
                    action: "view",
                    product: tl[1],
                    ammount: null
                }
            } else if (tl[0] === "category") {
                jsonB = {
                    action: "category",
                    product: tl[1],
                    ammount: null
                }
            } else {
                jsonB = null
            }
            //Axios is a temporary solution until the queue is chosen
            axios.post(url, jsonB)
            .then(function(response) {
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error)
            }) 
        }
    }
}