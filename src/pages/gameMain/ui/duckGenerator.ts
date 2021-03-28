import {DUCK_KEY, GAME_WIDTH} from "@/pages/gameMain/constant/constant";

class DuckGenerator {

  private group: Phaser.Physics.Arcade.Group;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.group = this.scene.physics.add.group();
  }

  public getGroup() {
    return this.group;
  }

  public generate(num: number) {
    const stepX = parseInt((`${(GAME_WIDTH - 12 * 2) / num}`), 10);
    const stars: Phaser.Physics.Arcade.Image[] = this.group.createFromConfig({
      key: DUCK_KEY,
      repeat: num,
      setXY: {x: 12, y: 0, stepX}
    });
    stars.forEach(function (child) {
      const imageChild = (child as Phaser.Physics.Arcade.Image);
      imageChild.setBounceY(Phaser.Math.FloatBetween(0.8, 1));
      imageChild.setBounceX(Phaser.Math.FloatBetween(0.8, 1));
      imageChild.setVelocity(Phaser.Math.Between(-200, 200), 20);
      imageChild.setCollideWorldBounds(true);
    });
    return stars;
  }
}

export default DuckGenerator;

