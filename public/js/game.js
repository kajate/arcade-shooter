var config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1280,
    height: 720,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.on("progress", function(value) {
        console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(500, 360, 300 * value, 30);
    });

    this.load.on("fileprogress", function(file) {
        console.log(file.src);
    });

    this.load.on("complete", function() {
        console.log("complete");
        progressBar.destroy();
        progressBox.destroy();
    });

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(490, 350, 320, 50);

    //   this.load.image('logo', 'zenvalogo.png');
    // for (var i = 0; i < 500; i++) {
    //     this.load.image('logo'+i, 'zenvalogo.png');
    // }

    this.load.image("ship", "assets/ships/whitelines.png");
    this.load.image("otherPlayer", "assets/ships/whitefull.png");

    this.load.image("meteroid", "assets/meteroid.png");
    this.load.image("meteroidTwo", "assets/meteroidtwo.png");
    this.load.image("meteroidThree", "assets/meteroidthree.png");

    this.load.image("star", "assets/emoji/tearsofjoy.png");
    this.load.image("aubergine", "assets/emoji/aubergine.png");
    this.load.image("poop", "assets/emoji/poop.png");
    this.load.image("tesla", "assets/emoji/tesla.png");
    this.load.image("pizza", "assets/emoji/pizza.png");
    this.load.image("peach", "assets/emoji/peach.png");
    this.load.image("alien", "assets/emoji/alien.png");

    this.load.image("earth", "assets/backgrounds/earth.jpg");
    this.load.image("bgtile", "assets/backgrounds/starsbig.png");
    this.load.image("bgtileTwo", "assets/backgrounds/starsbig.png");

    this.load.image("catcher", "assets/line.png");
}

// var bullets;
//
// var fireRate = 100;
// var nextFire = 0;
//
// var firebutton;

// var lasers;

function create() {
    this.backgroundEarth = this.add
        .tileSprite(900, 200, 1960, 1600, "earth")
        .setScale(0.2);
    this.backgroundZero = this.add
        .tileSprite(400, 300, 3780, 1820, "bgtile")
        .setScale(0.5);
    this.backgroundOne = this.add
        .tileSprite(800, 300, 1580, 720, "bgtile")
        .setScale(1);
    this.backgroundTwo = this.add
        .tileSprite(800, 300, 580, 720, "bgtileTwo")
        .setScale(2);
    this.backgroundThree = this.add
        .tileSprite(1000, 300, 1280, 720, "bgtileTwo")
        .setScale(8);

    this.catcher = this.physics.add.staticGroup();
    this.catcher.create(-2380, 360, "catcher");

    // this.bullets = this.add.group();
    // this.bullets.enableBody = true;
    // this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    //
    // this.bullets.createMultiple(40, "bullet");
    // this.bullets.setAll("anchor.x", 0.5);
    // this.bullets.setAll("anchor.y", 0.5);

    // this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    // var particles = this.add.particles("spark");
    //
    // var emitter = particles.createEmitter();
    // emitter.setPosition(6000, 400);
    // emitter.setScale(0.2);
    // emitter.setSpeed(200);
    // // emitter.setVelocityX(-50);
    // emitter.setBlendMode(Phaser.BlendModes.ADD);

    window.addEventListener("resize", resize);
    resize();

    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
    this.meteroid = this.physics.add.group("meteroid");
    this.meteroidTwo = this.physics.add.group("meteroidTwo");
    this.lasers = this.add.group();
    this.lasers.enableBody = true;
    this.lasers.createMultiple(20, "laser");

    this.socket.on("currentPlayers", function(players) {
        Object.keys(players).forEach(function(id) {
            if (players[id].playerId === self.socket.id) {
                addPlayer(self, players[id]);
            } else {
                addOtherPlayers(self, players[id]);
            }
        });
    });

    this.socket.on("newPlayer", function(playerInfo) {
        addOtherPlayers(self, playerInfo);
    });

    this.socket.on("playerMoved", function(playerInfo) {
        self.otherPlayers.getChildren().forEach(function(otherPlayer) {
            if (playerInfo.playerId === otherPlayer.playerId) {
                // otherPlayer.setRotation(playerInfo.rotation);
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });

    this.socket.on("disconnect", function(playerId) {
        self.otherPlayers.getChildren().forEach(function(otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });

    this.blueScoreText = this.add.text(16, 16, "", {
        fontSize: "24px",
        fill: "#7ccdff"
    });

    this.redScoreText = this.add.text(16, 40, "", {
        fontSize: "24px",
        fill: "#ff8ef0"
    });

    this.socket.on("scoreUpdate", function(scores) {
        self.blueScoreText.setText("Blue: " + scores.blue);
        self.redScoreText.setText("Pink: " + scores.red);
    });

    this.socket.on("starLocation", function(starLocation) {
        if (self.star) self.star.destroy();
        self.star = self.physics.add
            .image(starLocation.x, starLocation.y, "star")
            .setRotation(starLocation.r)
            .setAngularVelocity(starLocation.angv)
            .setDisplaySize(54, 54)
            .setVelocityX(starLocation.vx)
            .setVelocityY(starLocation.vy);
        self.physics.add.overlap(
            self.catcher,
            self.star,
            function() {
                console.log("catcher collision");
                this.socket.emit("starMissedAndReset");
            },
            null,
            self
        );
        self.physics.add.overlap(
            self.ship,
            self.star,
            function() {
                this.socket.emit("starCollected");
            },
            null,
            self
        );
    });

    this.socket.on("aubergineData", function(aubergineData) {
        if (self.aubergine) self.aubergine.destroy();
        self.aubergine = self.physics.add
            .image(aubergineData.x, aubergineData.y, "aubergine")
            .setDisplaySize(54, 54)
            .setVelocityX(aubergineData.vx)
            .setVelocityY(aubergineData.vy)
            .setRotation(aubergineData.r)
            .setAngularVelocity(aubergineData.angv);
        self.physics.add.overlap(
            self.catcher,
            self.aubergine,
            function() {
                console.log("catcher collision");
                this.socket.emit("aubergineMissedAndReset");
            },
            null,
            self
        );
        self.physics.add.overlap(
            self.ship,
            self.aubergine,
            function() {
                this.socket.emit("aubergineCollected");
            },
            null,
            self
        );
    });

    this.socket.on("poopData", function(poopData) {
        if (self.poop) self.poop.destroy();
        self.poop = self.physics.add
            .image(poopData.x, poopData.y, "poop")
            .setDisplaySize(54, 54)
            .setVelocityX(poopData.vx)
            .setVelocityY(poopData.vy)
            .setRotation(poopData.r)
            .setAngularVelocity(poopData.angv);
        self.physics.add.overlap(
            self.catcher,
            self.poop,
            function() {
                console.log("catcher collision");
                this.socket.emit("poopMissedAndReset");
            },
            null,
            self
        );
        self.physics.add.overlap(
            self.ship,
            self.poop,
            function() {
                this.socket.emit("poopCollected");
            },
            null,
            self
        );
    });

    this.socket.on("teslaData", function(teslaData) {
        if (self.tesla) self.tesla.destroy();
        self.tesla = self.physics.add
            .image(teslaData.x, teslaData.y, "tesla")
            .setDisplaySize(109, 64)
            .setVelocityX(teslaData.vx)
            .setVelocityY(teslaData.vy)
            .setRotation(teslaData.r)
            .setAngularVelocity(teslaData.angv);
        self.physics.add.overlap(
            self.catcher,
            self.tesla,
            function() {
                console.log("catcher collision");
                this.socket.emit("teslaMissedAndReset");
            },
            null,
            self
        );
        self.physics.add.overlap(
            self.ship,
            self.tesla,
            function() {
                this.socket.emit("teslaCollected");
            },
            null,
            self
        );
    });

    this.socket.on("pizzaData", function(pizzaData) {
        if (self.pizza) self.pizza.destroy();
        self.pizza = self.physics.add
            .image(pizzaData.x, pizzaData.y, "pizza")
            .setDisplaySize(64, 64)
            .setVelocityX(pizzaData.vx)
            .setVelocityY(pizzaData.vy)
            .setRotation(pizzaData.r)
            .setAngularVelocity(pizzaData.angv);
        self.physics.add.overlap(
            self.catcher,
            self.pizza,
            function() {
                console.log("catcher collision");
                this.socket.emit("pizzaMissedAndReset");
            },
            null,
            self
        );
        self.physics.add.overlap(
            self.ship,
            self.pizza,
            function() {
                this.socket.emit("pizzaCollected");
            },
            null,
            self
        );
    });

    this.socket.on("peachData", function(peachData) {
        if (self.peach) self.peach.destroy();
        self.peach = self.physics.add
            .image(peachData.x, peachData.y, "peach")
            .setDisplaySize(64, 64)
            .setVelocityX(peachData.vx)
            .setVelocityY(peachData.vy)
            .setRotation(peachData.r)
            .setAngularVelocity(peachData.angv);
        self.physics.add.overlap(
            self.catcher,
            self.peach,
            function() {
                console.log("catcher collision");
                this.socket.emit("peachMissedAndReset");
            },
            null,
            self
        );
        self.physics.add.overlap(
            self.ship,
            self.peach,
            function() {
                this.socket.emit("peachCollected");
            },
            null,
            self
        );
    });

    this.socket.on("meteroidLocation", function(meteroidData) {
        if (self.meteroid) self.meteroid.destroy();
        var randScale = Math.floor(Math.random() * 5) + 1;
        self.meteroid = self.physics.add
            .image(meteroidData.x, meteroidData.y, "meteroid")
            // .setScale(meteroidData.dscale)
            .setDisplaySize(meteroidData.dw, meteroidData.dh)
            .setVelocityX(meteroidData.vx)
            .setVelocityY(meteroidData.vy)
            .setRotation(meteroidData.r)
            .setAngularVelocity(meteroidData.angv);
        self.physics.add.overlap(
            self.catcher,
            self.meteroid,
            function() {
                console.log("catcher collision");
                this.socket.emit("meteroidReset");
            },
            null,
            self
        );
        self.physics.add.overlap(
            self.ship,
            self.meteroid,
            function() {
                this.socket.emit("meteroidCollision");
            },
            null,
            self
        );
        // self.physics.add.collider(self.meteroid, self.meteroidTwo);
    });

    this.socket.on("meteroidTwoLocation", function(meteroidTwoData) {
        if (self.meteroidTwo) self.meteroidTwo.destroy();
        self.meteroidTwo = self.physics.add
            .image(meteroidTwoData.x, meteroidTwoData.y, "meteroidTwo")
            // .setScale(meteroidTwoData.dscale)
            .setDisplaySize(meteroidTwoData.dw, meteroidTwoData.dh)
            .setVelocityX(meteroidTwoData.vx)
            .setVelocityY(meteroidTwoData.vy)
            .setRotation(meteroidTwoData.r)
            .setAngularVelocity(meteroidTwoData.angv);
        self.physics.add.overlap(
            self.catcher,
            self.meteroidTwo,
            function() {
                console.log("catcher collision");
                this.socket.emit("meteroidTwoReset");
            },
            null,
            self
        );
        self.physics.add.overlap(
            self.ship,
            self.meteroidTwo,
            function() {
                this.socket.emit("meteroidTwoCollision");
            },
            null,
            self
        );
    });

    this.socket.on("meteroidThreeLocation", function(meteroidThreeData) {
        if (self.meteroidThree) self.meteroidThree.destroy();
        self.meteroidThree = self.physics.add
            .image(meteroidThreeData.x, meteroidThreeData.y, "meteroidThree")
            // .setScale(meteroidThreeData.dscale)
            .setDisplaySize(meteroidThreeData.dw, meteroidThreeData.dh)
            .setVelocityX(meteroidThreeData.vx)
            .setVelocityY(meteroidThreeData.vy)
            .setRotation(meteroidThreeData.r)
            .setAngularVelocity(meteroidThreeData.angv);
        self.physics.add.overlap(
            self.catcher,
            self.meteroidThree,
            function() {
                console.log("catcher collision");
                this.socket.emit("meteroidThreeReset");
            },
            null,
            self
        );
        self.physics.add.overlap(
            self.ship,
            self.meteroidThree,
            function() {
                this.socket.emit("meteroidThreeCollision");
            },
            null,
            self
        );
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    // this.firebutton = this.input.keyboard.addKey(
    //     Phaser.Input.Keyboard.KeyCodes.SPACE
    // );
}

function update() {
    this.backgroundEarth.tilePositionX += 0.13;
    this.backgroundZero.tilePositionX += 0.08;
    this.backgroundOne.tilePositionX += 0.05;
    this.backgroundTwo.tilePositionX += 0.18;
    this.backgroundThree.tilePositionX += 4.5;

    if (this.ship) {
        // player movement
        var x = this.ship.x;
        var y = this.ship.y;
        // var r = this.ship.rotation;

        if (this.ship.x < 10) {
            this.ship.x = 10;
            this.ship.body.acceleration.x = 0;
        } else if (this.ship.x > 1280) {
            this.ship.x = 1280;
            this.ship.body.acceleration.x = 0;
        } else if (this.ship.y < 10) {
            this.ship.y = 10;
            this.ship.body.acceleration.x = 0;
        } else if (this.ship.y > 710) {
            this.ship.y = 710;
            this.ship.body.acceleration.x = 0;
        }

        if (
            this.ship.oldPosition &&
            (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y)
            //||
            //r !== this.ship.oldPosition.rotation
        ) {
            this.socket.emit("playerMovement", {
                x: this.ship.x,
                y: this.ship.y
                // rotation: this.ship.rotation
            });
        }

        this.ship.oldPosition = {
            x: this.ship.x,
            y: this.ship.y
        };

        if (this.cursors.left.isDown) {
            this.ship.setVelocityX(-350);
        } else if (this.cursors.right.isDown) {
            this.ship.setVelocityX(500);
            this.ship.setAcceleration(100);
            this.backgroundOne.tilePositionX += 0.15;
            this.backgroundTwo.tilePositionX += 0.25;
            this.backgroundThree.tilePositionX += 3.5;
        } else {
            this.ship.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.ship.setVelocityY(-470);
            this.backgroundTwo.tilePositionY += -0.02;
            this.backgroundThree.tilePositionY += -0.2;
        } else if (this.cursors.down.isDown) {
            this.ship.setVelocityY(470);
            this.backgroundTwo.tilePositionY += 0.02;
            this.backgroundThree.tilePositionY += 0.2;
        } else {
            this.ship.setVelocityY(0);
        }
    }
}

function addPlayer(self, playerInfo) {
    self.ship = self.physics.add
        .sprite(playerInfo.x, playerInfo.y, "ship")
        .setOrigin(0.5, 0.5)
        .setDisplaySize(44, 44);
    if (playerInfo.team === "blue") {
        self.ship.setTint(0x7ccdff);
    } else {
        self.ship.setTint(0xff8ef0);
    }
    self.ship.setMaxVelocity(600);
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add
        .sprite(playerInfo.x, playerInfo.y, "otherPlayer")
        .setOrigin(0.5, 0.5)
        .setDisplaySize(44, 44);
    if (playerInfo.team === "blue") {
        otherPlayer.setTint(0x7ccdff);
    } else {
        otherPlayer.setTint(0xff8ef0);
    }
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
}

function resize() {
    var canvas = game.canvas,
        width = window.innerWidth,
        height = window.innerHeight;
    var wratio = width / height,
        ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = width / ratio + "px";
    } else {
        canvas.style.width = height * ratio + "px";
        canvas.style.height = height + "px";
    }
}
