'use strict';






 function Enemy (game, image, x, y) {
  Phaser.Sprite.call(this, game, x, y, image);
  game.physics.arcade.enable(this);
  this.enableBody = true;
  //this.body.gravity.y = 20000;
  //this.body.gravity.x = 0;
  this.body.collideWorldBounds = true;
  this.anchor.setTo(0.5, 0.5);
  //this.scale.setTo(0.75,0.75);

}
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.constructor = Enemy;

Enemy.prototype.update = function (game, rushX, rushY, stopTrigger){

  // PONER TRIGGERS PARA LIMITAR EL CAMINO DE LOS ZOMBIES     <-------------------- FALTA
  // SEGUIR AL JUGADOR SI ESTAN EN SU RANGO (OFFSET--> RUSH.X y RUSH.Y)

 var offsetX = 200;// Probando
 var offsetY = 150;//...

 if((this.x + offsetX >= rushX && this.x < rushX) && (!game.physics.arcade.collide(this, stopTrigger))){


   if((this.y - offsetY <= rushY && this.y >= rushY) || (this.y + offsetY >= rushY && this.y <= rushY)){
     this.body.velocity.x = 200;// Probando
   }
   else this.body.velocity.x = 0;

 }
 else if((this.x - offsetX <= rushX && this.x > rushX) && (!game.physics.arcade.collide(this, stopTrigger))){
   if((this.y - offsetY <= rushY && this.y >= rushY) || (this.y + offsetY >= rushY && this.y <= rushY)){
     this.body.velocity.x = -200;// Probando
   }
   else this.body.velocity.x = 0;

  }
  else if (this.x === rushX) this.body.velocity.x = 0;// Se suppone que asi estarian quietos pero hacen cosas raras





}﻿

module.exports = Enemy;
