import React, {useEffect} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {useIntl} from "umi";
import {Card} from "antd";
import {AUTO, Game, Scene} from "phaser";

class Demo extends Scene {
  constructor() {
    super("demo");// 继承父类 并传入名字
  }

  public score = 0;
  public scoreText: Phaser.GameObjects.Text | undefined;
  public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  public stars: Phaser.Physics.Arcade.Group | undefined;
  public bombs: Phaser.Physics.Arcade.Group | undefined;

  public preload() { // j静态资源
    this.load.image('sky', 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01HDz0gO1nzmlLuq9Ba_!!57145161.png');
    this.load.image('ground', 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01WzzR4B1nzmlNygRyv_!!57145161.png');
    this.load.image('star', 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01O4i54u1nzmlFI0G27_!!57145161.png');
    this.load.image('bomb', 'https://img.alicdn.com/imgextra/i1/57145161/O1CN013xlIg11nzmlNSqcq5_!!57145161.png');
    this.load.spritesheet('dude',
      'https://img.alicdn.com/imgextra/i2/57145161/O1CN01cgRJ3b1nzmlKUSMa9_!!57145161.png',
      {frameWidth: 32, frameHeight: 48}
    );
  }

  public collectStar(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, star: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    (star as Phaser.Physics.Arcade.Image).disableBody(true, true);
    this.score += 10;
    (this.scoreText as Phaser.GameObjects.Text).setText(`分数: ${this.score}`);
    if (this.stars?.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        const imageChild = (child as Phaser.Physics.Arcade.Image);
        imageChild.enableBody(true, imageChild.x, 0, true, true);
        imageChild.setBounceY(Phaser.Math.FloatBetween(1, 1));
        imageChild.setBounceX(Phaser.Math.FloatBetween(1, 1));
        imageChild.setVelocity(Phaser.Math.Between(-200, 200), 20);
        imageChild.setCollideWorldBounds(true);

      });

      const x = (player.body.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      const bomb = this.bombs?.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
  }

  public hitBomb(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, bomb: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    this.physics.pause();
    const playerSprite = (player as Phaser.GameObjects.Sprite);
    playerSprite.setTint(0xff0000);
    playerSprite.anims.play('turn');

    //gameOver = true;
  }

  public create() {// 生命周期
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{key: 'dude', frame: 4}],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
      frameRate: 10,
      repeat: -1
    });

    this.physics.add.collider(this.player, platforms);

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {x: 12, y: 0, stepX: 70}
    });


    this.stars.children.iterate(function (child) {
      const imageChild = (child as Phaser.Physics.Arcade.Image);
      imageChild.setBounceY(Phaser.Math.FloatBetween(1, 1));
      imageChild.setBounceX(Phaser.Math.FloatBetween(1, 1));
      imageChild.setVelocity(Phaser.Math.Between(-200, 200), 20);
      imageChild.setCollideWorldBounds(true);
    });

    this.physics.add.collider(this.stars, platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);
    this.scoreText = this.add.text(16, 16, '分数: 0', {fontSize: '32px', fill: '#000'});

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
  }

  public update() {
    if (!this.player) {
      return;
    }
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 800,
  height: 600,
  parent: "gamemain",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 300
      }
    }
  },
  scene: Demo
}

export const GameMain = (): React.ReactNode => {


  useEffect(() => {
    // @ts-ignore
    window.game = new Game(config);
    // @ts-ignore
    return () => window.game.destroy(false, false);
  }, []);

  const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        <div id="gamemain"/>
      </Card>

    </PageContainer>
  )
};


export default GameMain;
