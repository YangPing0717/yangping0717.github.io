$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var lib = lib || {};


$(function(){

    if ( $('form').length > 0 ) {

        form.init( $('form') );

    }

    Swag.registerHelpers(window.Handlebars);

    // window.Laravel.csrfToken = $('meta[name="csrf-token"]').attr('content');
});


$.extend({

    create: function( route, data, callback ) {

        data['_method'] = 'GET';

        $.ajax({
            url         : route,
            type        : 'POST',
            dataType    : 'json',
            data        : data,

            success     : function(msg){
                callback(msg);
            }
        });

    },

    destroy: function( url, callback ) {

        $.ajax({
            url         : url,
            type        : 'POST',
            dataType    : 'json',
            data        : {_method: 'DELETE'},

            success : function(msg){
                callback(msg);
            }

        });

    }
});


lib.tmpl = function( tpl ){
    return Handlebars.compile( tpl );
};


function bytesToSize( bytes ) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
