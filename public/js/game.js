var config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1080,
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
        progressBar.fillRect(250, 280, 300 * value, 30);
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
    progressBox.fillRect(240, 270, 320, 50);

    //   this.load.image('logo', 'zenvalogo.png');
    // for (var i = 0; i < 500; i++) {
    //     this.load.image('logo'+i, 'zenvalogo.png');
    // }
    this.load.image("spark", "assets/particles.png");
    this.load.image("ship", "assets/ships/whitelines.png");
    this.load.image("catcher", "assets/line.png");
    this.load.image("otherPlayer", "assets/ships/whitefull.png");
    this.load.image("meteroid", "assets/meteroid.png");
    // this.load.image("star", "assets/meteroid2.png");
    // this.load.image("star", "assets/meteroid3.png");
    // this.load.image("star", "assets/meteroid4.png");
    // this.load.image("star", "assets/meteroid5.png");
    this.load.image("star", "assets/star_gold.png");
    this.load.image("bgtile", "assets/backgrounds/starsbig.png");
    this.load.image("bgtileTwo", "assets/backgrounds/starsbig.png");
    this.load.image("laser", "assets/bullet.png");
}

// var bullets;
//
// var fireRate = 100;
// var nextFire = 0;
//
// var firebutton;

// var lasers;

function create() {
    this.backgroundZero = this.add
        .tileSprite(400, 300, 280, 720, "bgtile")
        .setScale(0.5);
    this.backgroundOne = this.add
        .tileSprite(400, 300, 1280, 720, "bgtile")
        .setScale(1);
    this.backgroundTwo = this.add
        .tileSprite(800, 300, 1280, 720, "bgtileTwo")
        .setScale(2);
    this.backgroundThree = this.add
        .tileSprite(1000, 300, 1280, 720, "bgtileTwo")
        .setScale(8);

    this.catcher = this.physics.add.staticGroup();
    this.catcher.create(0, 410, "catcher");

    // var particles = this.add.particles("spark");
    //
    // var emitter = particles.createEmitter();
    // emitter.setPosition(6000, 400);
    // emitter.setScale(0.2);
    // emitter.setSpeed(200);
    // // emitter.setVelocityX(-50);
    // emitter.setBlendMode(Phaser.BlendModes.ADD);

    // bullets = this.add.group();
    // bullets.enableBody = true;
    //
    // bullets.createMultiple(50, "bullet");
    // this.setAll("checkWorldBounds", true);
    // this.setAll("outOfBoundsKill", true);

    window.addEventListener("resize", resize);
    resize();

    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
    this.lasers = this.add.group();
    this.lasers.enableBody = true;
    this.lasers.createMultiple(20, "laser");

    // this.lasers.callAll(
    //     "events.onOutOfBounds.add",
    //     "events.onOutOfBounds",
    //     resetLaser
    // );
    // Same as above, set the anchor of every sprite to 0.5, 1.0
    // this.lasers.callAll("anchor.setTo", "anchor", 0.5, 1.0);
    //
    // // This will set 'checkWorldBounds' to true on all sprites in the group
    // this.lasers.setAll("checkWorldBounds", true);
    //
    // // ...

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
        fontSize: "18px",
        fill: "#FFF"
    });

    this.redScoreText = this.add.text(16, 34, "", {
        fontSize: "18px",
        fill: "#FFF"
    });

    this.socket.on("scoreUpdate", function(scores) {
        self.blueScoreText.setText("Blue: " + scores.blue);
        self.redScoreText.setText("Red: " + scores.red);
    });

    this.socket.on("starLocation", function(starLocation) {
        if (self.star) self.star.destroy();
        self.star = self.physics.add
            .image(starLocation.x, starLocation.y, "star")
            .setDisplaySize(64, 64)
            .setVelocityX(-500);
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

    this.socket.on("meteroidLocation", function(meteroidData) {
        if (self.meteroid) self.meteroid.destroy();
        var randScale = Math.floor(Math.random() * 5) + 1;
        self.meteroid = self.physics.add
            .image(meteroidData.x, meteroidData.y, "meteroid")
            .setDisplaySize(64, 64)
            .setVelocityX(-500);
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
    });

    // this.socket.on("meteroidLocation", function(meteroidLocation) {
    //     // var rand = Math.floor(Math.random() * -100) + -50;
    //     // var randTwo = Math.floor(Math.random() * 5) + 1;
    //     // var dSize = Math.floor(Math.random() * 200) + 10;
    //     // var randThree = Math.floor(Math.random() * 100) + -100;
    //     // if (self.meteroid) self.meteroid.destroy();
    //     self.meteroid = self.physics.add
    //         .image(meteroidLocation.x, meteroidLocation.y, "meteroid")
    //         .setDisplaySize(meteriodLocation.mDSize, 64);
    //     self.physics.add.overlap(
    //         self.catcher,
    //         self.meteroid,
    //         function() {
    //             console.log("catcher collision");
    //             this.socket.emit("meteroidReset");
    //         },
    //         null,
    //         self
    //     );
    //     self.physics.add.overlap(
    //         self.ship,
    //         self.meteroid,
    //         function() {
    //             this.socket.emit("meteroidCollision");
    //         },
    //         null,
    //         self
    //     );
    // });

    this.cursors = this.input.keyboard.createCursorKeys();
    // this.firebutton = this.input.keyboard.addKey(
    //     Phaser.Input.Keyboard.KeyCodes.SPACE
    // );
}

function update() {
    this.backgroundZero.tilePositionX += 0.0001;
    this.backgroundOne.tilePositionX += 0.05;
    this.backgroundTwo.tilePositionX += 0.1;
    this.backgroundThree.tilePositionX += 2.5;

    if (this.ship) {
        // player movement
        var x = this.ship.x;
        var y = this.ship.y;
        // var r = this.ship.rotation;

        if (this.ship.x < 10) {
            this.ship.x = 10;
            this.ship.body.acceleration.x = 0;
        } else if (this.ship.x > 920) {
            this.ship.x = 920;
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
            // rotation: this.ship.rotation
        };

        // if (this.star) {
        //     if (this.star.x < -100) {
        //         this.star.x = Math.floor(Math.random() * 1000) + 1550;
        //         this.star.y = Math.floor(Math.random() * 720) + 10;
        //         // this.meteroid.body.acceleration.x = 0;
        //     }
        // }

        // if (
        //     this.star.oldPosition &&
        //     (x !== this.star.oldPosition.x || y !== this.star.oldPosition.y)
        //     //||
        //     //r !== this.ship.oldPosition.rotation
        // ) {
        //     this.socket.emit("starPosition", {
        //         x: this.star.x,
        //         y: this.star.y
        //         // rotation: this.ship.rotation
        //     });
        // }
        //
        // this.star.oldPosition = {
        //     x: this.star.x,
        //     y: this.star.y
        //     // rotation: this.ship.rotation
        // };

        if (this.cursors.left.isDown) {
            this.ship.setVelocityX(-350);
        } else if (this.cursors.right.isDown) {
            this.ship.setVelocityX(500);
            this.ship.setAcceleration(100);
            // this.ship.rotation += 10;
            this.backgroundOne.tilePositionX += 0.2;
            this.backgroundTwo.tilePositionX += 0.2;
            this.backgroundThree.tilePositionX += 3.5;
        } else {
            this.ship.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.ship.setVelocityY(-470);
            this.backgroundTwo.tilePositionY += -0.01;
            this.backgroundThree.tilePositionY += -0.5;
            // this.ship.rotation + 1.1;
            // this.ship.setAngularVelocity(-100);
        } else if (this.cursors.down.isDown) {
            this.ship.setVelocityY(470);
            this.backgroundTwo.tilePositionY += 0.01;
            this.backgroundThree.tilePositionY += 0.5;
            // this.ship.rotation + 1.1;
            // this.ship.setAngularVelocity(100);
            // this.ship.setAcceleration(0);
        } else {
            this.ship.setVelocityY(0);
        }
    }

    // if (this.meteroid) {
    //     if (this.meteroid.x > game.width - 100) {
    //         this.meteroid.x = game.width - 100;
    //         this.meteroid.body.acceleration.x = 0;
    //     }
    //     if (this.meteroid.x < -100) {
    //         this.meteroid.x = Math.floor(Math.random() * 1000) + 1550;
    //         this.meteroid.y = Math.floor(Math.random() * 720) + 10;
    //         // this.meteroid.body.acceleration.x = 0;
    //     }
    //     if (this.meteroid.y > game.height - 100) {
    //         this.meteroid.y = game.height - 100;
    //         this.meteroid.body.acceleration.x = 0;
    //     }
    //     if (this.meteroid.y < -100) {
    //         this.meteroid.x = Math.floor(Math.random() * 1500) + 1550;
    //         this.meteroid.y = Math.floor(Math.random() * 1220) + 1000;
    //         // this.meteroid.body.acceleration.x = 0;
    //     }
    // }

    // if (fireButton.isDown || game.input.activePointer.isDown) {
    //     fireBullet();
    // }
    // if (this.firebutton.isDown) {
    //     fireBullet();
    // }

    // Game.input.activePointer is either the first finger touched, or the mouse
    // if (game.input.activePointer.isDown) {
    //     // We'll manually keep track if the pointer wasn't already down
    //     if (!mouseTouchDown) {
    //         touchDown();
    //     }
    // } else {
    //     if (mouseTouchDown) {
    //         touchUp();
    //     }
    // }

    // function touchDown() {
    //     // Set touchDown to true, so we only trigger this once
    //     mouseTouchDown = true;
    //     fireLaser();
    // }
    //
    // function touchUp() {
    //     // Set touchDown to false, so we can trigger touchDown on the next click
    //     mouseTouchDown = false;
    // }

    // Loop over the keys
    // for (var index in phaserKeys) {
    //     // Save a reference to the current key
    //     var key = phaserKeys[index];
    //     // If the key was just pressed, fire a laser
    //     if (key.justDown) {
    //         fireLaser();
    //     }
    // }
}

// function init() {
//     // Listen to space & enter keys
//     var keys = [Phaser.KeyCode.SPACE, Phaser.KeyCode.ENTER];
//     // Create Phaser.Key objects for listening to the state
//     phaserKeys = game.input.keyboard.addKeys(keys);
//     // Capture these keys to stop the browser from receiving this event
//     game.input.keyboard.addKeyCapture(keys);
// }
//
// function fireLaser() {
//     // Get the first laser that's inactive, by passing 'false' as a parameter
//     var laser = lasers.getFirstExists(false);
//     if (laser) {
//         // If we have a laser, set it to the starting position
//         laser.reset(ship.x, ship.y - 20);
//         // Give it a velocity of -500 so it starts shooting
//         laser.body.velocity.y = -500;
//     }
// }
//
// function resetLaser(laser) {
//     // Destroy the laser
//     laser.kill();
// }

function addPlayer(self, playerInfo) {
    self.ship = self.physics.add
        .image(playerInfo.x, playerInfo.y, "ship")
        .setOrigin(0.5, 0.5)
        .setDisplaySize(64, 64);
    if (playerInfo.team === "blue") {
        self.ship.setTint(0x0000ff);
    } else {
        self.ship.setTint(0xff0000);
    }
    self.ship.setDrag(00);
    self.ship.setAngularDrag(00);
    self.ship.setMaxVelocity(600);
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add
        .sprite(playerInfo.x, playerInfo.y, "otherPlayer")
        .setOrigin(0.5, 0.5)
        .setDisplaySize(64, 64);
    if (playerInfo.team === "blue") {
        otherPlayer.setTint(0x0000ff);
    } else {
        otherPlayer.setTint(0xff0000);
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
