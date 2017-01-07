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
    _timer: null,
    _spawn_time: Math.random() * (25000-20000) + 20000,//(15s, 10s] Este tiempo hay que hacer que dependa de la velocidad del personaje
    //o del tiempo que queda para que acabe la partida si lo hacemos contrarreloj.
	_dashPower: 1000,
	_pauseScreen:{},
	_pausex: 0,
	_pauseY: 0,
	_winTrigger: {},
  _rushX: null,
  _rushY: null,
  _stopTrigger: {},







//--------------------------------------------------------------------------------

    //Método constructor...
  create: function () {

      //this._rush = this.game.add.sprite(30,1350, 'rush');

      //------------------------------------------------
      //-----------TIMER--------------------------------
      this._timer = this.game.time.create(false);
      //this._timer.loop(this._spawn_time, this.spawnEnemies, this);
      this._timer.start();
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
	  this._rush = this.game.add.sprite(70,3350, 'rush');
	  this._pauseScreen = this.add.sprite(70,3350,'pauseScreen');
	  this._pauseScreen.scale.setTo(2.5,2.8);
	  this._pauseScreen.alpha = 0.8;
	  this._pauseScreen.x = this.game.camera.x;
	  this._pauseScreen.y = this.game.camera.y;
	  this._winTrigger = this.add.sprite(70, 680,'winTrigger');
	  this._winTrigger.alpha = 0;

    this._stopTrigger = this.game.add.group();
    this._stopTrigger = this.game.add.physicsGroup();
    this._stopTrigger.create(950, 3350, 'stopTrigger');
    this._stopTrigger.create(1100, 3350, 'stopTrigger');
    this._stopTrigger.create(2008, 3093, 'stopTrigger');
    this._stopTrigger.create(767, 2709, 'stopTrigger');
    this._stopTrigger.create(1586, 2853, 'stopTrigger');
    this._stopTrigger.create(388, 2517, 'stopTrigger');
    this._stopTrigger.create(2102, 2277, 'stopTrigger');
    this._stopTrigger.create(1636, 1893, 'stopTrigger');
    this._stopTrigger.create(1446, 1893, 'stopTrigger');
    this._stopTrigger.create(341, 1557, 'stopTrigger');
    this._stopTrigger.create(2065, 1557, 'stopTrigger');
    this._stopTrigger.setAll('body.immovable', true);
    this._stopTrigger.setAll('anchor.x', 0.5);
    this._stopTrigger.setAll('anchor.y', 0.5);
    //this._stopTrigger.setAll('alpha', 0);
	  //--------------------------------------------------------------------
	  /*this._rush.powerBar = this.game.add.sprite(0,0,'powerbar'); No consigo implementar la barra de vida. voy a hacerlo con texto.
	  //this._rush.powerBar.cropEnabled = true;
	  //this._rush.powerBar.crop.width = (this._jetPack / this._jetPackPower) * this._rush.powerBar.width;
	  this._rush.addChild(this._rush.powerBar);
	  this._rush.powerBar.scale.setTo(0.2,0.2);
	  this._rush.powerBar.x = -6;
	  this._rush.powerBar.angle = 90;
	  this._rush.powerBar.crop = new Phaser.Rectangle(0,0,this._rush.powerBar.width, this._rush.powerBar.height);
	  */
	  //---------------------------------------------------------------------
	  this._jetPackText = this.game.add.text(-50, 0, "100 %", { font: "65px Arial", fill: "#002AFA", align: "center" });
	  this._jetPackText.font = 'Sniglet';
	  this._rush.addChild(this._jetPackText);
	  this._jetPackText.scale.setTo(0.3,0.3);
      //Colisiones con el plano de muerte y con suelo.
      this.map.setCollisionBetween(1, 5000, true, 'Death');
      this.map.setCollisionBetween(1, 5000, true, 'Estructuras');
	  //this.backgroundLayer.visible = false;
      //Cambia la escala a x3.
      this.groundLayer.setScale(3,3);
      this.backgroundLayer.setScale(3,3);
      this.death.setScale(3,3);

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

		//this.game.camera.addChild(this._continueButton);
		//this.game.camera.addChild(this._buttonMenu);

      //this.groundLayer.resizeWorld(); //resize world and adjust to the screen

      //nombre de la animación, frames, framerate, isloop
      this._rush.animations.add('run',
                    Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
      this._rush.animations.add('stop',
                    Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
      this._rush.animations.add('jump',
                     Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
      this.configure();

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


                  var enemy = new Enemy(this.game, 'zombie', this.game.rnd.between(850 , 900), 3350);
                  enemy.anchor.setTo(0.5, 0.5);
                  this._enemies.add(enemy);



                //this._enemies.setAll('body.collideWorldBounds', true);


                // HAY QUE CREAR TRIGGERS PARA EL SPAWN DE ZOMBIES

//------------------------------------------------------------------------------------------------------------------
  },

    //IS called one per frame.
    update: function () {

		//DEBUGS
		//console.log('ea', this._jetPack);

		//-----------------------------

		this.checkPause();
		//Durante el estado de pausa no tenemos que checkear al jugador.
		//Cuando implementemos los enemigso, hay que meter su update dentro de este if para que no se actualicen.
		if (this._pause === false){
        var moveDirection = new Phaser.Point(0, 0);
        var collisionWithTilemap = this.game.physics.arcade.collide(this._rush, this.groundLayer);
        var movement = this.GetMovement();

        //var enemyStanding = this.game.physics.arcade.collide(this._enemies, this.groundLayer);




	/*
		this._rush.powerBar.crop.width = ((this._jetPack / this._jetPackPower) * this._rush.powerBar.width);
		//this._rush.powerBar.updateCrop();
		console.log(this._rush.powerBar.crop.width);*/

        //transitions
        switch(this._playerState)
        {
            case PlayerState.STOP:
            case PlayerState.RUN:
                if(this.isJumping(collisionWithTilemap)){
                    this._playerState = PlayerState.JUMP;
					//this._alreadyJump = true;
                    this._initialJumpHeight = this._rush.y;
                    //this._rush.animations.play('jump');
                }
                else{
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        //this._rush.animations.play('run');
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
                        //this._rush.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                       // this._rush.animations.play('stop');
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
							if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this._jetPack < this._jetPackPower/2){
									moveDirection.y = this._dashPower;

								}
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
		this.jetPackPower();
        this.onCollisionEnemy();
		this.checkPlayerWin();

    this._rushX = this._rush.x;
    this._rushY = this._rush.y;
    //console.log(this._rushX );
    //console.log(this._rushY );


    this._enemies.forEach(function (zombie){
            zombie.update(this.game, this._rushX, this._rushY, this._stopTrigger);
        },this);




    // CUANDO SE COLISIONE CON LOS TRIGGER SE LLAMA A SPAWNENEMIES()

		}




    },


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

	checkPlayerWin: function(){

		if(this.game.physics.arcade.collide(this._rush, this._winTrigger))
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
		    this.game.physics.arcade.enable(this._winTrigger);

        this._rush.anchor.setTo(0.5, 0.5);
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
				console.log(this._buttonMenu);
				this._pause = true;
				this._rush.body.bounce.y = 0;
				this._rush.body.allowGravity = false;
				this._rush.body.velocity.y = 0;
				this._rush.body.velocity.x = 0;
        //-------------------TIMER--------------------------------------
        this._timer.pause();
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
		console.log(this._pause);
		this._continueButton.visible = false;
		this._buttonMenu.visible = false;
		this._pauseScreen.visible = false;

		this._rush.body.bounce.y = 0.2;
		this._rush.body.allowGravity = true;
		this._rush.body.gravity.y = 20000;
    //-----------------TIMER--------------------------------
    this._timer.resume();
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
        //this.onPlayerDie();
        console.log("fuuuuck");
      }

    },


    spawnEnemies: function() {

// CAMBIAR PARA QUE SPAWNEEN EN UNA POS PREDETERMINADA CERCA DEL TRIGGER CORRESPONDIENTE

      /*var current_time = this.game.time;
      if(current_time - this._last_spawn_time > this._time_til_spawn){

        this._last_spawn_time = current_time;*/
        var posRandX = (((Math.random() * (3 - 1) ) + 1) % 2 === 0) ? this.game.rnd.between(this._rush.x - 300, this._rush.x - 200) :
                                                                        this.game.rnd.between(this._rush.x + 200, this._rush.x + 300);
        var enemy = new Enemy(this.game, 'zombie', posRandX , 3093);//La  pos y tambien habria que cambiarla, sino se spawnearian
        //solo en el suelo
        enemy.anchor.setTo(0.5, 0.5);
        this._enemies.add(enemy);
        console.log("spawn motherfuckeeeeeeer");
    //}
  }
};

module.exports = PlayScene;
