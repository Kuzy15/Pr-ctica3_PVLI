var end = {
    create: function () {
      this.music = this.game.add.audio('win');
      this.music.volume = 0.5;
      this.music.loop = true;
      this.music.play();
      this.game.world.setBounds(0,0,800,600);
      var wallpaper2 = this.game.add.sprite(this.game.world.centerX,
                                        this.game.world.centerY,
                                        'wallpaper2');
      wallpaper2.anchor.setTo(0.5, 0.5);
      var button = this.game.add.button(600, 300,
                                          'buttonReset',
                                          this.actionOnClick,
                                          this, 2, 1, 0);
      button.anchor.set(0.5);
        //var goText = this.game.add.text(400, 100, "You win!");
        //var text = this.game.add.text(0, 0, "Reset Game");
        //text.anchor.set(0.5);
        //goText.anchor.set(0.5);
        //button.addChild(text);


      var buttonMenu = this.game.add.button(250, 300,
                                          'buttonMenu',
                                          this.menuOnClick,
                                          this, 2, 2, 4);
      buttonMenu.anchor.set(0.5);
        //var textMenu = this.game.add.text(0, 0, "Return Main Menu");
        //textMenu.anchor.set(0.5);
        //buttonMenu.addChild(textMenu);

    },



    actionOnClick: function(){
      this.music.destroy();
      this.game.state.start('play');
    },
    menuOnClick: function(){
      this.music.destroy();
      this.game.state.start('menu');
    }

};


module.exports = end;
﻿
