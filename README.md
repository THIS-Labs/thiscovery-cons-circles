# ConsCircles.js

Script to create opinionated infographics showing frequency of values for small-scales - eg. survey rankings. Populations can be displayed by individual group. Like this: https://this-institute.github.io/thiscovery-cons-circles/

____________

## Documentation

Create a new `ConsCircles` instance in a containing element by calling it with `target` set with a selector (by default it looks for a container with the class `cons-circles`).

    const infographic = new ConsCircles(options);
    infographic.init();

### Options

Options is an object with any of the following:

- `bgColor` [string] (Default = "white") - Background colour to set label/disc colours against

- `byArea` [boolean] (_false_) - draw discs proportionately to a maximum area rather than a maximum radius

- `canvasRes` [int] (1000) - width of the canvas - lower numbers might improve performance for a blockiness cost but 1000 should be fine

- `caption` [string] - Content for caption

- `colors` [array] - Set of strings of colours to use. All groups will always use the first colour.

- `dataIn` [object] - Data for the chart in format:

        {
            "Group 1" : [1,2,3,4,5],
            "Group 2" : [6,7,8,9,10]
        }

    A group for 'All' is automatically created if you use more than one row. All rows have to be the same length, or an exception is thrown.

- `extFont` [string] - If you want to use a particular font, link here to a CSS file setting it up.

- `fontFamily` [string] - Set the font family used.

- `fontRatio` [int] (30) - Change for exciting font size fun.

- `labels` [array] - Array of strings for y-axis labels - script understands two labels as Left-Right, three as Left-Mid-Right, and then any more it fits to the axis ie. give it nine labels for a nine-point scale etc.

- `labelSize` [int] - (40) - Change for exciting label size fun.

- `mixOnShift` [boolean] (_true_) - Default behaviour is for groups to not mix when selected, but they will with a Shift+Click. Set this to true to make mixing the default

- `noControls` [boolean] (_false_) - Hide/show controls.

- `noTrack` [boolean] (_true_) - Hide/show track under discs.

- `nStyle` [string] ("highLow") - Set the starting label style. `"highLow"|"percentHighLow"|"all"|"allPercent"|"none"`

- `percentOf` ["row"|"n"] - Set the starting sizing style - row = relative to the largest value in current view, n = relative to the total population size across groups.

- `showCaption` [boolean] (_false_) - Show hide the `<figcaption>` element.

- `target` [string] - Target container selector.

- `trackColor` [string] ("lightgray") - Colour of the track behind discs.
