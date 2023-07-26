(function ($) {

    // Plugin definition.
    $.fn.drop2 = function (options) {
        var $jq = this,
            isMultiple = $jq.attr('multiple');
        var $el, $select_options, $drop2_container, $drop2_head, $drop2_body, $drop2_list_body, $drop2_list = '';
        let selected = [];
        let x = 0;
        var settings = $.extend({

        }, options);


        var methods = {
            init: function () {
                $el = $jq
                $el.addClass(`drop2-select`)
                if ($el.attr('multiple') == 'multiple') {
                    $el.after(`<div class='drop-container multiselect-drop'><div class='drop-header'>Select Options</div> <div class='drop-body' drop-render='hide'><ul></ul><div class='drop-action-btn'><a class='drop-cancel'>Cancel</a><a class='drop-select'>submit</a></div></div>`)
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
                            methods.show();

                        }, 000);

                    } else {
                        methods.hide()
                    }
                })
                $drop2_list = $($el).next(`.drop-container`).find(`.drop-body ul li`)
                var selected_data = $($el).children("option:selected").attr('data-drop2-id')
                $($el).next(`.drop-container`).find(`.drop-body ul li[data-drop2-id='${selected_data}']`).prop('drop-selected', true);

                keyEvents()
                // Close dropdown while click outside
                $(document).on("click", function (event) {
                    var $trigger = $jq.next()
                    if ($trigger !== event.target && !$trigger.has(event.target).length) {
                        methods.hide()
                    }
                })


            },
            updateList: function () {
                $drop2_list_body.html(' ');
                $select_options.each(function (index) {
                    $(this).attr("data-drop2-id", `${index}`);
                    if ($(this).is(':selected')) {
                        $drop2_list_body.append(`<li data-drop2-id='${index}' data-key='${$(this).val()}'  drop-selected='true'>${$(this).text()}</li>`)
                    } else {
                        $drop2_list_body.append(`<li data-drop2-id='${index}' data-key='${$(this).val()}' drop-selected='false'>${$(this).text()}</li>`)
                    }

                });

                $jq.next().find('[data-drop2-id]').on('click', function () {
                    clickOption($(this));
                })
            },
            show: function () {
                $drop2_body.attr('drop-render', 'show');
                $drop2_list_body.scrollTop(0);
                $drop2_list_body.find(`.drop-hover`).removeClass('drop-hover');
                x = 0;
            },

            hide: function () {

                $drop2_body.attr('drop-render', 'hide')
            },

            selected: function () {
            }

            // Add more methods as needed...
        };

        function keyEvents() {

            $drop2_body.find(`.drop-cancel`).on('click', function () {
                methods.hide();
            })

            $(document).on("keydown", function (event) {
                if ($drop2_body.attr('drop-render') == 'show') {
                    if (event.keyCode === 40 && $drop2_list.length > x) {
                        $($el).next(`.drop-container`).find(`li[data-drop2-id="${x}"]`).addClass(`drop-hover`);
                        $($el).next(`.drop-container`).find(`li[data-drop2-id="${x}"]`).siblings(`.drop-hover`).removeClass(`drop-hover`);
                        if (x > 5) {
                            $drop2_list_body.scrollTop(35 * (x - 5));
                        }
                        if (x == $drop2_list.length) {
                            x = $drop2_list.length
                        }
                        x = x + 1;
                    }
                    if (event.keyCode === 38) {
                        if ($drop2_list_body.find(".drop-hover").attr('data-drop2-id') != undefined) {
                            x = Number($drop2_list_body.find(".drop-hover").attr('data-drop2-id'));
                            if (x >= 0) {
                                x = x - 1;
                                $($el).next(`.drop-container`).find(`li[data-drop2-id="${x}"]`).addClass(`drop-hover`);
                                $($el).next(`.drop-container`).find(`li[data-drop2-id="${x}"]`).siblings(`.drop-hover`).removeClass(`drop-hover`);
                                $drop2_list_body.scrollTop(34 * (x - 5));
                            }
                        }


                    } if (event.keyCode === 13 && $drop2_list.length >= x) {
                        var target = $drop2_list_body.find(".drop-hover")
                        clickOption(target)
                    }

                }
            })


        }

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
        // function removeStringFromArray(key, array) {
        //     let removeString = jQuery.grep(array, function (value) {
        //         return value != key;
        //     });
        //     return removeString;
        // }
        // function addStringToArray(key, array) {
        //     let arrayList = array;
        //      arrayList.push(key);
        //     return arrayList;
        // }
        function clickOption(target) {
            let currentListSelected = target.attr('drop-selected');
            listSelected(target, currentListSelected)
            if (currentListSelected === 'true') {
                if (isMultiple) {
                    // let aa = removeStringFromArray(target.attr('data-key'), $jq.val());
                    // $jq.val(aa).change();
                    selected = selected.filter(num => num != target.attr('data-key'));
                }
            }
            else {
                if (isMultiple) {
                    // let bb = addStringToArray(target.attr('data-key'), $jq.val());
                    // $jq.val(bb).change();
                    selected.push(target.attr('data-key'))
                    selected = [...new Set(selected.concat($jq.val()))]

                }
                else {
                    $jq.val(target.attr('data-key')).change();
                    $drop2_head.text(target.text())
                    methods.hide()

                }
            }
            if (isMultiple) {
                $drop2_body.find(`.drop-select`).on('click', function () {
                    //  selected = selected.concat($jq.val())
                    $jq.val(selected).change();
                    methods.hide()

                })
                $drop2_body.find(`.drop-cancel`).on('click', function () {
                    let difference = selected.filter(x => !$jq.val().includes(x));
                    difference.forEach(num => {
                        var a = $drop2_list_body.find(`[data-key=${num}]`).attr('drop-selected')
                        $drop2_list_body.find(`[data-key=${num}]`).attr('drop-selected', !a)
                    });
                    selected = $jq.val()
                    selected.forEach(num => $drop2_list_body.find(`[data-key=${num}]`).attr('drop-selected', 'true'))
                    methods.hide()

                })
            }

            methods.selected();

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