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

// set to receive fetchJisho()'s 'data' object
// can't figure out how to just return 'data' object
//  via return()
var jishoRes

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', fetchJisho(frontWord))
yomiButton.addEventListener("click", makeDefCard)

// get jisho.org API data via node.js proxy
async function fetchJisho(searchTerm) {
    //get json from jisho_helper.js
    const response = await fetch(`http://localhost:8000/${searchTerm}`)

    // result to JSON
    const parseJisho = await response.json()

    // get just the 'data' object
    json = await parseJisho["data"]

    // place 'data' object to global var
    jishoRes = json
    console.log("jisho data is received")

    return (parseJisho["data"]) // but return to where?  no clue
}

function makeDefCard(e) {
    let jishoData = jishoRes

    // make the div visible
    cardJishoDef.classList.toggle("hide")
    // console.log(jishoData[0])

    // new div for this definition data
    var defList = document.createElement("ul")
    defList.classList.add("j-defs")

    // there are multiple matches, handle each
    for (def of jishoData) {

        console.log(def)

        // new list item for this def
        var defListItem = document.createElement("li")
        defListItem.classList.add("j-def")

        // for is_common, add class to defList of 'common'
        if (def["is_common"] === true) {
            defListItem.classList.add("common")
        }
        // for japanese array, append a div with japanese info via function
        defListItem.appendChild(newJapaneseSpan(def["japanese"]))

        // for senses array, which holds the english_definitions
        defListItem.appendChild(newEngSpan(def["senses"]))

        // if there is anything in the 'tags' array
        if (def["tags"].length > 0) {
            let tagsSpan = document.createElement("span")
            tagsSpan.classList.add("tags")
            tagsSpan.innerText = def["tags"].join(", ")
            // append to newDiv
            defListItem.appendChild(tagsSpan)
        }
        defList.appendChild(defListItem)
    }
    // the definition div is complete!  append to the jisho 'card'
    cardJishoDef.appendChild(defList)

}

function newJapaneseSpan(japaneseArray) {
    // new div, class 'j-word'
    var newSpan = document.createElement("span")
    newSpan.classList.add("j-word")

    // add each entry as an li
    for (japaneseDef of japaneseArray) {
        // via the innerHTML approach to spice things up
        newSpan.innerHTML += `<span>${japaneseDef["word"]}【${japaneseDef["reading"]}】</span>`
    }

    return (newSpan)
}

function newEngSpan(sensesArray) {
    // new div with 'eng-word' class added
    var newSpan = document.createElement("span")
    newSpan.classList.add("eng-word")
    // just going to work with first senses object for now
    let sensesObject = sensesArray[0]
    // new span because I don't understand when to use spans
    var englishSpan = document.createElement("span")
    englishSpan.innerText = sensesObject["english_definitions"].join(", ")
    englishSpan.classList.add("eng-word")
    // put the span in the div
    newSpan.appendChild(englishSpan)

    // if there is anything in the parts_of_speech property
    // tack it on to the english div or span or whatever
    if (sensesObject["parts_of_speech"].length > 0) {
        let partOfSpeechSpan = document.createElement("span")
        partOfSpeechSpan.classList.add("part-of-speech")
        partOfSpeechSpan.innerText = sensesObject["parts_of_speech"].join(", ")
        // append to newSpan
        newSpan.appendChild(partOfSpeechSpan)
    }

    return (newSpan)
}

function newJlptLi(jlptObject) {
    // new span of class 'jlpt'
    var jlptSpan = document.createElement("span")
    jlptSpan.classList.add("jlpt")
    // break down jlpt object/array to single comma separated string
    jlpt.innerText = jlptObject.join("; ")

    return (jlptSpan)
}