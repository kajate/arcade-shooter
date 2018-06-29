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
    x: Math.floor(Math.random() * 2500) + 1500,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -200) + -500,
    vy: Math.floor(Math.random() * 100) + -100,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var alien = {
    x: Math.floor(Math.random() * 15000) + 10000,
    y: Math.floor(Math.random() * 600) + 100,
    vx: Math.floor(Math.random() * -1700) + -1000,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 10) + -10,
    angv: Math.floor(Math.random() * 50) + 10
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
    x: Math.floor(Math.random() * 2700) + 2200,
    y: Math.floor(Math.random() * 600) + 200,
    vx: Math.floor(Math.random() * -100) + -40,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var tesla = {
    x: Math.floor(Math.random() * 7000) + 6000,
    y: Math.floor(Math.random() * 600) + 150,
    vx: Math.floor(Math.random() * -400) + -100,
    vy: Math.floor(Math.random() * -50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var pizza = {
    x: Math.floor(Math.random() * 4000) + 3500,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -100) + -300,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var peach = {
    x: Math.floor(Math.random() * 4000) + 3500,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -100) + -300,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var alien = {
    x: Math.floor(Math.random() * 4000) + 3000,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -1000) + -600,
    vy: Math.floor(Math.random() * 50) + -50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 150) + 50
};

var meteroid = {
    x: Math.floor(Math.random() * 2500) + 2000,
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 500) + 20,
    vx: Math.floor(Math.random() * -350) + 100,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * -50) + 50,
    angv: Math.floor(Math.random() * 150) + 50
};

var meteroidTwo = {
    x: Math.floor(Math.random() * 2500) + 200,
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 500) + 20,
    vx: Math.floor(Math.random() * -550) + 50,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * -50) + 50,
    angv: Math.floor(Math.random() * 150) + 50
};

var meteroidThree = {
    x: Math.floor(Math.random() * 3000) + 2500,
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 500) + 20,
    vx: Math.floor(Math.random() * -350) + 50,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * -50) + 50,
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
        star.x = Math.floor(Math.random() * 2500) + 1500;
        star.y = Math.floor(Math.random() * 650) + 50;
        star.vx = Math.floor(Math.random() * -200) + -500;
        star.vy = Math.floor(Math.random() * 100) + -100;
        star.r = Math.floor(Math.random() * 50) + -50;
        star.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("starLocation", star);
        io.emit("scoreUpdate", scores);
    });

    socket.on("starMissedAndReset", function() {
        star.x = Math.floor(Math.random() * 2500) + 1500;
        star.y = Math.floor(Math.random() * 650) + 50;
        star.vx = Math.floor(Math.random() * -200) + -500;
        star.vy = Math.floor(Math.random() * 100) + -100;
        star.r = Math.floor(Math.random() * 50) + -50;
        star.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("starLocation", star);
    });

    socket.on("alienCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += Math.floor(Math.random() * 20000) + 1;
        } else {
            scores.red += Math.floor(Math.random() * 20000) + 1;
        }
        alien.x = Math.floor(Math.random() * 15000) + 10000;
        alien.y = Math.floor(Math.random() * 600) + 100;
        alien.vx = Math.floor(Math.random() * -1700) + -1000;
        alien.vy = Math.floor(Math.random() * 50) + -50;
        alien.r = Math.floor(Math.random() * 10) + -10;
        alien.angv = Math.floor(Math.random() * 50) + 10;
        io.emit("alienData", alien);
        io.emit("scoreUpdate", scores);
    });

    socket.on("alienMissedAndReset", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= Math.floor(Math.random() * 15000) + 5000;
        } else {
            scores.red -= Math.floor(Math.random() * 15000) + 5000;
        }
        alien.x = Math.floor(Math.random() * 15000) + 10000;
        alien.y = Math.floor(Math.random() * 600) + 100;
        alien.vx = Math.floor(Math.random() * -1700) + -1000;
        alien.vy = Math.floor(Math.random() * 50) + -50;
        alien.r = Math.floor(Math.random() * 10) + -10;
        alien.angv = Math.floor(Math.random() * 50) + 10;
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
        poop.vx = Math.floor(Math.random() * -150) + -40;
        poop.vy = Math.floor(Math.random() * -10) + 10;
        poop.r = Math.floor(Math.random() * 50) + -50;
        poop.angv = Math.floor(Math.random() * 15) + 5;
        io.emit("poopData", poop);
        io.emit("scoreUpdate", scores);
    });

    socket.on("poopMissedAndReset", function() {
        poop.x = Math.floor(Math.random() * 3200) + 2050;
        poop.y = Math.floor(Math.random() * 650) + 250;
        poop.vx = Math.floor(Math.random() * -150) + -40;
        poop.vy = Math.floor(Math.random() * -10) + 10;
        poop.r = Math.floor(Math.random() * 50) + -50;
        poop.angv = Math.floor(Math.random() * 15) + 5;
        io.emit("poopData", poop);
    });

    socket.on("teslaCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 10000;
        } else {
            scores.red += 10000;
        }
        tesla.x = Math.floor(Math.random() * 7000) + 6000;
        tesla.y = Math.floor(Math.random() * 600) + 150;
        tesla.vx = Math.floor(Math.random() * -400) + -100;
        tesla.vy = Math.floor(Math.random() * -50) + -50;
        tesla.r = Math.floor(Math.random() * 50) + -50;
        tesla.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("teslaData", tesla);
        io.emit("scoreUpdate", scores);
    });

    socket.on("teslaMissedAndReset", function() {
        tesla.x = Math.floor(Math.random() * 7000) + 6000;
        tesla.y = Math.floor(Math.random() * 600) + 150;
        tesla.vx = Math.floor(Math.random() * -400) + -100;
        tesla.vy = Math.floor(Math.random() * -50) + -50;
        tesla.r = Math.floor(Math.random() * 50) + -50;
        tesla.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("teslaData", tesla);
    });

    socket.on("pizzaCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 6969;
        } else {
            scores.red += 6969;
        }
        pizza.x = Math.floor(Math.random() * 4000) + 3500;
        pizza.y = Math.floor(Math.random() * 650) + 50;
        pizza.vx = Math.floor(Math.random() * -100) + -300;
        pizza.vy = Math.floor(Math.random() * 50) + -50;
        pizza.r = Math.floor(Math.random() * 50) + -50;
        pizza.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("pizzaData", pizza);
        io.emit("scoreUpdate", scores);
    });

    socket.on("pizzaMissedAndReset", function() {
        pizza.x = Math.floor(Math.random() * 4000) + 3500;
        pizza.y = Math.floor(Math.random() * 650) + 50;
        pizza.vx = Math.floor(Math.random() * -100) + -300;
        pizza.vy = Math.floor(Math.random() * 50) + -50;
        pizza.r = Math.floor(Math.random() * 50) + -50;
        pizza.angv = Math.floor(Math.random() * 150) + 50;
        io.emit("pizzaData", pizza);
    });

    socket.on("peachCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 500;
        } else {
            scores.red += 500;
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

    socket.on("meteroidCollision", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 10;
        } else {
            scores.red -= 10;
        }

        if (meteroid <= 10) {
            io.emit("meteroidData", meteroid);
        }
        io.emit("scoreUpdate", scores);
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

    socket.on("meteroidTwoCollision", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 10;
        } else {
            scores.red -= 10;
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

    socket.on("meteroidThreeCollision", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 10;
        } else {
            scores.red -= 10;
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
});

server.listen(8081, function() {
    console.log(`Listening on ${server.address().port}`);
});
