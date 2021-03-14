import React, {useEffect} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {useIntl} from "umi";
import {Card} from "antd";
import {AUTO, Game, Scene} from "phaser";


class Demo extends Scene {
  constructor() {
    super("demo");// 继承父类 并传入名字
  }

  public preload() { // j静态资源
    this.load.setBaseURL('http://labs.phaser.io');//
    this.load.image('sky', 'assets/skies/space3.png');// 静态资源 图片地址 官方
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }

  public create() {// 生命周期
    this.add.image(400, 300, "sky");// 图片坐标 及对象
    const particles = this.add.particles("red");// 创建粒子
    const emitter = particles.createEmitter({ // 粒子发射器 可以官网导出配置
      speed: 100,// 速度
      scale: {start: 1, end: 0},// 缩放
      blendMode: "ADD",
    });
    const logo = this.physics.add.image(400, 100, "logo");// 创建物理引擎 并添加展示对象
    logo.setVelocity(100, 200);// 运动速度 抛物线
    logo.setBounce(1, 1);// 弹性系数
    logo.setCollideWorldBounds(true);// 碰撞检测
    emitter.startFollow(logo);// 光影跟随
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
        y: 200
      }
    }
  },
  scene: Demo
}

export const GameMain = (): React.ReactNode => {

  useEffect(() => {
    window.game = new Game(config);
  }, [])

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
