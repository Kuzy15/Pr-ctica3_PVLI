'use strict';


//El pool es como un déposito del que se sacan o devuelven entidades para no acumular basura en el recolector de basura.

function Pool (game, entities) {
  this._group = game.add.group();
  this._group.addMultiple(entities);
  //this._group = game.add.physicsGroup();
  this._group.callAll('kill');//Al principio todas las entidades están desactivadas
}
//Spawnea una nueva entidad enemigo del propio pool.
 Pool.prototype.spawn = function(x, y) {
 var entity = this._group.getFirstExists(false);//Busca en el pool la 1ª entidad muerta
 if (entity) {//Si ha encontrado una entidad muerta...
   entity.reset(x, y);
 }
 return entity;
}﻿

module.exports = Pool;
