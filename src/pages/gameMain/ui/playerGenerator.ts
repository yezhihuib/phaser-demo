import {DEFAULT_GRAVITY, DUDE_KEY} from "@/pages/gameMain/constant/constant";

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

  onKeyInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const {player} = this;
    if (cursors.left.isDown) {
      player.setVelocityX(-200);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(200);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-360);
    }
    if (cursors.down.isDown) {
      player.setGravity(DEFAULT_GRAVITY * 2);
    } else {
      player.setGravity(0);
    }
  }

}

export default PlayerGenerator;
