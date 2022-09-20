import { ConsCircles } from "./ConsCircles";
window.g = new ConsCircles({
    labels: ["Disagree","Agree"],
    caption : "Example",
    colors: ["crimson","lightpink","gold","maroon","lightsteelblue","mediumseagreen"],
    showCaption: true,
    extFont: "https://thiscovery-public-assets.s3.eu-west-1.amazonaws.com/fonts/fonts.css",
    fontFamily: `"thisco_Brown", "Brown-Regular", Arial, "Helvetica Neue", Helvetica, sans-serif`,
    nStyle : "all"
});
g.init();