(function ($) {

    // Plugin definition.
    $.fn.select2 = function (options) {
        var $jq = this;
        // Iterate and reformat each matched element.
        var conditions = $.extend({
            hide: function (component) {
            },
            show: function (component) {
                component.find('.select2-body').show();
            },
            toggle: function (component) {
                
                component.find(`.select2-header`).on('click',function(){
                    component.children(`.select2-body`).toggle();
                })
            },
            dataType: "",
            dataSearch: function($element){
                console.log($element)
                var search_filed = $element.find(`input[name="search"]`)
                
                var list_elements = $element.find(`.select-options`)
               
                $(search_filed).on('input', function() {
                    var searchTerm = $(this).val().toLowerCase(); // Get the search term and convert it to lowercase
                
                    // Filter the list items based on the search term
                    $(list_elements).each(function() {
                      var text = $(this).text().toLowerCase(); // Get the text content of each list item and convert it to lowercase
                      if (text.indexOf(searchTerm) === -1) { // If the search term is not found in the text
                        $(this).hide(); // Hide the list item
                      } else {
                        $(this).show(); // Show the list item
                      }
                    });
                  });
            },
            renderData: function ($element) {
                $element.find(`.placeholder-icon`).html(`<i class="fa-solid fa-magnifying-glass"></i>`);
                var inputType = conditions.dataType;
                var body_content = $element.find('.select2-body');
                obj = { one: 'Apple', two: 'American', three: 'Orange', four: 'Banana', five: 'Strawberry', six: 'Grape', seven: 'multinational', eight: 'computer', nine: 'software', ten: 'quantum' };
                $.each(obj, function (key, value) {
                    if (inputType == 'checkbox') {
                        typeofInputs('checkbox',key,value)
                    }else if(inputType == 'radio'){
                        typeofInputs('radio',key,value)
                    }
                });
                function typeofInputs(type,key,value){
                    body_content.append(`<div class='select-options'>
                    <label class='w-full' for="select-check${key}">
                    <input type="${type}" id="select-check${key}"  name="customDropdown">
                    ${value}</label>
                  </div>`);
                }
                if(body_content.children(`.select-options`).length >= 5){
                    body_content.prepend(`<input type="text" class='border mb-2 px-2'  name="search">`)
                }
            },
            placeholderIcons: '<i class="fa-solid fa-magnifying-glass"></i>'
        }, options);
        
    
         var output ={
             'init': function(){
                $jq.each(function () {
                    var $el = $(this);
                    conditions.toggle($el)
                    conditions.renderData($el)
                    conditions.dataSearch($el)
                })
             },
             'get':function(){
                $jq.each(function () {
                var $el = $(this).find(`input[name="customDropdown"]:checked`).serialize()
                console.log($el)
                })
             }
         }

         output.init();
         return output;

    };


})(jQuery);