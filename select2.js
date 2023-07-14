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
            renderData: function ($element) {
                $element.find(`.placeholder-icon`).html(`<i class="fa-solid fa-magnifying-glass"></i>`)
                var inputType = conditions.dataType;
                var body_content = $element.find('.select2-body');
                obj = { one: 1, two: 2, three: 3, four: 4, five: 5 };
                $.each(obj, function (key, value) {
                    if (inputType == 'checkbox') {
                        typeofInputs('checkbox',key,value)
                    }else if(inputType == 'radio'){
                        typeofInputs('radio',key,value)
                    }
                });
                function typeofInputs(type,key,value){
                    body_content.append(`<div>
                    <label class='w-full' for="select-check${key}">
                    <input type="${type}" id="select-check${key}" name="customDropdown">
                    ${value}</label>
                  </div>`);
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