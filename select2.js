(function ($) {
    // Plugin definition.
    $.fn.drop2 = function (options) {
        var $jq = this,
            isMultiple = $jq.attr('multiple');
        var $el, $select_options, $drop2_container, $drop2_head, $drop2_body, $drop2_list_body, $drop2_list, $drop2_search = '';
        let selected = [];
        var settings = $.extend({
            options: 5,
            searchMin: 5,
            showSelectedBadge: true,
            customeheader: false,
            countBadge: false,
        }, options);
        var methods = {
            init: function () {
                $el = $jq
                $el.addClass(`drop2-select`)
                // Create drop conatiner and header
                var x = settings.customeheader ? "<a class='drop-clear'>Clear</a>" : '';
                $el.after(`<div class='drop-container ${$el.attr('multiple') ? 'multiselect-drop' : ''} '><div class='drop-header ${settings.customeheader ? 'drop-custom-header' : ''}'>${settings.customeheader ? settings.customeheader : 'Select Options'}</div> <div class='drop-body' drop-render='hide'><div class='selected-options'></div><ul></ul>${$el.attr('multiple') ? "<div class='drop-action-btn'>" + x + "<a class='drop-cancel'>Cancel</a><a class='drop-select'>submit</a></div>" : ''}</div>`)
                component()
                //Crate drop list
                methods.updateList();
                searchOptions($drop2_body);
                //Open drop while click header
                $drop2_head.on('click', function () {
                    if ($drop2_body.attr("drop-render") == 'hide') {
                        setTimeout(function () {
                            methods.show();

                        }, 0);

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
                component()
                $drop2_list_body.html(' ');
                $drop2_list_body.css('opacity', 0);
                if ($select_options.length >= settings.searchMin && $drop2_body.find('input').length == 0) {
                    $drop2_body.prepend(`<div class='search-section'><input type="text" placeholder="Search" data-search="">${isMultiple ? '<div class="s-action"><a class="s-select-all">All</a><a class="s-clear-all">Clear</a></div>' : ''}</div> `)
                }
                //To declare the search element end
                $select_options.each(function (index) {
                    $(this).attr("data-drop2-id", `${index}`);
                    var badge_condition = $(this).attr("data-badge");
                    let htTag = badgeHtml(badge_condition);
                    let listElement = $('<li>');
                    listElement.attr({
                        'data-drop2-id': index,
                        'data-key': $(this).val(),
                        'drop-selected': $(this).is(':selected') ? true : false,
                    });
                    listElement.append(`<span>${$(this).text()}</span>`);
                    listElement.append(htTag);
                    $drop2_list_body.append(listElement)
                });
                $drop2_list_body.find('li').length ? $drop2_body.removeClass('drop-no-data') : $drop2_body.addClass('drop-no-data')
                // Select option default selected
                $drop2_list = $($el).next(`.drop-container`).find(`.drop-body ul li`)
                // createIndex('sample');
                $jq.next().find('[data-drop2-id]').on('click', function () {
                    clickOption($(this));
                })
                displayMultiple($select_options);
                if (isMultiple) {
                    badgeCount();
                }
            },
            // Show methods
            show: function () {
                $el.trigger('drop2-select-show');
                $drop2_body.attr('drop-render', 'show');
                $drop2_body.find('input[data-search]').focus();
                $drop2_list_body.scrollTop(0);
                dropdownHeight($drop2_list_body)
                var keyPressed = false;
                $(document).keydown(function (event) {
                    if (!keyPressed && event.keyCode === 40) {
                        createIndex()
                        keyPressed = true;
                    }
                })
            },
            // Hide methods
            hide: function () {
                $el.trigger('drop2-select-hide');
                $jq.next(`.drop-container`).find('input[data-search]').val('')
                $drop2_body.removeClass('drop-no-data')
                $drop2_body.find('.hidden').each(function () {
                    $(this).removeClass('hidden').show()
                })
                $drop2_body.attr('drop-render', 'hide');
            },
            // Add more methods as needed...
        };
        //Assign common variables
        function component() {
            // assign variables and names
            $select_options = $jq.children('option')
            $drop2_body = $jq.next(`.drop-container`).find(`.drop-body`)
            $drop2_list_body = $jq.next(`.drop-container`).find(`.drop-body ul`)
            $drop2_head = $jq.next(`.drop-container`).find(`.drop-header`)
            $drop2_search = $jq.next(`.drop-container`).find('input[data-search]');
        }
        //Create list options index
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
        //Limit dropdown Height
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
        //Assign Badges
        function badgeHtml(data) {
            if (data) {
                let js = JSON.parse(data);
                let parentHtml = $('<span class="listBadge">');
                js.map(function (obj) {
                    let htTag = $('<span>', { class: 'badgeChild' });
                    htTag.css({
                        'background-color': obj.badgeColor ? obj.badgeColor : '',
                        'color': obj.badgeTextColor ? obj.badgeTextColor : '',
                        'border': obj.badgeBorder ? obj.badgeBorder : ''
                    });
                    htTag.addClass(obj.badgeClass ? obj.badgeClass : 'badge');
                    htTag.text(obj.badgeContent);
                    parentHtml.append(htTag);
                })
                return parentHtml;
            }
        }
        //Filter Search Options
        function searchOptions(target) {
            searchClear()
            target.find('[data-search]').on('keyup', function (event) {
                var searchTerm = $(this).val().toLowerCase();
                target.find(`ul li`).each(function () {
                    var text = $(this).text().toLowerCase();
                    // Get the text content of each list item and convert it to lowercase
                    if (text.indexOf(searchTerm) === -1) {
                        // If the search term is not found in the text
                        $(this).addClass('hidden');
                        $(this).hide();// Hide the list item

                        if ($drop2_list.length == $drop2_body.find('li.hidden').length) {
                            $drop2_body.addClass('drop-no-data')
                            $drop2_body.find('.s-action').hide()

                        } else {
                            $drop2_body.removeClass('drop-no-data')
                            $drop2_body.find('.s-action').show()

                        }

                    } else {
                        $(this).removeClass('hidden');
                        // Show the list item
                        $(this).show();

                    }
                });
                if (!((event.keyCode === 40) || (event.keyCode === 38 || event.keyCode === 13))) {
                    createIndex('search');
                }
                if ($drop2_list.length == $drop2_body.find('li.hidden').length) {
                    $drop2_body.addClass('drop-no-data')
                } else {
                    $drop2_body.removeClass('drop-no-data')
                }
            });
        }

        function searchClear() {
            var temp = []
            $drop2_body.find(`.s-select-all`).on('click', function () {
                $drop2_list_body.find(`li[drop-selected = 'false']`).not('.hidden').each(function () {
                    $(this).attr('drop-selected', 'true');
                    temp.push($(this).attr('data-key'))
                })
                selected = selected.concat(temp)
                temp = []
            })
            $drop2_body.find(`.s-clear-all`).on('click', function () {
                $drop2_list_body.find(`li[drop-selected = 'true']`).not('.hidden').each(function () {
                    $(this).attr('drop-selected', 'false');
                    temp.push($(this).attr('data-key'))
                })
                selected = selected.filter(item => !temp.includes(item));
                temp = []

            })
        }
        //Display Selected values at Dropdown Head
        function displayMultiple($select_options) {
            if (isMultiple && $select_options.is(':selected')) {
                settings.customeheader ? '' : $jq.next(`.drop-container`).find(`.drop-header`).text('');
                settings.customeheader ? '' : $jq.next(`.drop-container`).find(`.selected-options`).text('');
                $select_options.each(function (index) {
                    if ($(this).is(':selected')) {
                        selected.push($(this).val())
                        selected = [...new Set(selected)]
                        settings.customeheader ? '' : $jq.next(`.drop-container`).find(`.drop-header`).append(`<span class="drop2-choice" data-key="${$(this).val()}">${$(this).text()}<span class="clear-choice" onclick="event.stopPropagation()">×</span></span> `);
                        settings.customeheader ? '' : $jq.next(`.drop-container`).find(`.selected-options`).append(`<span class="drop2-choice" data-key="${$(this).val()}">${$(this).text()}<span class="clear-choice" onclick="event.stopPropagation()">×</span></span> `);
                    }
                })
                settings.customeheader ? '' : $jq.next(`.drop-container`).find(`.drop-header`).append(`${selected.length > 0 ? "<span class='drop-clear'>&#x2715</span>" : ''}`);
                clearAll()
                dispalyValues();
            } else if (isMultiple) {
                $drop2_head.html(`${settings.customeheader ? settings.customeheader : 'Select Options'}`);
                $jq.next(`.drop-container`).find(`.selected-options`).text('');
                clearAll()
            } else if (!isMultiple) {
                var selected_data = $el.find(`[value=${$el.val()}]`).text();
                $drop2_head.text(selected_data)
            }
        }

        function clearAll() {
            var drop_clear = settings.customeheader ? $drop2_body : $drop2_head
            drop_clear.find('.drop-clear').on('click', function () {
                $jq.val('').change()
                selected = []
                methods.updateList()
                methods.hide()
                $el.trigger('drop2-select-clear');
            })
        }
        // All key events
        function keyEvents() {

            $(document).on("keydown", function (event) {
                let list_height = parseInt($drop2_list.css("height"), 10)
                let currentIndex = $drop2_list_body.find('.drop-hover').attr('data-drop2-id');
                if ($drop2_body.attr('drop-render') == 'show') {
                    if ((event.keyCode === 40) && (($drop2_list_body.find('li:not(.hidden)').length) - 1) > currentIndex) { //Downarrow
                        $drop2_list_body.find(`li[data-drop2-id="${currentIndex}"]`).removeClass('drop-hover');
                        $drop2_list_body.scrollTop(list_height * (currentIndex - (settings.options - 1)));
                        currentIndex++;
                        $drop2_list_body.scrollTop(list_height * (currentIndex - (settings.options - 1)));
                        $drop2_list_body.find(`li[data-drop2-id="${currentIndex}"]`).addClass('drop-hover');
                    }
                    else if ((event.keyCode === 38) && (currentIndex > 0)) { //Uparrow
                        $drop2_list_body.find(`li[data-drop2-id="${currentIndex}"]`).removeClass('drop-hover');
                        currentIndex--;
                        $drop2_list_body.scrollTop(list_height * (currentIndex - (settings.options - 2)));
                        $drop2_list_body.find(`li[data-drop2-id="${currentIndex}"]`).addClass('drop-hover');
                    } else
                        if (event.keyCode === 13) {
                            var target = $drop2_list_body.find(".drop-hover")
                            clickOption(target)
                        }
                }
            })
            if (isMultiple) {
                $drop2_body.find(`.drop-select`).on('click', function () {
                    $jq.val(selected).change();
                    settings.customeheader && isMultiple ? '' : displayMultiple($select_options);
                    methods.hide();
                    $el.trigger('drop2-select-submitted');
                    badgeCount();
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
        //Display Cleared Value
        function dispalyValues() {
            if (isMultiple) {
                $jq.next(`.drop-container`).find(`.drop-header,.selected-options`).find('.clear-choice').on('click', function () {
                    console.log($(this))
                    var choice_value = $(this).parent().attr('data-key')
                    selected = selected.filter(num => num != choice_value);
                    $jq.val(selected).change();
                    displayMultiple($select_options);
                    $drop2_list_body.find(`[data-key=${choice_value}]`).attr('drop-selected', 'false');
                    badgeCount();
                });
            }
            else {
                $drop2_head.text(selected);
            }
        }
        //Display Counts
        function badgeCount() {
            let cnt = $jq.val().length;
            $drop2_head.attr('count', $jq.val().length);
            cnt ? $drop2_head.addClass('hasValue') : $drop2_head.removeClass('hasValue')
            settings.countBadge ? $drop2_head.addClass('showCount') : $drop2_head.removeClass('showCount');
        }
        //Here add temporary selected options
        function listSelected(target, condition) {
            isMultiple ? '' : $el.next().find('[data-drop2-id]').attr('drop-selected', 'false');
            if (isMultiple && (condition === 'true')) {
                target.attr('drop-selected', 'false');
                $jq.next(`.drop-container`).find(`.selected-options`).find(`span[data-key="${$(target).attr('data-key')}"]`).remove()
            }
            else {
                target.attr('drop-selected', 'true');
                $jq.next(`.drop-container`).find(`.selected-options`).append(`<span class="drop2-choice" data-key="${$(target).attr('data-key')}">${$(target).children('span:first-child').text()}<span class="clear-choice" onclick="event.stopPropagation()">×</span></span> `);
                // dispalyValues()
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
                    $el.trigger('drop2-select-submitted');
                    $drop2_head.text(target.children('span:first-child').text())
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
