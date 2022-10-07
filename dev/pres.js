import { ConsCircles } from "../src/js/ConsCircles";
const Bliss = require('blissfuljs');

const pages = [
    ()=>{
        window.g = new ConsCircles({
            dataIn : {
                "allRows" : [74,46,129,123,432,314,822,1141,2899]
                // "allRows" : [2973,1187,951,437,432]
                // "Extremes" : [2158,228,286,103,215],
                // "bottom" : [815,959,665,334,217],
                // "3rd Quartile" : [443,573,293,99,87],
                // "4th Quartile" : [372,386,372,235,130]
            },
            labels: ["1","2","3","4","5","6","7","8","9"],
            caption : "Scale range",
            colors: ["crimson","lightpink","gold","maroon","lightsteelblue","mediumseagreen"],
            showCaption: true,
            extFont: "https://thiscovery-public-assets.s3.eu-west-1.amazonaws.com/fonts/fonts.css",
            fontFamily: `"thisco_Brown", "Brown-Regular", Arial, "Helvetica Neue", Helvetica, sans-serif`,
            nStyle : "all"
        });
        // g.inView = ["Doctors"];
        g.init();
    },
    ()=>{
        window.g = new ConsCircles({
            dataIn : {
                // "allRows" : [74,46,129,123,432,314,822,1141,2899]
                // "allRows" : [2973,1187,951,437,432]
                "Extremes" : [2158,228,286,103,215],
                // "bottom" : [815,959,665,334,217],
                "3rd Quartile" : [443,573,293,99,87],
                "4th Quartile" : [372,386,372,235,130]
            },
            labels: ["9 or 1","8 or 2","7 or 3","6 or 4","5"],
            caption : "Scale range",
            colors: ["crimson","lightpink","gold","maroon","lightsteelblue","mediumseagreen"],
            showCaption: true,
            extFont: "https://thiscovery-public-assets.s3.eu-west-1.amazonaws.com/fonts/fonts.css",
            fontFamily: `"thisco_Brown", "Brown-Regular", Arial, "Helvetica Neue", Helvetica, sans-serif`,
            nStyle : "all"
        });
        // g.inView = ["Doctors"];
        g.init();
    },
    ()=>{
        window.g = new ConsCircles({
            labels: ["Disagree","","Agree"],
            caption : "Example",
            colors: ["crimson","lightpink","gold","maroon","lightsteelblue","mediumseagreen"],
            showCaption: true,
            extFont: "https://thiscovery-public-assets.s3.eu-west-1.amazonaws.com/fonts/fonts.css",
            fontFamily: `"thisco_Brown", "Brown-Regular", Arial, "Helvetica Neue", Helvetica, sans-serif`,
            nStyle : "highLow"
        });
        // g.inView = ["Doctors"];
        g.init();
    }
]

let pageNo = 0;
pages[pageNo].call(this);
window.document.body.addEventListener("keydown",(evt)=>{
    evt.stopPropagation();
    if (evt.code == "ArrowRight") {
        pageNo = pageNo + 1;
        if (pageNo > pages.length-1) pageNo = pages.length-1;
        $(".cons-circles").innerHTML = "";
        pages[pageNo].call(this);
    }
    if (evt.code == "ArrowLeft") {
        pageNo = pageNo - 1;
        if (pageNo < 0) pageNo = 0;
        $(".cons-circles").innerHTML = "";
        pages[pageNo].call(this);
    }
})