const formatScore = (score: number) => {
  return `分数：${score}`;
}

class ScoreLabel extends Phaser.GameObjects.Text {

  score: number;

  constructor(scene: Phaser.Scene, x: number, y: number, score: number, style: Phaser.Types.GameObjects.Text.TextStyle) {
    const newScore = formatScore(score);
    super(scene, x, y, newScore, style);
    this.score = score;
  }

  setScore(score: number) {
    this.score = score;
    this.setText(formatScore(score));
  }

  addScore(point: number) {
    const score = this.score + point;
    this.setScore(score);
  }
}

export default ScoreLabel;
