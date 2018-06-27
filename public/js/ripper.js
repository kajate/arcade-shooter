

import Enemy from 'Enemy';

class Ripper extends Enemy {

  constructor(game) {
    super(game); // // Setup the generic Enemy class
    this.animations.add("yellow", ["ripperYellow"]); // The "animation" consists of only on frame in this case
    this.animations.add("red", ["ripperRed"]); // The red type of rippers
    this.animations.add("frozen", ["ripperFrozen"]); // A frozen ripper

    this.vulnerabilities = {
      normal: 0,
      ice: 0,
      wave: 0,
      bomb: 0,
      missile: 0,
      screw: 0
    };
  }

  spawn(x, y, type) {
    this.stdReset(x,y); // Reset everything from Enemy class
    this.color = type; // there is two types, yellow and red
    if(this.color === "red") {
      // The red ones can be killed with missiles and screw attack
      this.vulnerabilities.missile = 1000;
      this.vulnerabilities.screw = 1000;
    }
    else {
      // The yellow ones is indestructible
      this.vulnerabilities.missile = 0;
      this.vulnerabilities.screw = 0;
    }
    this.play(this.color);
    // start in a random direction
    if (Math.random() < 0.5) {
      this.body.velocity.x = -this.speed;
    } else {
      this.body.velocity.x = this.speed;
    }
  }

/* The update method will be called automatically by Phaser, just as in the pure Phaser.Sprite class */
  update() {
    if(!this.stdUpdate()){return;}; // Do a standard update from Enemy class to check if update should even be done
    this.game.physics.arcade.collide(this, this.game.collisionLayer);
    if (this.body.blocked.right) {
      this.scale.x = -1;
      this.body.velocity.x = -this.speed;
    } else if (this.body.blocked.left) {
      this.scale.x = 1;
      this.body.velocity.x = this.speed;
    }
  }
}

export default Ripper;
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
import Enemy from 'Enemy';

class Ripper extends Enemy {

  constructor(game) {
    super(game); // // Setup the generic Enemy class
    this.animations.add("yellow", ["ripperYellow"]); // The "animation" consists of only on frame in this case
    this.animations.add("red", ["ripperRed"]); // The red type of rippers
    this.animations.add("frozen", ["ripperFrozen"]); // A frozen ripper

    this.vulnerabilities = {
      normal: 0,
      ice: 0,
      wave: 0,
      bomb: 0,
      missile: 0,
      screw: 0
    };
  }

  spawn(x, y, type) {
    this.stdReset(x,y); // Reset everything from Enemy class
    this.color = type; // there is two types, yellow and red
    if(this.color === "red") {
      // The red ones can be killed with missiles and screw attack
      this.vulnerabilities.missile = 1000;
      this.vulnerabilities.screw = 1000;
    }
    else {
      // The yellow ones is indestructible
      this.vulnerabilities.missile = 0;
      this.vulnerabilities.screw = 0;
    }
    this.play(this.color);
    // start in a random direction
    if (Math.random() < 0.5) {
      this.body.velocity.x = -this.speed;
    } else {
      this.body.velocity.x = this.speed;
    }
  }

/* The update method will be called automatically by Phaser, just as in the pure Phaser.Sprite class */
  update() {
    if(!this.stdUpdate()){return;}; // Do a standard update from Enemy class to check if update should even be done
    this.game.physics.arcade.collide(this, this.game.collisionLayer);
    if (this.body.blocked.right) {
      this.scale.x = -1;
      this.body.velocity.x = -this.speed;
    } else if (this.body.blocked.left) {
      this.scale.x = 1;
      this.body.velocity.x = this.speed;
    }
  }
}

export default Ripper;
