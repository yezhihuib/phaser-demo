import {BULLET_KEY, DEFAULT_GRAVITY} from "@/pages/gameMain/constant/constant";

class BulletGenerator {

  private scene: Phaser.Scene;
  private group: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.group = this.scene.physics.add.group();
  }

  public getGroup() {
    return this.group;
  }

  public createBullets(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, num: number) {
    const bulletNumber = num % 2 === 0 ? num + 1 : num;
    const bullets = this.group.createMultiple({
      key: BULLET_KEY,
      quantity: bulletNumber,
      setXY: {x: player.x, y: player.y - 12}
    });
    const step = -20;
    const baseVelocity = -1 * step * (bulletNumber - 1) / 2;
    bullets.forEach((bullet, index) => {
      bullet.setVelocityY(-600);
      bullet.setVelocityX(baseVelocity + index * step);
      bullet.setGravityY(DEFAULT_GRAVITY * -1);
    });
    return bullets;
  }
}

export default BulletGenerator;
