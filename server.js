var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);

var players = {};

//I will, in the means of time, fix all of this repetetiveteteive code,
//by creating a set of different speeds which I call on each property,
//for now, this is a quick-fix.

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

var aubergine = {
    x: Math.floor(Math.random() * 4000) + 3000,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -500) + -30,
    vy: Math.floor(Math.random() * -10) + 10,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 115
};

var poop = {
    x: Math.floor(Math.random() * 2500) + 2050,
    y: Math.floor(Math.random() * 650) + 250,
    vx: Math.floor(Math.random() * -80) + -40,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 15
};

var tesla = {
    x: Math.floor(Math.random() * 6200) + 6700,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -150) + -100,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 115
};

var pizza = {
    x: Math.floor(Math.random() * 5000) + 5500,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -250) + -100,
    vy: Math.floor(Math.random() * -5) + 5,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 115
};

var peach = {
    x: Math.floor(Math.random() * 4000) + 3000,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -500) + -30,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 115
};

var alien = {
    x: Math.floor(Math.random() * 4000) + 3000,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -500) + -30,
    vy: Math.floor(Math.random() * -2) + 2,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 115
};

var meteroidStart = {
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 1000) + 20,
    vx: Math.floor(Math.random() * -350) + 50,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * -50) + 50,
    angv: Math.floor(Math.random() * 50) + 10
};

var meteroid = {
    x: Math.floor(Math.random() * 2000) + 1500,
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 1000) + 20,
    vx: Math.floor(Math.random() * -350) + 50,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * -50) + 50,
    angv: Math.floor(Math.random() * 50) + 10
};

var meteroidTwo = {
    x: Math.floor(Math.random() * 2000) + 2500,
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 1000) + 20,
    vx: Math.floor(Math.random() * -350) + 50,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * -50) + 50,
    angv: Math.floor(Math.random() * 50) + 10
};

var meteroidThree = {
    x: Math.floor(Math.random() * 2500) + 3000,
    y: Math.floor(Math.random() * 700) + 50,
    dw: Math.floor(Math.random() * 1000) + 20,
    dh: Math.floor(Math.random() * 1000) + 20,
    vx: Math.floor(Math.random() * -350) + 50,
    vy: Math.floor(Math.random() * -50) + 50,
    r: Math.floor(Math.random() * -50) + 50,
    angv: Math.floor(Math.random() * 50) + 10
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
        io.emit("starLocation", star); //random number here for the new location of the star
    });

    socket.on("aubergineCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 500;
        } else {
            scores.red += 500;
        }
        aubergine.x = Math.floor(Math.random() * 3500) + 3000;
        aubergine.y = Math.floor(Math.random() * 650) + 50;
        aubergine.r = Math.floor(Math.random() * 50) + -50;
        aubergine.vx = Math.floor(Math.random() * -100) + -200;
        aubergine.vy = Math.floor(Math.random() * 50) + -50;
        aubergine.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("aubergineData", aubergine); //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });

    socket.on("aubergineMissedAndReset", function() {
        aubergine.r = Math.floor(Math.random() * 50) + -50;
        aubergine.vx = Math.floor(Math.random() * -200) + -100;
        aubergine.vy = Math.floor(Math.random() * -50) + 50;
        aubergine.x = Math.floor(Math.random() * 2200) + 2550;
        aubergine.y = Math.floor(Math.random() * 650) + 50;
        aubergine.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("aubergineData", aubergine); //random number here for the new location of the aubergine
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
        io.emit("poopData", poop); //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });

    socket.on("poopMissedAndReset", function() {
        poop.x = Math.floor(Math.random() * 3200) + 2050;
        poop.y = Math.floor(Math.random() * 650) + 250;
        poop.vx = Math.floor(Math.random() * -150) + -40;
        poop.vy = Math.floor(Math.random() * -10) + 10;
        poop.r = Math.floor(Math.random() * 50) + -50;
        poop.angv = Math.floor(Math.random() * 15) + 5;
        io.emit("poopData", poop); //random number here for the new location of the poop
    });

    socket.on("teslaCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 10000;
        } else {
            scores.red += 10000;
        }
        tesla.r = Math.floor(Math.random() * 50) + -50;
        tesla.vx = Math.floor(Math.random() * -200) + -100;
        tesla.vy = Math.floor(Math.random() * -20) + 20;
        tesla.x = Math.floor(Math.random() * 6200) + 6550;
        tesla.y = Math.floor(Math.random() * 650) + 50;
        tesla.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("teslaData", tesla); //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });

    socket.on("teslaMissedAndReset", function() {
        tesla.r = Math.floor(Math.random() * 50) + -50;
        tesla.vx = Math.floor(Math.random() * -200) + -100;
        tesla.vy = Math.floor(Math.random() * -20) + 20;
        tesla.x = Math.floor(Math.random() * 6200) + 6550;
        tesla.y = Math.floor(Math.random() * 650) + 50;
        tesla.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("teslaData", tesla); //random number here for the new location of the tesla
    });

    socket.on("pizzaCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 5000;
        } else {
            scores.red += 5000;
        }
        pizza.vx = Math.floor(Math.random() * -250) + -100;
        pizza.vy = Math.floor(Math.random() * -20) + 20;
        pizza.x = Math.floor(Math.random() * 6200) + 6550;
        pizza.y = Math.floor(Math.random() * 650) + 50;
        pizza.r = Math.floor(Math.random() * 50) + -50;
        pizza.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("pizzaData", pizza); //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });

    socket.on("pizzaMissedAndReset", function() {
        pizza.r = Math.floor(Math.random() * 50) + -50;
        pizza.vx = Math.floor(Math.random() * -200) + -100;
        pizza.vy = Math.floor(Math.random() * -20) + 20;
        pizza.x = Math.floor(Math.random() * 6200) + 6550;
        pizza.y = Math.floor(Math.random() * 650) + 50;
        pizza.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("pizzaData", pizza); //random number here for the new location of the pizza
    });

    socket.on("peachCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 500;
        } else {
            scores.red += 500;
        }
        peach.r = Math.floor(Math.random() * 50) + -50;
        peach.vx = Math.floor(Math.random() * -200) + -100;
        peach.vy = Math.floor(Math.random() * -50) + 50;
        peach.x = Math.floor(Math.random() * 2200) + 2550;
        peach.y = Math.floor(Math.random() * 650) + 50;
        peach.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("peachData", peach); //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });

    socket.on("peachMissedAndReset", function() {
        peach.r = Math.floor(Math.random() * 50) + -50;
        peach.vx = Math.floor(Math.random() * -200) + -100;
        peach.vy = Math.floor(Math.random() * -50) + 50;
        peach.x = Math.floor(Math.random() * 2200) + 2550;
        peach.y = Math.floor(Math.random() * 650) + 50;
        peach.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("peachData", peach); //random number here for the new location of the peach
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
        // meteroid.dscale = (Math.random() * (1.12 - 0.12) + 0.12).toFixed(2);
        meteroid.vx = Math.floor(Math.random() * -200) + -20;
        meteroid.vy = Math.floor(Math.random() * -2) + 2;
        meteroid.r = Math.floor(Math.random() * 50) + -50;
        meteroid.angv = Math.floor(Math.random() * 5) + 1;
        meteroid.x = Math.floor(Math.random() * 2000) + 1500;
        meteroid.y = Math.floor(Math.random() * 750) + 50;
        io.emit("meteroidLocation", meteroid); //random number here for the new location of the star
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
        // meteroidTwo.dscale = (Math.random() * (1.12 - 0.12) + 0.12).toFixed(2);
        meteroidTwo.vx = Math.floor(Math.random() * -300) + -200;
        meteroidTwo.vy = Math.floor(Math.random() * -2) + 2;
        meteroidTwo.r = Math.floor(Math.random() * 50) + -50;
        meteroidTwo.angv = Math.floor(Math.random() * 5) + 1;
        meteroidTwo.x = Math.floor(Math.random() * 2500) + 2000;
        meteroidTwo.y = Math.floor(Math.random() * 750) + 50;
        io.emit("meteroidTwoLocation", meteroidTwo); //random number here for the new location of the star
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
        // meteroidThree.dscale = (Math.random() * (1.12 - 0.12) + 0.12).toFixed(
        //     2
        // );
        meteroidThree.vx = Math.floor(Math.random() * -300) + -200;
        meteroidThree.vy = Math.floor(Math.random() * -2) + 2;
        meteroidThree.r = Math.floor(Math.random() * 50) + -50;
        meteroidThree.angv = Math.floor(Math.random() * 5) + 1;
        meteroidThree.x = Math.floor(Math.random() * 2500) + 3000;
        meteroidThree.y = Math.floor(Math.random() * 750) + 50;
        io.emit("meteroidThreeLocation", meteroidThree); //random number here for the new location of the star
    });
});

server.listen(8081, function() {
    console.log(`Listening on ${server.address().port}`);
});
