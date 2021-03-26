import {BULLET_KEY, DEFAULT_GRAVITY} from "@/pages/gameMain/constant/constant";

class BulletGenerator {

  private scene: Phaser.Scene;
  private group: Phaser.Physics.Arcade.Group;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(scene: Phaser.Scene, player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.scene = scene;
    this.player = player;
    this.group = this.scene.physics.add.group();
  }

  public getGroup() {
    return this.group;
  }

  public createBullet() {
    const bullet = this.group.create(this.player.x, this.player.y - 24, BULLET_KEY);
    bullet.setVelocityY(-600);
    bullet.setVelocityX(0);
    bullet.setGravityY(DEFAULT_GRAVITY * -1);
    return bullet;
  }
}

export default BulletGenerator;
