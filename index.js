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

        
        let result = "";
        // 1 fps
        for(var i = 0; i < frames.length; i += 30) {
            const frame = frames[i];

            let decom = decompressFrame(frame);
            for (const char of decom) {
                if (char == "\n") {
                    result += char;
                    continue;
                }
                var c = 1;
                if (char === '⠀') {
                    c = 0;
                }
                result += c;
            }
            result += "\n";
        }
        process.stdout.write(result);
        /*let index = 0;
        const startTime = Date.now();
        gameloop.setGameLoop((delta) => {
            if(frames[index] === undefined) {
                return;
            }
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
