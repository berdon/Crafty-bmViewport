var MAP_WIDTH = 640,//Crafty.DOM.window.width,
    MAP_HEIGHT = 640;//Crafty.DOM.window.height;

var VP_WIDTH = 256,//Crafty.DOM.window.width,
    VP_HEIGHT = 256;//Crafty.DOM.window.height;

Crafty.init(MAP_WIDTH, MAP_HEIGHT);
Crafty.canvas.init();

Crafty.modules({ bmViewport: 'DEV' }, function() {
    Crafty.scene("main", function() {
        Crafty.background("#000");
        Crafty.viewport.init(VP_WIDTH,VP_HEIGHT);
        
        var MAP_WIDTH_TILES = Math.floor(MAP_WIDTH / 16),
            MAP_HEIGHT_TILES = Math.floor(MAP_HEIGHT / 16);
        
        // Generate a sample map
        for(var x = 0; x < MAP_WIDTH_TILES; x++) {
            for(var y = 0; y < MAP_HEIGHT_TILES; y++) {
                var grass = "#0" + (Math.round(Math.random()*5) + 10).toString(16) + "0";
                
                // Grass
                Crafty.e("2D, DOM, Color, grass")
                    .attr({ x: x * 16, y: y * 16, h: 16, w: 16, z:1 })
                    .color(grass);
                
                // Boundary
                if(x === 0 || x === MAP_WIDTH_TILES - 1 || y === 0 || y === MAP_HEIGHT_TILES - 1) {
                    var color = (Math.round(Math.random()*6) + 1).toString(16);
                
                    Crafty.e("2D, DOM, Collision, Color, solid, fence")
                        .attr({ x: x * 16, y: y * 16, h: 16, w: 16, z:2 })
                        .color("#" + color + color + color);
                }
            }
        }
        
        // Add in our test player
        Crafty.e("2D, DOM, Collision, Color, Fourway, ViewportFollow")
            .attr({ x: 32, y: 32, h: 32, w: 32, z:2 })
            .color('blue')
            .fourway(4)
            .viewportFollow(32, new Crafty.polygon(
                [0,0], [MAP_WIDTH, 0],
                [MAP_WIDTH, MAP_HEIGHT], [0, MAP_HEIGHT]))
            .bind('Moved', function(from) {
                if(this.hit('solid')){
                    this.attr({x: from.x, y:from.y});
                }
            });
    });
    Crafty.scene("main");
});?