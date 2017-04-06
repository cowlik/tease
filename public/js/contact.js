var Tease = Tease || {};

/*
 *
 * contact
 *
 */

Tease.Contact = {
    init: function() {
        var contact = this;
    },
    initMap: function() {
        var contact = this;

        contact.map = new Tease.Map(document.getElementById("map"));
    }
};

$(function() {
    Tease.Contact.init();
});

function initMap() {
    Tease.Contact.initMap();
}
