var Example = function() {
    this.scroller = null;
    this.animations = new Animations();
    this.initialize();
};

Example.prototype.initialize = function() {
    this.scroller = new Scroller({
        navigationContainerSelector: '#navigation',
        contentSelector: '.content',
        sections: {}
    });

    this.bindEvents();
};

Example.prototype.bindEvents = function() {
    this.scroller.$document.on("scroller:section:scroll", this.animations.animate.bind(this));
};

var example = new Example();
