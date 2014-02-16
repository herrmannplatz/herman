
herman.createModule('Tween',function(){
    "use strict"

    /**
     * [Tween description]
     * @param {[type]} target   [description]
     * @param {[type]} property [description]
     * @param {[type]} begin    [description]
     * @param {[type]} end      [description]
     * @param {[type]} duration [description]
     */
    function Tween(target, property, begin, end, duration) {
        var startTime = new Date().getTime(),
            diff, progress, value;

        (function update() {
            stats.begin();
            diff = new Date().getTime() - startTime;
            progress = diff/duration;
            progress = progress < 1 ? progress : 1;
            value = begin + ( ( end - begin ) * progress );
            target[property] = value;
            target.update();

            if (progress < 1) {
                requestAnimationFrame(update);    
            }
            stats.end();
        })();
    }

    return Tween;

});