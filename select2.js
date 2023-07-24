(function ($) {

    // Plugin definition.
    $.fn.drop2 = function (options) {
        var $jq = this,
            isMultiple = $jq.attr('multiple');
        var $el, $select_options, $drop2_container, $drop2_head, $drop2_body, $drop2_list_body, $drop2_list = '';

        var settings = $.extend({

        }, options);


        var methods = {
            init: function () {
                $el = $jq
                // $el.hide()
                if ($el.attr('multiple') == 'multiple') {
                    $el.after(`<div class='drop-container multiselect-drop'><div class='drop-header'>Select Options</div> <div class='drop-body' drop-render='hide'><ul></ul><div class='drop-action-btn'><a class='drop-cancel'>Cancel</a><a class='drop-select'>submit</a></div></div></div>`)
                } else {
                    $el.after(`<div class='drop-container'><div class='drop-header'>${$el.val()}</div> <div class='drop-body' drop-render='hide'><ul></ul></div></div>`)
                }
                $select_options = $($el).children('option')
                $drop2_body = $jq.next(`.drop-container`).find(`.drop-body`)
                $drop2_list_body = $($el).next(`.drop-container`).find(`.drop-body ul`)
                $drop2_head = $el.next(`.drop-container`).find(`.drop-header`)
                methods.updateList();
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
                $($el).next(`.drop-container`).find(`.drop-body ul li[data-drop2-id='${selected_data}']`).prop('drop-selected', true);

            },
            updateList: function () {
                $drop2_list_body.html(' ');
                $select_options.each(function (index) {
                    $(this).attr("data-drop2-id", `${index}`);
                    if ($(this).is(':selected')) {
                        $drop2_list_body.append(`<li data-drop2-id='${index}' data-key='${$(this).val()}' class='' drop-selected='true'>${$(this).text()}</li>`)
                    } else {
                        $drop2_list_body.append(`<li data-drop2-id='${index}' data-key='${$(this).val()}' drop-selected='false'>${$(this).text()}</li>`)
                    }

                });
                clickOption();
            },
            show: function () {
                $drop2_body.attr('drop-render', 'show')
                if($drop2_body.attr('drop-render','show')){
                   var x = 0;
                   
                    $(document).keydown(function (event) {
                        if (event.keyCode === 40 && $drop2_list.length > x) {
                       console.log(x)
                        $($el).next(`.drop-container`).find(`li[data-drop2-id="${x}"]`).addClass(`drop-hover`);
                        $($el).next(`.drop-container`).find(`li[data-drop2-id="${x}"]`).siblings(`.drop-hover`).removeClass(`drop-hover`);
                        if(x > 6){
                           
                            $drop2_list_body.scrollTop(y);
                        }
                        x = x+1;

                        }
                    if (event.keyCode === 38) {
                       if($drop2_list_body.find(".drop-hover").attr('data-drop2-id')!= undefined){
                          x = $drop2_list_body.find(".drop-hover").attr('data-drop2-id') ;
                          $($el).next(`.drop-container`).find(`li[data-drop2-id="${x-1}"]`).addClass(`drop-hover`);
                          $($el).next(`.drop-container`).find(`li[data-drop2-id="${x-1}"]`).siblings(`.drop-hover`).removeClass(`drop-hover`);
                       }
                        
                        
                    }
                    })

                   }
            },

            hide: function () {
                $drop2_body.attr('drop-render', 'hide')
            },

            selected: function () {
            }

            // Add more methods as needed...
        };
        function listSelected(target, condition) {
            if (isMultiple) {
                if (condition === 'true') {
                    target.attr('drop-selected', 'false');
                }
                else {
                    target.attr('drop-selected', 'true');
                }
            }
            else {
                $el.next().find('[data-drop2-id]').attr('drop-selected', 'false');
                target.attr('drop-selected', 'true');
            }

        }
        function removeStringFromArray(key, array) {
            let removeString = jQuery.grep(array, function (value) {
                console.log(value)
                return value != key;
            });
            return removeString;
        }
        function addStringToArray(key, array) {
            let arrayList = array;
            let addString = arrayList.push(key);
            return arrayList;
        }
        function clickOption() {
            $jq.next().find('[data-drop2-id]').on('click', function () {
                let currentListSelected = $(this).attr('drop-selected');
                listSelected($(this), currentListSelected)
                if (currentListSelected === 'true') {
                    if (isMultiple) {
                        let aa = removeStringFromArray($(this).attr('data-key'), $jq.val());
                        $jq.val(aa).change();
                    }
                }
                else {
                    if (isMultiple) {
                        let bb = addStringToArray($(this).attr('data-key'), $jq.val());
                        $jq.val(bb).change();
                    }
                    else {
                        $jq.val($(this).attr('data-key')).change();
                    }
                }
                methods.selected();
            })
         
        }

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