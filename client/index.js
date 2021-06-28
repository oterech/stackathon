import Phaser, { Cameras } from 'phaser'
import GameScene from './game'
import TitleScene from './title';
var gameScene = new GameScene()
var titleScene = new TitleScene()
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
},
};
var game = new Phaser.Game(config)
game.scene.add("game", gameScene)
game.scene.add("titleScene", titleScene)
game.scene.start("titleScene")

