$(document).ready(function() {

    // Gathering Foregrounds Height and Width
    var foregroundWidth = $(".foreground").width() / 2;
    var foregroundHeight = $(".foreground").height() / 2;

    // The Animation Magic
    $(".foreground").mousemove(function(event) {
        var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";

        // This actually gives me the distance of the mouse of the center of the screen.
        moveOnX = (event.pageX - foregroundWidth) / foregroundWidth;
        moveOnY = (event.pageY - foregroundHeight) / foregroundHeight;

        // Animation in Process
        $(".text").css('transform', 'translateX(' + moveOnX + 'em) rotateY(' + 60 * moveOnX + 'deg) translateY(' + moveOnY + 'em) rotateX(' + -60 * moveOnY / 2 + 'deg)');
        $(".guitar").css('transform', 'translateX(' + moveOnX * 20 + 'px)');

    });

    // Calling for sidenav
    $('.hamburger-icon').on('click', function(event) {
        event.preventDefault();
        $('.sidenav').toggleClass('active');
        $('.hamburger-icon').toggleClass('active');
    });

    // Inactivating the side nav when clicked out of it.
    $('.foreground').on('click', function(event) {
        event.preventDefault();
        $('.sidenav').removeClass('active');
        $('.hamburger-icon').removeClass('active');
    });

});
