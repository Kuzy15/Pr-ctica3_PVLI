'use strict';






 function Enemy (thiis, image, frame, x, y) {
  Phaser.Sprite.call(this, thiis, x, y, image, frame);
  thiis.physics.arcade.enable(this);
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
     this.body.velocity.x = 250;

   }
   else this.body.velocity.x = 0;

 }
 else if((this.x - offsetX <= rushX && this.x > rushX)){

   if((this.y - offsetY <= rushY && this.y >= rushY) || (this.y + offsetY >= rushY && this.y <= rushY)){
     this.body.velocity.x = -250;

   }
   else this.body.velocity.x = 0;

}
else if (this.x === rushX) this.body.velocity.x = 0;

this.ChangeAnimations();

}﻿

Enemy.prototype.ChangeAnimations = function(){
  if(this.body.velocity.x < 0)  this.animations.play('runLeft');
  else if (this.body.velocity.x > 0)  this.animations.play('run');
  else this.animations.play('iddle');
}
Enemy.prototype.SetAnimations = function(){
  var run = this.animations.add('run', [6, 7, 8], 10, false);
  var runLeft = this.animations.add('runLeft', [3, 4, 5], 10, false);
  var iddle = this.animations.add('iddle', [4, 7], 1, true);
}

function Boss(thiis, image/*key*/, frame/*nº de frame*/, x, y){
  Enemy.call(this, thiis, image, frame, x, y);
}

Boss.prototype = Object.create(Enemy.prototype);
Boss.prototype.constructor = Boss;

module.exports = {
  Enemy: Enemy,
  Boss: Boss
};
