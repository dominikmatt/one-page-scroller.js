var Animations = function() {
    var $sectionTwo = $('#two-section');

    /**
     * @method animate
     *
     * @author Dominik Matt <dma@massiveart.com>
     *
     * @param event
     * @param $el
     * @param section
     * @param posWinTop
     * @param posTop
     * @param lastPos
     * @param diff
     * @param direction
     */
    this.animate = function animate(event, $el, section, posWinTop, posTop, lastPos, diff, direction) {
        switch (section) {
            case 'one':
            case 'two':
                sectionTwoAnimation(event, $el, section, posWinTop, posTop, lastPos, diff, direction);
                break;
        }
    };

    /**
     * @mehtod sectionTwoAnimation
     * @param event
     * @param $section
     * @param posWinTop
     * @param posTop
     * @param lastPos
     * @param diff
     * @param direction
     */
    var sectionTwoAnimation = function sectionTwoAnimation(event, $section, posWinTop, posTop, lastPos, diff, direction) {
        var animStart = $sectionTwo.offset().top + $sectionTwo.height() / 2 - example.scroller.$window.height();
        var animHide = $sectionTwo.offset().top + $sectionTwo.height() / 2 - 20 - example.scroller.$window.height();

        example.scroller.getSingleAnimation("sectionTwoAnimation", animStart, animHide, direction,
            //on scroll down
            function(done) {
                var $img = $sectionTwo.find('.animate-image');

                $img
                    .stop()
                    .animate({
                        opacity: 1
                    }, 700, done);
            //on scroll up
            }, function(done) {
                var $img = $sectionTwo.find('.animate-image');

                $img
                    .stop()
                    .animate({
                        opacity: 0
                    }, 700);
                done();
            //on initialize
            }, function(done) {
                done();
            });
    };
};
