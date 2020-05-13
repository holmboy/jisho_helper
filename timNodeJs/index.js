const express = require("express")()
const fetch = require("node-fetch")
const cors = require("cors")

express.use(cors())

//sets up route, the :means that it will use whatever comes after as the search term i.e. /house
express.get("/:lookup", async (req, res) => {
  //parses the url object and stores the search term in a variable
  const searchTerm = encodeURIComponent(req.params.lookup) 
  console.log(searchTerm)

  //hits the api with a template literal, which is a made with the addition of variables
  const getjisho = await fetch(
    `http://beta.jisho.org/api/v1/search/words?keyword=${searchTerm}`
  )
  
  //parses fetched data
  const parseJisho = await getjisho.json()

  //sends data back to client as json
  res.json(parseJisho)
})

//res.json(parseJisho.data[0].japanese)

//sets express server to listen at port 8000
express.listen(8000, (err) =>
  console.log(err || "Node.js/Express Server Running")
)
