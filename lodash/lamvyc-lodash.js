

var lamvyc = function () {


    /*-----------------------------------
     *              Array
     *------------------------------------
     */

    //将ary拆分成size长度的区块，返回拆分后的二维数组

    // function fn1(...a) {
    //     return a
    // }        输出数组
    //如fn1(5,6,7)  输出[5,6,7]
    function chunk(ary, size) {
        //push每次只能传一个参数
        let res = []
        let l = ary.length
        let i = 0
        let g = l - i
        for (; i < l; i += size) {
            if (g >= size) {

                res.push(ary.slice(i, i + size))
            } else {
                res.push(ary.slice(i, l))       //.slice()输出的结果是一个数组
            }

        }
        return res
    }


    //创建一个新数组，包含原数组中所有的非假值元素。例如false, null,0, "", undefined, 和 NaN 都是被认为是“假值”。

    //'假值'的布尔值均为false
    function compact(ary) {
        let l = ary.length
        let res = []
        for (i = 0; i < l; i++) {
            if (ary[i]) {
                res.push(ary[i])
            }
        }
        return res
    }


    //创建一个具有唯一array值的数组，每个值不包含在其他给定的数组中。
    //（注：即创建一个新数组，这个数组中的值，为第一个数字（array 参数）排除了给定数组中的值。）
    //  _.concat(...arg)拆分其他数组并合并到一个新的数组,尽量写成_.concat，通用
    //  如var array = [1];
    //  var other = _.concat(array, 2, [3], [[4]]);

    // console.log(other);
    // // => [1, 2, 3, [4]]

    // console.log(array);
    // // => [1]


    //_.include()
    //可以这样_.includes([1],1)
    //也可以这样[1].includes(1)

    //排除其他元素，可以传入多个参数，但第二个及以后的参数必须是数组
    //不改变原数组
    function difference(ary, ...arg) {
        let res = []
        let mergeOther = [].concat(...arg)//拆分其他数组并合并到一个新的数组
        for (let i = 0; i < ary.length; i++) {
            if (mergeOther.includes(ary[i])) {
                continue
            } else {
                res.push(ary[i])
            }

        }
        return res

    }

    //_.differenceBy([3.1, 2.2, 1.3], [2.5],[3.9] ,Math.floor);
    //不改变原数组
    //同上，只是最后一个参数是一个迭代器，迭代器会对所有参数执行运算，然后执行difference
    /*
    _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], _.property('x'));
    _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');//本质上第三个参数传入'x'，它也是个函数
    _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], it => it.x);
    let a = [{ 'x': 2 }, { 'x': 1 }] 
    function(a){
        return a.map(it => it.x)
    }
    */
    function differenceBy(ary, ...arg) {
        //1.检查第三个参数，如果是数组直接执行difference()
        let iteratee0 = arg[arg.length - 1]//arg最后一个参数为迭代器
        if (Array.isArray(iteratee0)) {
            return _.difference(ary, ...arg)
        } else {
            iteratee0 = _.iteratee(iteratee0)
            //执行iteratee排除lodash中的一些副作用函数
            /*
            1.传 string 是直接返回 path 上的值 <=> _.property
            2.传 array 是把 path 上的值做比较 <=> _.matchesProperty
            3.传 object 是去 match 匹配看看你给的 key 和 value 都有没有，可以比你给的多，但是不能少 <=> _.matches
            4.传 function 返回这个函数
            */
        }

        let ary1 = []
        ary.forEach((n) => {
            ary1.push(iteratee0(n))
        })

        let arg2 = []
        for (let i = 0; i < arg.length - 1; i++) {
            arg[i].forEach((n) => {
                arg2.push(iteratee0(n))
            })
        }

        let res = []
        for (let i = 0; i < ary1.length; i++) {
            if (arg2.includes(ary1[i])) {
                continue
            } else {
                res.push(ary[i])
            }
        }
        return res
    }


    //var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
    //_.differenceWith(objects, [{ 'x': 1, 'y': 2 }],[{ 'x': 2, 'y': 1 }], _.isEqual);
    //同difference，最后一个参数是比较器，把与比较器相匹配的值给移除出去，
    function differenceWith(ary, ...arg) {
        let lasts = arg.pop()
        lasts = _.iteratee(lasts)
        let res = []
        let arg2 = [].concat(...arg)
        for (let i = 0; i < ary.length; i++) {
            let flag = true
            for (let item of arg2) {
                if (!lasts(ary[i], item)) {//arg2的每一项都与ary[第i项]不相等，
                    flag = false
                }
            }
            if (!flag) {
                res.push(ary[i])
            }
        }
        return res
    }
    //创建一个切片数组，去除array前面的n个元素。（n默认值为1。）
    function drop(ary, n = 1) {
        //n - 1 对应数组下标
        let l = ary.length
        if (n >= l) {
            return []
        } else {
            for (let i = 0; i < n; i++) {
                ary.shift()
            }
            return ary
        }
    }

    //创建一个切片数组，去除array尾部的n个元素。（n默认值为1。）
    function dropRight(ary, n = 1) {
        let l = ary.length
        if (n >= l) {
            return []
        } else {
            for (let i = 0; i < n; i++) {
                ary.pop()
            }
            return ary
        }
    }

    //从后向前测，删除通过的元素直至第一个没通过的元素出现
    function dropRightWhile(ary, predicate = identity) {
        predicate = iteratee(predicate)
        for (var i = ary.length - 1; i >= 0; i--) {
            if (!predicate(ary[i], i, ary)) {
                break
            }
        }
        return ary.slice(0, i + 1)
    }

    //前面通过测验的略过，从第一个没有通过测验的开始拿
    function dropWhile(ary, predicate = identity) {
        predicate = iteratee(predicate)
        for (var i = 0; i < ary.length; i++) {
            if (!predicate(ary[i], i, ary)) {
                break
            }
        }
        return ary.slice(i) // i [0,length]
    }
    //减少一级array嵌套深度。
    //_.flatten([1, [2, [3, [4]], 5]]);
    // => [1, 2, [3, [4]], 5]
    //concat(array,value)均拆开最外层[]然后放入到一个空数组中XXX 
    //concat第二个及以后的参数均只拆开最外层放入到要连接的数组中
    //concat创建一个新数组，将array与任何数组 或 值连接在一起。
    //concat连接方式，每个参数都只展开最外一层[],放进创建的新数组中
    function flatten(ary) {
        let res = _.concat([], ...ary)
        return res
    }


    /*var a = [1,2,3];
    console.log(typeof a);  //返回“object”
    console.log(Array.isArray(a));  //true */
    //在上面代码中，typeof 运算符只能显示数组的类型是 Object，而 Array.isArray() 方法可以直接返回布尔值。在条件表达式中，使用该方法非常实用。
    function flattenDeep(array) {
        let res = []
        array.forEach(item => {
            if (Array.isArray(item)) {
                res.push(...flattenDeep(item))
            } else {
                res.push(item)
            }
        })
        return res
    }

    //_.flattenDepth(array, [depth=1])
    //[depth=1] (number):最多减少的嵌套层级数。不改变原数组
    //减少array数组内部的嵌套层级,想减少几层就减少几层，如果depth大于数组的嵌套层级数，相当于flattenDeep完全展平
    function flattenDepth(array, depth = 1) {
        if (depth == 0) {
            return array.slice()
        }
        let result = []
        array.forEach(item => {
            if (Array.isArray(item)) {
                result.push(...flattenDepth(item, depth - 1))
            } else {
                result.push(item)
            }
        })
        return result
    }

    //join功能：1.将传入的数组转换成字符串；2.展开数组，对数组中的数组统统展开；3.第二个参数作为连接符，连接数组中的每一项
    function join(ary, separator = ',') {
        let res = ary[0].toString()
        separator = separator.toString()
        for (let i = 1; i < ary.length; i++) {
            res = res + separator + ary[i]
        }
        return res

    }

    //pause
    // function join(ary,separator = ','){
    //     separator = separator.toString()
    //     for(let i = 0;i < ary.length;i++){
    //         if(ary(i) instanceof Array){
    //             join(ary[i],separator = ',')
    //         }else{
    //             res = res + separator + ary[i]
    //         }
    //     }
    //     return res
    // }


    //改变原数组，颠倒原数组顺序
    function reverse(ary) {//利用双指针
        let left = 0
        let right = ary.length - 1
        let temp
        while (left < right) {
            temp = ary[left]
            ary[left] = ary[right]
            ary[right] = temp
            left++
            right--
        }
        return ary
    }

    //size获取对象、字符串、数组的长度
    function size(p) {
        return p.length === undefined ? Object.keys(p).length : p.length
    }

    // function size(collection) {
    //     if (Array.isArray(collection) || typeof collection == 'string') {
    //         return collection.length
    //     } else {
    //         let i = 0
    //         for(let key in collection){
    //             i++
    //        }
    //         return i 
    //     }
    // }


    //array.forEach(callback[, thisArg])；callback(currentValue, index, arr)，currentValue必选
    //没有返回值，只针对每个元素调用func；无法使用break，return等终止循环
    function forEach(obj, f) {
        //限制循环条件参数为 数组/对象/字符串 
        if (obj instanceof Object || typeof (obj) == 'string') {
            for (let i in obj) {
                f(obj[i], i)
            }
        }
        //函数返回值为原参数
        return obj
    }

    // Array.prototype.FforEach = function (fn , thisArg) { //thisArg 为设置的forEach循环过后的返回值，如果没有确定 默认为undefined
    //     if(typeof fn !== 'function'){
    //         throw new Error(`${fn} is not a function`);
    //     };
    //     if(!Array.isArray(this)){
    //         throw new Error(`${this} is not a Array`);
    //     };
    //     let arr = this;
    //     for(let i = 0 ; i < arr.length; i++) {
    //         fn.call(thisArg , arr[i] , i ,arr )
    //     }
    // }
    //--------------String---------------


    //返回数组的第一个元素，不会改变原数组
    function head(ary) {
        if (ary) {
            return ary[0]
        } else {
            return []
        }
    }

    //_.pull(array, [values]);改变原数组,移除数组中包含values的值
    //  [1,3,5,7] =>  
    function pull(ary, ...arg) {//arg可代表多个参数进行遍历
        for (let i = 0; i < ary.length; i++) {
            if (arg.includes(ary[i])) {
                ary.splice(i, 1)
                i--//删除了才需要i--,删除会改变原下标值
            }
        }
        return ary
    }

    //_.without(array, [values]);不改变原数组，移除数组中包含values的值
    function without(ary, ...arg) {
        let res = []
        ary.forEach(n => {//forEach参数为一个callback函数
            if (!arg.includes(n)) {
                res.push(n)
            }
        })
        return res
    }

    //arr.fill(value[, start[, end]])
    //value 用来填充数组元素的值。
    //start(可选) 起始索引，默认值为0。
    //end(可选) 终止索引，默认值为 this.length。
    function fill(ary, val, start = 0, end = ary.length) {
        for (let i = start; i < end; i++) {
            ary[i] = val
        }
        return ary
    }

    //去除数组中最后一个元素
    function initial(ary) {
        if (ary.length < 2) {
            return []
        } else {
            ary.pop()
            return ary
        }
    }

    //_.concat(array, [values])
    //创建一个新数组，将array与任何数组 或 值连接在一起。
    //连接方式，每个参数都只展开最外一层[],放进创建的新数组中
    function concat(ary, ...arg) {
        let res = ary
        arg.forEach((n) => {//利用forEach遍历剩余参数
            if (typeof n === 'object') {//判断剩余参数的数据类型
                res.push(...n)
            } else {
                res.push(n)
            }
        })
        return res
    }

    //返回传入的第一个参数
    function identity(val) {
        return val
    }

    //返回值为函数，
    /*
    var users = [
     { 'user': 'barney' },
     { 'user': 'fred' }
    ];

    _.map(users,it => it.user) === _.map(users,_.property('user')) 
    返回值  ['barney', 'fred']
    
    var objects = [
    { 'a': { 'b': { 'c': 2 } } },
    { 'a': { 'b': { 'c': 1 } } }
    ];

    _.map(objects,it => it.a.b.c) === _.map(objects,_.property('a.b.c'))
    返回值[2,1]
    */
    function property(prop) { // 传入一个属性名，返回一个函数, 得到指定属性值的路径函数
        return function (obj) {
            return obj[prop] // 获取obj对象的属性值
        }
    }

    // function property(prop) {
    //     return function(obj) {
    //         return get(obj, prop) //调用get函数获取深层次属性
    //     }
    // }

    //_.fromPairs([['fred', 30,2], ['barney', 40,1]]);
    //只取元素中数组的前两项作为键值对，返回一个对象
    function fromPairs(pairs) {
        let result = {}
        for (let item of pairs) {
            result[item[0]] = item[1]
        }
        return result
    }

    //返回 值value在数组中的索引位置, 没有找到为返回-1
    function indexOf(ary, value, fromIndex = 0) {
        let i
        if (fromIndex >= 0) {
            i = fromIndex
        } else if (fromIndex <= -ary.length) {
            i = 0
        } else {
            i = Math.abs(ary.length + fromIndex)
        }
        for (; i < ary.length; i++) {
            if (ary[i] === value) {
                return i
            }
        }
        return -1
    }

    //_.intersection([2, 1], [4, 2], [1, 2]);
    // => [2]
    function intersection(...arys) {
        let ary = arys[0]//随便取出一个数组
        let values = arys.slice(1)//slice截取剩下的数组
        let result = []
        for (let value of values) {//value代表values中的某一数组
            for (let item of ary) {
                if (value.includes(item)) {
                    result.push(item)
                }
            }
        }
        return result
    }

    function intersectionBy(...arys) {
        let predicate = arys[arys.length - 1]
        let ary = arys[0]
        let values
        if (Array.isArray(predicate)) { //没传iteratee
            predicate = identity
            values = flattenDeep(arys.slice(1)).map(it => predicate(it))
        } else {
            predicate = iteratee(predicate)
            values = flattenDeep(arys.slice(1, -1)).map(it => predicate(it))
        }

        let result = []
        for (let i = 0; i < ary.length; i++) {
            if (values.includes(predicate(ary[i]))) {
                result.push(ary[i])
            }
        }
        return result
    }

    function intersectionWith(ary, ...arrays) {
        let comparator = arrays[arrays.length - 1]
        if (Array.isArray(comparator)) {
            comparator = isEqual
            arrays = flattenDeep(arrays)
        } else {
            comparator = iteratee(comparator)
            arrays = flattenDeep(arrays.slice(0, -1))
        }
        return ary.filter(it => {
            for (var item of arrays) {
                if (comparator(it, item)) {
                    return true
                }
            }
            return false
        })
    }
    return {
        chunk: chunk,
        compact: compact,
        difference: difference,
        differenceBy: differenceBy,
        differenceWith: differenceWith,
        drop: drop,
        dropRight: dropRight,
        dropRightWhile: dropRightWhile,
        dropWhile: dropWhile,
        fill: fill,
        findIndex: findIndex,
        findLastIndex: findLastIndex,
        flatten: flatten,
        flattenDeep: flattenDeep,
        flattenDepth: flattenDepth,
        head: head,
        join: join,
        pull: pull,
        reverse: reverse,
        forEach: forEach,
        size: size,
        without: without,
        concat: concat,
        identity: identity,
        property: property,
        initial: initial,
        fromPairs: fromPairs,
        indexOf: indexOf,
        intersection: intersection,
        intersectionBy: intersectionBy,
        intersectionWith: intersectionWith,
    }
}()




