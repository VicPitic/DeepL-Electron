const translate = require("deepl");
const fs = require("fs")


let rawdata = fs.readFileSync("json_files/students.json")

var inputData = JSON.parse(rawdata);
var inputString = JSON.stringify(inputData);

Object.keys(inputData).forEach(function (key) {
    translate({
        free_api: true,
        text: key.toString(),
        target_lang: "RO",
        auth_key: "f4327f9c-bb0e-30fe-345a-80f081dc666f:fx"
    }).then(result => {
        //console.log(result.data["translations"][0]["text"].toString(), key.toString());
        inputString = inputString.replace(key.toString(), result.data["translations"][0]["text"].toString());
        console.log(inputString);
    }).catch(error => {
        console.log(error);
    });
});

console.log(inputString);

//console.log(inputString.replace("name", "inlocuit"));



