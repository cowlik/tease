var Tease = Tease || {};

/*
 *
 * home
 *
 */

Tease.Home = {
    init: function() {
        var home = this;
    },
    initMap: function() {
        var home = this;

        home.map = new Tease.Map(document.getElementById("map"));
    }
};

$(function() {
    Tease.Home.init();
});

function initMap() {
    Tease.Home.initMap();
}
