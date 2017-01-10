var end = {
    create: function () {
        console.log("You win!");
        var button = this.game.add.button(500, 300,
                                          'button',
                                          this.actionOnClick,
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        var goText = this.game.add.text(400, 100, "You win!");
        var text = this.game.add.text(0, 0, "Reset Game");
        text.anchor.set(0.5);
        goText.anchor.set(0.5);
        button.addChild(text);


        var buttonMenu = this.game.add.button(250, 300,
                                          'button',
                                          this.menuOnClick,
                                          this, 2, 2, 4);
        buttonMenu.anchor.set(0.5);
        var textMenu = this.game.add.text(0, 0, "Return Main Menu");
        textMenu.anchor.set(0.5);
        buttonMenu.addChild(textMenu);

    },

    

    actionOnClick: function(){
        this.game.state.start('play');
    },
    menuOnClick: function(){
        this.game.state.start('menu');
    }

};


module.exports = end;
﻿