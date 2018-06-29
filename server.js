var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);

var players = {};

//Dear github people, as well as possible employers and code-freaks,
//I will, in the means of time, fix all of this repetetiveteteive code.
//Most probabably by creating a set of different attributs, in groups,
//which I call on each property re-spawn, for now, this is a quick-fix.
//But in any case, © Patrick Ebbmo Gårdinger 2018
var scores = {
    blue: 0,
    red: 0
};

var star = {
    x: Math.floor(Math.random() * 2000) + 1200,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -200) + -500,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var alien = {
    x: Math.floor(Math.random() * 20000) + 15000,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -1200) + -900,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 10) + -10,
    angv: Math.floor(Math.random() * 10) + 5
};

var aubergine = {
    x: Math.floor(Math.random() * 4000) + 3500,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -100) + -300,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var poop = {
    x: Math.floor(Math.random() * 3500) + 3000,
    y: Math.floor(Math.random() * 600) + 200,
    vx: Math.floor(Math.random() * -40) + -80,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var tesla = {
    x: Math.floor(Math.random() * 20000) + 15000,
    y: Math.floor(Math.random() * 600) + 100,
    vx: Math.floor(Math.random() * -150) + -300,
    vy: Math.floor(Math.random() * 10) + -10,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 100) + 50
};

var pizza = {
    x: Math.floor(Math.random() * 6000) + 5500,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -100) + -400,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var fistbump = {
    x: Math.floor(Math.random() * 8000) + 7000,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -400) + -600,
    vy: Math.floor(Math.random() * 100) + -100,
    r: Math.floor(Math.random() * 5) + -5,
    angv: Math.floor(Math.random() * 10) + 1
};

var peach = {
    x: Math.floor(Math.random() * 4000) + 3500,
    y: Math.floor(Math.random() * 600) + 100,
    vx: Math.floor(Math.random() * -100) + -300,
    vy: Math.floor(Math.random() * 10) + -10,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var meteroid = {
    x: Math.floor(Math.random() * 2000) + 1700,
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 500) + 20,
    vx: Math.floor(Math.random() * -100) + -300,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var meteroidTwo = {
    x: Math.floor(Math.random() * 2500) + 2000,
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 500) + 20,
    vx: Math.floor(Math.random() * -100) + -300,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var meteroidThree = {
    x: Math.floor(Math.random() * 2500) + 2000,
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 500) + 20,
    vx: Math.floor(Math.random() * -100) + -300,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
    players[socket.id] = {
        rotation: 0,
        x: 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: Math.floor(Math.random() * 2) == 0 ? "red" : "blue"
    };

    socket.emit("currentPlayers", players);

    socket.emit("starLocation", star);
    socket.emit("aubergineData", aubergine);
    socket.emit("poopData", poop);
    socket.emit("teslaData", tesla);
    socket.emit("pizzaData", pizza);
    socket.emit("peachData", peach);
    socket.emit("alienData", alien);
    socket.emit("fistbumpData", fistbump);

    socket.emit("scoreUpdate", scores);

    socket.emit("meteroidLocation", meteroid);
    socket.emit("meteroidTwoLocation", meteroidTwo);
    socket.emit("meteroidThreeLocation", meteroidThree);

    socket.broadcast.emit("newPlayer", players[socket.id]);
    console.log("player " + [socket.id] + "  has joined the game");

    socket.on("disconnect", function() {
        delete players[socket.id];
        io.emit("disconnect", socket.id);
        console.log("player " + [socket.id] + " has left the game");
    });

    socket.on("playerMovement", function(movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        socket.broadcast.emit("playerMoved", players[socket.id]);
    });

    socket.on("starCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 100;
        } else {
            scores.red += 100;
        }
        star.x = Math.floor(Math.random() * 2500) + 1700;
        star.y = Math.floor(Math.random() * 650) + 50;
        star.vx = Math.floor(Math.random() * -200) + -500;
        star.vy = Math.floor(Math.random() * 50) + -100;
        star.r = Math.floor(Math.random() * 50) + -50;
        star.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("starLocation", star);
        io.emit("scoreUpdate", scores);
    });

    socket.on("starMissedAndReset", function() {
        star.x = Math.floor(Math.random() * 2500) + 1700;
        star.y = Math.floor(Math.random() * 650) + 150;
        star.vx = Math.floor(Math.random() * -200) + -500;
        star.vy = Math.floor(Math.random() * 50) + -100;
        star.r = Math.floor(Math.random() * 50) + -50;
        star.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("starLocation", star);
    });

    socket.on("alienCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += alien.vx * -10;
        } else {
            scores.red += alien.vx * -10;
        }
        alien.x = Math.floor(Math.random() * 25000) + 12000;
        alien.y = Math.floor(Math.random() * 600) + 100;
        alien.vx = Math.floor(Math.random() * -700) + -1200;
        alien.vy = Math.floor(Math.random() * 50) + -50;
        alien.r = Math.floor(Math.random() * 10) + -10;
        alien.angv = Math.floor(Math.random() * 10) + 5;
        io.emit("alienData", alien);
        io.emit("scoreUpdate", scores);
    });

    socket.on("alienMissedAndReset", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= alien.vx * -3;
        } else {
            scores.red -= alien.vx * -3;
        }
        alien.x = Math.floor(Math.random() * 25000) + 12000;
        alien.y = Math.floor(Math.random() * 600) + 100;
        alien.vx = Math.floor(Math.random() * -700) + -1200;
        alien.vy = Math.floor(Math.random() * 50) + -50;
        alien.r = Math.floor(Math.random() * 10) + -10;
        alien.angv = Math.floor(Math.random() * 10) + 5;
        io.emit("alienData", alien);
        io.emit("scoreUpdate", scores);
    });

    socket.on("aubergineCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 500;
        } else {
            scores.red += 500;
        }
        aubergine.x = Math.floor(Math.random() * 4000) + 3500;
        aubergine.y = Math.floor(Math.random() * 650) + 50;
        aubergine.vx = Math.floor(Math.random() * -100) + -300;
        aubergine.vy = Math.floor(Math.random() * 50) + -50;
        aubergine.r = Math.floor(Math.random() * 50) + -50;
        aubergine.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("aubergineData", aubergine);
        io.emit("scoreUpdate", scores);
    });

    socket.on("aubergineMissedAndReset", function() {
        aubergine.x = Math.floor(Math.random() * 4000) + 3500;
        aubergine.y = Math.floor(Math.random() * 650) + 50;
        aubergine.vx = Math.floor(Math.random() * -100) + -300;
        aubergine.vy = Math.floor(Math.random() * 50) + -50;
        aubergine.r = Math.floor(Math.random() * 50) + -50;
        aubergine.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("aubergineData", aubergine);
    });

    socket.on("poopCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 10000;
        } else {
            scores.red -= 10000;
        }
        poop.x = Math.floor(Math.random() * 3200) + 2050;
        poop.y = Math.floor(Math.random() * 650) + 250;
        poop.vx = Math.floor(Math.random() * -40) + -150;
        poop.vy = Math.floor(Math.random() * -10) + 10;
        poop.r = Math.floor(Math.random() * 50) + -50;
        poop.angv = Math.floor(Math.random() * 15) + 5;
        io.emit("poopData", poop);
        io.emit("scoreUpdate", scores);
    });

    socket.on("poopMissedAndReset", function() {
        poop.x = Math.floor(Math.random() * 3200) + 2050;
        poop.y = Math.floor(Math.random() * 650) + 250;
        poop.vx = Math.floor(Math.random() * -40) + -150;
        poop.vy = Math.floor(Math.random() * -10) + 10;
        poop.r = Math.floor(Math.random() * 50) + -50;
        poop.angv = Math.floor(Math.random() * 15) + 5;
        io.emit("poopData", poop);
    });

    socket.on("teslaCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 15000;
        } else {
            scores.red += 15000;
        }
        tesla.x = Math.floor(Math.random() * 25000) + 20000;
        tesla.y = Math.floor(Math.random() * 600) + 100;
        tesla.vx = Math.floor(Math.random() * -150) + -300;
        tesla.vy = Math.floor(Math.random() * 10) + -10;
        tesla.r = Math.floor(Math.random() * 50) + -50;
        tesla.angv = Math.floor(Math.random() * 100) + 50;
        io.emit("teslaData", tesla);
        io.emit("scoreUpdate", scores);
    });

    socket.on("teslaMissedAndReset", function() {
        tesla.x = Math.floor(Math.random() * 25000) + 20000;
        tesla.y = Math.floor(Math.random() * 600) + 100;
        tesla.vx = Math.floor(Math.random() * -150) + -300;
        tesla.vy = Math.floor(Math.random() * 10) + -10;
        tesla.r = Math.floor(Math.random() * 50) + -50;
        tesla.angv = Math.floor(Math.random() * 100) + 50;
        io.emit("teslaData", tesla);
    });

    socket.on("pizzaCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 6969;
        } else {
            scores.red += 6969;
        }
        pizza.x = Math.floor(Math.random() * 6000) + 5500;
        pizza.y = Math.floor(Math.random() * 650) + 50;
        pizza.vx = Math.floor(Math.random() * -100) + -300;
        pizza.vy = Math.floor(Math.random() * 50) + -50;
        pizza.r = Math.floor(Math.random() * 50) + -50;
        pizza.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("pizzaData", pizza);
        io.emit("scoreUpdate", scores);
    });

    socket.on("pizzaMissedAndReset", function() {
        pizza.x = Math.floor(Math.random() * 6000) + 5500;
        pizza.y = Math.floor(Math.random() * 650) + 50;
        pizza.vx = Math.floor(Math.random() * -100) + -300;
        pizza.vy = Math.floor(Math.random() * 50) + -50;
        pizza.r = Math.floor(Math.random() * 50) + -50;
        pizza.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("pizzaData", pizza);
    });

    socket.on("fistbumpCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 5000;
        } else {
            scores.red += 5000;
        }
        fistbump.x = Math.floor(Math.random() * 3000) + 2500;
        fistbump.y = Math.floor(Math.random() * 650) + 50;
        fistbump.vx = Math.floor(Math.random() * -100) + -300;
        fistbump.vy = Math.floor(Math.random() * 50) + -50;
        fistbump.r = Math.floor(Math.random() * 5) + -5;
        fistbump.angv = Math.floor(Math.random() * 10) + 1;
        io.emit("fistbumpData", fistbump);
        io.emit("scoreUpdate", scores);
    });

    socket.on("fistbumpMissedAndReset", function() {
        fistbump.x = Math.floor(Math.random() * 6000) + 5500;
        fistbump.y = Math.floor(Math.random() * 650) + 50;
        fistbump.vx = Math.floor(Math.random() * -100) + -300;
        fistbump.vy = Math.floor(Math.random() * 50) + -50;
        fistbump.r = Math.floor(Math.random() * 50) + -50;
        fistbump.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("fistbumpData", fistbump);
    });

    socket.on("peachCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 1000;
        } else {
            scores.red += 1000;
        }
        peach.x = Math.floor(Math.random() * 4000) + 3500;
        peach.y = Math.floor(Math.random() * 650) + 50;
        peach.vx = Math.floor(Math.random() * -100) + -300;
        peach.vy = Math.floor(Math.random() * 50) + -50;
        peach.r = Math.floor(Math.random() * 50) + -50;
        peach.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("peachData", peach);
        io.emit("scoreUpdate", scores);
    });

    socket.on("peachMissedAndReset", function() {
        peach.x = Math.floor(Math.random() * 4000) + 3500;
        peach.y = Math.floor(Math.random() * 650) + 50;
        peach.vx = Math.floor(Math.random() * -100) + -300;
        peach.vy = Math.floor(Math.random() * 50) + -50;
        peach.r = Math.floor(Math.random() * 50) + -50;
        peach.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("peachData", peach);
    });

    socket.on("meteroidReset", function() {
        meteroid.dw = Math.floor(Math.random() * 1200) + 20;
        meteroid.dh = Math.floor(Math.random() * 1200) + 20;
        meteroid.vx = Math.floor(Math.random() * -200) + -20;
        meteroid.vy = Math.floor(Math.random() * -2) + 2;
        meteroid.r = Math.floor(Math.random() * 50) + -50;
        meteroid.angv = Math.floor(Math.random() * 5) + 1;
        meteroid.x = Math.floor(Math.random() * 2000) + 1500;
        meteroid.y = Math.floor(Math.random() * 750) + 50;
        io.emit("meteroidLocation", meteroid);
    });

    socket.on("meteroidCollision", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 50;
        } else {
            scores.red -= 50;
        }
        io.emit("scoreUpdate", scores);
    });

    socket.on("meteroidTwoReset", function() {
        meteroidTwo.dw = Math.floor(Math.random() * 1200) + 20;
        meteroidTwo.dh = Math.floor(Math.random() * 1200) + 20;
        meteroidTwo.vx = Math.floor(Math.random() * -300) + -200;
        meteroidTwo.vy = Math.floor(Math.random() * -2) + 2;
        meteroidTwo.r = Math.floor(Math.random() * 50) + -50;
        meteroidTwo.angv = Math.floor(Math.random() * 5) + 1;
        meteroidTwo.x = Math.floor(Math.random() * 2500) + 2000;
        meteroidTwo.y = Math.floor(Math.random() * 750) + 50;
        io.emit("meteroidTwoLocation", meteroidTwo);
    });

    socket.on("meteroidTwoCollision", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 100;
        } else {
            scores.red -= 100;
        }
        io.emit("scoreUpdate", scores);
    });

    socket.on("meteroidThreeReset", function() {
        meteroidThree.dw = Math.floor(Math.random() * 1200) + 20;
        meteroidThree.dh = Math.floor(Math.random() * 1200) + 20;
        meteroidThree.vx = Math.floor(Math.random() * -300) + -200;
        meteroidThree.vy = Math.floor(Math.random() * -2) + 2;
        meteroidThree.r = Math.floor(Math.random() * 50) + -50;
        meteroidThree.angv = Math.floor(Math.random() * 5) + 1;
        meteroidThree.x = Math.floor(Math.random() * 2500) + 3000;
        meteroidThree.y = Math.floor(Math.random() * 750) + 50;
        io.emit("meteroidThreeLocation", meteroidThree);
    });

    socket.on("meteroidThreeCollision", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 150;
        } else {
            scores.red -= 150;
        }
        io.emit("scoreUpdate", scores);
    });
});

server.listen(8081, function() {
    console.log(`Listening on ${server.address().port}`);
});
