var GameOver = {
    create: function () {
        console.log("Game Over");
        this.game.world.setBounds(0,0,800,600);
        var wallpaper = this.game.add.sprite(this.game.world.centerX,
                                        this.game.world.centerY,
                                        'wallpaper');
        wallpaper.anchor.setTo(0.5, 0.5);
        var button = this.game.add.button(400, 500,
                                          'buttonReset',
                                          this.actionOnClick,
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        button.alpha = 0.9;


        //var goText = this.game.add.text(400, 100, "GameOver");
        var goImage = this.game.add.sprite(400, 100, 'go');
        goImage.anchor.set(0.5);
        //var text = this.game.add.text(0, 0, "Reset");
        //text.anchor.set(0.5);
        //goText.anchor.set(0.5);
        //button.addChild(text);


        var buttonMenu = this.game.add.button(400, 300,
                                          'buttonMenu',
                                          this.menuOnClick,
                                          this, 2, 2, 4);
        buttonMenu.anchor.set(0.5);
        buttonMenu.alpha = 0.9;
        //var textMenu = this.game.add.text(0, 0, "Main Menu");
        //textMenu.anchor.set(0.5);
        //buttonMenu.addChild(textMenu);

    },

    //TODO 7 declarar el callback del boton.

    actionOnClick: function(){
      this.game.state.start('play');
    },
    menuOnClick: function(){
        this.game.state.start('menu');
    }

};


module.exports = GameOver;
