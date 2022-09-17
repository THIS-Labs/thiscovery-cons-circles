/**
 * @jest-environment jsdom
 */

const { SceneItem, ConsCircles } = require('./ConsCircles.js');
const _ = require('lodash');

describe("It should be ready for testing",()=>{
    test("ready to go",()=>{
        expect(true).toBe(true);
    })
});

describe("It should set up and stuff",()=>{
    beforeEach(()=>{
        const el = document.createElement("div");
        el.className = "cons-circles";
        document.body.appendChild(el);
    });
    test('constructs',()=>{
        const result = new ConsCircles({debug:true});
        expect(result.options.debug).toBe(true);
    });
    test('it should throw bad data',()=>{
        const bad_data = ["string",{a:["string"],b:[3]},{a:[1,2,3],b:[4,5,6],c:[7,8]}];
        let get_result;
        bad_data.forEach(badness=>{
            get_result = ()=>new ConsCircles({dataIn:badness});
            expect(get_result).toThrow();
        });
        // fixture data should be OK
        get_result = ()=>new ConsCircles();
        expect(get_result).not.toThrow();
    });
    test('it requires a target element',()=>{
        const get_result = ()=>new ConsCircles({target:".doesnt-exist"});
        expect(get_result).toThrow();
    });
    test('it adds up values',()=>{
        const cc = new ConsCircles();
        expect(cc.All[0]).toBe(_.sum(_.values(cc.data).map(row=>row[0])));
    });
    test('it gets visible values',()=>{
        const cc = new ConsCircles();
        expect(cc.visibleReal[0]).toBe(cc.All[0]);
        cc.inView = ["Farmers"];
        expect(cc.visibleReal[0]).toBe(cc.data.Farmers[0]);
        cc.inView = ["Farmers","Doctors"];
        expect(cc.visibleReal[0]).toBe(cc.data.Farmers[0]+cc.data.Doctors[0]);
    });
    test('it gets visible percent values',()=>{
        const cc = new ConsCircles();
        expect(cc.visiblePercent[0]).toBe(cc.All[0] / cc.n);
        cc.inView = ["Farmers"];
        expect(cc.visiblePercent[0]).toBe(cc.data.Farmers[0] / _.sum(cc.data.Farmers));
        cc.options.percentOf = "n"; // switch to as a percentage of n 
        expect(cc.visiblePercent[0]).toBe(cc.data.Farmers[0] / cc.n);
    })
});

describe("SceneItem should be setting props properly",()=>{
    test("it should create an item",()=>{
        let result;
        const bad_result = ()=>{
            result = new SceneItem();
        }
        expect(bad_result).toThrow();
        result = new SceneItem({type:"test",name:"test"});
    });
    test("it should set props",()=>{
        const disc = new SceneItem({
            type: "disc",
            name: "test_disc"
        });
        disc.setProp("radius",0);
        expect(disc.start.radius).toBe(0);
        expect(disc.end.radius).toBe(0);
        disc.setProp("radius",10);
        expect(disc.start.radius).toBe(0);
        expect(disc.end.radius).toBe(10);
        disc.setProp("radius",20);
        expect(disc.start.radius).toBe(10);
        expect(disc.end.radius).toBe(20);
    });
});