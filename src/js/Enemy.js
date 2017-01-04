'use strict';






 function Enemy (game, image) {
  Phaser.Sprite.call(this, game, 0, 0, image);
}
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.constructor = Enemy;

/*Enemy.prototype.update = function (){//De momento el movimiento es muy kk, ya lo cambiare (para que sigan al pj)
_enemigoMoveDir: false,//variables de los enemigos para cambiar su dirección...
if(this.x >= this.game.world.weight/2 || this.x <= 0 ) _enemigoMoveDir = true;//Creo que está mal...
else _enemigoMoveDir = false;

if(_enemigoMoveDir) this.x += 2;
else this.x -= 2;
}﻿*/

module.exports = Enemy;
