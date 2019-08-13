const Gpio = require('onoff').Gpio;
const relayA = new Gpio(15, 'out');

let button = new Array();
button['buttonA'] = new Gpio(17, 'in', 'both', {debounceTimeout: 500});
button['buttonB'] = new Gpio(27, 'in', 'both', {debounceTimeout: 50});
button['buttonC'] = new Gpio(22, 'in', 'both', {debounceTimeout: 50});
button['buttonD'] = new Gpio(14, 'in', 'both', {debounceTimeout: 500});


const story = require('./story.json');

let lasttime = 0;
let idletime = 60000; //defaut
let presence = 0;
let lienImage = "";

const fs = require('fs');
const setting_action = require('./action.json');

let fileList = require('./filesList.json');

console.log(Object.keys(story));

if (Object.keys(story).includes('init')) {
    Object.keys(story.init).forEach(e => element(e, story.init));
} else {
    console.log('Missing init KEYS');
}

function element(key, context) {

    if (key === "message") {
        Object.keys(context.message).forEach(k => console.log(k + " -> " + context.message[k]));
        // Object.keys(context.message).forEach(k => io.emit(k, context.message[k]));
    } else if (key === "log") {
        Object.keys(context.log).forEach(k => console.log(k + " -> " + context.log[k]));
    } else if (key === "activity") {
        if (context.activity.up) {
            lastActivity(true);
        } else {
            idletime = context.activity.idle;
        }
    } else if (key === "input") {
        Object.keys(context.input).forEach(i => {
            if (context.input[i].length === undefined) {
                button[i].unwatch();
                button[i].watch(function (err, value) {
                    const buttonContext = context.input[i];
                    if (value == "1") {
                        Object.keys(buttonContext).forEach(e => element(e, buttonContext));
                    }
                });
            } else {
                button['buttonA'].unwatch();
                button['buttonB'].unwatch();
                button['buttonC'].unwatch();
                button['buttonD'].unwatch();
                button[i].watch(function (err, value) {
                    const buttonContext = context.input[i];
                    if (value == "1") {
                        Object.keys(story[buttonContext]).forEach(e => element(e, story[buttonContext]));
                    }
                });
            }
        });
    } else if (key === "action") {


    }
}


// loop of Idle
function loopIdle() {
    if (presence === 0 && lastActivity() > idletime) {
        // to ZERO
    }
}

//demon de verification d'activité
function lastActivity(set = false) {
    if (set) {
        lasttime = Date.now();
    }
    return (Date.now() - lasttime);
}


const execut = new Array();

execut['set'] = function () {
    fs.stat(setting_action.src_photo_set, function (err, stat) {
        if (err == null) {
            console.log('file exist');
            fs.unlink(setting_action.src_photo_set, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('file erase');
                exec(text, (e, stdout, stderr) => {
                    console.log(e);
                    console.log('new file');
                    process.exit();
                });
            });
        } else if (err.code === 'ENOENT') {
            exec(setting_action.shoot_set + setting_action.src_photo_set, (e, stdout, stderr) => {
                console.log(e);
                console.log('create file');
                process.exit();
            });
        } else {
            console.log('Some other error: ', err.code);
        }
    });
}

execut['shoot'] = function (callback) {
    const now = Date.now();
    lienImage = setting_action.dir + now + setting_action.file_extention;
    fileList[0]['file'] = "." + lienImage;
    fileList[0]['url'] = lienImage;
    const ex = setting_action.shoot + now + setting_action.file_extention;
    exec(ex, (e, stdout, stderr) => {
        console.log(e);
        callback();
    });
}

