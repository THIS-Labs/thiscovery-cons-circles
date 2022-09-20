// Consensus Circles infographic generator
// Glyn Cannon
// 0.1 Sept 2022

const Bliss = require('blissfuljs');
const _ = require('lodash');
const Color = require('color');

window.inter_functions = {
    linear: (t, b, c, d) => {
        return (c - b) * t / d + b;
    },
    easeInQuad: (t, b, c, d) => {
        t /= d;
        return (c - b) * t * t + b;
    },
    easeOutQuad: (t, b, c, d) => {
        t /= d;
        return -(c - b) * t * (t - 2) + b;
    },
    easeInOutQuad: (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c - b) / 2 * t * t + b;
        t--;
        return -(c - b) / 2 * (t * (t - 2) - 1) + b;
    }
};

const DEFAULT_EASING = "easeInOutQuad"; // easing is global

window.interpolate = ({ a, b, time, duration, easing = DEFAULT_EASING }) => {
    const getVal = inter_functions[easing];
    if (Array.isArray(a)) {
        return a.map((value, i) => {
            return getVal(time, a[i], b[i], duration);
        });
    } else if (isFinite(a)) {
        return getVal(time, a, b, duration);
    } else {
        return a;
    }
};

const EMBED_STYLES = `
    .cons-circles figcaption { white-space:nowrap; overflow:hidden; text-overflow: ellipsis; transition: color .3s; height: 1.2em; }
    .cc-controls {display:flex; justify-content:space-between; align-items:center; }
    ul.cc-controls-group { display:flex; justify-content:center; padding: 0 2rem; flex-wrap:wrap; }
    button.cc-control { appearance:none; -webkit-appearance:none; border:none; border-radius:999px; margin:.2em; font-size: .7em; padding: .08em .6em; padding-left:1em; font-family:inherit; position:relative; white-space:nowrap;}
    button.cc-control:before { content:"\\2022"; display:inline-block; font-size:1em; line-height: 0; vertical-align:unset; position:absolute; left: .5ch; top: 1ch; }
    select.cc-nstyle-select { appearance:none; -webkit-appearance:none; }
    button.cc-global-switch, select.cc-nstyle-select { height: 2.4ch; font-family: inherit; border:none; border-radius:999px; margin:.2em; padding: .08em .6em; color:white; font-size: .4em; background:lightslategray; cursor:pointer;}
    button.cc-global-switch.active { border:.5px solid lightslategray; color: slategray; background: white;}
    button.cc-global-switch:hover, button.cc-global-switch:active {filter:brightness(0.7);}
    .cc-controls.no-groups button.cc-global-switch, .cc-controls.no-groups ul.cc-controls-group { visibility:hidden; }
`; 

const FIXTURE = {
    "Farmers": [2, 4, 45, 56, 23, 22, 2],
    "Doctors": [3, 56, 45, 4, 1, 1, 0],
    "Lawyers": [45, 34, 23, 4, 6, 1, 0]
}

const DEFAULTS = {

    allowGroupMix: true,
    allowGroupMixColorMix: true,
    altColumns: null, // alt numerical labelling for the columns
    byArea : false,
    bgColor: "white", // background is transparent, but a colour to react to can be set
    canvasRes: 1000, // lower numbers improve performance?
    caption: "The default data",
    colors: ["seagreen", "orangered", "lightskyblue","gold", "deeppink", "limegreen","royalblue", "darkorange", "darkviolet"], // first color is used as default and for 'All' aggregate
    dataIn: FIXTURE,
    debug: false,
    easing: null, // override default easing
    extFont: null, // URL for external font stylesheet, must also be defined in fontFamily to work
    fontFamily: `system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    fontRatio: 30,
    labels: ["Low", "Neutral", "High"], // understands one label as mid, two as left-right, three as left-mid-right, n as all columns
    labelSize : 40,
    mixOnShift : true, // default behaviour is only to mix on Shift-click
    noControls: false,
    noTrack : true,
    nStyle : "highLow", // highLow | all | percentHighLow | allPercent | none
    percentOf: "row", // row|n
    relToMax : true, // circles show proportionate to highest value
    showCaption: false,
    target: '.cons-circles',
    trackColor : 'lightgray'
}

const CANVAS_RATIO = 5 / 1; // ratio for how much height canvas grabs
const NSTYLE_OPTIONS = ["highLow","percentHighLow","all","allPercent","none"]

function median(numbers) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
}

class SceneItem {
    constructor(props = null) {
        if (_.isNull(props)) throw ("SceneItem requires properties, at least type and name");
        _.assign(this, {
            duration: 0,
            time: 0,
            type: "",
            content: ""
        }, props);
        this.start = {};
        this.end = {};
        if (!this.name) throw ("SceneItem needs a name");
        this.id = _.uniqueId();
    }

    get isAnimating() {
        return this.time < this.duration;
    }

    setProp(prop, payload, duration = null) {
        const self = this;
        if (!_.isString(prop) && !_.isObject(prop)) throw ("setProp needs a prop!");
        if (_.isObject(prop)) {
            _.toPairs(prop).forEach(pair => {
                self.setProp(pair[0], pair[1]);
            });
            return;
        }

        // optionally can set duration, to reset current animation, will set time to 0
        // otherwise will animate to end within current cycle 

        self.start[prop] = _.isUndefined(self.end[prop]) ? payload : self.end[prop];
        self.end[prop] = payload;
        if (!_.isNull(duration) && isFinite(duration)) _.assign(self, {
            duration,
            time: 0
        });
    }

}

class ConsCircles {
    constructor(options = {}) {

        // add ConsCircles stylesheet if not there
        const CCStyles = $('#ConsCircleStyles');
        if (!CCStyles) {
            const actualStyles = $.create('style',{
                id : 'ConsCircleStyles' 
            });
            document.body.prepend(actualStyles);
            actualStyles.prepend(EMBED_STYLES);
        }

        this.options = _.assign({}, DEFAULTS, options);
        const {
            colors,
            dataIn,
            extFont,
            target,
            caption,
            showCaption,
            labels
        } = this.options;

        // check data integrity
        const check = ConsCircles.checkData(dataIn);
        if (check !== true) throw (check);

        this.id = _.uniqueId();

        // check target is valid
        this.targetEl = document.querySelector(target);
        if (!(this.targetEl instanceof HTMLElement)) throw ("ConsCircles requires valid target element");

        // load external font if required
        if (!_.isNull(extFont)) {
            const linkEl = document.createElement("link");
            linkEl.setAttribute("rel", "stylesheet");
            linkEl.setAttribute("href", extFont);
            document.head.appendChild(linkEl);
        }

        // constants
        // add 'All', n, columns
        this.data = dataIn;
        this.All = ConsCircles.rowSums(_.values(dataIn));
        this.n = _.sum(this.All);
        this.columns = this.All.length;

        // group labels for ref - will use the order found in
        this.groupLabels = ["All", ..._.keys(this.data)];
        this.groupColors = _.fromPairs(this.groupLabels.map((group, i) => {
            const colorIndex = i < colors.length ? i : i % colors.length;
            return [group, colors[colorIndex]]
        }));

        // variables
        // set colours
        this.currentColor = colors[0];

        // set up elements and point buttons to handler
        this.container = $.create('figure', {
            className: 'cc-container',
            id: `cc-container-${this.id}`,
            style: {
                color: this.currentColor,
                display: 'block',
                'font-family': this.options.fontFamily,
                margin: "0",
                width: '100%' // fill containing element
            },
            contents: [
                ((!!caption && showCaption) ? {
                    tag: "figcaption",
                    id: `cc-caption-${this.id}`,
                    contents: [caption,{tag:"span",className:'caption-add'}]
                } : null),
                {
                    tag: "canvas",
                    id: `cc-canvas-${this.id}`,
                    style: {
                        width: '100%',
                        'aspect-ratio': `${CANVAS_RATIO}`
                    },
                    width : this.canvWidth,
                    height : this.canvHeight
                },
                (!this.options.noControls ? {
                    tag: "div",
                    id: `cc-controls-${this.id}`,
                    className: `cc-controls ${this.hasGroups ? 'has-groups':'no-groups'}`,
                    style: {
                        width: "100%"
                    },
                    contents: [{
                        tag : "button",
                        className : "cc-global-switch",
                        innerHTML : `n-Local`,
                        events : {
                            click : (evt)=>{
                                this.handleGlobalSwitch.call(this,evt);
                            }
                        }
                    },{
                        tag: 'ul',
                        className: 'cc-controls-group',
                        contents: this.groupLabels.map(group => {
                            return {
                                tag: 'li',
                                contents: {
                                    tag: 'button',
                                    className:'cc-control',
                                    contents: group,
                                    'data-group-name': group,
                                    events : {
                                        click : (evt)=>{
                                            this.handleAll.call(this,evt);
                                        }
                                    }
                                }
                            }
                        })
                    },{
                        tag: "select",
                        className : "cc-nstyle-select",
                        contents : NSTYLE_OPTIONS.map(nstyle=>{
                            const opt = {
                                tag : 'option',
                                contents : _.startCase(nstyle).replace("Percent","%"),
                                value : nstyle
                            };
                            if (nstyle == this.options.nStyle) opt.selected = true;
                            return opt;
                        }),
                        events : {
                            change : (evt)=>{
                                this.handleNStyleSelect.call(this,evt);
                            }
                        }
                    }]
                } : null)
            ],
            'aria-description': ConsCircles.genDescText(this)
        });

        this.targetEl.appendChild(this.container);
        this.setFontSize();
        window.addEventListener('resize', () => {
            this.setFontSize.call(this);
        });

        // set viewing
        this.inView = ["All"];

        // // set up canvas items
        this.scene = [];
        const {
            discY,
            discXPositions,
            axisY,
            axisXPositions,
            colorTextOnBground,
            discLabels
        } = this;

        // axis labels

        labels.forEach((content, i) => {
            const item = new SceneItem({
                type: 'axis_label',
                content,
                name: `label_${_.snakeCase(content)}`,
                number : i
            })
            item.setProp({
                y: axisY,
                x: axisXPositions[i],
                fill: colorTextOnBground
            });
            this.scene.push(item);
        });

        // background discs

        this.visiblePercent.forEach((d, i) => {
            let x = discXPositions[i];
            let fill = ConsCircles.getRGB(this.options.bgColor);
            let disc = new SceneItem({
                type: 'disc',
                name: `disc_${i+1}`,
                number : i
            });
            disc.setProp({
                y: discY,
                x,
                fill,
                radius: 0
            });
            this.scene.push(disc);
        });

        // foreground labels

        this.visibleReal.forEach((real, i) => {
            let x = discXPositions[i];
            let fill = ConsCircles.getRGB(this.options.bgColor);
            let label = new SceneItem({
                type: 'disc_label',
                name: `disc_label_${i+1}`,
                content: discLabels[i],
                number : i
            });
            label.setProp({
                y: discY,
                x,
                fill
            });
            this.scene.push(label);
        });
    }

    init(){
        // sep into init to stop testing breaking (hates canvases)
        // set canvas context and any global values
        this.canvas = $("canvas",this.container);
        this.ctx = this.canvas.getContext("2d");
        // run update once
        this.update();
        // run loop
        this.loopStart();
    }

    get sceneIsStatic() {
        return this.scene.every(item=>item.time >= item.duration);
    }

    get colorTextOnColor() {
        // let current = Color("white");
        // if (current.contrast(Color(this.currentColor)) > 5) return ConsCircles.getRGB(current);
        // else {
        //     current = Color(this.currentColor);
        //     current.lightness = 0.75;
        //     return ConsCircles.getRGB(current);
        // }
        // return Color(this.currentColor).isDark() ? ConsCircles.getRGB("white") : ConsCircles.getRGB(Color(this.currentColor))
        return ConsCircles.getTextColor(this.currentColor,this.currentColor);
    }

    get colorTextOnBground() {
        // const current = Color(this.currentColor);
        // if (current.contrast(Color(this.options.bgColor)) > 4) return ConsCircles.getRGB(current);
        // else {
        //     current.lightness(0.75);
        //     return ConsCircles.getRGB(current);
        // }
        return ConsCircles.getTextColor(this.bgColor,this.currentColor);
    }

    get discLabels() {
        switch (this.options.nStyle) {
            case "none":
                return this.visibleReal.map(v=>"");
            case "highLow":
                return this.visibleReal.map((v,i)=>{
                    if (v==_.max(this.visibleReal)){
                        return `${v}|(n=${_.sum(this.visibleReal)})`;
                    }
                    if (v==_.min(this.visibleReal)){
                        return `(${v})`
                    }
                    return "";
                });
            case "percentHighLow":
                return this.visiblePercent.map((v,i)=>{
                    if (v==_.max(this.visiblePercent)){
                        return `${_.round(v*100,1)}%|(n=${_.sum(this.visibleReal)})`;
                    }
                    if (v==_.min(this.visiblePercent)){
                        return `(${_.round(v*100,1)}%)`
                    }
                    return "";
                });
            case "allPercent":
                return this.visiblePercent.map((v,i)=>{
                    if (v==_.max(this.visiblePercent)){
                        return `${_.round(v*100,1)}%|(n=${_.sum(this.visibleReal)})`;
                    }
                    else {
                        return `${_.round(v*100,1)}%`;
                    }
                })
            default:
                return this.visibleReal.map((v, i) => {
                    let column = _.isArray(this.options.altColumns) ? this.options.altColumns[i] : i + 1;
                    return `${this.visibleReal[i]}`
                });
        }
    }

    get canvWidth() {
        return this.options.canvasRes * devicePixelRatio;
    }

    get canvHeight() {
        return this.canvWidth / CANVAS_RATIO;
    }

    get axisY() {
        return this.canvHeight * 0.2;
    }

    get axisXPositions() {
        switch (this.options.labels.length) {
            case 1: 
                return [this.canvWidth / 2]
            case 2: 
                return [this.discXPositions[0], _.last(this.discXPositions)]
            case 3: 
                return [this.discXPositions[0], this.canvWidth / 2, _.last(this.discXPositions)]
            default:
                if (this.options.labels.length < this.columns) {
                    console.warn("ConsCircles passed less labels on X-axis than columns - please check.");
                }
                return this.discXPositions;
        }
        // return [this.discXPositions[0], this.canvWidth / 2, _.last(this.discXPositions)];
    }

    get discY() {
        return this.canvHeight * 0.60;
    }

    get lowLabelY() {
        return this.canvHeight * 0.85;
    }

    get maxDiscRadius() {
        return this.canvHeight * .3;
    }

    get maxDiscArea() {
        return Math.PI * this.maxDiscRadius * this.maxDiscRadius;
    }

    get discXPositions() {
        const {
            canvWidth,
            maxDiscRadius,
            columns
        } = this;
        const gap = (canvWidth - (maxDiscRadius * 2 * columns)) / (columns - 1);
        return this.All.map((v, i) => {
            return (i * (maxDiscRadius + gap)) + (maxDiscRadius * (i+1));
        })
    }

    get hasGroups() {
        return this.rows.length > 1;
    }

    get rows() {
        return _.values(this.data);
    }

    get visibleReal() {
        const rows = this.inView.map(row => {
            if (row == "All") return this.All;
            else return this.data[row];
        });
        return ConsCircles.rowSums(rows);
    }

    get visiblePercent() {
        const {
            visibleReal,
            n
        } = this;
        const {
            percentOf
        } = this.options;
        return visibleReal.map(v => {
            return v / (percentOf == "row" ? _.sum(visibleReal) : n);
        })
    }

    get reweightedPercent() {
        const b = _.sum(this.visiblePercent);
        return this.visiblePercent.map(v=>v/b);
    }

    get discRadii() {
        if (this.options.byArea) return this.discRadiiByArea;
        const weightedRadius = this.options.relToMax ? this.maxDiscRadius / _.max(this.reweightedPercent) : this.maxDiscRadius;
        return this.options.percentOf == "row" ? this.reweightedPercent.map(pc=>pc*weightedRadius) : this.visiblePercent.map(pc=>pc*weightedRadius);
    }
    get discRadiiByArea() {
        const getRadius = (pc)=>{
            return Math.sqrt((pc*(this.maxDiscArea))/Math.PI);
        }
        return this.options.percentOf == "row" ? this.reweightedPercent.map(getRadius) : this.visiblePercent.map(getRadius);
    }

    get standardRate() {
        // might add jitter here
        return 15 + _.random(0,10); // around half a second? too fast?  
    }

    get realMean() {
        return _.mean(this.visibleReal);
    }

    get globalMedian() {
        return median(_.flatten(this.rows));
    }

    handleAll(evt) {
        evt.stopPropagation();
        const group = evt.target?.dataset?.groupName;
        if (!group) return;
        // if (this.inView.includes(group) && (_.inRange(this.inView.length,2,(this.groupLabels.length -2)))) {this.inView.splice(this.inView.indexOf(group),1)} // unlight group
        // else if (this.inView.includes(group)) {return;} // already lit
        // else if ((group == "All") && (!this.inView.includes("All"))) {this.inView = ["All"];}
        // else if (this.inView.includes(group) && (_.inRange(this.inView.length,2,(this.groupLabels.length -2)))) {this.inView.splice(this.inView.indexOf(group),1)} // unlight group
        // else if (this.inView.length == (this.groupLabels.length -2)) {this.inView = ["All"]} // all groups lit
        // else if (this.inView.includes("All") && (group !== "All")) { this.inView = [group]; }
        // else { this.inView.push(group); }

        if (!this.options.mixOnShift || (this.options.mixOnShift && evt.shiftKey)) {

            if (this.inView.includes(group)) {this.inView.splice(this.inView.indexOf(group),1)} // unlight group
            else { this.inView.push(group); }

            if (this.inView.length == 0) { this.inView = [group]; return; } // can't have empty group
            if (this.inView.includes("All") && (group !== "All")) { this.inView.splice(this.inView.indexOf("All"),1); } // All can't co-exist
            if (this.inView.includes("All") && (group == "All")) { this.inView = ["All"]; } // All can't co-exist
            else if (this.inView.length == (this.groupLabels.length - 1)) { this.inView = ["All"]; } // all lit means All

        }
        else {
            this.inView = [group];
        }

        this.update();
        this.loopStart();
    }

    handleGlobalSwitch(evt){
        evt.stopPropagation();
        if (this.options.percentOf == "row") {
            this.options.percentOf = "n";
            evt.target.classList.add("active");
            evt.target.innerHTML = "n-Global";
        }
        else {
            this.options.percentOf = "row";
            evt.target.classList.remove("active");
            evt.target.innerHTML = "n-Local";
        }
        this.update();
        this.loopStart();
        return;
    }

    handleNStyleSelect(evt){
        evt.stopPropagation();
        this.options.nStyle = evt.target.value;
        this.update();
        this.loopStart();
        return;
    }

    loop() {
        const self = this;
        const {ctx} = this;
        // draw!
        ctx.clearRect(0,0,this.canvWidth,this.canvHeight);
        // draw track & notches
        if (!self.options.noTrack) {
            ctx.strokeStyle = self.options.trackColor;
            ctx.moveTo(self.discXPositions[0],self.discY);
            ctx.lineTo(_.last(self.discXPositions),self.discY);
            ctx.stroke(); // fnar
            self.discXPositions.forEach(x=>{
                ctx.moveTo(x,self.discY-5);
                ctx.lineTo(x,self.discY+5);
                ctx.stroke();
            });
        }
        // cycle scene
        this.scene.forEach(item=>{
            switch (item.type) {
                case 'axis_label':
                    self.drawAxisLabel(item);
                break;
                case 'disc':
                    self.drawDisc(item);
                break;
                case 'disc_label':
                    self.drawAxisLabel(item);
                break;
            }
        })
        // check anything in scene still animating?
        if (!self.sceneIsStatic) {
            window.setTimeout(()=>{
                window.requestAnimationFrame(()=>{
                    self.loop.call(self);
                });
            },1000/60);
        }
        else {
            self.loop_running = false;
        }
    }
    
    loopStart() {
        if (this.loop_running !== true) {this.loop(); this.loop_running = true;} else return;
    }

    drawAxisLabel(item){
        const {ctx} = this;
        const {labelSize,fontFamily} = this.options;
        const {x} = item.end; // label x is fixed
        const { time, duration } = item;
        const y = interpolate({a:item.start.y,b:item.end.y,time,duration});
        const fill = ConsCircles.getInterpColor((item.start.fill || item.end.fill), item.end.fill, time, duration);
        ctx.fillStyle = fill;
        ctx.textAlign = "center";
        ctx.baseline = "bottom";

        if (item.content.split("|").length == 1) {
            ctx.font = `${labelSize}px ${fontFamily}`;
            ctx.fillText(item.content,x,y+(this.options.labelSize*0.3));
        }
        else {
            ctx.font = `${labelSize*1}px ${fontFamily}`;
            const rowsNo = item.content.split("|").length, rowTop = y - (rowsNo*(labelSize)*0.5);
            item.content.split("|").forEach((content,i)=>{
                let newY = rowTop + (i*labelSize) + (labelSize*.6);
                ctx.fillText(content,x,newY);
            });
        }


        // increment time
        if (item.time < item.duration) { item.time = time + 1; }
    }

    drawDisc(item){
        const {ctx} = this;
        const {x,y} = item.end;
        const {time,duration} = item;
        const fill = ConsCircles.getInterpColor((item.start.fill || item.end.fill), item.end.fill, time, duration);
        const radius = interpolate({a:item.start.radius,b:item.end.radius,time,duration});
        // const fill = "black";
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(x,y,radius,0,2*Math.PI);
        ctx.fill();
        // increment time
        if (item.time < duration) { item.time = time + 1; }
    }

    update() {

        // update resets durations, y, colors - loop draws one frame 

        // ('darkslategray' if more than one group mixed? - later version do gradients?)
        this.currentColor = this.groupColors[this.inView[0]];
        if (this.inView.length > 1) this.currentColor = "darkgray";
        const { inView, currentColor, groupColors, options, standardRate, discRadii, discLabels, colorTextOnColor, colorTextOnBground, visibleReal, realMean, globalMedian, discY, lowLabelY } = this;

        // update caption
        if ($("span.caption-add",this.container) && this.hasGroups) $("span.caption-add",this.container).innerText = this.inView[0] == "All" ? " - All Groups" : ` - ${this.inView.join(" + ")}`;
        $(".cons-circles figcaption")._.style({color:this.colorTextOnBground});

        // cycle scene objects
        this.scene.forEach((item,i)=>{
            switch (item.type) {
                // update label colors
                case "axis_label":
                    item.setProp("fill",ConsCircles.getRGB(colorTextOnBground),standardRate)
                    return;
                // update disc sizes and colors 
                case "disc":
                    item.setProp("radius",discRadii[item.number]);
                    item.setProp("fill",ConsCircles.getRGB(currentColor),standardRate);
                    return;
                // update disc label content, position and colors
                case "disc_label":
                    item.content = discLabels[item.number];
                    // if ((visibleReal[item.number] < realMean) || (this.options.percentOf == "n")) {
                    if (discRadii[item.number] < this.options.labelSize*1.5) {
                        // float down, change color
                        item.setProp("y",lowLabelY);
                        item.setProp("fill",ConsCircles.getRGB(colorTextOnBground),standardRate);
                    }
                    else {
                        item.setProp("fill",ConsCircles.getRGB(colorTextOnColor),standardRate);
                        item.setProp("y",discY)
                    }
                    return;
            }
        });

        // update button statuses
        $$(`#cc-container-${this.id} button.cc-control`).forEach(butt=>{
            if (inView.includes(butt.dataset.groupName)) {
                butt._.style({
                    backgroundColor : groupColors[butt.dataset.groupName],
                    color : ConsCircles.getTextColor(groupColors[butt.dataset.groupName],   groupColors[butt.dataset.groupName])
                })
            }
            else {
                butt._.style({
                    backgroundColor : 'transparent',
                    color : ConsCircles.getTextColor(options.bgColor,groupColors[butt.dataset.groupName])
                })
            }
        });

    }

    setFontSize() {
        $(this.container)._.style({
            fontSize: `${_.floor(this.targetEl.clientWidth / this.options.fontRatio)}px`
        });
    }

    static getInterpColor(a,b,time,duration){
        const start = Color(a);
        return start.mix(Color(b),(time/duration));
    }

    static getTextColor(bgColor="white",textColor="white"){
        let newColor = Color(textColor);
        newColor = newColor.lightness(30);
        return Color(bgColor).isDark() ? "white" : newColor.toString();
    }

    static genDescText(ccObj) {
        // to do
        return "";
    }

    static getRGB(color) {
        return Color(color).rgb().array();
    }

    static rowSums(data) {
        if (!_.isArray(data) && !_.isArray(data[0])) return null;
        // presumes an array of rows of values
        return (data[0] || []).map((v, i) => {
            return _.sum(data.map(v => v[i]));
        });
    }

    static checkData(data) {
        // true if OK
        // string message if not
        //
        // data should be square object of arrays of numbers
        // 'All' is a reserved group name

        if (!_.isObject(data)) return "Data is not an object";
        if (_.keys(data).includes("All")) return "'All' is a reserved group name";
        let consistent = true,
            size = null;
        _.forIn(data, (group) => {
            if (!_.isArray(group)) {
                consistent = "Data must be an object of value arrays";
                return;
            }
            if (!_.every(group, _.isFinite)) {
                consistent = "Data rows must be numbers";
                return;
            }
            if (_.isNull(size)) size = group.length;
            if (group.length !== size) {
                consistent = "Data rows must all be same length";
                return;
            }
        });
        return consistent;
    }
}

window.ConsCircles = ConsCircles;

module.exports = {
    ConsCircles,
    SceneItem
};