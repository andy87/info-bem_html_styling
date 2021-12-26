// Fake
function slide_prev(){}
function slide_next(){}

$(document).ready(function ()
{
    "use strict";



    // Variables

    const $window   = $(window),
    $block      = {
        header      : $('.block__header'),
        form        : $('.block__form'),
        menu        : $('.block__menu'),
        alert       : $('.block__alert'),
    },
    $inputs     = {
        name        : $('[name="name"]'),
        email       : $('[name="email"]'),
        company     : $('[name="company"]'),
        message     : $('[name="message"]'),
        subscriber  : $('[name="subscriber"]')
    },
    menuItems   = [],
    hash        = window.location.hash;



    //Functions

    function scroll( $element, time )
    {
        time = (time === undefined) ? 600 : time;

        $([document.documentElement, document.body]).animate({
            scrollTop: $element.offset().top
        }, time );
    }

    function toggleMenu()
    {
        $block.header.toggleClass('__active');
    }

    function pageScrollTop()
    {
        return parseInt( $('HTML').scrollTop() );
    }

    function menuState()
    {
        const cls       = '__fixed',
            height      = parseInt( $('#welcome').innerHeight() ) - parseInt($block.header.innerHeight()),
            has_class   = $block.header.hasClass(cls);

        if ( pageScrollTop() > height )
        {
            if ( ! has_class ) $block.header.addClass( cls );

        } else {

            if ( has_class ) $block.header.removeClass( cls );
        }
    }

    function inputCustomValidity( input, message )
    {
        input.setCustomValidity(message);
    }

    function showAlert(text)
    {
        if ( ! $block.alert.length )
        {
            $('BODY').append($('<div/>',{
                class   : 'block__alert'
            }));
        }

        const $objWindow = $('<div/>',{
            class   : 'b_alert--window'
        });

        $objWindow.append($('<div/>',{
            class   : 'b_alert--closer',
            text    : '✕'
        }));

        $objWindow.append($('<div/>',{
            class   : 'b_alert--text',
            text    : text
        }));

        $block.alert.append($objWindow);

        if ( ! $block.alert.hasClass('__active') )
        {
            $block.alert.addClass('__active');
        }

        setTimeout(function () {

            if ( $objWindow.length ) $objWindow.find('.b_alert--closer').click();

        }, 9900);
    }



    //Binds
    $block.alert.on('click', '.b_alert--closer', function()
    {
        $(this).parent('.b_alert--window').remove();

        if ( ! $block.alert.find('.b_alert--window').length && $block.alert.hasClass('__active') )
        {
            $block.alert.removeClass('__active');
        }
    });

    $(document).on('click', '.block__alert.__active', function ()
    {
        $('.b_alert--window').remove();
        $block.alert.removeClass('__active');
    });

    $window.on('scroll', function (e)
    {
        const cls = '__active',
        scrollTop = pageScrollTop();

        let target = '#welcome';

        for( let key in menuItems )
        {
            let href = menuItems[ key ];

            if ( href !== undefined && $(href).length )
            {
                let $item   = $(href),
                    top     = parseInt( $item.offset().top ) - parseInt( $block.header.height() );

                if ( scrollTop > top )
                {
                    target = href;
                }
            }
        }

        $block.menu.find(`.${cls}`).removeClass( cls );
        $block.menu.find(`[href="${target}"]`).addClass( cls );

        menuState();
    });

    $('A').on('click', function (e)
    {
        const $this = $(this),
        href    = $this.attr('href');

        if ( href.indexOf('#') === 0 && $(href).length )
        {
            $block.header.removeClass('__active');
            scroll( $(href) );
        }
    });

    $('.b_header--burger').on('click', toggleMenu );

    $block.form.on('submit', function (e)
    {
        const $this     = $(this),
            $access     = $('#is_access');

        if ( ! $access.is(":checked") )
        {
            alert('Необходимо согласие на обработку персональных данных.');

            const $notify =  $('.b_form--notify');

            if ( ! $notify.hasClass('__blink') ) $notify.addClass('__blink');

            setTimeout(function () {
                $notify.removeClass('__blink');
            }, 1000 );

            e.preventDefault();
            return false;

        } else {

            let text = "Произошла непредвиденная ошибка";

            const AJAX = {
                url         : $this.attr('action'),
                method      : $this.attr('method'),
                data        : $this.serialize(),
                dataType    : 'JSON',
                success     : function (resp)
                {
                    if ( resp !== undefined )
                    {
                        switch ( resp.status )
                        {
                            case "error":
                                text = "Ошибка отправки формы";
                                break;

                            default:
                                text = "Спасибо за обращение! \r\nМы подготовим ответ и свяжемся с Вами";
                                break;
                        }

                        $this[0].reset();

                        showAlert( text );
                    }
                },
                error       : function ( resp )
                {
                    showAlert( text );
                },
            };

            $.ajax(AJAX);

            e.preventDefault();
            return false;
        }
    });



    //validation Fix
    const err = 'Заполните это поле';

    for (  let key in $inputs )
    {
        let $item = $inputs[ key ];

        $item.on('keyup, change', function (e)
        {
            this.setCustomValidity('');

            if ( this.value === '' ) this.setCustomValidity( err );
        });

        $item[0].setCustomValidity( err );
    }



    // Init
    function init()
    {
        $block.menu.find('.b_menu--link').each(function( x, item )
        {
            menuItems.push( $(item).attr('href') );
        });

        menuState();

        setTimeout(function()
        {
            if ( hash.length && hash.indexOf('#') === 0 && $(hash).length )
            {
                scroll( $(hash) );
            }
        }, 300);

        // validate
    }

    init();

});