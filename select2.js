(function ($) {

    // Plugin definition.
    $.fn.drop2 = function (options) {
        var $jq = this;
        // Iterate and reformat each matched element.
        var conditions = $.extend({
            hide: function (component) {
                component.next(`.drop-container`).find(`.drop-body`).attr('drop-render', 'hide');
                component.trigger('drop2:close');
            },
            show: function (component) {
                component.next(`.drop-container`).find(`.drop-body`).attr('drop-render', 'show')
                component.trigger('drop2:open');
            },
            toggle: function (component) {
                component.next(`.drop-container`).find(`.drop-header`).on('click', function () {
                    if (component.next(`.drop-container`).find(`.drop-body`).attr("drop-render") == 'hide') {
                        component.trigger('drop2:opening');
                        setTimeout(function () {
                            conditions.show(component)
                        }, 300);

                    } else {
                        component.trigger('drop2:closing');
                        conditions.hide(component)
                    }
                })
            },
            dataType: "single",
            placeholderIcons: '<i class="fa-solid fa-magnifying-glass"></i>'
        }, options);


        var output = {
            'init': function () {
                $jq.each(function () {
                    var $el = $(this);
                    output.create($el)
                    conditions.toggle($el)
                    output.choose($el)
                })
            },
            'create': function ($el) {
                $el.hide()
                if ($el.val() == '') {
                    $el.after(`<div class='drop-container multiselect-drop'><div class='drop-header'>Select Options</div> <div class='drop-body' drop-render='hide'><ul></ul></div></div>`)
                } else {
                    $el.after(`<div class='drop-container'><div class='drop-header'>${$el.val()}</div> <div class='drop-body' drop-render='hide'><ul></ul></div></div>`)
                }
                $($el).children('option').each(function (index, val) {
                    $(this).attr("data-drop2-id", `${index}`);
                    $($el).next(`.drop-container`).find(`.drop-body ul`).append(`<li data-drop2-id='${index}' drop-selected='false'>${$(this).text()}</li>`)
                });
            },
            'choose': function ($el) {
                var select_data = $($el).next(`.drop-container`).find(`.drop-body ul li`)
                var selected_data = $($el).children("option:selected").attr('data-drop2-id')
                $($el).next(`.drop-container`).find(`.drop-body ul li[data-drop2-id='${selected_data}']`).prop('drop-selected', true)
                $(select_data).each(function (index, val) {
                    $(this).on('click', function () {
                        $el.trigger('drop2:selecting');
                        if($el.attr('multiple')=='multiple' && $(this).attr('drop-selected') == 'true'){
                         $($el).find(`option[data-drop2-id='${$(this).attr('data-drop2-id')}']`).prop('selected', false);

                        }else{
                            $($el).find(`option[data-drop2-id='${$(this).attr('data-drop2-id')}']`).prop('selected', true);
                        }
                        $el.trigger('drop2:select');
                        output.update($el)
                    })
                   
                })

            },

            'update': function ($el) {
                $($el).children("option").each(function () {
                    selected_data = $(this).attr('data-drop2-id');
                    if ($(this).is(':selected')) {
                        $($el).next(`.drop-container`).find(`.drop-body ul li[data-drop2-id='${selected_data}']`).attr('drop-selected', true)
                    } else {
                        $($el).next(`.drop-container`).find(`.drop-body ul li[data-drop2-id='${selected_data}']`).attr('drop-selected', false);
                        $($el).next(`.drop-container`).find(`.drop-header`).text($el.val())
                    }
                })
            },
            'destroy': function () {

            },
            'get': function () {
                $jq.each(function () {
                    var $el = $(this).find(`input[name="customDropdown"]:checked`).serialize()
                })
            }
        }

        output.init();
        return output;

    };


})(jQuery);