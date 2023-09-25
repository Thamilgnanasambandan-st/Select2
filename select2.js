(function ($) {

    // Plugin definition.
    $.fn.drop2 = function (options) {
        var $jq = this,
            isMultiple = $jq.attr('multiple');
        var $el, $select_options, $drop2_container, $drop2_head, $drop2_body, $drop2_list_body, $drop2_list, $drop2_search = '';
        let selected = [];
        var settings = $.extend({
            options: 5,
            searchMin: 5

        }, options);


        var methods = {
            init: function () {
                $el = $jq
                $el.addClass(`drop2-select`)

                // Create drop conatiner and header
                if ($el.attr('multiple') == 'multiple') {
                    $el.after(`<div class='drop-container multiselect-drop'><div class='drop-header'>Select Options</div> <div class='drop-body' drop-render='hide'><ul></ul><div class='drop-action-btn'><a class='drop-cancel'>Cancel</a><a class='drop-select'>submit</a></div></div>`)

                } else {
                    $el.after(`<div class='drop-container'><div class='drop-header'>${$el.val()}</div> <div class='drop-body' drop-render='hide'><ul></ul></div></div>`)
                }

                // assign variables and names
                $select_options = $($el).children('option')
                $drop2_body = $jq.next(`.drop-container`).find(`.drop-body`)
                $drop2_list_body = $($el).next(`.drop-container`).find(`.drop-body ul`)
                $drop2_head = $jq.next(`.drop-container`).find(`.drop-header`)
             
                //Crate drop list 
                methods.updateList();

                searchOptions($drop2_body);

                $drop2_search = $jq.next(`.drop-container`).find('input[data-search]');


                //Open drop while click header
                $drop2_head.on('click', function () {
                    if ($drop2_body.attr("drop-render") == 'hide') {
                        setTimeout(function () {
                            methods.show();

                        }, 000);

                    } else {
                        methods.hide()
                    }
                })


                var selected_data = $($el).children("option:selected").attr('data-drop2-id')
                $($el).next(`.drop-container`).find(`.drop-body ul li[data-drop2-id='${selected_data}']`).prop('drop-selected', true);

                // Create events and functionality 
                keyEvents()

                // Close dropdown while click outside
                $(document).on("click", function (event) {
                    var $trigger = $jq.next()
                    if ($trigger !== event.target && !$trigger.has(event.target).length) {
                        methods.hide()
                    }
                })

            },

            //Crate drop list 
            updateList: function () {
                
                $drop2_list_body.html(' ');
                $drop2_list_body.css('opacity', 0);
                if ($select_options.length >= settings.searchMin) {
                    $drop2_body.prepend('<div><input type="text" placeholder="Search" data-search=""></div> ')
                }
                //To declare the search element start
                $drop2_search = $drop2_body.find('[data-search]');
                //To declare the search element end
                $select_options.each(function (index) {
                    $(this).attr("data-drop2-id", `${index}`);
                       
                    if ($(this).is(':selected')) {
                        $drop2_list_body.append(`<li data-drop2-id='${index}' data-key='${$(this).val()}'  drop-selected='true'>${$(this).text()}</li>`);

                    } else {
                        $drop2_list_body.append(`<li data-drop2-id='${index}' data-key='${$(this).val()}' drop-selected='false'>${$(this).text()}</li>`)
                    }
                });
                // Select option default selected 
                $drop2_list = $($el).next(`.drop-container`).find(`.drop-body ul li`)
                createIndex('sample');

                $jq.next().find('[data-drop2-id]').on('click', function () {
                    clickOption($(this));
                })

                displayMultiple($select_options)

            },


            // Show methods
            show: function () {
                $drop2_body.attr('drop-render', 'show');
                $drop2_body.find('input[data-search]').focus();
                $drop2_list_body.scrollTop(0);
                createIndex()
                dropdownHeight($drop2_list_body)
            },
            // Hide methods
            hide: function () {
                $drop2_body.attr('drop-render', 'hide');
            },

            // Add more methods as needed...
        };
        function createIndex(data) {
            let count = 0;

            $drop2_list = $($el).next(`.drop-container`).find(`.drop-body ul li`)

            $drop2_list.attr('data-drop2-id', '')
            $drop2_list.removeClass('drop-hover');
            $drop2_list.each(function (index) {
                if (!$(this).hasClass('hidden')) {
                    $(this).attr('data-drop2-id', count);
                    count++;
                }
            })
            $drop2_list_body.find('[data-drop2-id="0"]').addClass('drop-hover')
        }
        function dropdownHeight(targetList) {
            let c = 0;
            let he = 0;

            targetList.find('li').each(function () {
                c++;
                if (c <= settings.options) {
                    he = he + $(this).outerHeight();
                }
                else if (c === (settings.options + 1)) {
                    he = he + ($(this).outerHeight() / 2);
                }
            })

            targetList.css({
                'max-height': he + 'px',
                'opacity': 1,
            });

        }

        function searchOptions(target) {
            target.find('[data-search]').on('keyup', function (event) {
                var searchTerm = $(this).val().toLowerCase();
                target.find(`ul li`).each(function () {
                    var text = $(this).text().toLowerCase();
                    // Get the text content of each list item and convert it to lowercase
                    if (text.indexOf(searchTerm) === -1) {
                        // If the search term is not found in the text
                        $(this).addClass('hidden');
                        $(this).hide();// Hide the list item
                    } else {
                        $(this).removeClass('hidden');
                        // Show the list item
                        $(this).show();
                    }
                });
                if (!((event.keyCode === 40) || (event.keyCode === 38 || event.keyCode === 13))) {
                    createIndex('search');
                }
            });

        }



        function displayMultiple($select_options) {
            if (isMultiple && $select_options.is(':selected')) {
                $drop2_head.text('');
                $select_options.each(function (index) {
                    if ($(this).is(':selected')) {
                        selected.push($(this).val())
                        selected = [...new Set(selected)]
                        $drop2_head.append(`<span class='drop2-choice' data-key="${$(this).val()}">${$(this).text()}<span class='clear-choice' onclick="event.stopPropagation()">×</span></span>`)
                        dispalyValues()
                    }
                })
            } else if (isMultiple) {
                $drop2_head.text('Select Options');
            }
        }

        function keyEvents() {
            $drop2_body.find(`.drop-cancel`).on('click', function () {
                methods.hide();
            })

            $(document).on("keydown", function (event) {
                let currentIndex = $drop2_list_body.find('.drop-hover').attr('data-drop2-id');
                if ($drop2_body.attr('drop-render') == 'show') {
                    if ((event.keyCode === 40) && (($drop2_list_body.find('li:not(.hidden)').length) - 1) > currentIndex) { //Downarrow
                        $drop2_list_body.find(`li[data-drop2-id="${currentIndex}"]`).removeClass('drop-hover');
                        $drop2_list_body.scrollTop(34 * (currentIndex - (settings.options - 1)));
                        currentIndex++;
                        console.log(currentIndex)
                        $drop2_list_body.scrollTop(34 * (currentIndex - (settings.options - 1)));
                        $drop2_list_body.find(`li[data-drop2-id="${currentIndex}"]`).addClass('drop-hover');
                    }
                    else if ((event.keyCode === 38) && (currentIndex > 0)) { //Uparrow
                        $drop2_list_body.find(`li[data-drop2-id="${currentIndex}"]`).removeClass('drop-hover');
                        currentIndex--;
                        $drop2_list_body.scrollTop(34 * (currentIndex - (settings.options - 1)));
                        $drop2_list_body.find(`li[data-drop2-id="${currentIndex}"]`).addClass('drop-hover');
                    } else
                        if (event.keyCode === 13) {
                            var target = $drop2_list_body.find(".drop-hover")
                            clickOption(target)
                        }
                }
            })

            if(isMultiple){
                $drop2_body.find(`.drop-select`).on('click', function () {
                    $jq.val(selected).change();
                    displayMultiple($select_options)
                    methods.hide();
                    $el.trigger('drop2-select-submitted');
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

        }


        function dispalyValues() {
            if (isMultiple) {
            

                $drop2_head.find('.clear-choice').each(function () {
                    $(this).on('click', $(this).closest('.drop-header'), function () {
                        console.log($(this))
                        var choice_value = $(this).parent().attr('data-key')
                        selected = selected.filter(num => num != choice_value);
                        $jq.val(selected).change();
                        displayMultiple($select_options);
                        $drop2_list_body.find(`[data-key=${choice_value}]`).attr('drop-selected', 'false')
                    })
                })
            }
        }

        function listSelected(target, condition) {
            isMultiple ? '' : $el.next().find('[data-drop2-id]').attr('drop-selected', 'false');
            if (isMultiple && (condition === 'true')) {
                target.attr('drop-selected', 'false');
            }
            else {
                target.attr('drop-selected', 'true');
            }
        }

        function clickOption(target) {
            let currentListSelected = target.attr('drop-selected');
            listSelected(target, currentListSelected)
            if (currentListSelected === 'true') {
                if (isMultiple) {
                    selected = selected.filter(num => num != target.attr('data-key'));
                }
            }
            else {
                if (isMultiple) {
                    selected.push(target.attr('data-key'))
                    selected = [...new Set(selected.concat($jq.val()))]

                }
                else {
                    $jq.val(target.attr('data-key')).change();
                    $drop2_head.text(target.text())
                    methods.hide()

                }
            }
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