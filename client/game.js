
import Phaser, { Cameras } from 'phaser'

var platforms
var player
var cursors
var bones
var pb
var score = 0;
var scoreText;
var bombs
var gameOver
var controls
var map
var groundLayer
var endplat
var background
var restart
const trueOrFalse = Math.random() < 0.5
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'game'})
    }
    init(){

    }
    preload(){
        this.load.spritesheet('dog', 'dog.png', {frameWidth: 32, frameHeight: 48})
  this.load.tilemapTiledJSON('map', 'map.json')
  this.load.image('tiles','default_tiles.png')
  this.load.image('sky', 'backdrop.png')
  this.load.image('bone', 'bone.png')
  this.load.image('grounds', 'ground.png', )
  this.load.image('bomb', 'bomb.png');
  this.load.image('palm', 'palm-tree-right.png');
  this.load.image('pb', 'peanutbutter.png');
    }
    create(){
        console.log(this.anims.generateFrameNumbers('dog'))
  map = this.add.tilemap('map')
  var backDrop = this.add.image(400, 300, 'sky');
 var groundTile = map.addTilesetImage('default_tiles','tiles')
  groundLayer = map.createLayer('groundLayer', groundTile)
  platforms = map.createLayer('platforms', groundTile)
  endplat = map.createLayer('endplat', groundTile)
  background = map.createLayer('background', groundTile)
  groundLayer.setCollisionByExclusion([-1])
  platforms.setCollisionByExclusion([-1])
  endplat.setCollisionByExclusion([-1])
  player = this.physics.add.sprite(100 , 450,'dog')
  let palm = this.physics.add.sprite(3200, 100, 'palm');
  player.setBounce(.5)
  player.setCollideWorldBounds(true);
  palm.setCollideWorldBounds(true)

  this.physics.world.bounds.width = groundLayer.width;
  this.physics.world.bounds.height = groundLayer.height; 
  this.anims.create({
    key: 'hop',
    frames: this.anims.generateFrameNumbers('dog', {start: 10, end: 17} ),
    frameRate: 24,
    repeat: -1
  }); 
  this.anims.create({
    key: 'turn',
    frames: this.anims.generateFrameNumbers('dog', {start: 0, end: 3}),
    frameRate: 12,
    repeat: -1
});
this.anims.create({
  key: 'left',
  frames: this.anims.generateFrameNumbers('dog', { start: 18, end: 25 }),
  frameRate: 20,
  repeat: -1
});

this.anims.create({
  key: 'right',
  frames: this.anims.generateFrameNumbers('dog', { start: 26, end: 31 }),
  frameRate: 16,
  repeat: -1
});
player.body.setGravityY(300)
this.physics.add.collider(player, groundLayer);
this.physics.add.collider(player, platforms);
this.physics.add.collider(palm, endplat)
this.physics.add.collider(player,endplat)
cursors = this.input.keyboard.createCursorKeys();


var controlConfig = {
  camera: this.cameras.main,
  left: cursors.left,
  right: cursors.right,
  speed: .25
};

controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

this.cameras.main.setBounds(0, 0, player.x + groundLayer.width + 200, 0);

this.cameras.main.startFollow(player)


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
const trueOrFalse = Math.random() < 0.5
var boneSpace = trueOrFalse ? getRandomArbitrary(200,250) : getRandomArbitrary(300,400)
var pbSpace = trueOrFalse ? getRandomArbitrary(100,250) : getRandomArbitrary(300,400)
bones = this.physics.add.group({
  key: 'bone',
  repeat: 20,
  setXY: { x: 12, y: 50, stepX: boneSpace}
});
bones.children.iterate(function (child) {

  child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

pb = this.physics.add.group({
  key: 'pb',
  repeat: 10,
  setXY: {x: 100, y:0, stepX: pbSpace}
})

pb.children.iterate(function (child) {

  child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));

});



// baseStars = this.physics.add.group({
//   key: 'bone',
//   repeat: 3,
//   setXY: {x:500, y: 410, stepX: 90}
// })


//this creates a collision when stars land on platforms
this.physics.add.collider(bones, groundLayer);
this.physics.add.collider(bones, platforms);
this.physics.add.collider(pb, platforms);
this.physics.add.collider(pb, groundLayer);

//this causes the collect start function to be called when the player overlaps with the stars
this.physics.add.overlap(player, bones, collectBones, null, this);
this.physics.add.overlap(player, pb, collectPB, null, this);

// This is the text for the score and when game over appears

scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#F8FA90' });
scoreText.setScrollFactor(0)
gameOver = this.add.text(200,200)
restart = this.add.text(400,500)
restart.setScrollFactor(0)
gameOver.setScrollFactor(0)
backDrop.setScrollFactor(0)
//this creates a group  for the bombs and adds a boundary between all the bombs and the platforms(so they bounce off and not go through)
bombs = this.physics.add.group();
this.physics.add.collider(bombs, groundLayer);
this.physics.add.collider(bombs, platforms);
this.physics.add.collider(bombs, endplat);
//when the player hits the bomb the hit bomb function is called
this.physics.add.collider(player, bombs, hitBomb, null, this);
this.physics.add.collider(player, palm, youWin, null, this)
//configuration for the camera


    }
    update(time, delta){
        controls.update(delta);

        if (cursors.up.isDown ) {
      
         if (player.body.blocked.down) {
          player.setVelocityY(-500);
      
          player.anims.play('hop', true)
         }
        }
       else if (cursors.left.isDown)
        {
            player.setVelocityX(-300);
        
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(300);
        
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
        
            player.anims.play('turn', true);
        }
      
      
    }
    clickButton() {
      this.scene.start("game")
    }
}


function hitBomb (player, bomb)
{

    this.physics.pause();
    restart.setText('restart!')
    restart.setInteractive({useHandCursor: true})
    restart.on('pointerdown', () => this.clickButton())
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver.setFontSize('75px')
    gameOver.setText('GAME OVER')

}

function youWin (player) {

  if(score < 150) {

  }
  this.physics.pause()
  player.anims.play('jump', true)
  gameOver.setText('WINNER!!')
  gameOver.setFontSize('100px')
  controls.active = false
}

function collectBones (player, bone)
{
    bone.disableBody(true, true);
    score+= 10;
    scoreText.setText('score! ' + score)


//     if (bone.countActive(true) === 0)
//     {
//         bone.children.iterate(function (child) {

//             child.enableBody(true, child.x, 0, true, true);

//         });
// }

var x = trueOrFalse ? getRandomArbitrary(200,400) + player.x : getRandomArbitrary(200,500) - player.x 

var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

}

function collectPB (player, peanut){
    peanut.disableBody(true, true)
    score+=50
    scoreText.setText('score! ' + score)
  
    var x = trueOrFalse ? getRandomArbitrary(200,400) + player.x : getRandomArbitrary(200,500) - player.x 
  
    var bomb = bombs.create(x, 75, 'bomb');
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-300, 500), 50);
  }


export default GameScene