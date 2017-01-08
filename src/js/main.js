'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.

var gameOver = require ('./gameover_scene.js');
var playScene = require ('./play_scene.js');
var menuScene = require ('./menu_scene.js');




var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.spritesheet('button', 'images/buttons.png', 168, 70);
    this.game.load.image('logo', 'images/FondoDef.png');
  },

  create: function () {
    //this.game.state.start('preloader');
      this.game.state.start('menu');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";



    this.load.onLoadStart.add(this.loadStart, this);

      this.game.load.image('tiles', 'images/simples_pimples.png');
	  this.game.load.image('tilesFiccion', 'images/tiles3.png');
	  this.game.load.image('tilesPared', 'images/tiles2.png');
      this.game.load.tilemap('tilemap', 'images/mapa.json', null, Phaser.Tilemap.TILED_JSON);
      //this.game.load.atlas('rush', 'images/rush_spritesheet.png', 'images/rush_spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.spritesheet('rush', 'images/Hero1.png', 80, 124, 16);
	  this.game.load.image('powerbar', 'images/RedBar.png');
	  this.game.load.image('pauseScreen', 'images/pause_screen.png');
	  this.game.load.image('winTrigger', 'images/win_trigger.png');
    this.game.load.image('stopTrigger', 'images/stopTrigger.png');

      //this.game.load.image('zombie', 'images/zombiePrueba.png');//de momento solo cargo una imagen, luego pondre animaciones.
    this.game.load.spritesheet('zombie', 'images/ZombieSheet.png', 64, 64, 12);
    this.load.onLoadComplete.add(this.loadComplete,this);



  },

  loadStart: function () {
    //this.game.state.start('play');
    console.log("Game Assets Loading ...");
  },
  loadComplete: function(){
  	this.game.state.start('play');

  },



    update: function(){
        this._loadingBar
    }
};


var wfconfig = {

    active: function() {
        console.log("font loaded");
        init();
    },

    google: {
        families: ['Sniglet']
    }

};



window.onload = function () {

 	WebFont.load(wfconfig);


};

function init(){
 var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

                game.state.add('boot',BootScene);
                game.state.add('menu',menuScene);
                game.state.add('preloader',PreloaderScene);
                game.state.add('play',playScene);
                game.state.add('gameOver', gameOver);
                game.state.start('boot');


};
