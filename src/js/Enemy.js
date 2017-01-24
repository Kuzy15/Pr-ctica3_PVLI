'use strict';

 function Enemy (thiis, image, frame, x, y) {
  Phaser.Sprite.call(this, thiis, x, y, image, frame);
  thiis.physics.arcade.enable(this);
  this.body.enable = true;
  this.body.gravity.y = 2000;
  this.body.gravity.x = 0;
  this.body.collideWorldBounds = true;
  this.body.bounce.x = 0.5;
  this.anchor.setTo(0.5, 0.5);
  //this.scale.setTo(0.85,0.85);


}
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.constructor = Enemy;


function Zombie (thiis, image, frame, x, y) {
  Enemy.call(this, thiis, image, frame, x, y);
  this.SetAnimations();
}
Zombie.prototype = Object.create(Enemy.prototype);
Zombie.prototype.constructor = Zombie;

Zombie.prototype.update = function (rushX, rushY){

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

Zombie.prototype.ChangeAnimations = function(){
  if(this.body.velocity.x < 0)  this.animations.play('runLeft');
  else if (this.body.velocity.x > 0)  this.animations.play('run');
  else this.animations.play('iddle');


}
Zombie.prototype.SetAnimations = function(){
  var run = this.animations.add('run', [6, 7, 8], 10, false);
  var runLeft = this.animations.add('runLeft', [3, 4, 5], 10, false);
  var iddle = this.animations.add('iddle', [4, 7], 1, true);

}


function Boss(thiis, image, frame, x, y){
  Enemy.call(this, thiis, image, frame, x, y);
  this._last_shoot = 0;
  this.life = 15;
  this.setAnimatioons();
}

Boss.prototype = Object.create(Enemy.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.setAnimatioons = function () {

  var p = this.animations.add('run', Phaser.Animation.generateFrameNames('right', 1, 7, '', 0), 10, false);
  var u = this.animations.add('runLeft', Phaser.Animation.generateFrameNames('left', 1, 7, '', 0), 10, false);
  var t = this.animations.add('atkdch', Phaser.Animation.generateFrameNames('atkdch', 0, 6, '', 0), 30,false);
  var a =this.animations.add('atkizq', Phaser.Animation.generateFrameNames('atkizq', 0, 6, '', 0), 30,false);

}
Boss.prototype.ChangeAnimations = function(){
  if(this.body.velocity.x < 0)  this.animations.play('runLeft');
  else if (this.body.velocity.x > 0)  this.animations.play('run');
}

Boss.prototype.move = function (rushX, rushY) {
  var limIZQ = 400;
  var limDCH = 1100;
  var offsetX = 200;
  var offsetY = 100;

  if(this.body.velocity.x === 0){
    this.body.velocity.x = -300;
  }

  if((this.x + offsetX >= rushX && this.x < rushX) ){

    if((this.y - offsetY <= rushY && this.y >= rushY) || (this.y + offsetY >= rushY && this.y <= rushY)){
      this.body.velocity.x = 250;
      //this.animations.play('run');
      //animaciones DCH
    }
  }
  else if((this.x - offsetX <= rushX && this.x > rushX)){

    if((this.y - offsetY <= rushY && this.y >= rushY) || (this.y + offsetY >= rushY && this.y <= rushY)){
      this.body.velocity.x = -250;
      //this.animations.play('runLeft');
      //animciones IZQ
    }
 }  /*NO SE SI HABRIA QUE QUITARLO PARA CUANDO DISPARE ESTE QUIETO Y HAGA LA ANIMACION DE ATAQUE */



 else if(this.body.x >= limDCH ){
     this.body.velocity.x = -300;
     //animaciones DCH
    //this.animations.play('run');

   }
  else if (this.body.x <= limIZQ){
    this.body.velocity.x = 300;
      //animaciones IZQ
    //this.animations.play('runLeft');

  }
  this.ChangeAnimations();
}

Boss.prototype.attack = function (rushX, rushY, rocks, thiis) {

  var rock = rocks.getFirstDead();
  var timeTilShoot = 10000;

  var currentTime = thiis.time.now;
  var offsetX = 400;
  //console.log(currentTime);
  if(rock){
  if(currentTime - this._last_shoot > timeTilShoot){
    this.body.velocity.x = 0;
    if(this.x < rushX/*this.x + offsetX >= rushX && this.x < rushX*/){
      //dispara hacia la derecha
      //this.body.velocity.x = 0;
      //this.y -= 30;
      this.animations.play('atkdch');
      this._last_shoot = thiis.time.now;

      rock.scale.setTo(0.5, 0.5);
      rock.reset(this.x + 35, this.y);
      rock.body.velocity.x = 550;

    }


    else if(this. x > rushX/*this.x - offsetX <= rushX && this.x > rushX*/){
      //disparahacia la izquierda
      //this.body.velocity.x = 0;
      //this.y -= 30;
      this.animations.play('atkizq');
      this._last_shoot = thiis.time.now;
      rock.scale.setTo(0.5, 0.5);
      rock.reset(this.x - 35, this.y+10);
      rock.body.velocity.x = -550;
    }
  }
}
}

module.exports = {
  Zombie: Zombie,
  Boss: Boss
};
