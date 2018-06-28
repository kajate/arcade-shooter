var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);

var players = {};

var star = {
    x: Math.floor(Math.random() * 2700) + 1950,
    y: Math.floor(Math.random() * 650) + 50,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 115
};

var scores = {
    blue: 0,
    red: 0
};

var aubergine = {
    x: Math.floor(Math.random() * 5200) + 4050,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -500) + -30,
    vy: Math.floor(Math.random() * -2) + 2,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 115
};

var poop = {
    x: Math.floor(Math.random() * 3200) + 2050,
    y: Math.floor(Math.random() * 650) + 250,
    vx: Math.floor(Math.random() * -80) + -40,
    vy: Math.floor(Math.random() * -10) + 10,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 15
};

var tesla = {
    x: Math.floor(Math.random() * 1200) + 1550,
    y: Math.floor(Math.random() * 650) + 50,
    vx: Math.floor(Math.random() * -150) + -100,
    vy: Math.floor(Math.random() * -2) + 2,
    r: Math.floor(Math.random() * 50) + -50,
    angv: Math.floor(Math.random() * 145) + 115
};

var meteroid = {
    x: 1300,
    y: Math.floor(Math.random() * 750) + 50,
    dscale: (Math.random() * (1.12 - 0.12) + 0.12).toFixed(2),
    vx: -350,
    vy: Math.floor(Math.random() * -50) + 50,
    r: 20,
    angv: 10
};
var meteroidTwo = {
    x: 1900,
    y: Math.floor(Math.random() * 750) + 50,
    // dsize: (100, 400),
    dscale: (Math.random() * (1.12 - 0.12) + 0.12).toFixed(2),
    vx: -200,
    vy: 50, //Math.floor(Math.random() * -50) + 50,
    r: 20,
    angv: 10
};

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
    console.log("player " + [socket.id] + "  is joining the game");

    // create a new player and add it to our players object
    players[socket.id] = {
        rotation: 0,
        x: 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: Math.floor(Math.random() * 2) == 0 ? "blue" : "red"
    };

    // send the players object to the new player
    socket.emit("currentPlayers", players);
    //make sure the hiddenplayer exists everywhere in ever game
    // socket.emit("hiddenPlayer", hiddenPlayer);
    // send the star object to the new player
    socket.emit("starLocation", star);
    socket.emit("aubergineData", aubergine);
    socket.emit("poopData", poop);
    socket.emit("teslaData", tesla);

    // send the current scores
    socket.emit("scoreUpdate", scores);
    //send the current meteroid location
    socket.emit("meteroidLocation", meteroid);
    socket.emit("meteroidTwoLocation", meteroidTwo);
    // update all other players of the new player
    socket.broadcast.emit("newPlayer", players[socket.id]);
    console.log("player " + [socket.id] + "  has joined the game");

    socket.on("disconnect", function() {
        console.log("player " + [socket.id] + " is leaving the game");

        // remove this player from our players object
        delete players[socket.id];

        // emit a message to all players to remove this player
        io.emit("disconnect", socket.id);

        console.log("player " + [socket.id] + " has left the game");
    });

    // when a player moves, update the player data
    socket.on("playerMovement", function(movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        // players[socket.id].rotation = movementData.rotation;
        // emit a message to all players about the player that moved
        socket.broadcast.emit("playerMoved", players[socket.id]);
    });

    socket.on("starCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 10;
        } else {
            scores.red += 10;
        }
        star.angv = Math.floor(Math.random() * 145) + 115;
        star.r = Math.floor(Math.random() * 50) + -50;
        star.x = Math.floor(Math.random() * 3000) + 950;
        star.y = Math.floor(Math.random() * 650) + 50;
        io.emit("starLocation", star); //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });

    socket.on("starMissedAndReset", function() {
        star.angv = Math.floor(Math.random() * 145) + 115;
        star.r = Math.floor(Math.random() * 50) + -50;
        star.x = Math.floor(Math.random() * 3000) + 950;
        star.y = Math.floor(Math.random() * 650) + 50;
        io.emit("starLocation", star); //random number here for the new location of the star
    });

    socket.on("aubergineCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 100;
        } else {
            scores.red += 100;
        }
        aubergine.r = Math.floor(Math.random() * 50) + -50;
        aubergine.vx = Math.floor(Math.random() * -200) + -100;
        aubergine.vy = Math.floor(Math.random() * -20) + 20;
        aubergine.x = Math.floor(Math.random() * 2200) + 2550;
        aubergine.y = Math.floor(Math.random() * 650) + 50;
        aubergine.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("aubergineData", aubergine); //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });

    socket.on("aubergineMissedAndReset", function() {
        aubergine.r = Math.floor(Math.random() * 50) + -50;
        aubergine.vx = Math.floor(Math.random() * -200) + -100;
        aubergine.vy = Math.floor(Math.random() * -20) + 20;
        aubergine.x = Math.floor(Math.random() * 2200) + 2550;
        aubergine.y = Math.floor(Math.random() * 650) + 50;
        aubergine.angv = Math.floor(Math.random() * 145) + 115;
        io.emit("aubergineData", aubergine); //random number here for the new location of the aubergine
    });

    socket.on("poopCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 1000;
        } else {
            scores.red -= 1000;
        }
        poop.x = Math.floor(Math.random() * 3200) + 2050;
        poop.y = Math.floor(Math.random() * 650) + 250;
        poop.vx = Math.floor(Math.random() * -80) + -40;
        poop.vy = Math.floor(Math.random() * -10) + 10;
        poop.r = Math.floor(Math.random() * 50) + -50;
        poop.angv = Math.floor(Math.random() * 15) + 5;
        io.emit("poopData", poop); //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });

    socket.on("poopMissedAndReset", function() {
        poop.x = Math.floor(Math.random() * 3200) + 2050;
        poop.y = Math.floor(Math.random() * 650) + 250;
        poop.vx = Math.floor(Math.random() * -80) + -40;
        poop.vy = Math.floor(Math.random() * -10) + 10;
        poop.r = Math.floor(Math.random() * 50) + -50;
        poop.angv = Math.floor(Math.random() * 15) + 5;
        io.emit("poopData", poop); //random number here for the new location of the poop
    });

    socket.on("teslaCollected", function() {
        if (players[socket.id].team === "blue") {
            scores.blue += 5000;
        } else {
            scores.red += 5000;
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

    socket.on("meteroidCollision", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 1;
        } else {
            scores.red -= 1;
        }

        if (meteroid <= 10) {
            io.emit("meteroidData", meteroid);
        }
        io.emit("scoreUpdate", scores);
    });

    socket.on("meteroidReset", function() {
        meteroid.dscale = (Math.random() * (1.12 - 0.12) + 0.12).toFixed(2);
        meteroid.vx = Math.floor(Math.random() * -200) + -20;
        meteroid.vy = Math.floor(Math.random() * -2) + 2;
        meteroid.r = Math.floor(Math.random() * 50) + -50;
        meteroid.angv = Math.floor(Math.random() * 5) + 1;
        meteroid.x = Math.floor(Math.random() * 2600) + 1950;
        meteroid.y = Math.floor(Math.random() * 750) + 50;
        io.emit("meteroidLocation", meteroid); //random number here for the new location of the star
    });

    socket.on("meteroidTwoCollision", function() {
        if (players[socket.id].team === "blue") {
            scores.blue -= 1;
        } else {
            scores.red -= 1;
        }
        io.emit("scoreUpdate", scores);
    });

    socket.on("meteroidTwoReset", function() {
        meteroidTwo.dscale = (Math.random() * (1.12 - 0.12) + 0.12).toFixed(2);
        meteroidTwo.vx = Math.floor(Math.random() * -300) + -200;
        meteroidTwo.vy = Math.floor(Math.random() * -2) + 2;
        meteroidTwo.r = Math.floor(Math.random() * 50) + -50;
        meteroidTwo.angv = Math.floor(Math.random() * 5) + 1;
        meteroidTwo.x = Math.floor(Math.random() * 2600) + 1950;
        meteroidTwo.y = Math.floor(Math.random() * 750) + 50;
        io.emit("meteroidTwoLocation", meteroidTwo); //random number here for the new location of the star
    });
});

server.listen(8081, function() {
    console.log(`Listening on ${server.address().port}`);
});
