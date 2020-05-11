// ELEMENTS
const yomiButton = document.getElementById("yomi-button")
const kanjiButton = document.getElementById("kanji-button")
const bunButton = document.getElementById("bun-button")

const cardFront = document.querySelector(".front")
const cardRear = document.querySelector(".rear")
const cardJishoDef = document.querySelector(".jisho-defs")

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
        // new div for this definition data
        var newDiv = document.createElement("div")
        newDiv.classList.add("j-def")

        console.log(def)
        // each result has japanese, english (senses), jltp, is_commin, etc
        for (prop of Object.getOwnPropertyNames(def)) {

            var propValue = def[prop]

            // div for each prop?
            var propDiv = document.createElement("div")
            propDiv.classList.add("j-prop")
            propDiv.id = prop
            switch (prop) {
                case "japanese":
                    // add prop name to div
                    propDiv.innerText = "Japanese"

                    // new UL for this property
                    var newUl = document.createElement("ul")

                    // add each entry as an li
                    for (japaneseDef of propValue) {

                        // new li with span
                        var newLi = document.createElement("li")
                        newUl.appendChild(newLi)
                        newLi.innerHTML = `<span class="j-word">${japaneseDef["word"]} 【${japaneseDef["reading"]}】</span>`
                    }
                    propDiv.appendChild(newUl)
                    break

                case "is_common":

                    break

                case "jlpt":

                    break

                case "senses":
                    // add prop name to div
                    propDiv.innerText = "English"

                    // new UL for this property
                    var newUl = document.createElement("ul")
                
                    // add each entry as an li
                    for (engDef of propValue[0]["english_definitions"]) {
                        var newLi = document.createElement("li")
                        newUl.appendChild(newLi)
                        newLi.innerHTML = JSON.stringify(engDef)
                    }
                    propDiv.appendChild(newUl)
                    break
                default:
                    break
            }
            newDiv.appendChild(propDiv)
        }
        cardJishoDef.appendChild(newDiv)
    }
}