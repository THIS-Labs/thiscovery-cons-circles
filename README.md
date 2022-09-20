# ConsCircles.js

Script to create opinionated infographics showing frequency of values for small-scales - eg. survey rankings. Populations can be displayed by individual group. Like so!

<div class="cons-circles"></div>
<script src="/dist/ConsCircles.js" type="module"></script>
<script>const g = new ConsCircles({
    labels: ["Disagree","Agree"],
    caption : "Example",
    colors: ["crimson","lightpink","gold","maroon","lightsteelblue","mediumseagreen"],
    showCaption: true,
    extFont: "https://thiscovery-public-assets.s3.eu-west-1.amazonaws.com/fonts/fonts.css",
    fontFamily: `"thisco_Brown", "Brown-Regular", Arial, "Helvetica Neue", Helvetica, sans-serif`,
    nStyle : "all"
});
g.init();</script>
