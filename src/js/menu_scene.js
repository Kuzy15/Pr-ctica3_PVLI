var MenuScene = {
    create: function () {
        this.music = this.game.add.audio('mainTheme');
        this.music.volume = 0.5;
        this.music.loop = true;
        this.music.play();

        this.game.world.setBounds(0,0,800,600);
        var logo = this.game.add.sprite(this.game.world.centerX,
                                        this.game.world.centerY,
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        var buttonStart = this.game.add.button(this.game.world.centerX-10,
                                               this.game.world.centerY+160,
                                               'buttonStart',
                                               this.actionOnClick,
                                               this, 2, 1, 0);
        buttonStart.anchor.set(0.5);
        buttonStart.alpha = 0.90;
        buttonStart.scale.setTo(0.65, 0.65);
        //var style = { font: "40px Arial", fill: "#000000", align: "center"};
        //var textStart = this.game.add.text(0, 0, "Start", style);
        //textStart.font = 'Sniglet';
        //textStart.anchor.set(0.5);
        //buttonStart.addChild(textStart);
    },

    actionOnClick: function(){
      this.music.destroy();
      this.game.state.start('preloader');
    }
};

module.exports = MenuScene;
