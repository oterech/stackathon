import Phaser from 'phaser'

class TitleScene extends Phaser.Scene {

	constructor() {
		super({key:'titleScene'});
	}

	preload() {
		this.load.image('background', 'backdrop.png');
	}

	create() {
		 var bg = this.add.sprite(0,0,'background');
		  bg.setOrigin(0,0);
          var style = { font: '12pt', fill: '#B95F89', wordWrap: {width: 300, useAdvancedWrap: true}, };
		  var text = this.add.text(200,200, 'Click to Start!', {font: '50px', align: 'center', fill: "#473198"});
          var descr = this.add.text(50,400, 'help Lola collect bones and peanut butter along her way to the beach! Be careful, the more items you collect the more bombs will drop. Make it to the palm tree to win!', style)
          text.setInteractive({useHandCursor: true})
          text.on('pointerdown', () => this.clickButton())
	}
    clickButton(){
        this.scene.switch("game")
    }

}

export default TitleScene;