'use strict';



_enemigoMoveDir: false,//variables de los enemigos para cambiar su dirección...


 function Zombies (game) {
  Phaser.Sprite.call(this, game, 0, 0, 'zombie');
}
Zombies.prototype = Object.create(Phaser.Sprite.prototype);
Zombies.constructor = Zombies;

Zombies.prototype.update = function (){//De momento el movimiento es muy kk, ya lo cambiare (para que sigan al pj)
if(this.x >= this.game.world.weight/2 || this.x <= 0 ) _enemigoMoveDir = true;//Creo que está mal...
else _enemigoMoveDir = false;

if(_enemigoMoveDir) this.x += 2;
else this.x -= 2;
}﻿

module.exports = Enemy;
