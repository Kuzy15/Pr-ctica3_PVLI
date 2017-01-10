'use strict';






 function Enemy (game, image, frame, x, y) {
  Phaser.Sprite.call(this, game, x, y, image, frame);
  game.physics.arcade.enable(this);
  this.body.enable = true;
  this.body.gravity.y = 2000;
  this.body.gravity.x = 0;
  this.body.collideWorldBounds = true;
  this.body.bounce.x = 0.1;
  this.anchor.setTo(0.5, 0.5);
  //this.scale.setTo(0.85,0.85);

}
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.constructor = Enemy;

Enemy.prototype.update = function (rushX, rushY, stopTrigger){

  // SEGUIR AL JUGADOR SI ESTAN EN SU RANGO (OFFSET--> RUSH.X y RUSH.Y)

 var offsetX = 200;
 var offsetY = 150;

 if((this.x + offsetX >= rushX && this.x < rushX) ){

   if((this.y - offsetY <= rushY && this.y >= rushY) || (this.y + offsetY >= rushY && this.y <= rushY)){
     this.body.velocity.x = 200;
   }
   else this.body.velocity.x = 0;

 }
 else if((this.x - offsetX <= rushX && this.x > rushX)){

   if((this.y - offsetY <= rushY && this.y >= rushY) || (this.y + offsetY >= rushY && this.y <= rushY)){
     this.body.velocity.x = -200;
   }
   else this.body.velocity.x = 0;

}
else if (this.x === rushX) this.body.velocity.x = 0;

}﻿

module.exports = Enemy;
