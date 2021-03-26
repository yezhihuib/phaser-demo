import {BOMB_KEY, GAME_WIDTH} from "@/pages/gameMain/constant/constant";

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

  generateBombs(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, num: number) {
    const stepX = parseInt((`${(GAME_WIDTH - 12 * 2) / num}`), 10);
    const bombs = this.group?.createFromConfig({
      key: BOMB_KEY,
      repeat: num,
      setXY: {x: 0, y: 0, stepX}
    });
    bombs?.forEach((bomb) => {
      const randX = (player.body.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      bomb.setX(randX)
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    });
    return bombs;
  }
}

export default BombGenerator;
