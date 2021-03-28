import {DEFAULT_GRAVITY, TIGER_KEY} from "@/pages/gameMain/constant/constant";

enum Direction {
  LEFT = "LEFT",
  RIGHT = "RIGHT"
}

class PlayerTigerGenerator {
  private scene: Phaser.Scene;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private direction: Direction;

  constructor(scene: Phaser.Scene) {
    this.direction = Direction.LEFT;
    this.scene = scene;
    this.player = this.scene.physics.add.sprite(100, 450, TIGER_KEY);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.attachAnimation();
  }

  attachAnimation() {
    const {scene} = this;
    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers(TIGER_KEY, {start: 5, end: 0}),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers(TIGER_KEY, {start: 8, end: 13}),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'turn-left',
      frames: [{key: TIGER_KEY, frame: 6}],
      frameRate: 20
    });

    scene.anims.create({
      key: 'turn-right',
      frames: [{key: TIGER_KEY, frame: 7}],
      frameRate: 20
    });
  }

  public getPlayer() {
    return this.player;
  }

  onKeyInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const {player} = this;

    if (cursors.left.isDown) {
      player.setVelocityX(-200);
      player.anims.play("left", true);
      this.direction = Direction.LEFT;
    } else if (cursors.right.isDown) {
      player.setVelocityX(200);
      player.anims.play("right", true);
      this.direction = Direction.RIGHT;
    } else {
      player.setVelocityX(0);
      if (this.direction === Direction.LEFT) {
        player.anims.play('turn-left');
      } else {
        player.anims.play('turn-right');
      }
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

export default PlayerTigerGenerator;
