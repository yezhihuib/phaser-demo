import React, {useEffect} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Card} from "antd";
import {AUTO, Game, Scene} from "phaser";
import ScoreLabel from "@/pages/gameMain/ui/scoreLabel";
import BombGenerator from "@/pages/gameMain/ui/bombGenerator";
import {
  BOMB_KEY,
  BULLET_KEY,
  DEFAULT_GRAVITY,
  DUCK_KEY,
  DUDE_KEY,
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_KEY,
  PANDA_KEY,
  STAR_KEY,
  TIGER_KEY
} from "@/pages/gameMain/constant/constant";
import BulletGenerator from "@/pages/gameMain/ui/bulletGenerator";
import DuckGenerator from "@/pages/gameMain/ui/duckGenerator";
import PlayerPandaGenerator from "@/pages/gameMain/ui/playerPandaGenerator";

class Demo extends Scene {
  width: number;
  height: number;
  playerGenerator?: PlayerPandaGenerator;
  starGenerator?: DuckGenerator;
  bombGenerator?: BombGenerator;
  bulletGenerator?: BulletGenerator;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  scoreLabel?: ScoreLabel;
  gameOver?: boolean;

  constructor(width: number, height: number) {
    super("demo");// 继承父类 并传入名字
    this.width = width;
    this.height = height;
  }


  public preload() { // j静态资源
    this.load.image('sky', 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01HDz0gO1nzmlLuq9Ba_!!57145161.png');
    this.load.image(GROUND_KEY, 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01WzzR4B1nzmlNygRyv_!!57145161.png');
    this.load.image(STAR_KEY, 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01O4i54u1nzmlFI0G27_!!57145161.png');
    this.load.image(STAR_KEY, 'https://img.alicdn.com/imgextra/i2/57145161/O1CN01O4i54u1nzmlFI0G27_!!57145161.png');
    this.load.image(BOMB_KEY, 'https://img.alicdn.com/imgextra/i1/57145161/O1CN013xlIg11nzmlNSqcq5_!!57145161.png');
    this.load.image(BULLET_KEY, 'https://img.alicdn.com/imgextra/i4/57145161/O1CN011quuRi1nzmlX97d2V_!!57145161.png');
    this.load.image(DUCK_KEY, 'https://img.alicdn.com/imgextra/i3/57145161/O1CN01jgYJwN1nzmlSX0945_!!57145161.png');
    this.load.spritesheet(DUDE_KEY,
      'https://img.alicdn.com/imgextra/i2/57145161/O1CN01cgRJ3b1nzmlKUSMa9_!!57145161.png',
      {frameWidth: 32, frameHeight: 48}
    );
    this.load.spritesheet(TIGER_KEY,
      'https://img.alicdn.com/imgextra/i4/57145161/O1CN01hglrF31nzmlWTwuOX_!!57145161.png',
      {frameWidth: 56, frameHeight: 36, spacing: 40}
    );
    this.load.atlas(PANDA_KEY,
      "https://bruce-public-bucket.oss-cn-hangzhou.aliyuncs.com/game/pic/panda/panda.png",
      "https://bruce-public-bucket.oss-cn-hangzhou.aliyuncs.com/game/pic/panda/panda.json"
    )

  }

  public collectStar(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, star: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    const physicsPlayer = player as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    (star as Phaser.Physics.Arcade.Image).disableBody(true, true);
    this.scoreLabel?.addScore(10);
    const stars = this.starGenerator?.getGroup();
    if (stars?.countActive(true) === 0) {
      this.starGenerator?.generate(Phaser.Math.Between(3, 9));
      // this.bombGenerator?.generateBombs(physicsPlayer, Phaser.Math.Between(1, 4));
    }
  }

  public playerHitBomb(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, bomb: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    this.physics.pause();
    const playerSprite = (player as Phaser.GameObjects.Sprite);
    playerSprite.setTint(0xff0000);
    playerSprite.anims.play('turn');

    this.gameOver = true;
  }

  public bulletHitBomb(bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody, bomb: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    (bullet as Phaser.Physics.Arcade.Image).disableBody(true, true);
    (bomb as Phaser.Physics.Arcade.Image).disableBody(true, true);
  }

  public bulletHitPlatform(bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody, platform: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    (bullet as Phaser.Physics.Arcade.Image).disableBody(true, true);
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();
    platforms.create(600, 400, GROUND_KEY);
    platforms.create(50, 250, GROUND_KEY);
    platforms.create(750, 220, GROUND_KEY);
    return platforms;
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
    this.playerGenerator = new PlayerPandaGenerator(this);
    const player = this.playerGenerator.getPlayer();
    this.starGenerator = new DuckGenerator(this);
    this.starGenerator.generate(11);
    const stars = this.starGenerator.getGroup();

    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.bombGenerator = new BombGenerator(this);
    const bombs = this.bombGenerator.getGroup();

    this.bulletGenerator = new BulletGenerator(this);
    const bullets = this.bulletGenerator.getGroup();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player, stars, this.collectStar, undefined, this);
    this.physics.add.collider(player, bombs, this.playerHitBomb, undefined, this);
    this.physics.add.collider(bullets, bombs, this.bulletHitBomb, undefined, this);
    this.physics.add.collider(bullets, platforms, this.bulletHitPlatform, undefined, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.space.onDown = () => {
      this.bulletGenerator?.createBullets(player, 5);
    }


    console.log(this.textures.get(PANDA_KEY))
  }

  public update() {
    const player = this.playerGenerator?.getPlayer();
    if (!player) {
      return;
    }
    if (!this.cursors) {
      return;
    }
    if (this.gameOver) {
      return;
    }
    this.playerGenerator?.onKeyInput(this.cursors);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "gamemain",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: DEFAULT_GRAVITY
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

  // const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        <div id="gamemain"/>
      </Card>

    </PageContainer>
  )
};


export default GameMain;
