import {DEFAULT_GRAVITY, PANDA_KEY} from "@/pages/gameMain/constant/constant";

enum Direction {
  LEFT = "LEFT",
  RIGHT = "RIGHT"
}

class PlayerPandaGenerator {
  private scene: Phaser.Scene;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private faceDirection: Direction;

  constructor(scene: Phaser.Scene) {
    this.faceDirection = Direction.LEFT;
    this.scene = scene;
    this.player = this.scene.physics.add.sprite(100, 450, PANDA_KEY);
    this.player.setOriginFromFrame();
    this.player.setBounce(0.2);
    this.player.body.syncBounds = true;
    this.player.setCollideWorldBounds(true);
    this.attachAnimation();
  }

  attachAnimation() {
    const {scene} = this;
    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNames(PANDA_KEY, {start: 1, end: 4, prefix: "walk_l_", suffix: ".png"}),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNames(PANDA_KEY, {start: 1, end: 4, prefix: "walk_r_", suffix: ".png"}),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'turn-left',
      frames: [{key: PANDA_KEY, frame: "static_l_1.png"}],
      frameRate: 20
    });

    scene.anims.create({
      key: 'turn-right',
      frames: [{key: PANDA_KEY, frame: "static_r_1.png"}],
      frameRate: 20
    });

    scene.anims.create({
      key: 'jump-air-left',
      frames: [{key: PANDA_KEY, frame: "jump_l_2.png"}],
      frameRate: 20
    });

    scene.anims.create({
      key: 'jump-air-right',
      frames: [{key: PANDA_KEY, frame: "jump_r_2.png"}],
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
      if (player.body.touching.down) {
        player.anims.play("left", true);
      } else {
        player.anims.play("jump-air-left", true);
      }
      this.faceDirection = Direction.LEFT;
    } else if (cursors.right.isDown) {
      player.setVelocityX(200);
      if (player.body.touching.down) {
        player.anims.play("right", true);
      } else {
        player.anims.play("jump-air-right", true);
      }
      this.faceDirection = Direction.RIGHT;
    } else {
      player.setVelocityX(0);
      if (this.faceDirection === Direction.LEFT) {
        if (player.body.touching.down) {
          player.anims.play('turn-left');
        } else {
          player.anims.play("jump-air-left", true);
        }
      } else {
        if (player.body.touching.down) {
          player.anims.play('turn-right');
        } else {
          player.anims.play("jump-air-right", true);
        }
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

export default PlayerPandaGenerator;
