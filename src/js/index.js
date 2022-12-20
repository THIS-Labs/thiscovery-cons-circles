// format data

const raw = require("../../dev/raw.csv");
const Papa = require('papaparse');
const _ = require('lodash');
const { Chart } = require('chart.js');

function getStandardDeviation (array,sample=false) {
    const n = sample ? array.length-1 : array.length;
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

const totalize_frequencies = (rows,cols=[1,2,3,4,5,6,7,8,9])=>{
    const whole_freq = _.countBy(_.flatten(rows),parseInt);
    if (!cols) return _.values(whole_freq); // BUT! will miss out columns with a freq of 0, ie. never counted
    // better to use cols
    return cols.map(v=>whole_freq[v] || 0);
}

const data = Papa.parse(raw);
let results = [];
const SCALE_SIZE = 9;
data.data.forEach(row=>{
    // get row modal mean
    let freq = _.countBy(row,parseInt);
    let full_freq = Array.from(Array(SCALE_SIZE)).map((v,i)=>{
        return freq[i+1] || 0;
    });
    let max = _.max(_.values(freq));
    let modes = _.keys(freq).filter(k=>freq[k]==max).map(_.toNumber);
    results.push({
        row:row.map(_.toNumber),
        grav : _.mean(modes),
        range : _.keys(freq).length,
        stdDev : getStandardDeviation(row.map(_.toNumber),true),
        full_freq
    });
});

console.debug(`Mean Std Deviation : ${_.mean(results.map(({stdDev})=>stdDev))}`); 

const allRows =  results.map(({row})=>row);
const allRowsTotal = totalize_frequencies(allRows);

results = _.shuffle(results);
results = _.sortBy(results,["range","stdDev"]);

const quartileCutoffs = [
    _.floor(results.length/4),
    2 * _.floor(results.length/4),
    3 * _.floor(results.length/4),
];

// console.debug({results});

const first_quartile = totalize_frequencies(_.slice(allRows,0,quartileCutoffs[0]));
const second_quartile = totalize_frequencies(_.slice(allRows,quartileCutoffs[0],quartileCutoffs[1]));
const third_quartile = totalize_frequencies(_.slice(allRows,quartileCutoffs[1],quartileCutoffs[2]));
const fourth_quartile = totalize_frequencies(_.slice(allRows,quartileCutoffs[2]));

// console.debug({
//     first_quartile,
//     second_quartile,
//     third_quartile,
//     fourth_quartile
// });

let condensed_results = _.chunk(results,4).map(chunk=>{return chunk.map(({full_freq})=>full_freq)});
const column_totals = (rows)=>{
    return rows[0].map((value,column)=>{
        return _.sum(rows.map(row=>row[column]));
    })
}
condensed_results = condensed_results.map(column_totals);

let quartile_results = _.chunk(results,_.ceil(results.length / 4)).map(chunk=>{return chunk.map(({full_freq})=>full_freq)});
quartile_results = quartile_results.map(column_totals);

const midsExtremesNinePoint = (row)=>{
    return [row[4],row[5]+row[3],row[6]+row[2],row[7]+row[1],row[8]+row[0]];
}

// present

import { ConsCircles } from "./ConsCircles.js";
const Bliss = require('blissfuljs');

const pages = [
    // ()=>{
    //     window.g = new ConsCircles({
    //         dataIn : {
    //             allRowsTotal
    //             // "allRows" : [2973,1187,951,437,432]
    //             // "Extremes" : [2158,228,286,103,215],
    //             // "bottom" : [815,959,665,334,217],
    //             // "3rd Quartile" : [443,573,293,99,87],
    //             // "4th Quartile" : [372,386,372,235,130]
    //         },
    //         labels: ["1","2","3","4","5","6","7","8","9"],
    //         caption : "Scale range",
    //         colors: ["crimson","lightpink","gold","maroon","lightsteelblue","mediumseagreen"],
    //         showCaption: true,
    //         extFont: "https://thiscovery-public-assets.s3.eu-west-1.amazonaws.com/fonts/fonts.css",
    //         fontFamily: `"thisco_Brown", "Brown-Regular", Arial, "Helvetica Neue", Helvetica, sans-serif`,
    //         nStyle : "all"
    //     });
    //     // g.inView = ["Doctors"];
    //     g.init();
    // },
    ()=>{
        window.g = new ConsCircles({
            dataIn : {
                // "allRows" : [74,46,129,123,432,314,822,1141,2899]
                // "allRows" : [2973,1187,951,437,432]
                // "Extremes" : [2158,228,286,103,215],
                // "Extremes" : [1990,468,306,73,153], // method B
                // "Extremes" : [1852,565,344,92,137], // method C
                // "bottom" : [815,959,665,334,217],
                // "3rd Quartile" : [443,573,293,99,87],
                // "3rd Quartile" : [593,351,278,131,142], // method B
                // "3rd Quartile" : [638,303,274,148,132], // method c
                // "4th Quartile" : [372,386,372,235,130]
                // "4th Quartile" : [390,368,367,233,137] // method B
                // "4th Quartile" : [483,319,333,197,163] // method c
                "1st Quartile" : midsExtremesNinePoint(quartile_results[0]),
                "2nd Quartile" : midsExtremesNinePoint(quartile_results[1]),
                "3rd Quartile" : midsExtremesNinePoint(quartile_results[2]),
                "4th Quartile" : midsExtremesNinePoint(quartile_results[3])
            },
            labels: ["Mid","6/4","7/3","8/2","9/1"],
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
        const container = $(".cons-circles");
        const canv = $.create("canvas",{
            style : {
                width : "100%",
                height: "70vh"
            }
        });
        container.appendChild(canv);
        canv.width = canv.clientWidth * devicePixelRatio;
        canv.height = canv.clientHeight * devicePixelRatio;
        const ctx = canv.getContext('2d');
        const data = {
            datasets : [{
                label : "StdDev v Modal Average",
                data : results.map((item,i)=>{
                    const x = i ;
                    return {y:item.stdDev,x:item.grav}
                }),
                borderColor: "crimson",
                fill: false
            }]
        };
        const config = {
            type : 'scatter',
            data,
            options : {}
        };
        const chart = new Chart(ctx,config);
    },
    ()=>{
        // we're going to borrow cons-circles for a graph
        const container = $(".cons-circles");
        const canv = $.create("canvas",{
            style : {
                width : "100%",
                height: "70vh"
            }
        });
        container.appendChild(canv);
        canv.width = canv.clientWidth * devicePixelRatio;
        canv.height = canv.clientHeight * devicePixelRatio;
        const ctx = canv.getContext('2d');
        const data = {
            datasets :[{
                label : "Nines",
                data : results.map((item,i)=>{
                    const x = i ;
                    return {x,y:item.full_freq[8]}
                }),
                // data : [10,20,30,40],
                borderColor: "blue",
                fill : false,
                tension : 0.1
            },{
                label : "Eights",
                data : results.map((item,i)=>{
                    const x = i ;
                    return {x,y:item.full_freq[7]}
                }),
                // data : [10,20,30,40],
                borderColor: "gold",
                fill : false,
                tension : 0.1
            },{
                label : "Sevens",
                data : results.map((item,i)=>{
                    const x = i ;
                    return {x,y:item.full_freq[6]}
                }),
                // data : [10,20,30,40],
                borderColor: "crimson",
                fill : false,
                tension : 0.1
            },{
                label : "Sixes",
                data : results.map((item,i)=>{
                    const x = i ;
                    return {x,y:item.full_freq[5]}
                }),
                // data : [10,20,30,40],
                borderColor: "seagreen",
                fill : false,
                tension : 0.1
            }]
        };
        console.debug({nines:data.datasets[0].data});
        const config = {
            type : 'scatter',
            data,
            options : {}
        };
        const chart = new Chart(ctx,config);

    },
    ()=>{
        // we're going to borrow cons-circles for a graph
        const container = $(".cons-circles");
        const canv = $.create("canvas",{
            style : {
                width : "100%",
                height: "70vh"
            }
        });
        container.appendChild(canv);
        canv.width = canv.clientWidth * devicePixelRatio;
        canv.height = canv.clientHeight * devicePixelRatio;
        const ctx = canv.getContext('2d');
        const data = {
            datasets :[{
                label : "Extremes",
                data : condensed_results.map((item,i)=>({x:i,y:item[8]+item[0]+item[4]})),
                borderColor: "blue",
                fill : false,
                tension : 0.1
            },{
                label : "Eights or Twos",
                data : condensed_results.map((item,i)=>({x:i,y:item[7]+item[1]})),
                borderColor: "gold",
                fill : false,
                tension : 0.1
            },{
                label : "Sevens or Threes",
                data : condensed_results.map((item,i)=>({x:i,y:item[6]+item[2]})),
                borderColor: "crimson",
                fill : false,
                tension : 0.1
            },{
                label : "Sixes or Fours",
                data : condensed_results.map((item,i)=>({x:i,y:item[5]+item[3]})),
                borderColor: "seagreen",
                fill : false,
                tension : 0.1
            }]
        };
        console.debug({nines:data.datasets[0].data});
        const config = {
            type : 'scatter',
            data,
            options : {}
        };
        const chart = new Chart(ctx,config);

    },
    // ()=>{
    //     window.g = new ConsCircles({
    //         labels: ["Disagree","","Agree"],
    //         caption : "Example",
    //         colors: ["crimson","lightpink","gold","maroon","lightsteelblue","mediumseagreen"],
    //         showCaption: true,
    //         extFont: "https://thiscovery-public-assets.s3.eu-west-1.amazonaws.com/fonts/fonts.css",
    //         fontFamily: `"thisco_Brown", "Brown-Regular", Arial, "Helvetica Neue", Helvetica, sans-serif`,
    //         nStyle : "highLow"
    //     });
    //     // g.inView = ["Doctors"];
    //     g.init();
    // }
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