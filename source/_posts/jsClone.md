---
layout: '[layout]'
title: JavaScript 深克隆浅析 & 实现一个简单的深克隆
date: 2018-07-14 11:24:38 
categories: 学习记录
comments: true
background: /images/page/jsClone/clone.jpg
---

### 前言
项目中我们时常会需要对一个参数进行拷贝，应用在多个场景中，最简单的方法当然就是直接“=”进行赋值操作，但我们都知道 javascript 中有原始类型（string，number，boolean）、合成类型（object）和特殊类型 （null，undefined）。原始类型和特殊类型直接赋值没有问题，对于合成类型来说，它保存的是电脑里内存的一段地址，赋值操作只是把引用地址再拷贝了一份，所以对于以下代码来说引用的其实是一个对象。
```js
let obj1 = {
    a:1,
    b:2
};

let obj2 = obj1;

obj2.a = 2;

console.log(obj2.a); //2
console.log(obj1.a); //2
```
### 实现
根据以上的代码，可能我们很快就会想到：“既然这样，我直接用循环遍历不就可以解决这个问题”。
```js
const obj1 = {
    a:1,
    b:2
};

function objClone(obj) {
    let newObj = {};
    for(let k in obj){
        newObj[k] = obj[k];
    }
    return newObj;
}

const obj2 = objClone(obj1);

obj2.a = 2;

console.log(obj2.a); //2
console.log(obj1.a); //2
```
这样确实可以上面的代码的问题，但是对于复杂嵌套简单的循环遍历并不能解决这个问题。所以还需要完善一下
```js
const obj1 = {
    a: 1,
    b: {
        a: {a: 1, b: 2},
        b: [1, 2, 3]
    }
};

function objClone(fromObj, newObj) {
    newObj = newObj || {};
    for (let k in fromObj) {
        let item = fromObj[k];
        if (typeof item === 'object') {
            newObj[k] = item instanceof Array ? [] : {};
            objClone(item, newObj[k]);
        } else {
            newObj[k] = item;
        }
    }
    return newObj;
}

const obj2 = objClone(obj1);

obj2.b.a.a = 2;

console.log(obj2.b.a.a); //2
console.log(obj1.b.a.a); //1
```
看起来还不错，基本我们要的都能实现了，但还有一点问题就是当Value值为 Function 和 RegExp 时，并不能拷贝一份全新的对象，让我们继续实现对这两种的实现。
```js
// plan A
function funClone(fun) {
    if(typeof fun === 'function'){
        return new Function('return ' + fun.toString())();
    }
}

// plan B
function funClone(fun) {
    let temp = function temporary() { return fun.apply(fun, arguments); };
    for(let key in fun) {
        if (fun.hasOwnProperty(key)) {
            temp[key] = fun[key];
        }
    }
    return temp;
}
```
这两个方法是我从网上找到的， plan b 会比plan  a更好（猜测是因为a会丢失构造函数的属性，如果我说的不对请指正）。
```js
// Date
function dateClone(date) { 
    return new Date(date.valueOf()); 
}

// regExp
function regExpClone(reg) {
    let pattern = reg.valueOf();
    let flags = '';
    flags += pattern.global ? 'g' : '';
    flags += pattern.ignoreCase ? 'i' : '';
    flags += pattern.multiline ? 'm' : '';
    return new RegExp(pattern.source, flags);
}
```
regExp 和 date 就比较简单了，直接取值再新建就行。
现在我们基本所需的类型都有了，接下来拼装就行了，完整代码：
```js
const {funClone} = require('./4.fun');
const {dateClone,regExpClone} = require('./5.regAndDate');

const obj1 = {
    a: 1,
    b: {
        a: {a: 1, b: 2},
        b: [1, 2, 3]
    },
    c: /45/ig,
    d: new Date()
};

function objClone(fromObj, newObj) {
    newObj = newObj || {};
    for (let k in fromObj) {
        let item = fromObj[k];
        //防止无线循环
        if(item === newObj[k]){
            continue;
        }
        //typeof null = "object"
        if (typeof item === 'object' &&　item) {
            if(item instanceof Array){
                newObj[k] = [];
                objClone(item, newObj[k]);
            }else if(item instanceof Date){
                newObj[k] = dateClone(Date);
            }else if(item instanceof RegExp){
                newObj[k] = regExpClone(Date);
            }
            newObj[k] = {};
            objClone(item, newObj[k]);
        }else if(typeof item === 'function' &&　item){
            newObj[k] = funClone(item);
        }else {
            newObj[k] = item;
        }
    }
    return newObj;
}

const obj2 = objClone(obj1);

obj2.b.a.a = 2;

console.log(obj2.b.a.a); //2
console.log(obj1.b.a.a); //1
```

### 第三方库
接下来让我们看看其他第三方库是怎么做深克隆的
#### jquery extend
```js
jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};
```
#### lodash cloneDeep
```js
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });

    return result;
  }

  if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });

    return result;
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}
```

### 总结
可以看到第三方库都是采用递归进行层层拷贝，其中 lodash  还支持 ES6 Symbol 和 Map 的拷贝非常完善。深克隆其实是js中比较头疼的问题，涉及到各种类型的不同存储读取方式。还有一种方式是通过 `JSON.parse(JSON.stringify({}));` 拷贝对象，这种方式无法实现regExp 、Date 以及构造函数的拷贝，所以并不推荐使用，项目中更推荐使用 lodash 进行深克隆。 
