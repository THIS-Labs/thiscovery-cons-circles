const stdin = require('stdin');
const Papa = require('papaparse');
const _ = require('lodash');

function getStandardDeviation (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  }

stdin((str)=>{
    const data = Papa.parse(str);
    let results = [];
    data.data.forEach(row=>{
        // get row modal mean
        let freq = _.countBy(row,parseInt);
        let max = _.max(_.values(freq));
        let modes = _.keys(freq).filter(k=>freq[k]==max).map(_.toNumber);
        // console.debug({modes});
        results.push({
            grav : _.mean(modes),
            range : _.keys(freq).length,
            stdDev : getStandardDeviation(row.map(_.toNumber))
        });
    })
    console.log(Papa.unparse(results));
});
