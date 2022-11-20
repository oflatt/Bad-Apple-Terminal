const gameloop = require("node-gameloop");
const readline = require("readline");
const fs = require("fs");

run();

function decompressFrame(frame) {
    let string = "";
    let lines = frame.split("\n");
    for (let line of lines) {
        let tokens = line.match(/.{1,5}/g);
        for (let token of tokens) {
            let multiplier = parseInt(token.substring(1));
            string += token[0].repeat(multiplier);
        }
        string += "\n";
    }
    return string;
}

function run() {
    fs.readFile("data.txt", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        let frames = data.split("\n\n");

        let index = 0;
        const startTime = Date.now();
        let result = "";
        for(var i = 0; i < frames.length; i += 10) {
            const frame = frames[i];
            result += "Array(";

            let decom = decompressFrame(frame);
            let chars = decom.split("\n").join("").split("");

            var current = 2;
            var counter = 0;
            for (const char of chars) {
                var c = 1;
                if (char === "⠀") {
                    c = 0;
                }

                if (c === current) {
                    counter += 1;
                }
                else {
                    if (current !== 2) {
                        result += current.toString() + "," + counter.toString() + ",";
                    }
                    counter = 1;
                    current = c;
                }
            }
            result += current.toString() + "," + counter.toString();
            result += "),\n";
        }
        process.stdout.write(result);

        /*gameloop.setGameLoop((delta) => {
            let string = decompressFrame(frames[index]);

            readline.clearLine(process.stdout, -1);
            readline.cursorTo(process.stdout, 0, 2);
            process.stdout.write(string);
            process.stdout.write(
                `Frame: ${index}  |  FPS: ${index / ((Date.now() - startTime) / 1000)} \n`
            );

            index++;
        }, 1000 / 30);*/
    });
}
