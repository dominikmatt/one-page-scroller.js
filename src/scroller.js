var Scroller = function(options) {
    this.$document = $(document);
    this.$window = $(window);
    this.$el = $('html, body');
    this.$nav = $(options.navigationContainerSelector);
    this.$sections = $(options.contentSelector);
    this.selectedSection = '';
    this.$section = this.$sections.first();
    this.lastSection = '';
    this.sectionPosTop = 0;
    this.sectionLastPosTop = 0;
    this.scrollTop = 0;
    this.scrollLastTop = 0;

    var init = function init() {
        this.startHash = location.hash.replace('#', '');
        bindDomEvents();
        checkHash();
        this.$window.on('load', checkHash.bind(this));
        loop();
    }.bind(this);

    /**
     * @method bindDomEvents
     *
     * @author Dominik Matt
     */
    var bindDomEvents = function() {
        $(window).scroll(_.throttle(onScroll.bind(this), 10));
        $(window).on('touchmove', _.throttle(onTouchMove.bind(this), 10));
    }.bind(this);

    /**
     * @method onTouchMove
     *
     * @author Dominik Matt
     */
    var onTouchMove = function onTouchMove(event) {
        checkSection();
        calculateSectionPos();
        onScroll(event);
    }.bind(this);

    /**
     * @method onScroll
     *
     * @author Dominik Matt
     */
    var onScroll = function onScroll(event) {
        this.scrollTop = this.$document.scrollTop();
        this.$document.trigger('scroller:scroll', [this.scrollTop]);
    }.bind(this);

    /**
     * @method checkSection
     *
     * @author Dominik Matt
     */
    var checkSection = function checkSection() {
        var scrollTop = this.$document.scrollTop() + (this.$window.height() / 2);
        this.$sections.each(function(key, el) {
            var $el = $(el),
                offsetTop = $el.offset().top;
            if (scrollTop > offsetTop && scrollTop < ( offsetTop + $el.height() ) && $el.data('section-url') && $el.data('section-url') != this.selectedSection) {
                enterSection($el);
                return;
            }
        }.bind(this));
    }.bind(this);

    /**
     * @method enterSection
     *
     * @author Dominik Matt
     */
    var enterSection = function enterSection($el) {
        setActiveNavPoint($el.data('section-url'));

        window.location.hash = $el.data('section-url');

        this.lastSection = this.selectedSection;
        this.selectedSection = $el.data('section-url');
        this.$lastSection = this.$section;
        this.$section = $el;

        this.$document.trigger('scroller:section:enter', [this.selectedSection]);
        this.$section.trigger('scroller:section:entered', [this.selectedSection]);

        selectTransforms();
    }.bind(this);

    /**
     * @method calculateSectionPos
     *
     * @author Dominik Matt
     */
    var calculateSectionPos = function calculateSectionPos() {
        this.scrollTop = $(document).scrollTop();
        var direction = 'down';

        if (this.scrollLastTop > this.scrollTop) {
            direction = 'up';
        } else if (this.scrollLastTop == this.scrollTop) {
            direction = 'stand';
        }

        if (direction != 'stand') {
            this.sectionLastPosTop = this.sectionPosTop;
            this.sectionPosTop = parseInt(this.scrollTop - this.$section.offset().top);
            var posTop = this.sectionPosTop + (this.$window.height() / 2);


            var diff = this.scrollLastTop - this.scrollTop;

            this.$document.trigger('scroller:section:scroll', [this.$section, this.selectedSection, this.sectionPosTop, posTop, this.sectionLastPosTop, diff, direction]);
        }

        this.scrollLastTop = this.scrollTop;
    }.bind(this);

    /**
     * @method selectTransforms
     *
     * @author Dominik Matt
     */
    var selectTransforms = function selectTransforms() {
        if (this.transforms) {
            var selectorTo = ' > ' + this.selectedSection;
            var selectorFromTo = this.lastSection + ' > ' + this.selectedSection;
            var selectorFrom = this.lastSection + ' > ';

            handleTransform(selectorTo);
            handleTransform(selectorFromTo);
            handleTransform(selectorFrom);
        }
    }.bind(this);

    /**
     * @method handleTransform
     *
     * @author Dominik Matt
     */
    var handleTransform = function handleTransform(selector) {
        if (this.transforms[selector]) {
            this.transforms[selector](this.$section);
        }
    }.bind(this);

    /**
     * @method scrollTo
     *
     * @author Dominik Matt
     */
    this.scrollTo = function scrollTo(section, type) {
        if (!type) type = 'selector';

        switch (type) {
            case 'function':
                if (typeof window[section] == 'function') {
                    var pos = window[section](),
                        distance = 0;
                }

                break;
            default:
            case 'selector':
                var $el = $('#' + section + '-section');
                var pos;
                var distance;

                if ($el.length > 0) {
                    pos = $el.offset().top;
                    distance = parseInt($el.data('distance'));
                    setActiveNavPoint(section);
                }

                break;
        }

        this.$el
            .stop()
            .animate({
                scrollTop: pos + distance + 'px'
            }, 1000);
    }.bind(this);

    /**
     * @method setActiveNavPoint
     *
     * @author Dominik Matt
     */
    var setActiveNavPoint = function setActiveNavPoint(section) {
        var $navEl = $('.section-nav-' + section + '');

        this.$nav.find('a').removeClass('active');
        $navEl.addClass('active');
    }.bind(this);

    /**
     * @method checkHash
     *
     * @author Dominik Matt
     */
    var checkHash = function checkHash() {
        if (this.startHash) {
            if (options.sections && options.sections[this.startHash]) {
                var section = options.sections[this.startHash].scrollTo.section,
                    type = options.sections[this.startHash].scrollTo.type;
                this.scrollTo(section, type);
            } else {
                this.scrollTo(this.startHash);
            }
        }
    }.bind(this);

    /**
     * @method loop
     *
     * @author Dominik Matt
     */
    var loop = function loop(doAnimation) {
        var step = function step() {
            checkSection();
            calculateSectionPos();
            window.requestAnimationFrame(step);
        }.bind(this);

        window.requestAnimationFrame(step);
    }.bind(this);

    /**
     * @method getAnimation
     *
     * @author Dominik Matt <dma@massiveart.com>
     */
    this.getAnimation = function getAnimation(animStart, length, pause, maxIndex, scrollDiff) {
        var diff = this.scrollTop - animStart,
            index = Math.floor(diff / (length + pause)),
            state = 'playing',
            scrollDiff = (scrollDiff < 0) ? scrollDiff * -1 : scrollDiff;

        if (index < 0) {
            state = 'wait',
                done = 0;
            var time = 0;
        } else {
            var isPause = (diff - ((length + pause) * index) > length),
                done = diff - ((length + pause) * index);

            if (index >= maxIndex) state = 'end';
            if (isPause) state = 'pause';
            var time = scrollDiff * 2;
        }

        return {
            diff: diff,
            index: index,
            state: state,
            length: (isPause == true ? pause : length),
            time: time,
            done: done
        };
    }.bind(this);

    this.animStates = {};
    /**
     * @method getSingleAnimation
     *
     * @author Dominik Matt
     */
    this.getSingleAnimation = function getSingleAnimation(key, animStart, animHide, scrollDirection, onStartDown, onHide, onInit) {
        if (!this.animStates[key]) {
            this.animStates[key] = 'init';
        }

        var state = this.animStates[key],
            startDiff = this.scrollTop - animStart,
            hideDiff = this.scrollTop - animHide;

        var done = function(key, state) {
            if (key) {
                this.animStates[key] = state;
            }
        };

        if (state == 'init') {
            if (typeof onInit == 'function') {
                onInit(done.bind(this, key, 'wait'));
            }
        }

        if (startDiff >= 0 && state == 'wait') {
            if (typeof onStartDown == 'function') {
                onStartDown(done.bind(this, key, 'end'));
                this.animStates[key] = 'playing';
            }
        }

        if (hideDiff <= 0 && (state == 'end' || state == 'playing')) {
            if (typeof onHide == 'function') {
                this.animStates[key] = 'endPlaying';
                onHide(done.bind(this, key, 'wait'));
            }
        }

    }.bind(this);

    this.scrollToOrder = function scrollToOder(section) {};

    init();
};