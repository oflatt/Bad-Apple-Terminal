const getPixels = require("get-pixels");
const fs = require("fs");

const { toFourDigits } = require("./utilities");

const outputpath = "../owmidiconverter/frames.js";

const build = (index) => {
    // Delete file if exists
    if (fs.existsSync(outputpath)) {
        fs.writeFileSync(outputpath, "", { flag: "w" }, (err) => {});
    }
    fs.writeFileSync(outputpath, "const FRAMES = `Array(", { flag: "a" }, (err) => {});
    doFrame();
};

function doFrame(index = 1, frameNum = 0) {
    let indexString = toFourDigits(Math.round(index).toString());
    let path = `frames/BadApple${indexString}.png`;
    if(frameNum >= 25) {
        fs.writeFileSync(outputpath, "Custom String(\"\"));`", { flag: "a" }, (err) => {});
        return;
    }

    getPixels(path, (err, pixels) => {
        if (err) {
            console.error(err);
            return;
        }

        let widthCounter = 0;
        let string = "Custom String(\"";
        for (let i = 0; i < pixels.data.length; i += 4) {
            let value = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
            value = Math.max(pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]);

            // string += getCharacterForGrayScale(value) + getCharacterForGrayScale(value);
            const index = Math.floor(value / (256 / 2));
            if(index === 0) {
                string += "o";
            } else if(index === 1) {
                string += "n";
            } else {
                throw 'index not 0 or 1';
            }

            widthCounter++;
            if (widthCounter === 32) {
                string += "\\\\n";
                widthCounter = 0;
                string += "\"),\n";
                string += "Custom String(\"";
            }
        }
        string += "\"),\n";

        fs.writeFileSync(outputpath, string, { flag: "a" }, (err) => {});

        console.log(index);

        // 2 fps
        doFrame(index + 7.5, frameNum+1);
    });
}

build(1);

module.exports.build = build;
