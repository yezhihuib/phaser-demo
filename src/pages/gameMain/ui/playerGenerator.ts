import {DUDE_KEY} from "@/pages/gameMain/constant/constant";

class PlayerGenerator {
  private scene: Phaser.Scene;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.player = this.scene.physics.add.sprite(100, 450, DUDE_KEY);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.attachAnimation();
  }

  attachAnimation() {
    const {scene} = this;
    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers(DUDE_KEY, {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'turn',
      frames: [{key: DUDE_KEY, frame: 4}],
      frameRate: 20
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers(DUDE_KEY, {start: 5, end: 8}),
      frameRate: 10,
      repeat: -1
    });
  }

  public getPlayer() {
    return this.player;
  }

}

export default PlayerGenerator;
