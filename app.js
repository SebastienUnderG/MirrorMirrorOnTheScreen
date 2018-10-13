const Gpio = require('onoff').Gpio;
var log4js = require('log4js');
const logger = log4js.getLogger('things');
var WatchJS = require("melanke-watchjs");
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
const exec = require('child_process').exec;


const relayA = new Gpio(15, 'out');
const buttonA = new Gpio(17, 'in', 'both', {debounceTimeout: 500});
const buttonB = new Gpio(27, 'in', 'both', {debounceTimeout: 50});
const buttonC = new Gpio(22, 'in', 'both', {debounceTimeout: 50});
const buttonD = new Gpio(14, 'in', 'both', {debounceTimeout: 500});
// -----------


log4js.configure({
    appenders: {
        dateFile: {
            type: 'dateFile',
            filename: 'mask.log',
            pattern: 'yyyy-MM-dd-hh',
            compress: true
        },
        out: {
            type: 'stdout'
        }
    },
    categories: {
        default: {
            appenders: [
                'dateFile', 'out'
            ],
            level: 'trace'
        }
    }
});


//Administration

var distance = {};
relayA.writeSync(0);
global.flash = 0;
distance.minD = 10 * (1e6 / 34321) * 2; //zone minimum
distance.maxD = 60 * (1e6 / 34321) * 2; //zone maximum
distance.timeStep = 1000; //zone de statisme
distance.updateTime = 200; //frequence de mise a jour de la position
distance.step = 0; // init de l'étape
global.presence = 0;
distance.status = 0;


// print process.argv
process.argv.forEach(function (val, index, array) {
    //console.log(index + ': ' + val);
    if (index == 2 && val == "-s") {
        //passer en mode paramettre
        setShoot();
    }

});


function getStatus() {
    status = [
        "Le masque est dans le noir",
        "Le masque apparait",
        "Preparer prendre la photo",
        "Initalisation de la PHOTO",
        "La photo est prise",
        "etes-vous sur de l imprimer",
        "Impression",
        "Mode Pause"
    ];
    logger.debug("Chapitre : " + distance.status + " >> " + status[distance.status]);
}

var Gpio_D = require('pigpio').Gpio,
    trigger = new Gpio_D(23, {mode: Gpio_D.OUTPUT}),
    echo = new Gpio_D(24, {
        mode: Gpio_D.INPUT,
        alert: true
    }); //Paramettrage

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
var MICROSECDONDS_PER_CM = 1e6 / 34321;

trigger.digitalWrite(0); // Make sure trigger is low

(function () {
    var startTick;

    echo.on('alert', function (level, tick) {
        var endTick,
            diff;

        if (level == 1) {
            startTick = tick;
        } else {
            endTick = tick;
            diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic

            if (diff <= distance.maxD && diff >= distance.minD) {
                distance.step++;
            } else {
                distance.step = 0;
                global.presence = 0;
            }
            if (distance.step >= (distance.timeStep / distance.updateTime)) {
                //console.log("devant" + distance.step + " => " + distance.maxD);
                global.presence = 1;
            }
        } //fin du else
    }); // fin de echo
}()); // fin de fonction

// Trigger a distance measurement once per second
setInterval(function () {
    trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, distance.updateTime);

// -----------
var http = require('http');
var fs = require('fs');
var ent = require('ent');


var fileList = [
    {"url": "/snap.jpg", "file": "./images/1525872432182.jpg", "code": "", "type": "{'Content-Type': 'image/jpg'}"},
    {"url": "/image.jpg", "file": "./images/set.jpg", "code": "", "type": "{'Content-Type': 'image/jpg'}"},
    {"url": "/", "file": "./index.html", "code": "utf-8", "type": "{'Content-Type': 'text/html'}"},
    {"url": "/style.css", "file": "./css/style.css", "code": "utf-8", "type": "{'Content-Type': 'text/css'}"},
    {
        "url": "/script.js",
        "file": "./js/script.js",
        "code": "utf-8",
        "type": "{'Content-Type': 'application/javascript'}"
    },
    {
        "url": "/idle_princess2.gif",
        "file": "./resources/idle_princess2.gif",
        "code": "",
        "type": "{'Content-Type': 'image/gif'}"
    },
    {"url": "/favicon.ico", "file": "./resources/favicon.ico", "code": "", "type": "{'Content-Type': 'image/ico'}"},
    {
        "url": "/jquery-3.3.1.min.js",
        "file": "./js/jquery-3.3.1.min.js",
        "code": "utf-8",
        "type": "{'Content-Type': 'application/javascript'}"
    },
    {
        "url": "/modernizr.custom.js",
        "file": "./js/modernizr.custom.js",
        "code": "utf-8",
        "type": "{'Content-Type': 'application/javascript'}"
    },
    {
        "url": "/demo1.js",
        "file": "./js/demo1.js",
        "code": "utf-8",
        "type": "{'Content-Type': 'application/javascript'}"
    },
    {
        "url": "/classie.js",
        "file": "./js/classie.js",
        "code": "utf-8",
        "type": "{'Content-Type': 'application/javascript'}"
    },
    {"url": "/normalize.css", "file": "./css/normalize.css", "code": "utf-8", "type": "{'Content-Type': 'text/css'}"},
    {"url": "/style6.css", "file": "./css/style6.css", "code": "utf-8", "type": "{'Content-Type': 'text/css'}"},
    {"url": "/valide.png", "file": "./resources/valide.png", "code": "", "type": "{'Content-Type': 'image/png'}"},
    {"url": "/1.png", "file": "./resources/1.png", "code": "", "type": "{'Content-Type': 'image/png'}"},
    {"url": "/2.png", "file": "./resources/2.png", "code": "", "type": "{'Content-Type': 'image/png'}"},
    {"url": "/print.png", "file": "./resources/print.png", "code": "", "type": "{'Content-Type': 'image/png'}"},
    {"url": "/refus.png", "file": "./resources/refus.png", "code": "", "type": "{'Content-Type': 'image/png'}"},
    {"url": "/back.png", "file": "./resources/back.png", "code": "", "type": "{'Content-Type': 'image/png'}"},
    {"url": "/photo.png", "file": "./resources/photo.png", "code": "", "type": "{'Content-Type': 'image/png'}"},
    {"url": "/press.gif", "file": "./resources/press.gif", "code": "", "type": "{'Content-Type': 'image/gif'}"},
    {"url": "/load.gif", "file": "./resources/load.gif", "code": "", "type": "{'Content-Type': 'image/gif'}"},
    {
        "url": "/BLKCHCRY.TTF",
        "file": "./ttf/BLKCHCRY.TTF",
        "code": "",
        "type": "{'Content-Type': 'application/octet-stream'}"
    }
];

// Chargement du fichier index.html affiché au client
var server = http.createServer(function (req, res) {

    logger.debug("***WEB*** " + req.url);

    for (var i = 0; i < fileList.length; i++) {
        var obj = fileList[i];

        if (obj.code == "utf-8") {
            if (req.url == obj.url) {
                fs.readFile(obj.file, "utf-8", function (error, content) {
                    res.writeHead(200, obj.type);
                    res.end(content);
                });
            }

        } else {

            if (req.url == obj.url) {
                fs.readFile(obj.file, function (error, content) {
                    res.writeHead(200, obj.type);
                    res.end(content);
                });
            }

        }

    }
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    logger.debug(' --Connexion avec le client : ok --');
    io.emit('serveur', "Connexion avec le serveur");
    //setStatus0();

    socket.on('retourCheese', function (message) {
        finCheese();
    });

});

// BOUTON A
buttonA.watch(function (err, value) {
    if (value == "1") {
        getStatus();
    }
});

// BOUTON D OU BOUTON 1
buttonB.watch(function (err, value) {

    if (value == "1") {

        if (distance.status == "5") {
            impressionNow();
            value = 0;
        } else if (distance.status == "4") {
            initPreparation();
            value = 0;
        } else if (distance.status == "2") {
            initShoot();
            value = 0;
        } else if (distance.status == "1") {
            initPreparation();
            value = 0;
        } else if (distance.status == "0") {
            setStatus1();
        } else {
            logger.fatal("Bouton B #1 : Chapitre " + distance.status);
        }

    }

});

// BOUTON C OU BOUTON 2
buttonC.watch(function (err, value) {
    if (value == "1") {

        if (distance.status == "5") {
            initPreparation();
            value = 0;
        } else if (distance.status == "4") {
            confirmationImpression();
            value = 0;
        } else if (distance.status == "2") {
            setStatus1();
            value = 0;
        } else if (distance.status == "1") {
            initPreparation();
            value = 0;
        } else {
            logger.fatal("Bouton C #2 : Chapitre " + distance.status);
        }

    }

});

//Bouton D
buttonD.watch(function (err, value) {
    if (value == "1") {
        setStatus0();

    }
});

// Initalisation
watch(distance, function () {
    if (global.presence == 1 && distance.status == 0) {
        setStatus1();
    }

});

var temperature = 0;
setInterval(function () {
    //verification temperature
    var text = 'cat /sys/class/thermal/thermal_zone0/temp';

    exec(text, (e, stdout, stderr) => {
        var t = stdout.match(/\d+/)[0] / 1000;
        if (Math.round(temperature) < Math.round(t)) {
            logger.fatal(t);
            temperature = t;
        } else if (Math.round(temperature) > Math.round(t)) {
            logger.info(t);
            temperature = t;
        }
    });

}, 20000);


// loop du timeOut
function loop() {

    if (global.presence == 0) {
        if (distance.status == 1 && lastActivity() > 60000) {
            goTimeout();
        } else if (distance.status == 2 && lastActivity() > 60000) {
            goTimeout();
        } else if (distance.status == 3 && lastActivity() > 60000) {
            goTimeout();
            logger.fatal("Bug de Timeout sur la prise de photo")
        } else if (distance.status == 4 && lastActivity() > 120000) {
            goTimeout();
        } else if (distance.status == 5 && lastActivity() > 240000) {
            console.log("5> " + goTimeout());
            goTimeout();
        } else if (distance.status == 6 && lastActivity() > 400000) {
            console.log("5> " + goTimeout());
            goTimeout();
        }

    }

}

function goTimeout() {
    logger.debug(' ---Timeout--- : je retourne en sommeille');
    lastActivity(1);
    setStatus0();
}

//demon de verification d'activité
function lastActivity(set = 0) {
    if (set) {
        global.lasttime = Date.now();
    }
    return (Date.now() - global.lasttime);
}


function setShoot() {
    distance.status = -1;
    //flashSwitch();
    var fs = require("fs");
    var text = "gphoto2 --capture-image-and-download --filename=images/set.jpg";
    fs.stat('images/set.jpg', function (err, stat) {
        if (err == null) {
            logger.fatal('fichier exist');
            fs.unlink('images/set.jpg', function (err) {
                if (err) {
                    return console.error(err);
                }
                logger.fatal("écraser config")
                exec(text, (e, stdout, stderr) => {
                    logger.fatal(e);
                    logger.fatal("nouvelle config");
                    //flashSwitch();
                    process.exit();
                });
            });

        } else if (err.code == 'ENOENT') {
            // file does not exist
            exec(text, (e, stdout, stderr) => {
                logger.fatal(e);
                logger.fatal('configuré');
                //flashSwitch();
                process.exit();
            });

        } else {
            console.log('Some other error: ', err.code);
        }
    });


}


// -----------------
// suite des histoire


function setStatus0() {
    io.emit('photo', "");
    distance.status = 0;
    logger.debug('%%% Remise à zero %%%');
    io.emit('distance', 0);
    lastActivity(1);
    global.flash = 0;
    io.emit('photo', "");
}

function setStatus1() {
    distance.status = 1;
    io.emit('distance', 1);
    logger.info('Une personne se présente devant le mirroir');
    io.emit('message', "Célèbre est votre beauté majesté,</br>Voulez-vous la photographier ?</br> <div id='icons'><img src='press.gif'> <img src='1.png'> pour <img src='photo.png'></div>");
    lastActivity(1);
    io.emit('photo', "");
}

function initPreparation() {
    io.emit('photo', "<img src='image.jpg'>");
    io.emit('message', "Installez-vous !</br>Voici le cadre de la photo,</br>Êtes-vous prêts ?</br> <div id='icons'><img src='press.gif'> <img src='1.png'> pour <img src='valide.png'> </br> <img src='press.gif'> <img src='2.png'> pour <img src='refus.png'> </div>");
    logger.info('Installez-vous');
    distance.status = 2;
    lastActivity(1);
}

function initShoot() {
    distance.status = 3;
    lastActivity(1);

    flashSwitch();
    logger.info('Cheese :)');
    io.emit('cheese', 1);
    /*
    setTimeout(function() {
      logger.info('Cheese :)');
      io.emit('cheese', 1);
    }, 500)
    */
}

function flashSwitch() {
    if (global.flash == 0) {
        relayA.writeSync(1);
        global.flash = 1;
        logger.info("Flash ON");
    } else {
        relayA.writeSync(0);
        global.flash = 0;
        logger.info("Flash OFF");
    }
}

function shootNow() {
    var now = Date.now();
    global.lienImage = "/images/" + now + ".jpg";
    fileList[0]['file'] = "." + global.lienImage;
    fileList[0]['url'] = global.lienImage;

    var text = "gphoto2 --capture-image-and-download --filename=images/" + now + ".jpg";
    exec(text, (e, stdout, stderr) => {
        logger.fatal(e);
        flashSwitch();
        postShoot(global.lienImage);
    });
    lastActivity(1);
}

function finCheese() {
    logger.info('SHOOT');
    io.emit('photo', "<img src='/load.gif'>");
    io.emit('message', "Veuillez patienter");
    shootNow();
    distance.status = 4;
    io.emit('cheese', 0);
    lastActivity(1);

}

function postShoot(images) {
    io.emit('photo', "<img src='" + images + "'>");
    io.emit('message', "Voici votre portrait !</br> Vous êtes magnifiques ! </br> <div id='icons'><img src='press.gif'> <img src='1.png'> pour <img src='back.png'>Recommencer </br> <img src='press.gif'> <img src='2.png'> pour <img src='print.png'> Imprimer</div>");

}

function confirmationImpression() {
    logger.info("confirmationImpression");
    io.emit('message', "Êtes-vous sûr de vouloir imprimer</br>cette magnifique photo ?</br> <div id='icons'><img src='press.gif'> <img src='1.png'> pour <img src='valide.png'>Absolument !</br> <img src='press.gif'> <img src='2.png'> pour <img src='refus.png'> En fait Non !</div>");
    distance.status = 5;
    lastActivity(1);
}

function impressionNow() {
    lastActivity(1);
    distance.status = 6;
    io.emit('photo', "");
    //io.emit('message', "Veuillez patienter !</br> Impression en cours");
    io.emit('message', 1);
    var text = 'lp -d Canon_SELPHY_CP1200 -o landscape -o fit-to-page .' + global.lienImage;
    //var text = "ls";
    exec(text, (e, stdout, stderr) => {
        logger.fatal(e);


    });
    setTimeout(function () {
        console.log("1");
        io.emit('photo', "");
        io.emit('message', "Bye bye");
        setTimeout(function () {
            setStatus0();
        }, 5000);
    }, 55000);

}

setInterval(loop, 5000);
server.listen(8080);
console.log('Version BETA');
console.log('Version BETA');