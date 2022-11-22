const https = require("https");
const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: true }));
require('dotenv').config()

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index");
});
app.post("/", function (req, res) {
    let name=req.body.movie_name;
    const api_key=process.env.API_KEY;
    const url=`https://www.omdbapi.com/?t=${name}&apikey=${api_key}`;
    https.get(url, function (response) {       
        let finalData = '';
        console.log(url);
        response.on("data", function (data) {
            finalData += data.toString();
        });
        response.on("end", function() {
           const parsedData = JSON.parse(finalData);
           if(parsedData.Response=="False"){
              res.render("not_found",{name:name});
           }
           else{
            
               res.render("movie_details_copy",{object:parsedData});
           }
        });
   })

})

app.listen(3000, () => console.log("Server is running"));