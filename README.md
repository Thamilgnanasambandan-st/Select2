# Drop2 Features

- single select dropdown
- Multi-select dropdown
- search dropdown list
- arrows keys support
- limit the number of items displayed in a dropdown
- custom sort
- Listed items in separate boxes
- Custom header and Placeholder and icons 
- Select all and Clear all options 
- Action Buttons like Submit and Cancel
- Custom themes
- Badges like count


## Example

Demo : <a href='https://drop2.netlify.app/'>https://drop2.netlify.app/</a>

## Installation

https://github.com/Thamilgnanasambandan-st/Select2

## Initilization 

$('#demo').drop2()

## Options

#### Badge

Show selected options count

**type**: `boolean`  
**default**: `false`  

Example:
Example:  
```js
$('#demo').drop2({
    countBadge: true
});
```

#### Selected Drawer

Show Selected options separately 

**type**: `boolean`  
**default**: `false`  

Example:  
```js
$('#demo').drop2({
    selectedDrawer: true
});
```

#### Custom Header 

We can define custom headers with icons but its not placeholder 

**type**: `boolean`  
**default**: `false`  

Example:  
```js
$('#demo').drop2({
    customeheader :' <i class="fa-solid fa-download"></i> Select User',
});
```

#### Options show

This is define number of items shows in drawer 

**type**: `Number`  
**default**: `5`  

Example:  
```js
$('#demo').drop2({
    customeheader :' <i class="fa-solid fa-download"></i> Select User',
});
```

## Events 

#### `open`

triggers when drop2 is open 

Example:  
```js
$(document).on('drop2-select-show', '#demo, function(){
   console.log('trigerrred - S');
});
```

#### `hide`

triggers when drop2 is close

Example:  
```js
$(document).on('drop2-select-hide', '#demo, function(){
   console.log('trigerrred - H');
});
```


#### `Submit` 

triggers when drop2 multiple options submitted 

Example:  
```js
$(document).on('drop2-select-submitted', '#demo', function(){
   console.log('trigerrred - H');
});
```


