Crafty.c('Grid',{
   init: function(){
       this.attr({
           w: Game.map_grid.tile.width,
           h: Game.map_grid.tile.height
       });
   },
   
   at: function(x,y) {
       if(x===undefined) {
           // my location
           return {x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height};
       } else {
           // set position
           this.attr({
               x: x * Game.map_grid.tile.width,
               y: y * Game.map_grid.tile.height
           });
           return this;
       }
   }
});

Crafty.c('Actor',{
    init: function(){
        this.requires('2D, Canvas, Grid');
    }
});

Crafty.c('Tree',{
    init: function(){
        this.requires('Actor, spr_tree, Solid');
    }
});

Crafty.c('Bush',{
    init: function(){
        this.requires('Actor, spr_bush, Solid');
    }
});

Crafty.c('PlayerCharacter',{
   init: function(){
       var animation_speed = 8;
       
       this.requires('Actor, Fourway, spr_player, Collision, SpriteAnimation')
       .fourway(4)
       .stopOnSolids()
       .onHit('Village', this.visitVillage)
       .reel('PlayerMovingUp',    animation_speed, 0, 0, 2)
       .reel('PlayerMovingRight', animation_speed, 0, 1, 2)
       .reel('PlayerMovingDown',  animation_speed, 0, 2, 2)
       .reel('PlayerMovingLeft',  animation_speed, 0, 3, 2);
       
       var animation_speed = 8;
       this.bind('NewDirection', function(data){
           if (data.x > 0) {
               this.animate('PlayerMovingRight', 1);
           } else if (data.x < 0) {
               this.animate('PlayerMovingLeft', 1);
           } else if (data.y > 0) {
               this.animate('PlayerMovingDown', 1);
           } else if (data.y < 0) {
               this.animate('PlayerMovingUp', 1);
           } else {
               this.stop();
           }
       });
   },
   
   stopOnSolids: function(){
       this.onHit('Solid', this.stopMovement);
       
       return this;
   },
   
   stopMovement: function(){
       this._speed = 0;
       if(this._movement){
           this.x -= this._movement.x;
           this.y -= this._movement.y;
       }
   },
   
   visitVillage: function(data){
       village = data[0].obj;
       village.collect();
   }
});

Crafty.c('Village',{
   init: function(){
       this.requires('Actor, spr_village');
   },
   
   collect: function(){
       this.destroy();
       Crafty.audio.play('knock');
       Crafty.trigger('VillageVisited', this);
   }
})