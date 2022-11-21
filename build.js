const getPixels = require("get-pixels");
const fs = require("fs");

const { toFourDigits } = require("./utilities");

const outputpath = "../owmidiconverter/encoding.txt"

const build = (index) => {
    // Delete file if exists
    if (fs.existsSync(outputpath)) {
        fs.writeFileSync(outputpath, "", { flag: "w" }, (err) => {});
    }

    doFrame();
};

function doFrame(index = 1) {
    let indexString = toFourDigits(Math.round(index).toString());
    let path = `frames/BadApple${indexString}.png`;

    getPixels(path, (err, pixels) => {
        if (err) {
            console.error(err);
            return;
        }

        let string = "";

        const symbols = "01";

        let counter = 0;
        let current = false;

        let widthCounter = 0;
        for (let i = 0; i < pixels.data.length; i += 4) {
            let value = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
            value = Math.max(pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]);

            // string += getCharacterForGrayScale(value) + getCharacterForGrayScale(value);
            const index = Math.floor(value / (256 / 2));
            if (index === current) {
                counter++;
            } else {
                if(current !== false) {
                    string += symbols[current];
                    string += ",";
                    string += counter.toString(2);
                    string += ",";
                }
                current = index;
                counter = 1;
            }

            widthCounter++;
            if (widthCounter === 16) {
                widthCounter = 0;
            }
        }
        string += symbols[current];
        string += ",";
        string += counter.toString(2);
        string += "\n";

        fs.writeFileSync(outputpath, string, { flag: "a" }, (err) => {});

        console.log(index);

        // 4 fps
        doFrame(index + 7.5);
    });
}

build(1);

module.exports.build = build;
