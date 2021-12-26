
let app = {
    getCode : function(){}
};

$(document).ready(function ()
{
    console.log('scripts.js ready()');

    app.init = {
        inputmask : function ()
        {
            if ( !$().inputmask ) {
                console.log('js inputmask - not loaded');
                return;
            }

            const $items = $('[data-inputmask]');

            if ( !$items.length ) {
                console.log('inputmask - elements not found');
                return;
            }

            $items.inputmask();
        },

        datepicker : function ()
        {
            if ( !$().datepicker ) {
                console.log('js datepicker - not loaded');
                return;
            }

            const $items = $('[data-datepicker]');

            if ( !$items.length ) {
                console.log('datepicker - elements not found');
                return;
            }

            $items.datepicker($.datepicker.regional['ru']);
        }
    };

    app.getCode = function()
    {
        alert('Код выслан вам на телефон');
    }

    app.init.inputmask();
    app.init.datepicker();

});