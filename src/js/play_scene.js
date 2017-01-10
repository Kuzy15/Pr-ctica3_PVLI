'use strict';

//var Pool = require('./Pool');
var Enemy = require('./Enemy');
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
	  _jetPackPower: 700,
	  _jetPack: 700,
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
	  _doubleJump: false,	//Booleano que nos permite ver si ya se ha realizado el doble salto.
	  _alreadyJump: false, //Booleano que nos permite ver si ya se ha realizado el primer salto.
	  _jetPackText: '100 %',
	  _pause: false,
	  _continueButton: {},
	  _buttonMenu: {},
    _enemies: {},//[]
    //_pool: {},
    //_time_til_spawn: Math.random()*3000 + 2000,//Controla el tiempo de spawn
    //_last_spawn_time: 1000,
    //_timer: null,
    //_spawn_time: Math.random() * (25000-20000) + 20000,//(15s, 10s] Este tiempo hay que hacer que dependa de la velocidad del personaje
    //o del tiempo que queda para que acabe la partida si lo hacemos contrarreloj.
	_pauseScreen:{}, //Sprite de Pause.
	_pausex: 0, //Variables que utilizamos para mover el sprite de pause con la camara.
	_pauseY: 0,
	_winTrigger: {},//Trigger que controla el win del player.
  _rushX: null,
  _rushY: null,
  _stopTrigger: {},
  _laserBarrier: {},//Sprite de barrera laser.
  _coreItem: {},//Sprite del item que hay que recoger y que abre la puerta.
  _life: 100,//Vida del personaje.
  _bloodLayer: {},//Sprite que indica al jugador como va de vida.








//--------------------------------------------------------------------------------

    //Método constructor...
  create: function () {

    //this._rush = this.game.add.sprite(30,1350, 'rush');
    //------------------------------------------------
    //-----------TIMER--------------------------------
    //this._timer = this.game.time.create(false);
    //this._timer.loop(this._spawn_time, this.spawnEnemies, this);
    //this._timer.start();
    //------------------------------------------------

    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('patrones','tiles');
    this.map.addTilesetImage('patrones2', 'tilesPared');
    this.map.addTilesetImage('patrones3', 'tilesFiccion');
    //Creacion de las layers
    this.backgroundLayer = this.map.createLayer('BackgroundLayer');
    this.groundLayer = this.map.createLayer('Estructuras');
    //plano de muerte
    this.death = this.map.createLayer('Death');
	//Añadimos el sprite de sangre.
	this._bloodLayer = this.add.sprite(70,3350,'bloodLayer');
    this._bloodLayer.scale.setTo(0.3,0.3);
	this._bloodLayer.alpha = 0;
	//Añadimos al jugador.
    this._rush = this.game.add.sprite(70, 3350, 'rush', 1);
    this._rush.scale.setTo(0.5, 0.5);
	//Añadimos el sprite de pause.
    this._pauseScreen = this.add.sprite(70,3350,'pauseScreen');
    this._pauseScreen.scale.setTo(2.5,2.8);
    this._pauseScreen.alpha = 0.8;
    this._pauseScreen.x = this.game.camera.x;
    this._pauseScreen.y = this.game.camera.y;
	//Añadimos el trigger de victoria.
    this._winTrigger = this.add.sprite(70, 680,'winTrigger');
    this._winTrigger.alpha = 0;
	//Añadimos el item
	this._coreItem = this.add.sprite(300, 3200, 'coreItem');
	this._coreItem.scale.setTo(0.6,0.6);
	this.game.physics.arcade.enable(this._coreItem);
	this._coreItem.body.immovable = true;


    this._stopTrigger = this.game.add.group();
    this._stopTrigger = this.game.add.physicsGroup();
    this._stopTrigger.enableBody = true;
    this._stopTrigger.physicsBodyType = Phaser.Physics.ARCADE
    //this._stopTrigger.setAll('enable.body', true);
    this._stopTrigger.create(950, 3350, 'stopTrigger');
    this._stopTrigger.create(1100, 3350, 'stopTrigger');
    this._stopTrigger.create(2008, 3093, 'stopTrigger');
    this._stopTrigger.create(767, 2709, 'stopTrigger');
    this._stopTrigger.create(1586, 2853, 'stopTrigger');
    this._stopTrigger.create(388, 2517, 'stopTrigger');
    this._stopTrigger.create(2102, 2277, 'stopTrigger');
    this._stopTrigger.create(1636, 1893, 'stopTrigger');
    this._stopTrigger.create(1399, 1893, 'stopTrigger');
    this._stopTrigger.create(341, 1557, 'stopTrigger');
    this._stopTrigger.create(2065, 1557, 'stopTrigger');
    this._stopTrigger.setAll('body.immovable', true);
    this._stopTrigger.setAll('anchor.x', 0.5);
    this._stopTrigger.setAll('anchor.y', 0.5);
    this._stopTrigger.setAll('alpha', 0);
	//Añadimos el indicador de potencia del jetPack
	this._jetPackText = this.game.add.text(-80, -20, "100 %", { font: "65px Arial", fill: "#002AFA", align: "center" });
	this._jetPackText.font = 'Sniglet';
	this._rush.addChild(this._jetPackText);
	this._jetPackText.scale.setTo(0.4,0.4);
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
    /*this._rush.animations.add('run',
                  Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
    this._rush.animations.add('stop',
                  Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
    this._rush.animations.add('jump',
                   Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);*/


//CODIGO DE ENEMIGOS  ----------------------------------------------------------------------

//Opción 1: Con el Pool

  /*

    for (var i = 0; i < 2; i++) {
      this._enemies.push(new Enemy(this.game, 'zombie'));
    }

    this._pool = new Pool(this.game, this._enemies);

    this._pool.spawn(this.game.rnd.between(200, 700), 3350);//Probando, solo creará un zombie.

*/

//Opción 2: Sin el Pool
    this._enemies = this.game.add.group();
    //this._enemies = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
    //this._enemies.setAll('body.collideWorldBounds', true);
    //this.spawnEnemies(890, 3350);
    this.spawnEnemies(1247, 3350);
    //this.spawnEnemies(1700, 3350);
    this.spawnEnemies(1274, 2803);
    this.spawnEnemies(1950, 3350);
    this.spawnEnemies(2105, 2871);
    this.spawnEnemies(889, 2679);
    this.spawnEnemies(777, 3063);
    this.spawnEnemies(1117, 3063);
    this.spawnEnemies(1467, 3063);
    this.spawnEnemies(1862, 3063);
    this.spawnEnemies(750, 2487);
    this.spawnEnemies(1100, 2487);
    this.spawnEnemies(1570, 2007);
    this.spawnEnemies(1167, 2055);
    this.spawnEnemies(1805, 2247);
    this.spawnEnemies(2057, 1863);
    this.spawnEnemies(350, 1863);
    this.spawnEnemies(1179, 1863);
    this.spawnEnemies(1555, 1507);
    this.spawnEnemies(1700, 1507);
    this.spawnEnemies(900, 1699);
	//Barrera laser
	this._laserBarrier = this.add.sprite(1376,1932, 'laserBarrier');
	this._laserBarrier.scale.setTo(1.6,1);
	this.game.physics.arcade.enable(this._laserBarrier);
	this._laserBarrier.body.immovable = true;
	this._laserBarrier.body.moves = false;

	//Añadir los botones de pause.
	this._pauseX = this.game.camera.x + (this.camera.width / 3);
	this._pauseY = this.game.camera.y - (this.camera.height / 2);
	this._continueButton = this.game.add.button(0 , 0,
							  'button',
							  this.continueOnClick,
							  this, 2, 1, 0);
	this._continueButton.anchor.set(0.5);

	var text = this.game.add.text(0, 0, "Continue");
	text.anchor.set(0.5);

	this._continueButton.addChild(text);


	this._buttonMenu = this.game.add.button(0, 0,
									  'button',
									  this.exitOnClick,
									  this, 2, 1, 0);
	this._buttonMenu.anchor.set(0.5);
	var textMenu = this.game.add.text(0, 0, "Main Menu");
	textMenu.anchor.set(0.5);
	this._buttonMenu.addChild(textMenu);
	this._continueButton.visible = false;
	this._buttonMenu.visible = false;
	this._continueButton.inputEnable = false;
	this._buttonMenu.inputEnable = false;
	//Añadimos el sprite de la sangre.
	this._bloodLayer = this.add.sprite(70,3350,'bloodLayer');
    this._bloodLayer.scale.setTo(0.3,0.3);
	this._bloodLayer.alpha = 0;



	this.configure();

// HAY QUE CREAR TRIGGERS PARA EL SPAWN DE ZOMBIES

//------------------------------------------------------------------------------------------------------------------
  },

    //IS called one per frame.
  update: function () {
    //DEBUGS

	//Chekeamos la pausa en el update.
	this.checkPause();
	//Comprobamos las colisiones.
	this.game.physics.arcade.collide(this._enemies, this.groundLayer);
	this.game.physics.arcade.collide(this._rush, this._laserBarrier);
	this.game.physics.arcade.collide(this._rush, this.groundLayer);
		//Si la variable de pause está a false, si hay que comprobar el bucle del juego.
	if (this._pause === false){

        var moveDirection = new Phaser.Point(0, 0);
        var movement = this.GetMovement();


        //transitions
        switch(this._playerState){
          case PlayerState.STOP:
          case PlayerState.RUN:
          if(this.isJumping()){

            this._playerState = PlayerState.JUMP;
					   //this._alreadyJump = true;
            this._initialJumpHeight = this._rush.y;
            //this._rush.animations.play('jump');
          }
          else{
            if(movement !== Direction.NONE){
              this._playerState = PlayerState.RUN;
              //this._rush.animations.play('run');
            }else{
              this._playerState = PlayerState.STOP;
              //this._rush.animations.play('stop');
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
              //this._rush.animations.play('run');
            }
            else{
              this._playerState = PlayerState.STOP;
              //this._rush.animations.play('stop');
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
                   /* if(this._rush.scale.x < 0)
                        this._rush.scale.x *= -1;*/
          }
          else if(movement === Direction.LEFT){
            moveDirection.x = -this._speed;
                    /*if(this._rush.scale.x > 0)
                        this._rush.scale.x *= -1;*/
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
          }
          break;
        }

      //movement
        this.movement(moveDirection,5,
                      this.backgroundLayer.layer.widthInPixels*this.backgroundLayer.scale.x - 10);
        this.checkPlayerFell();
		//Actualizamos el sprite de sangre para que esté centrado en la pantalla y se muestre según la vida.
		this.updateBloodLayer();
		//Comprobar colision con el item. No
		this.checkItem();
		//Actualizamos el indicador de jetPack.
		this.jetPackPower();
		//Llamamos a las colisiones con el enemigo.
        this.onCollisionEnemy();
		//Comprobamos si el jugador a ganado ya.
		this.checkPlayerWin();
        this._rushX = this._rush.x;
        this._rushY = this._rush.y;

        /*if(!this.game.physics.arcade.collide(this._enemies, this._stopTrigger)){
          this._enemies.forEach(function (zombie){
            zombie.update(this.game, this._rushX, this._rushY, this._stopTrigger);
          },this);
      }*/

        this._enemies.forEach(function (zombie){
          if(!this.game.physics.arcade.collide(zombie, this._stopTrigger)){
            zombie.update(/*this.game,*/ this._rushX, this._rushY, this._stopTrigger);
          }
        },this);




    // CUANDO SE COLISIONE CON LOS TRIGGER SE LLAMA A SPAWNENEMIES()

		}
  },



  onPlayerDie: function(){
      //TODO 6 Carga de 'gameOver';
      this.game.state.start('gameOver');

  },
  onPlayerWin: function(){
    this.game.state.start('end');
  },

  checkPlayerFell: function(){
      if(this.game.physics.arcade.collide(this._rush, this.death))
          this.onPlayerDie();
  },

	checkPlayerWin: function(){

		if(this.game.physics.arcade.collide(this._rush, this._winTrigger))
            this.onPlayerWin();

	},

  isStanding: function(){
      return this._rush.body.blocked.down || this._rush.body.touching.down
  },

  isJumping: function(){

      return ( this.game.input.keyboard.downDuration(Phaser.Keyboard.UP,5));
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
	  this.game.physics.arcade.enable(this._winTrigger);
      this._rush.anchor.setTo(0.5, 0.5);
      this._rush.body.bounce.y = 0.2;
      this._rush.body.gravity.y = 20000;
      this._rush.body.gravity.x = 0;
      this._rush.body.velocity.x = 0;
      this.game.camera.follow(this._rush);
      this.game.camera.setSize(700,500)
	  this._life = 100;
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

	jetPackPower : function(){
		var power = ((this._jetPack / this._jetPackPower) * 100);
			this._jetPackText.text = Math.round(power) + ' %';
		if(power > 50)
		  this._jetPackText.fill = '#002AFA';

		if(power <= 50 && power > 30)
		  this._jetPackText.fill = '#F2FA00';
			if(power <=30)
				this._jetPackText.fill = '#FA0000';

	},

	checkPause : function () {
    if(this.game.input.keyboard.downDuration(Phaser.Keyboard.P,10)){
           // Si el juego no esta pausado, lo ponemos en pause y mostramos los botones.
			if (this._pause === false){
				this._pause = true;
				this._rush.body.bounce.y = 0;
				this._rush.body.allowGravity = false;
				this._rush.body.velocity.y = 0;
				this._rush.body.velocity.x = 0;
				this.stopEnemies();

        //-------------------TIMER--------------------------------------
        //this._timer.pause();
        //--------------------------------------------------------------



				//Añadir los botones y esas cosas.
				var x,y;
				x = this.game.camera.x + (this.camera.width / 1.7);
				y = this.game.camera.y + (this.camera.height / 2);
				this._continueButton.x = x;
				this._continueButton.y = (y + this.game.camera.height/6.6)


				this._buttonMenu.x = x;
				this._buttonMenu.y = (y + this.game.camera.height/3);
				this._continueButton.visible = true;
				this._continueButton.alpha = 0;
				this._buttonMenu.visible = true;
				this._buttonMenu.alpha = 0;
				this._continueButton.inputEnable = true;
				this._buttonMenu.inputEnable = true;
				this._pauseScreen.visible = true;
				this._pauseScreen.x = this.game.camera.x - 50;
				this._pauseScreen.y = this.game.camera.y;
			}

			else {
				this.continueOnClick();
			}
    }
	},

	continueOnClick: function (){
		//Mostramos los botones y reseteamos el juego.
		this._pause = false;

		this._continueButton.visible = false;
		this._buttonMenu.visible = false;
		this._pauseScreen.visible = false;

		this._rush.body.bounce.y = 0.2;
		this._rush.body.allowGravity = true;
		this._rush.body.gravity.y = 20000;
    //-----------------TIMER--------------------------------
    //this._timer.resume();
    //------------------------------------------------------

	},

	exitOnClick: function (){
    this._pause = false;
		this.game.state.start('menu');

	},


	doubleJump: function(){
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && /*!this._doubleJump*/ this._jetPack >= 15 && this._alreadyJump){
      this._initialJumpHeight = this._rush.y;
			//this._doubleJump = true;
			this._jetPack -= 5;
			return true;
		}
    return false;
	},

  //CODIGO DE ENEMIGOS
  onCollisionEnemy: function() {


    if(this.game.physics.arcade.collide(this._rush, this._enemies)){

      if(this._life > 1) { this._life -= 2; }
      else this.onPlayerDie();

    }
	else {
		if (this._life < 100)this._life += 0.5;
	}
  },

  stopEnemies: function() {

	  this._enemies.forEach(function (zombie){
            zombie.body.velocity.x = 0;
			zombie.body.velocity.y = 0;
          },this);


  },

  checkItem: function(){
	  if(this.game.physics.arcade.collide(this._rush, this._coreItem)){
			this._laserBarrier.destroy();
			this._coreItem.destroy();
		}
  },

  updateBloodLayer: function(){

	  var x, y;
	  x = this.game.camera.x;
	  y = this.game.camera.y;
	  this._bloodLayer.x = x;
	  this._bloodLayer.y = y;
	  this._bloodLayer.alpha = 1 - (this._life * 0.01);

  },

  spawnEnemies: function(x, y) {

// CAMBIAR PARA QUE SPAWNEEN EN UNA POS PREDETERMINADA CERCA DEL TRIGGER CORRESPONDIENTE

      /*var current_time = this.game.time;
      if(current_time - this._last_spawn_time > this._time_til_spawn){

        this._last_spawn_time = current_time;*/
        //var posRandX = (((Math.random() * (3 - 1) ) + 1) % 2 === 0) ? this.game.rnd.between(this._rush.x - 300, this._rush.x - 200) :
                                                                        //this.game.rnd.between(this._rush.x + 200, this._rush.x + 300);
        var enemy = new Enemy(this.game, 'zombie', 5, x, y);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.scale.setTo(1, 1);
        this._enemies.add(enemy);

    //}
  }
};

module.exports = PlayScene;
