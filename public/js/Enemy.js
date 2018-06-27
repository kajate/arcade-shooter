class Enemy extends Phaser.Sprite {
  constructor(game) {
    super(game, 0, 0, "sprites"); // Setup Phaser.Sprite. It's coordinates is unimportant and I just set them to zero. "Sprites" is a spriteatlas with sprites for all enemies.
    this.exist = false; // I create an enemy instance but don't want to add it to the stage. For this I use a spawn method (mainly to make it easier to reuse the enemies from it's type specific pool).
    this.anchor.setTo(0.5, 0.5);
    // Body
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    // Vulnerabilities (used to calculate damage when hit)
    this.vulnerabilities = {
      normal: 1,
      ice: 1,
      wave: 1,
      bomb: 1,
      missile: 1000,
      screw: 1000
    };
    // Other stuff
    this.maxHealth = 1; // Health to set when spawned
    this.damage = 8; // Damage Samus will take if she touches the enemy
    let anim = this.animations.add("deathAnimation", ["boom0", "boom1", "boom2"], 15, false); // generic explosion when killed, can be overrided of course
    anim.onComplete.add(this.death, this);
  }

  /* Standard reset is called from the spawn-function (se example enemy later in the tutorial */
  stdReset(x, y) {
    this.reset(x, y);
    this.frozen = false;
    this.energy = this.maxHealth;
    this.exists = true;
    this.dying = false;
    this.sleeping = true; // the enemy is sleeping, and will cancel it's update
  }

  /* stdUpdate is called from the enemies' update methods to do generic stuff. If it return false the update loop in the enemy calling stdUpdate should be broken. */
  stdUpdate() {
    if (!this.exists && this.frozen) {
      return false;
    }
    if (this.sleeping) {
      if (this.inCamera) { // the enemy is within camera, and wakes up and stays awake even outside camera after this.
        this.sleeping = false;
      }
      return false;
    }
    return true; // Continue update-loop
  }

  hit(bullet) {
    if (this.dying) { // While the enemy sprite plays it's death animation it should ignore all bullets
      return;
    }
    if (bullet.type === "ice" && !this.frozen) { // Ice will freeze if not frozen, but defrost if the enemy is frozen
      this.frozen = true;
      this.play("frozen");
    } else {
      this.frozen = false; // I don't care about resetting animation, this should be done by the enemy itself in its now continued update loop
      this.health -= this.vulnerabilities[bullet.type];
      if (this.vulnerabilities[bullet.type] === 0) { // A metallic "klonk" when there is no damage
        this.game.sound.play('ricochetShort');
      }
    }

    if (this.health < 1) {
      this.dying = true;
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      this.body.allowGravity = false; // most enemies has this to false already, but not all
      this.play("deathAnimation");
    }
  }

  death() {
    this.game.pickups.createNew(this.x, this.y, "random"); // The enemies randomly drops an energy dot or missile
    this.exists = false;
  }
}

export default Enemy;
