var Tease = Tease || {};

/*
 *
 * services
 *
 */

Tease.Services = {
    init: function() {
        var services = this;

        services.accordion = new Tease.Accordion();
    }
};

$(function() {
    Tease.Services.init();
});