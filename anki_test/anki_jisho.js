// ELEMENTS
const yomiButton = document.getElementById("yomi-button")
const kanjiButton = document.getElementById("kanji-button")
const bunButton = document.getElementById("bun-button")

const cardFront = document.querySelector(".front")
const cardRear = document.querySelector(".rear")
const cardJishoDef = document.querySelector(".jisho-def")

var JishoAPI = "http://kitsusan.synology.me:8080/?"
var JishoAPI = "http://localhost:8000/?"
var frontWord = cardFront.innerText

// setup for sanity check when using console and bouncing function local var to this var
var testglobal

// for console use as well.  why two?  I don't know
var jishoRes

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', fetchJisho(frontWord))
yomiButton.addEventListener("click", makeDefCard)


async function fetchJisho(searchTerm) {
    //get json from jisho_helper.js
    const response = await fetch(`http://localhost:8000/${searchTerm}`)

    // result to JSON format or Object
    const parseJisho = await response.json()

    // for console use to check the structure of the data
    json = await parseJisho["data"]

    jishoRes = json
    console.log("jisho data is received")

    return (parseJisho["data"]) // but return to where?  no clue

    // because I cannot figure out how to use the results of this
    // promise outside of the async function, I guess all
    // work that uses the fetch result must stay here.

}

function addListItem(item, list) {
    const listItem = document.createElement("li")
    const listContent = document.createTextNode(item)
    listItem.appendChild(listContent)
    list.appendChild(listItem)
}

function makeDefCard(e) {
    console.log(e.target)
    let jishoData = jishoRes

    // make the div visible
    cardJishoDef.classList.toggle("hide")
    // console.log(jishoData[0])

    // there are multiple matches, handle each
    for (def of jishoData) {
        var newDiv = document.createElement("div")
        newDiv.classList.add("j-def")
        console.log(def)
        // each result has japanese, english (senses), jltp, is_commin, etc
        for (prop of Object.getOwnPropertyNames(def)) {
            var propValue = def[prop]
            // add a ul to the card for this property

            switch (prop) {
                case "japanese":
                    // new UL for this property
                        var newUl = document.createElement("ul")
                        newUl.innerText = prop
                        newUl.classList.add(prop)
                        console.log(newUl)
                    // add each entry as an li
                    for(japaneseDef of propValue){
                        var newLi = document.createElement("li")
                        newUl.appendChild(newLi) 
                        newLi.innerHTML = `<span class="j-word">${japaneseDef["word"]}</span>`
                    }
                    newDiv.appendChild(newUl)
                    break
                case "is_common":
                    console.log(def[prop])
                    break
                case "jlpt":
                    console.log(def[prop])
                    break
                case "senses":
                    console.log(def[prop])
                    break
            }
            
        }
        cardJishoDef.appendChild(newDiv)
    }
}

function xbuildDefCard(def) {
    for (const part in def) {

        // also console sanity check
        // console.log(`${part}: ${jishoDef[part]}`)

        // grab that definitions div element
        let reading_card = document.getElementById("definitions")

        // create a div named slug with the value of slug
        if (part == "slug") {
            let partDiv = document.createElement("div")
            partDiv.setAttribute("id", part)

            // put in the slug value
            partDiv.innerText = def[part]

            // attach that guy to the definitions div
            reading_card.appendChild(partDiv)
        }
        // if it is common, make the div
        // would like this to be more like a badge or icon
        // later
        else if (part == "is_common") {

            if (def[part] == true) {
                // make div with id of json object part name
                let partDiv = document.createElement("div")
                partDiv.setAttribute("id", part)

                partDiv.innerText = "common"

                // slap it in to the definitions div
                reading_card.appendChild(partDiv)
            }
        }
        // japanese key has more going on
        // drill down into the parts for each japanese def
        // currently only handling the first one
        else if (part == "japanese") {

            // make the japanese div
            let partDiv = document.createElement("div")
            partDiv.setAttribute("id", part)
            reading_card.appendChild(partDiv);

            // there can be more than one japanese def
            // only handling the first one for now
            let japanese_defs = def[part]
            console.log(japanese_defs[0])
            let japanese_def = japanese_defs[0]

            // using that global to check things in the console
            testglobal = japanese_defs[0]

            for (let key in japanese_def) {
                console.log(japanese_def[key])
                let japaneseSpan = document.createElement("span")
                japaneseSpan.innerText = japanese_def[key]
                japaneseSpan.setAttribute("id", key)

                document.getElementById(key).appendChild(japaneseSpan)


            }
        }

    }

}
