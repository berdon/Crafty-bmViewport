Crafty.c("ViewportFollow", {
    mapBoundary: null,
    viewportPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    
    init: function() {
    },
    
    ViewportFollow: function(padding, mapBoundary) {
        if(padding != null) {
            if(typeof(padding) === "object") {
                this.viewportPadding.top = padding.top != null ? padding.top : 0;
                this.viewportPadding.right = padding.right != null ? padding.right : 0;
                this.viewportPadding.bottom = padding.bottom != null ? padding.bottom : 0;
                this.viewportPadding.left = padding.left != null ? padding.left : 0;
            }
            else if(typeof(padding) === "number") {
                this.viewportPadding.top = padding;
                this.viewportPadding.right = padding;
                this.viewportPadding.bottom = padding;
                this.viewportPadding.left = padding;
            }
        }
        
        if(mapBoundary == null) {
            this.mapBoundary = new Crafty.polygon([0,0], [Crafty.DOM.window.width, 0], [Crafty.DOM.window.width, Crafty.DOM.window.height], [0, Crafty.DOM.window.height]);
        }
        else {
            this.mapBoundary = mapBoundary;
        }
        
        this.bind('Moved', function(from) {
            var vpx_min = this._x - this.viewportPadding.left,
                vpx_max = this._x - (Crafty.viewport.width - this.viewportPadding.right) + this._w;

            var vpy_min = this._y - this.viewportPadding.top,
                vpy_max = this._y - (Crafty.viewport.height - this.viewportPadding.bottom) + this._h;

            if(this.mapBoundary.containsPoint(vpx_min, this._y) && this.mapBoundary.containsPoint(vpx_max + Crafty.viewport.width, this._y)) {
                if(this._x + Crafty.viewport.x <= this.viewportPadding.left)
                    Crafty.viewport.x = -(this._x - this.viewportPadding.left);
                else if(this._x + Crafty.viewport.x >= (Crafty.viewport.width - this.viewportPadding.right) - this._w)
                    Crafty.viewport.x = -(this._x + this._w - (Crafty.viewport.width - this.viewportPadding.right));
            }

            if(this.mapBoundary.containsPoint(this._x, vpy_min) && this.mapBoundary.containsPoint(this._x, vpy_max + Crafty.viewport.height)) {
                if(this._y + Crafty.viewport.y <= this.viewportPadding.top)
                    Crafty.viewport.y = -(this._y - this.viewportPadding.top);
                else if(this._y + Crafty.viewport.y >= (Crafty.viewport.height - this.viewportPadding.bottom) - this._h)
                    Crafty.viewport.y = -(this._y + this._h - (Crafty.viewport.height - this.viewportPadding.bottom));
            }
        });
        
        return this;
    }
});