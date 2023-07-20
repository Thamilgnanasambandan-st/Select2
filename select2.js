(function ($) {

    // Plugin definition.
    $.fn.drop2 = function (options) {
        var $jq = this;
        var $el, $select_options, $drop2_container, $drop2_head, $drop2_body, $drop2_list_body, $drop2_list = '';

        var settings = $.extend({}, options);


        var methods = {
            init: function () {
                $el = $jq
                $el.hide()
                if ($el.attr('multiple') == 'multiple') {
                    $el.after(`<div class='drop-container multiselect-drop'><div class='drop-header'>Select Options</div> <div class='drop-body' drop-render='hide'><ul></ul><div class='drop-action-btn'><a class='drop-cancel'>Cancel</a><a class='deop-select'>submit</a></div></div></div>`)
                } else {
                    $el.after(`<div class='drop-container'><div class='drop-header'>${$el.val()}</div> <div class='drop-body' drop-render='hide'><ul></ul></div></div>`)
                }
                $select_options = $($el).children('option')
                $drop2_body = $jq.next(`.drop-container`).find(`.drop-body`)
                $drop2_list_body = $($el).next(`.drop-container`).find(`.drop-body ul`)
                $drop2_head = $el.next(`.drop-container`).find(`.drop-header`)
                $select_options.each(function (index, val) {
                    $(this).attr("data-drop2-id", `${index}`);
                    if ($(this).is(':selected')) {
                        $drop2_list_body.append(`<li data-drop2-id='${index}' drop-selected='true'>${$(this).text()}</li>`)
                    } else {
                        $drop2_list_body.append(`<li data-drop2-id='${index}' drop-selected='false'>${$(this).text()}</li>`)
                    }

                });
                $drop2_head.on('click', function () {
                    if ($drop2_body.attr("drop-render") == 'hide') {
                        setTimeout(function () {
                            methods.show()
                        }, 300);

                    } else {
                        methods.hide()
                    }
                })

                $drop2_list = $($el).next(`.drop-container`).find(`.drop-body ul li`)
                var selected_data = $($el).children("option:selected").attr('data-drop2-id')
                $($el).next(`.drop-container`).find(`.drop-body ul li[data-drop2-id='${selected_data}']`).prop('drop-selected', true)
                $($drop2_list).each(function (index, val) {
                    $(this).on('click', function () {
                        if ($el.attr('multiple') == 'multiple' && $(this).attr('drop-selected') == 'true') {
                            $($el).find(`option[data-drop2-id='${$(this).attr('data-drop2-id')}']`).prop('selected', false);
                        } else {
                            $($el).find(`option[data-drop2-id='${$(this).attr('data-drop2-id')}']`).prop('selected', true);
                        }
                        $el.trigger('drop2:select');
                        methods.update()
                    })
                })

            },

            show: function () {
                $drop2_body.attr('drop-render', 'show')
            },

            hide: function () {
                $drop2_body.attr('drop-render', 'hide')
            },

            update: function () {
                $select_options.each(function () {
                    $el = $jq
                    selected_data = $(this).attr('data-drop2-id');
                    if ($(this).is(':selected')) {
                        $($el).next(`.drop-container`).find(`.drop-body ul li[data-drop2-id='${selected_data}']`).attr('drop-selected', true)
                    } else {
                        $($el).next(`.drop-container`).find(`.drop-body ul li[data-drop2-id='${selected_data}']`).attr('drop-selected', false);
                        if ($el.attr('multiple') != 'multiple') {
                            $($el).next(`.drop-container`).find(`.drop-header`).text($el.val())
                        }
                    }
                })
            }

            // Add more methods as needed...
        };


        return this.each(function () {

            var $el = $(this);
            if (methods[options]) {
                $select_options = $($el).children('option')
                $drop2_body = $jq.next(`.drop-container`).find(`.drop-body`)
                $drop2_list_body = $($el).next(`.drop-container`).find(`.drop-body ul`)

                // If a option with the provided name exists, call it with the given parameters
                return methods[options].apply(this);
            } else if (typeof options === 'object' || !options) {

                // If no option name is provided, or the argument is an object (options), initialize the plugin
                return methods.init()
            } else {

                // Handle errors for unknown option names
                $.error('option ' + options + ' does not exist on jQuery.myCustomPlugin');
            }

        });

    };


})(jQuery);