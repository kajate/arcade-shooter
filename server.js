var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);

var players = {};
// var hiddenPlayer = {
//     x: 50,
//     y: 0
// };

var star = {
    x: Math.floor(Math.random() * 1200) + 950,
    y: Math.floor(Math.random() * 650) + 50
};

var meteroid = {
    x: 1200,
    y: 400,
    // dSize: (100, 100),
    vx: 20,
    vy: 20,
    r: 20,
    angv: 5
};

var scores = {
    blue: 0,
    red: 0
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
    // send the current scores
    socket.emit("scoreUpdate", scores);
    //send the current meteroid location
    socket.emit("meteroidLocation", meteroid);
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
        if (players[socket.id].team === "red") {
            scores.red += 10;
        } else {
            scores.blue += 10;
        }
        star.x = Math.floor(Math.random() * 1000) + 950;
        star.y = Math.floor(Math.random() * 650) + 50;
        io.emit("starLocation", star); //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });

    socket.on("starMissedAndReset", function() {
        star.x = Math.floor(Math.random() * 1000) + 950;
        star.y = Math.floor(Math.random() * 650) + 50;
        io.emit("starLocation", star); //random number here for the new location of the star
    });

    socket.on("meteroidReset", function() {
        meteroid.x = Math.floor(Math.random() * 1000) + 950;
        meteroid.y = Math.floor(Math.random() * 650) + 50;
        if (meteroid <= 10) {
            io.emit("meteroidLocation", meteroid);
        } //random number here for the new location of the star
    });

    socket.on("meteroidCollision", function() {
        if (players[socket.id] === "blue") {
            scores.red -= 1;
        } else {
            scores.blue -= 1;
        }
        meteroid.x = Math.floor(Math.random() * 1000) + 950;
        meteroid.y = Math.floor(Math.random() * 650) + 50;
        if (meteroid <= 10) {
            io.emit("meteroidLocation", meteroid);
        } //random number here for the new location of the star
        io.emit("scoreUpdate", scores);
    });
});

server.listen(8081, function() {
    console.log(`Listening on ${server.address().port}`);
});
