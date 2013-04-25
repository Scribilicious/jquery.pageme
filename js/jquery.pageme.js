/********************************************************************************
* jquery.pageme.js - programmed by Jens Eldering (C) 2013 by Atec Media (C)
*********************************************************************************
* Version    : 1.0.1
* Release    : 25-4-2013
* License    : CC BY-SA 3.0 | http://creativecommons.org/licenses/by-sa/3.0/
* Script     : Javascript / jQuery
*
* Programmer : Jens Eldering
* Contact    : jens@atecmedia.com
********************************************************************************/
;if(window.jQuery) (function($){
	$.fn.pageme = function(options) {
        // Default settings
        var defaults = {
            status     : '<div class="scrollLoad"></div>',
            loading    : 'Loading...',
            finished   : 'Finished...',
            error      : 'Error loading...',
            statusfade : 500,
            statuspause: 1000,
            container  : '.container',
            next       : '.next',
            navigation : '.navigate',
            nextfade   : 500,
            datatype   : 'html'
        };
        options = $.extend(defaults, options);

        // replace false with 0 fade speed
        if (options.nextfade===false) options.nextfade = 0;
        if (options.statusfade===false) options.statusfade = 0;

        return this.each(function() {
            // check if next page exist, if yes : do scroll load
            if ($(this).find(options.next).length && $(this).find(options.next).attr("href").length) $.fn.pageme.doscroll($(this),$(this).find(options.next).attr("href"),options);
            // remove loading container
            if ($(this).find(options.container).length) $(this).find(options.container).contents().unwrap();
            // remove navigation
            if ($(this).find(options.navigation).length) $(this).find(options.navigation).remove();
        });
    }

    $.fn.pageme.doscroll = function(element,next,options) {
        // if status container exists, create
        if (options.status) var $status = $(options.status);
        else var $status = false;
        // scrolling event handler
        $(window).scroll(function() {
            // check if bottom is reached
            if ($(window).scrollTop() + $.fn.pageme.height() > $(document).height() - 10) {
                $(window).unbind('scroll');
                // view loading status
                if ($status && options.loading) $('body').append($status.html(options.loading).fadeIn(options.statusfade));
                $.ajax({
                    url: next,
                    cache: false,
                    dataType: options.datatype,
                    success: function(html) {
                        // append container to element
                        var append = $('<div></div>').hide().html($(options.container,html).html());
                        $(append).appendTo(element).fadeIn(options.nextfade, function() {
                            $(append).contents().unwrap();
                        });
                        // check if next page exist, if yes : do scroll load again
                        if ($(options.next, html).length && $(options.next, html).attr('href').length) {
                            $.fn.pageme.doscroll(element,$(options.next, html).attr('href'),options);
                        } else if ($status && options.finished) { // if not : show the finish status
                            $status.fadeOut(options.statusfade, function(){
                                $status.html(options.finished).fadeIn(options.statusfade).delay(options.statuspause).fadeOut(options.statusfade, function() {
                                $status.remove();
                            })});
                            return;
                        }
                        // remove status
                        if ($status && options.loading) $status.fadeOut(options.statusfade,function(){
                            $status.remove();
                        });
                    },
                    error: function(xhr){ // show error if next page isn't loaded
                        if ($status && options.error) $status.fadeOut(options.statusfade, function(){
                            $status.html(options.error).fadeIn(options.statusfade).delay(options.statuspause).fadeOut(options.statusfade, function() {
                                $status.remove();
                            });
                        });
                    }
               });
            }
        });
    }

    // Duo the jQuery $(window).height bug we need to use a native JavaScript function to determine the window height
    $.fn.pageme.height = function() {
        var height;
        //Standards browsers mozilla, netscape, opera and IE7
        if (typeof window.innerHeight != 'undefined') height = window.innerHeight
        // IE6
        else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientHeight != 'undefined' && document.documentElement.clientHeight != 0) height = document.documentElement.clientHeight;
        // Older IE
        else height = document.getElementsByTagName('body')[0].clientHeight;
        return height;
    }
})(jQuery);
