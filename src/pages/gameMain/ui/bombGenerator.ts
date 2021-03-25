import {BOMB_KEY} from "@/pages/gameMain/constant/constant";

class BombGenerator {

  private scene: Phaser.Scene;
  private group: Phaser.Physics.Arcade.Group;


  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.group = this.scene.physics.add.group();
  }

  getGroup() {
    return this.group;
  }

  generate(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const x = (player.body.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    const bomb = this.group?.create(x, 16, BOMB_KEY);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    return bomb;
  }
}

export default BombGenerator;
