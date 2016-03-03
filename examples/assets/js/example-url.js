var Example = function() {
    this.scroller = null;

    this.initialize();
};

Example.prototype.initialize = function() {
    this.scroller = new Scroller({
        navigationContainerSelector: '#navigation',
        contentSelector: '.content',

        sections: {}
    });
};

Example.prototype.bindEvents = function() {
    this.scroller.$document.on("scroller:section:enter", function() { console.log('on pageview'); });
};


var example = new Example();