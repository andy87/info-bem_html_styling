
'use strict';

let modules;

$(document).ready(function ()
{
    const STATUS_ERR    = 0;
    const STATUS_OK     = 1;

    modules = {

        init        : function ( callback )
        {
            callback = callback ?? function ( self ) {};

            function condition( modules, name )
            {
                return ( typeof modules[ name ] === "object" && typeof modules[ name ]['init'] === "function" )
            }

            for( let name in modules )
            {
                if ( condition( modules, name ) )
                {
                    if ( modules[name]['init']() === STATUS_ERR )
                    {
                        console.log( 'Module not found', name );
                        continue;
                    }
                    //console.log( `Module ${name} Enabled`,  );
                }
            }

            callback( this );
        },

        window      : {

            actions     : {

                scroll      : function ( $element, time )
                {
                    time = time ?? 600;

                    $([document.documentElement, document.body]).animate({
                        scrollTop: $element.offset().top
                    }, time );
                }
            }
        },

        menu        : {

            selectors   : {
                block       : '.block__menu',
                hamburger   : '.b_menu--hamburger',
                link        : '.b_menu--link',
                wrapper     : '.b_menu--wrapper'
            },

            links       : {
                wrapper     : null
            },

            cls         : {
                open        : '__open'
            },

            init        : function()
            {
                let $wrapper = $(this.selectors.wrapper);

                if ( $wrapper )
                {
                    this.bind();

                    this.links.$wrapper = $wrapper;

                    return STATUS_OK
                }

                return STATUS_ERR
            },

            bind        : function()
            {
                $(this.selectors.hamburger).on('click', this.actions.toggle );

                $(this.selectors.link).on('click', function (e)
                {
                    const $this = $(this),
                        href    = $this.attr('href'),
                        $target = $( href );

                    if ( href !== '/' && href.indexOf('#') === 0 )
                    {
                        e.preventDefault();

                        modules.window.actions.scroll( $target );

                        modules.menu.actions.close();
                    }

                });
            },

            actions     : {

                toggle      : function ()
                {
                    modules.menu.links.$wrapper.toggleClass( modules.menu.cls.open );
                },

                open        : function ()
                {
                    modules.menu.links.$wrapper.addClass( modules.menu.cls.open );

                },

                close       : function ()
                {
                    modules.menu.links.$wrapper.removeClass( modules.menu.cls.open );
                }
            }
        },

        parallax    : {

            $item       : '#parallax',
            limits      : {},

            init        : function ()
            {
                this.$item = $( this.$item );

                if ( this.$item.length )
                {
                    const top   = parseInt( this.$item.css('top') ),
                        left    = parseInt( this.$item.css('left') );

                    this.limits = {
                        top     : {
                            center  : top,
                            min     : top,
                            max     : top + 50
                        },
                        left    : {
                            center  : left,
                            min     : left - 50,
                            max     : left + 50
                        },
                    };

                    this.bind();

                    return STATUS_OK
                }

                return STATUS_ERR
            },

            bind        : function ()
            {
                let self = this;

                $(window).on('mousemove', function (e)
                {
                    const $w    = $(this),
                        width   = $w.width(),
                        height  = $w.height();

                    if ( width < 1140 ) return;

                    const   cursor_x = e.clientX,
                        cursor_y = e.clientY;

                    let x = ( cursor_x / ( width / 100 ) / 100 ),
                        y = ( cursor_y / ( height / 100 ) / 100 );

                    const limits = self.limits;

                    x = limits.left.min + ( ( limits.left.max - limits.left.min ) * x );
                    y = limits.top.min + ( ( limits.top.max - limits.top.min ) * y );

                    self.$item.css({
                        top     : y,
                        left    : x,
                    });
                });
            }

        },

        filter      : {

            selectors   : {
                block       : '.block__filter',
                list        : '.b_product--list',
                item        : '.b_product--item',
                button      : '.b_filter--button',
            },

            init        : function ()
            {
                const $filter = $( this.selectors.block );

                if ( $filter.length )
                {
                    this.bind( $filter );

                    return STATUS_OK
                }

                return STATUS_ERR
            },

            bind        : function( $filter )
            {
                $filter.on('click', this.selectors.button, function (e)
                {
                    e.preventDefault();

                    modules.filter.actions.filter( $(this).attr('href'), $(this) );
                });
            },

            actions     : {

                filter      : function ( category, $this )
                {
                    const   self            = modules.filter,
                            cls             = {
                                filter : '__filter',
                                active : '__active',
                            },
                            $product_list   = $( self.selectors.list );

                    let $collectionProduct = $( self.selectors.item );

                    $collectionProduct.hide();

                    if ( category !== '*' )
                    {
                        const filter = '[data-category="' + category+ '"]';

                        $collectionProduct = $collectionProduct.filter( filter );
                    }

                    if ( $this === undefined )
                    {
                        $this = $( self.selectors.button + '[href="' + category + '"]' );
                    }

                    $product_list.removeClass(cls.filter);

                    if ( $collectionProduct.length )
                    {
                        $collectionProduct.show();

                        $( self.selectors.button + '.' + cls.active ).removeClass( cls.active );

                        if ( $this !== undefined ) $this.addClass(cls.active );

                        if ( $collectionProduct.length < 4 ) $product_list.addClass(cls.filter);
                    }
                }
            }
        },

        config      : {

            selectors   : {
                block       : '.block__config',
                button      : '.b_config--button'
            },

            // значения для калькулятора
            items       : {
                1  : {
                        form_id     : 'server_form',
                        params      : {
                            "month": 4,
                            "data_center": 1,
                            "data_center_2": 2,
                            "name_server": 1,
                            "range_1": 30,
                            "range_cores": 4,
                            "select_1": 150
                        }
                },
                2  : {
                        form_id     : 'server_form',
                        params      : {
                            "month": 3,
                            "data_center": 2,
                            "data_center_2": 1,
                            "name_server": 2,
                            "range_1": 66,
                            "range_2": 6666,
                            "select_1": 1,
                            "select_2": 2
                        }
                },
                3  : {
                        form_id     : 'server_form',
                        params      : {
                            "month": 2,
                            "data_center": 1,
                            "data_center_2": 1,
                            "name_server": 1,
                            "range_1": 111,
                            "range_2": 10000,
                            "select_1": 1,
                            "select_2": 1
                        }
                },
            },

            init        : function ()
            {
                if ( $(this.selectors.block).length && $(this.selectors.button).length )
                {
                    this.bind();
                }
            },

            bind        : function ()
            {
                $(this.selectors.block).on('click', this.selectors.button, function (e)
                {
                    e.preventDefault();
                    const   $this   = $(this),
                            self    = modules.config,
                            id      = parseInt( $this.data('id') ),
                            form_id = self.items[id]['form_id'];

                    if ( id !== undefined )
                    {
                        let params  = self.items[id]['params'];

                        if ( params !== undefined )
                        {
                            self.actions.setup(form_id, params);
                        }

                        $this.addClass('__active');
                    }
                });
            },

            actions     : {

                setup       : function( form_id, params )
                {
                    const cls = '__active';

                    $(modules.config.selectors.block).find('.'+cls).removeClass(cls);

                    const $form = $('#' + form_id);

                    if ( ! $form.length ) return;

                    for( let name in params )
                    {
                        let $element = $form.find( '[name="' + name + '"]' );

                        if ( $element.length )
                        {
                            let tagName = $element[0].tagName.toLowerCase();

                            if ( tagName === 'select' )
                            {
                                $element[0].value = params[name] ;

                            } else if ( tagName === 'input' ) {

                                let type = $element.first().attr('type');

                                switch ( type ) {
                                    case 'checkbox':
                                    case 'radio':
                                        $('INPUT[value="' + params[name] + '"]').click();
                                        break;

                                    case 'range':
                                        $element = $('[name="' + $element.data('target') + '"]');

                                    default:
                                        $element[0].value = params[name];
                                        break;
                                }
                            }
                            $element.first().change();
                        }
                    }
                }
            }
        },

        form        : {

            selectors   : {
                block       : '.block__form.__calc',
                tab         : '.b_form--tab',
                label       : '.b_form--label'
            },

            total       : '#total_price',

            items       : {

                // цены для категойрий
                // value : price
                tabs        : {
                    1 : {
                        "name_server": {
                            1 : 0,
                            2 : 102,
                        },
                        "range_3": 200,
                        "select_1": {
                            1 : 0,
                            2 : 0,
                            3 : 0,
                            4 : 0,
                            5 : 0,
                            6 : 0,
                            7 : 0,
                            8 : 0,
                            9 : 0,
                            10 : 0,
                            11 : 0,
                            12 : 0
                        },
                        "range_1": 40,
                        "range_cores": 400,
                        "data_center": {
                            1 : 40,
                            2 : 44
                        },
                        "data_center_2": {
                            1 : 50,
                            2 : 55
                        },
                        "range_2": 150,
                    },
                }
            },

            init        : function ()
            {
                this.bind();

                let id = parseInt( $(this.selectors.tab).filter('.__active').data('id') );

                this.actions.set_price( id );

                return STATUS_OK
            },

            bind        : function ()
            {
                $(this.selectors.block).on('change', 'INPUT, SELECT', this.actions.calc );

                $(this.selectors.tab).on('click', function (e)
                {
                    e.preventDefault();

                    modules.form.actions.set_price( $(this).data('id') );
                });
            },

            actions     : {

                set_price   : function( id )
                {
                    const   self    = modules.form,
                        cls         = '__active',
                        prices      = self.items.tabs[ id ];

                    $(self.selectors.tab + `.${cls}` ).removeClass(cls);

                    function lib_prices( $element, lib )
                    {
                        $.each( lib, function ( value, price )
                        {
                            $element.filter(`[value="${value}"]`)
                                .attr( 'data-price', price )
                                .data( 'price', price );
                        });
                    }

                    for( let name in prices )
                    {
                        let priceLib    = prices[name],
                            $element    = $(`[name="${name}"]`);

                        if ( $element.length )
                        {
                            let tag = $element[0].tagName;

                            if ( tag === 'SELECT' )
                            {
                                lib_prices( $element.find('OPTION'), priceLib );

                            } else if ( tag === 'INPUT' ) {

                                switch  ( $element.attr('type') )
                                {
                                    case 'range':
                                        $element.attr('data-price', priceLib).data('price', priceLib );
                                        break;

                                    case 'radio':
                                    case 'checkbox':
                                        lib_prices( $element, priceLib );
                                        break;
                                }
                            }
                        }
                    }

                    $(self.selectors.tab + `[data-id="${id}"]`).addClass( cls );

                    self.actions.calc();

                    return false;
                },

                calc        : function (e)
                {
                    const $form = $(modules.form.selectors.block),
                        $items  = $form.find('[data-price]:checked, OPTION[data-price]:selected, [type=range][data-price]'),
                        month   = parseInt( $form.find('[name="month"]')[0].value );

                    let totalPrice  = 0;

                    $items.each(function ( index, $item )
                    {
                        let $element = $($item);

                        let price = parseInt( $element.data('price') );

                        if ( $item.tagName === 'INPUT' && $item.type === 'range' )
                        {
                            $element = $element.data('target');

                            $element = $('[name="' + $element + '"]');

                            price = parseInt( $element.val().replace(/\s+/g, '') ) * price;
                        }

                        totalPrice += price;
                    });

                    totalPrice = totalPrice * month;

                    $(modules.form.total).text( totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") );
                }
            }

        },

        input       : {

            selector    : {
                input       : '.b_form--input',
                range       : 'INPUT.range',
            },

            init        : function ()
            {
                if ( $( this.selector.input ).length )
                {
                    this.bind();

                    return STATUS_OK
                }

                return STATUS_ERR
            },

            bind        : function()
            {
                $( this.selector.range ).on('change', function (e)
                {
                    modules.input.actions.change( $(this) );

                } );
            },

            actions     : {

                change  : function ( $item )
                {
                    let value = $item.val().replace(/\s/g, '');

                    //спасибо ciprex_
                    const result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

                    $item.val( result );

                    if ( $item.data('target') )
                    {
                        modules.range.actions.setValue( $item.data('target'), value );
                    }
                }
            }
        },

        tooltips    : {

            init        : function ()
            {
                $('.tooltip').tooltipster({
                    animation   : 'fade',
                    delay       : 200,
                    theme       : 'tooltipster-borderless'
                });
            }
        },

        range       : {

            selector    : 'INPUT.range-slider',

            collection  : {},

            init        : function ()
            {
                const $range    = $( this.selector );

                if ( $range.length )
                {
                    const $elements = $('input.range-slider');

                    for ( let i = 0; i < $elements.length; i++)
                    {
                        let $item = $($elements[i]);

                        let slider  = $item.slider();

                        slider.on("slide", modules.range.actions.slide );

                        modules.range.collection[ $item.attr('name') ] = slider;
                    }

                    return STATUS_OK
                }
                return STATUS_ERR
            },

            actions     : {

                slide       : function (e)
                {
                    const $this     = $( this ),
                        selector    = 'INPUT[name="' + $this.data('target') + '"]';

                    $( selector ).val( e.value ).change();
                },

                setValue    : function ( slider_name, value )
                {
                    modules.range.collection[ slider_name ].slider('setValue', value );
                }
            },
        },

        partners    : {

            selectors   : {
                block       : '.block__partners',
                button      : '.b_partners--button'
            },

            owl         : null,

            property    : {
                loop            : true,
                items           : 1,
                autoplay        : true,
                autoplayTimeout : 1500,
                responsive      :{
                    400              :{
                        items           :1
                    },
                    640             :{
                        items           :2
                    },
                    900             :{
                        items           :3
                    },
                    1140             :{
                        items           :4
                    }
                }
            },

            init        : function ()
            {
                if ( $(this.selectors.block).length )
                {

                    this.owl = $('#carousel_partners').owlCarousel(this.property );

                    this.bind();

                    return STATUS_OK
                }

                return STATUS_ERR
            },

            bind        : function()
            {
                const $buttons = $(this.selectors.button);

                $buttons.filter('.__left').on('click', this.actions.left);

                $buttons.filter('.__right').on('click', this.actions.right);
            },

            actions     : {

                left        : function (e)
                {
                    e.preventDefault();
                    modules.partners.owl.trigger('prev.owl.carousel');
                },

                right       : function (e)
                {
                    e.preventDefault();
                    modules.partners.owl.trigger('next.owl.carousel');
                },
            }
        },

        modal       : {

            selectors   : {
                block       : '.block__modal',
                window      : '.b_modal--window',
                overlay     : '.b_modal--overlay',
                closer      : '.b_modal--closer'
            },

            links       : {
                $block      : null,
                $windows    : null,
                $button     : null,
            },

            init        : function ()
            {
                let links = this.links;

                links.$block    = $( this.selectors.block );
                links.$windows  = $( this.selectors.window );
                links.$button  = $('.js-modal');

                if ( links.$block.length &&   links.$windows.length )
                {
                    if ( this.bind() === STATUS_OK ) return STATUS_OK
                }
            },

            bind        : function ()
            {
                this.links.$button.on('click', function (e)
                {
                    e.preventDefault();

                    modules.modal.actions.open(  $(this).attr('href') );

                });

                this.links.$block.on('click', this.selectors.closer, this.actions.closer );

                $( this.selectors.overlay ).on('click', this.actions.closer_overlay );

                return STATUS_OK
            },

            actions     : {

                open            : function( id )
                {
                    const $modal        = $( id ),
                        $block__modal   = modules.modal.links.$block;

                    if ( ! $modal.length ) return;

                    if ( $block__modal.is(":hidden") )
                    {
                        $block__modal.show(function ()
                        {
                            $modal.addClass('__open');
                        });

                    } else {
                        $modal.addClass('__open');
                    }
                },

                closer_overlay  : function(e)
                {
                    if ( e.target !== e.currentTarget ) return;

                    modules.modal.links.$windows.removeClass('__open');

                    modules.modal.actions.hide_overlay();
                },

                closer      : function(e)
                {
                    $(this).parents( modules.modal.selectors.window ).removeClass('__open');

                    setTimeout(function ()
                    {
                        modules.modal.actions.hide_overlay();
                    }, 500)
                },

                hide_overlay : function ()
                {
                    const self = modules.modal;

                    if ( ! self.links.$windows.filter(".__open").length )
                    {
                        self.links.$block.hide();
                    }
                }
            }
        },
    };

    modules.init();
});