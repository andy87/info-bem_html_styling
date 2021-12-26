"use strict";

$(document).ready(function()
{
    // code ...

    function bodyToggleDesign()
    {
        var text = $('TITLE').text();

        $('BODY').toggleClass('design');

        text = ( $('BODY').hasClass('design') )
            ? '[design] ' + text
            : text.replace('[design] ', '');

        $('TITLE').text( text );
    }

    window.dev = bodyToggleDesign;

    $('BODY').on('dblclick', bodyToggleDesign );

    if ( window.location.hash.indexOf('design') !== -1 )
    {
        bodyToggleDesign();
    }

});