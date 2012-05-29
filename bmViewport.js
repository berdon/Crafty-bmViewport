/**
 * Crafty-bmViewport
 * Enhances and improves upon the Crafty.viewport through components.
 *  - ViewportFollow
 *      + Forces the viewport to follow the bound entity. This component offers adjustable
 *        "boundary padding" prior to the viewport moving and configurable map boundary via.
 *        Crafty.polygon. If no map boundary is set, the default is to use
 *        Crafty.DOM.window.width and Craft.DOM.window.height; however.
 *
 * Author:  Austin Hanson
 * Date:    5/28/2012
 */

/**@
 * #ViewportFollow
 * @category Graphics
 * @requires Multiway, Fourway, Twoway
 * Forces the viewport to follow the bound entity. This component offers adjustable
 * "boundary padding" prior to the viewport moving and configurable map boundary via.
 * Crafty.polygon. If no map boundary is set, the default is to use
 * Crafty.DOM.window.width and Craft.DOM.window.height; however.
 */
Crafty.c("ViewportFollow", {
    _lockedAtX: false,
    _lockedAtY: false,
    mapBoundary: null,
    viewportPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    
    init: function() { },
    
    /**@
     * #.viewportFollow
     * @comp bmViewport
     * @sign public this .viewportFollow(Integer padding)
     * @sign public this .viewportFollow(Integer padding, Crafty.polygon mapBoundary)
     * @param padding - Distance from the map boundary from which the viewport will
     * begin following the entity.
     * @param mapBoundary - Polygon defining the map boundary
     * 
     * @sign public this .viewportFollow(Map padding)
     * @sign public this .viewportFollow(Map padding, Crafty.polygon mapBoundary)
     * @param padding - Map of {top, right, bottom, left} paddings
     * @param mapBoundary - Polygon defining the map boundary
     * 
     * @example
     * ~~~
     * Crafty.e("2D, DOM, Color, Fourway, ViewportFollow")
     *      .attr({ x: 32, y: 32, h: 32, w: 32, z:2 })
     *      .color('blue')
     *      .fourway(4)
     *      .ViewportFollow(32, new Crafty.polygon(
     *          [0,0], [MAP_WIDTH, 0],
     *          [MAP_WIDTH, MAP_HEIGHT], [0, MAP_HEIGHT]));
     * ~~~
     */
    viewportFollow: function(padding, mapBoundary) {
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

            // Is the viewport within x adjusting range?
            if(this.mapBoundary.containsPoint(vpx_min, this._y) && this.mapBoundary.containsPoint(vpx_max + Crafty.viewport.width, this._y)) {
                // Flag that we're not locked in the y direction
                this._lockedAtX = false;
                
                if(this._x + Crafty.viewport.x <= this.viewportPadding.left)
                    Crafty.viewport.x = -(this._x - this.viewportPadding.left);
                else if(this._x + Crafty.viewport.x >= (Crafty.viewport.width - this.viewportPadding.right) - this._w)
                    Crafty.viewport.x = -(this._x + this._w - (Crafty.viewport.width - this.viewportPadding.right));
            }
            // No, attempt to reseat the viewport at a valid position
            else if(!this._lockedAtX && !this.mapBoundary.containsPoint(vpx_min, this._y)) {
                // Flag that we're locked on a boundary
                this._lockedAtX = true;
                
                var vpx = vpx_min;
                for(; !this.mapBoundary.containsPoint(vpx, this._y) && vpx < this._x; vpx++) { }
                Crafty.viewport.x = -vpx;
            }
            else if(!this._lockedAtX && !this.mapBoundary.containsPoint(vpx_max + Crafty.viewport.width, this._y)) {
                // Flag that we're locked on a boundary
                this._lockedAtX = true;
                
                var vpx = vpx_max;
                for(; !this.mapBoundary.containsPoint(vpx, this._y) && vpx > (this._x + this._w); vpx--) { }
                Crafty.viewport.x = -vpx;
            }

            // Is the viewport within y adjusting range?
            if(this.mapBoundary.containsPoint(this._x, vpy_min) && this.mapBoundary.containsPoint(this._x, vpy_max + Crafty.viewport.height)) {
                // Flag that we're not locked in the y direction
                this._lockedAtY = false;
                
                if(this._y + Crafty.viewport.y <= this.viewportPadding.top)
                    Crafty.viewport.y = -(this._y - this.viewportPadding.top);
                else if(this._y + Crafty.viewport.y >= (Crafty.viewport.height - this.viewportPadding.bottom) - this._h)
                    Crafty.viewport.y = -(this._y + this._h - (Crafty.viewport.height - this.viewportPadding.bottom));
            }
            // No, attempt to reseat the viewport at a valid position
            else if(!this._lockedAtY && !this.mapBoundary.containsPoint(this._x, vpy_min)) {
                // Flag that we're locked on a boundary
                this._lockedAtY = true;
                
                var vpy = vpy_min;
                for(; !this.mapBoundary.containsPoint(this._x, vpy) && vpy < this._y; vpy++) { }
                Crafty.viewport.y = -vpy;
            }
            else if(!this._lockedAtY && !this.mapBoundary.containsPoint(this._x, vpy_max + Crafty.viewport.height)) {
                // Flag that we're locked on a boundary
                this._lockedAtY = true;
                
                var vpy = vpy_max;
                for(; !this.mapBoundary.containsPoint(this._x, vpy) && vpy > (this._y + this._h); vpy--) { }
                Crafty.viewport.y = -vpy;
            }
        });
        
        return this;
    }
});