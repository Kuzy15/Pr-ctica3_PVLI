'use strict';






 function Enemy (game, image, x, y) {
  Phaser.Sprite.call(this, game, x, y, image);
  game.physics.arcade.enable(this);
  this.enableBody = true;
  this.body.collideWorldBounds = true;
  this.anchor.setTo(0.5, 0.5);
  //this.scale.setTo(0.75,0.75);

}
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.constructor = Enemy;

Enemy.prototype.update = function (game, rushX){

  // PONER TRIGGERS PARA LIMITAR EL CAMINO DE LOS ZOMBIES     <-------------------- FALTA
  // SEGUIR AL JUGADOR SI ESTAN EN SU RANGO (OFFSET--> RUSH.X)

 var offset = 200;// Probando

 if(this.x + offset >= rushX && this.x < rushX){

   this.body.velocity.x = 200;// Probando
   //if(game.physics.arcade.collide(this, triggerStop)) this.body.velocity.x = 0;
 }
 else  if(this.x - offset <= rushX && this.x > rushX){

    this.body.velocity.x = -200;// Probando
    //if(game.physics.arcade.collide(this, triggerStop)) this.body.velocity.x = 0;
  }
  else if (this.x === rushX) this.body.velocity.x = 0;// Se suppone que asi estarian quietos pero hacen cosas raras





}﻿

module.exports = Enemy;
