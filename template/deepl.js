const translate = require("deepl");
const { storage } = require("firebase-admin");
const fs = require("fs");
const { stopCoverage } = require("v8");

const firebaseConfig = {
    apiKey: "AIzaSyCvkRNaXsCoDDoZ8jfJAvV1Wofqn-B7b6U",
    authDomain: "job-board-database.firebaseapp.com",
    projectId: "job-board-database",
    storageBucket: "job-board-database.appspot.com",
    messagingSenderId: "97894020421",
    appId: "1:97894020421:web:bf82170b67900b2104fa2c",
    measurementId: "G-XLNNESECJ3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function getParams() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var filaParam = url.searchParams.get("file");
    return filaParam;
}

function checkDict(object, dict) {
    var object_keys = [];
    var dict_keys = [];

    var valid = true;

    Object.keys(object).forEach(async function (key) {
        object_keys.push(key);
    })


    Object.keys(dict).forEach(async function (key) {
        dict_keys.push(key);
    })

    for (let index = 0; index < object_keys.length; index++) {
        if (!dict_keys.includes(object_keys[index])) {
            valid = false;
        }
    }

    console.log(object_keys, dict_keys, valid);

    return valid;
}

const configRaw = fs.readFileSync("template/credentials/credentials.json");
var config = JSON.parse(configRaw);


function TranslateObject(object, store = {}) {
    Object.keys(object).forEach(async function (key) {


        if (typeof object[key] === "object") {
            store[key] = {};
            store[key] = TranslateObject(object[key], store[key]);
        }
        else if (typeof object[key] === "string") {
            //api key f4327f9c-bb0e-30fe-345a-80f081dc666f:fx
            await translate({
                free_api: true,
                text: object[key].toString(),
                target_lang: config["output_lan"],
                auth_key: config["api_key"]
            }).then(async function (result) {
                store[key] = result.data["translations"][0]["text"];
            }).catch(error => {
                console.log(error);
            });
        }
        console.log("Result: \n")

        console.log(store);

        $.getJSON(`https://firebasestorage.googleapis.com/v0/b/job-board-database.appspot.com/o/json_files_input%2F${getParams()}?alt=media&token=267b09fd-cf27-4a50-885e-dbc8df1174e0`, function (data) {


            if (checkDict(data, store)) {
                var storageRef = firebase.storage().ref(`json_files_input/${config["output_lan"].toLowerCase()}.json`);

                storageRef.putString(JSON.stringify(store)).then(() => {
                    var loadingButton = document.getElementById("loading-button");
                    var processingText = document.getElementById("process-text");

                    loadingButton.innerText = "Download";
                    processingText.innerText = `${config["output_lan"].toLowerCase()}.json`
                    loadingButton.onclick = () => {
                        window.location.href = `https://firebasestorage.googleapis.com/v0/b/job-board-database.appspot.com/o/json_files_input%2F${config["output_lan"].toLowerCase()}.json?alt=media&token=da67f0ab-c9dd-485a-9204-5ef02e1c4d6f`
                    }
                })
            }
        });

        /*

        var storageRef = firebase.storage().ref("json_files_input/Output.json");

        storageRef.putString(JSON.stringify(store)).then(() => {
            var loadingButton = document.getElementById("loading-button");
            var processingText = document.getElementById("process-text");

            loadingButton.innerText = "Download";
            processingText.innerText = "Output.json"
            loadingButton.onclick = () => {
                window.location.href = "https://firebasestorage.googleapis.com/v0/b/job-board-database.appspot.com/o/json_files_input%2FOutput.json?alt=media&token=da67f0ab-c9dd-485a-9204-5ef02e1c4d6f"
            }
        })
        */
    })



    return store;
}

$.getJSON(`https://firebasestorage.googleapis.com/v0/b/job-board-database.appspot.com/o/json_files_input%2F${getParams()}?alt=media&token=267b09fd-cf27-4a50-885e-dbc8df1174e0`, function (data) {
    TranslateObject(data);
});


