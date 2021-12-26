
"use strict";

$(document).ready(function ()
{
    "use strict";

    // Variables

    const $window   = $(window),
        $block      = {
            page        : $('.block__page'),
            header      : $('.block__header'),
            form        : $('.b_form--wrapper'),
            menu        : $('.block__menu'),
            alert       : $('.block__alert'),
        },
        $inputs     = {
            name        : $('[name="name"]'),
            company     : $('[name="contact"]'),
            message     : $('[name="message"]'),
        },
        menuItems   = [],
        hash        = window.location.hash;

    //Libs

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
        const cls   = '__fixed',
            height      = parseInt( $('#welcome').innerHeight() ) - parseInt($block.header.innerHeight() ) - 2,
            has_class   = $block.header.hasClass(cls);

        if ( pageScrollTop() > height )
        {
            if ( ! has_class ) $block.header.addClass( cls );

        } else {

            if ( has_class ) $block.header.removeClass( cls );
        }
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

    $window.on('scroll', function ()
    {
        const cls = '__active',
            scrollTop = pageScrollTop();

        let target = '#welcome';

        for( let key in menuItems )
        {
            let href = menuItems[key];

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
        $block.menu.find(`[href="${target}"]`).first().addClass( cls );

        menuState();
    });

    $('A').on('click', function ()
    {
        const $this = $(this),
            href    = $this.attr('href');

        if ( href.indexOf('#') === 0 && $(href).length )
        {
            $block.header.removeClass('__active');

            scroll( $(href) );
        }
    });

    $('.b_header--button').click(function (e)
    {
        e.preventDefault();

        toggleMenu();

        return false;
    });

    $block.form.on('submit', function (e)
    {
        const $this     = $(this),
            $access     = $('#is_access'),
            cls         = '__blink';

        console.log('$this 1', $this);

        if ( ! $access.is(":checked") )
        {
            alert('Необходимо согласие на обработку персональных данных.');

            const $notify =  $('.b_form--notify');

            if ( ! $notify.hasClass( cls ) ) $notify.addClass( cls );

            setTimeout(function () {
                $notify.removeClass( cls );
            }, 1000 );

            e.preventDefault();
            return false;

        } else {
            console.log('$this 2', $this);

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

            console.log('AJAX', AJAX);

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

        $item.on('keyup, change', function ()
        {
            this.setCustomValidity('');

            if ( this.value === '' ) this.setCustomValidity( err );
        });

        if ( $item[0] !== undefined) $item[0].setCustomValidity( err );
    }

    const carousel = $('.owl-carousel').owlCarousel({
        items   : 1,
        loop    : true,
        speed   : 800
    });

    $('.b_carousel--button').on('click', function (e)
    {
        e.preventDefault();
        const action = ( $(this).hasClass('__next') )
            ? 'next.owl.carousel'
            : 'prev.owl.carousel';

        carousel.trigger( action );
    });



    // Init
    function init()
    {
        $block.page.find('.b_page--item').each(function( x, item )
        {
            menuItems.push( '#' + $(item).attr('id') );
        });

        menuState();

        setTimeout(function()
        {
            if ( hash.length && hash.indexOf('#') === 0 )
            {
                if ( hash.indexOf('=') === -1 && $(hash).length ) scroll( $(hash) );
            }
        }, 100);
    }

    // оповещение на JS о том что форма получена
    if ( window.location.search.indexOf('?status=') !== -1 )
    {
        if ( window.location.search.indexOf('?status=error') === -1 )
        {
            showAlert("Спасибо за обращение! \r\nМы подготовим ответ и свяжемся с Вами");
        }
    }

    init();

});