
// Consensus Circles infographic generator
// Glyn Cannon
// 0.1 Sept 2022

const Bliss = require('blissfuljs');
const _ = require('lodash');

import '../css/main.css';

const FIXTURE = {
    "Farmers" : [2,4,45,56,23,22,2],
    "Doctors" : [3,56,45,4,1,1,0],
    "Lawyers" : [45,34,23,4,6,1,0]
}

const DEFAULTS = {
    dataIn : FIXTURE,
    extFont : null, // URL for external font, must also be defined in fontFamily to work
    fontFamily : `system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    colors : ["royalblue","darkorange","darkorchid","gold","deeppink","seagreen","orangered","limegreen","lightskyblue","slategray"], // first color is used as default and for 'All' aggregate
}
