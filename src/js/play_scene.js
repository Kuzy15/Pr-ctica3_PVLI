'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}



//Scena de juego.
var PlayScene = {
    _rush: {}, //player
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 60, //altura máxima del salto.
	_jetPackPower: 500,
	_jetPack: 500,
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
	_doubleJump: false,
	_powerCropRect:0,	//Booleano que nos permite ver si ya se ha realizado el doble salto.
	_alreadyJump: false, //Booleano que nos permite ver si ya se ha realizado el primer salto.


//CODIGO DE ENEMIGOS
  //_enemigoMoveDir: false,//variables de los enemigos para cambiar su dirección...
  //  _enemies: {},
//---------------------------------------------------------------------------------

//No se hacerlo de estar forma, me da error por la herencia (prototypes)

  /*//El pool de los enemigos...
   Pool: function(game, entities) {
     this._group = game.add.group();
     this._group.addMultile(entities);
     this._group.callAll('kill');
  },
  //Spawnea una nueva entidad enemigo del propio pool.
   spawn: function(x, y) {
    var entity = this._group.getFirstExists(false);
    if (entity) {
      entity.reset(x, y);
    }
    return entity;
  },
 Zombies: function(game) {//No se si va aquí o fuera...
    Phaser.Sprite.call(this, game, 0, 0, 'zombie');
 },
 Zombies.prototype = Object.create(Phaser.Sprite.prototype);
 Zombies.constructor = Zombies;

 Zombies.prototype.update: function (){
  if(this.x >= this.game.world.weight/2 || this.x <= 0 ) _enemigoMoveDir = true;//Creo que está mal...
  else _enemigoMoveDir = false;

  if(_enemigoMoveDir) this.x += 2;
  else this.x -= 2;
},*/

//--------------------------------------------------------------------------------

    //Método constructor...
  create: function () {



//CODIGO DE ENEMIGOS
    /*  _enemies.enableBody = true;
      _enemies.physicsBodyType = Phaser.Physiscs.ARCADE;*/

     //this.createEnemies();
      /*var pool;
      var zombies = [];
          for (var i = 0; i < 5; i++) {
              zombies.push(new Zombies(this.game));
          }
          pool = new Pool(this.game, zombies);*/



      //this._rush = this.game.add.sprite(30,1350, 'rush');

      this.map = this.game.add.tilemap('tilemap');
      this.map.addTilesetImage('patrones','tiles');
	  this.map.addTilesetImage('patrones2', 'tilesPared');
	  this.map.addTilesetImage('patrones3', 'tilesFiccion');
      //Creacion de las layers
      this.backgroundLayer = this.map.createLayer('BackgroundLayer');
      this.groundLayer = this.map.createLayer('Estructuras');
      //plano de muerte
      this.death = this.map.createLayer('Death');
	  this._rush = this.game.add.sprite(70,3350, 'rush');
	  this._rush.powerBar = this.game.add.sprite(0,0,'powerbar');
	  this._rush.powerBar.cropEnabled = true;
	  //this._rush.powerBar.crop.width = (this._jetPack / this._jetPackPower) * this._rush.powerBar.width;
	  this._rush.addChild(this._rush.powerBar);
	  this._rush.powerBar.scale.setTo(0.2,0.2);
	  this._rush.powerBar.x = -6;
	  this._rush.powerBar.angle = 90;
	  
      //Colisiones con el plano de muerte y con suelo.
      this.map.setCollisionBetween(1, 5000, true, 'Death');
      this.map.setCollisionBetween(1, 5000, true, 'Estructuras');
	  //this.backgroundLayer.visible = false;
      //Cambia la escala a x3.
      this.groundLayer.setScale(3,3);
      this.backgroundLayer.setScale(3,3);
      this.death.setScale(3,3);

      //this.groundLayer.resizeWorld(); //resize world and adjust to the screen

      //nombre de la animación, frames, framerate, isloop
      this._rush.animations.add('run',
                    Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
      this._rush.animations.add('stop',
                    Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
      this._rush.animations.add('jump',
                     Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
      this.configure();
  },

    //IS called one per frame.
    update: function () {

		//DEBUGS
		//console.log('ea', this._jetPack);

		//-----------------------------

//CODIGO DE ENEMIGOS
        /*pool.spawn(0, 0);
        for(each var in zombies){

          this.var.update();
        }*/



        var moveDirection = new Phaser.Point(0, 0);
        var collisionWithTilemap = this.game.physics.arcade.collide(this._rush, this.groundLayer);
        var movement = this.GetMovement();
		
	
		/*this._rush.powerBar.crop.width = ((this._jetPack / this._jetPackPower) * this._rush.powerBar.width);
		this._rush.powerBar.updateCrop();
		//console.log(this._rush.powerBar.crop);*/
		
        //transitions
        switch(this._playerState)
        {
            case PlayerState.STOP:
            case PlayerState.RUN:
                if(this.isJumping(collisionWithTilemap)){
                    this._playerState = PlayerState.JUMP;
					//this._alreadyJump = true;
                    this._initialJumpHeight = this._rush.y;
                    this._rush.animations.play('jump');
                }
                else{
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._rush.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._rush.animations.play('stop');
                    }
                }
                break;

            case PlayerState.JUMP:
				if (!this.doubleJump()){
                var currentJumpHeight = this._rush.y - this._initialJumpHeight;
                this._playerState = (currentJumpHeight*currentJumpHeight < this._jumpHight*this._jumpHight)
                    ? PlayerState.JUMP : PlayerState.FALLING;
				this._alreadyJump = true;
                break;
				}
				else {
					if (this._jetPack <= 15)
						this._playerState = PlayerState.FALLING;
					else this._playerState = PlayerState.JUMP;
				}

            case PlayerState.FALLING:
                if(this.isStanding()){
					//this._doubleJump = false;
					this._jetPack = this._jetPackPower;
					this._alreadyJump = false;
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._rush.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._rush.animations.play('stop');
                    }
                }
				else if (this.doubleJump()){

					this._playerState = PlayerState.JUMP;
				}
                break;
        }
        //States
        switch(this._playerState){

            case PlayerState.STOP:
                moveDirection.x = 0;
                break;
            case PlayerState.JUMP:
            case PlayerState.RUN:
            case PlayerState.FALLING:
                if(movement === Direction.RIGHT){
                    moveDirection.x = this._speed;
                    if(this._rush.scale.x < 0)
                        this._rush.scale.x *= -1;
                }
                else if(movement === Direction.LEFT){
                    moveDirection.x = -this._speed;
                    if(this._rush.scale.x > 0)
                        this._rush.scale.x *= -1;
                }
                if(this._playerState === PlayerState.JUMP){

						if (this._rush.body.blocked.up || this._rush.body.touching.up){
							this._playerState = PlayerState.FALLING;

						}
						else {
							moveDirection.y = -this._jumpSpeed;
						}

				}
                if(this._playerState === PlayerState.FALLING){
                    moveDirection.y = 0;
					/*
						if (this.doubleJump()){
						this._playerState = PlayerState.JUMP;
						this._alreadyJump = true;
						console.log('entra');

						}*/
				}
                break;
        }
        //movement
        this.movement(moveDirection,5,
                      this.backgroundLayer.layer.widthInPixels*this.backgroundLayer.scale.x - 10);
        this.checkPlayerFell();

        //this.onCollisonEnemy();
    },
//CODIGO DE ENEMIGOS
    /*createEnemies: function (){

        for(var x = 0; x < 3; x++){
          var enemy = this._enemies.create(x * 5, 0, 'zombie');
          //enemy.anchor.set(0.5, 0.5);
        }

    },*/


    canJump: function(collisionWithTilemap){
        return this.isStanding() && collisionWithTilemap || this._jamping;
    },

    onPlayerDie: function(){
        //TODO 6 Carga de 'gameOver';
        this.game.state.start('gameOver');

    },

    checkPlayerFell: function(){
        if(this.game.physics.arcade.collide(this._rush, this.death))
            this.onPlayerDie();
    },

    isStanding: function(){
        return this._rush.body.blocked.down || this._rush.body.touching.down
    },

    isJumping: function(collisionWithTilemap){
        return this.canJump(collisionWithTilemap) &&
            this.game.input.keyboard.downDuration(Phaser.Keyboard.UP,5);
    },

    GetMovement: function(){
        var movement = Direction.NONE
        //Move Right
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            movement = Direction.RIGHT;
        }
        //Move Left
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            movement = Direction.LEFT;
        }
        return movement;
    },
    //configure the scene
    configure: function(){
        //Start the Arcade Physics systems
        //this.game.world.setBounds(0, 0, 2400, 160);
		this.game.world.setBounds(0, 0, 2200, 7550);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#a9f0ff';
        this.game.physics.arcade.enable(this._rush);


//CODIGO DE ENEMIGOS
        /*this._enemies = this.game.add.group();
        this._enemies = game.add.physicsGroup();*/

        this._rush.body.bounce.y = 0.2;
        this._rush.body.gravity.y = 20000;
        this._rush.body.gravity.x = 0;
        this._rush.body.velocity.x = 0;
        this.game.camera.follow(this._rush);
		this.game.camera.setSize(700,500)
    },
    //move the player
    movement: function(point, xMin, xMax){
        this._rush.body.velocity = point;// * this.game.time.elapseTime;

        if((this._rush.x < xMin && point.x < 0)|| (this._rush.x > xMax && point.x > 0))
            this._rush.body.velocity.x = 0;

    },

    //TODO 9 destruir los recursos tilemap, tiles y logo.
    destroyResources: function(){
        this.tilemap.destroy();
        this.tiles.destroy();
		this.tilesFiccion.destroy();
		this.tilesPared.destroy();
        this.game.world.setBounds(0,0,800,600);
    },
	

	doubleJump: function(){

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && /*!this._doubleJump*/ this._jetPack >= 15 && this._alreadyJump){
					this._initialJumpHeight = this._rush.y;
					//this._doubleJump = true;
					this._jetPack -= 5;
					return true;
				}
		return false;
	}

//CODIGO DE ENEMIGOS
  /*onCollisonEnemy: function() {//De momento está puesto para que si toca al enemigo en cualquier lado se muera

    if(this.game.physics.arcade.collide(this._rush, this._enemies));
      this.onPlayerDie();
  }*/
};

module.exports = PlayScene;
