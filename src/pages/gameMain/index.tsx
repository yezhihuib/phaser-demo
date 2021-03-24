import React, {useEffect} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {useIntl} from "umi";
import {Card} from "antd";
import {AUTO, Game, Scene} from "phaser";
import ScoreLabel from "@/pages/gameMain/ui/scoreLabel";

const GROUND_KEY = "ground";
const DUDE_KEY = "dude";
const STAR_KEY = "star";


class Demo extends Scene {
  constructor() {
    super("demo");// 继承父类 并传入名字
  }

  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  stars: Phaser.Physics.Arcade.Group | undefined;
  bombs: Phaser.Physics.Arcade.Group | undefined;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  scoreLabel: ScoreLabel | undefined;

  public preload() { // j静态资源
    this.load.image('sky', 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01HDz0gO1nzmlLuq9Ba_!!57145161.png');
    this.load.image(GROUND_KEY, 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01WzzR4B1nzmlNygRyv_!!57145161.png');
    this.load.image(STAR_KEY, 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01O4i54u1nzmlFI0G27_!!57145161.png');
    this.load.image('bomb', 'https://img.alicdn.com/imgextra/i1/57145161/O1CN013xlIg11nzmlNSqcq5_!!57145161.png');
    this.load.spritesheet('dude',
      'https://img.alicdn.com/imgextra/i2/57145161/O1CN01cgRJ3b1nzmlKUSMa9_!!57145161.png',
      {frameWidth: 32, frameHeight: 48}
    );
  }

  public collectStar(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, star: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    (star as Phaser.Physics.Arcade.Image).disableBody(true, true);
    this.scoreLabel?.addScore(10);
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

    this.gameOver = true;
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();
    platforms.create(600, 400, GROUND_KEY);
    platforms.create(50, 250, GROUND_KEY);
    platforms.create(750, 220, GROUND_KEY);
    return platforms;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, DUDE_KEY);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{key: DUDE_KEY, frame: 4}],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, {start: 5, end: 8}),
      frameRate: 10,
      repeat: -1
    });

    return player;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 11,
      setXY: {x: 12, y: 0, stepX: 70}
    });
    stars.children.iterate(function (child) {
      const imageChild = (child as Phaser.Physics.Arcade.Image);
      imageChild.setBounceY(Phaser.Math.FloatBetween(1, 1));
      imageChild.setBounceX(Phaser.Math.FloatBetween(1, 1));
      imageChild.setVelocity(Phaser.Math.Between(-200, 200), 20);
      imageChild.setCollideWorldBounds(true);
    });
    return stars;
  }

  createScoreLabel(x: number, y: number, score: number) {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {fontSize: '32px', color: '#000'}
    const label = new ScoreLabel(this, x, y, score, style);
    this.add.existing(label);
    return label;
  }

  public create() {// 生命周期
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    const platforms = this.createPlatforms();
    const player = this.createPlayer();
    this.player = player;
    const stars = this.createStars();
    this.stars = stars;
    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, this.collectStar, undefined, this);

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  public update() {
    if (!this.player) {
      return;
    }
    if (!this.cursors) {
      return;
    }
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
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
