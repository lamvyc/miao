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

    //减少一级array嵌套深度。
    //_.flatten([1, [2, [3, [4]], 5]]);
    // => [1, 2, [3, [4]], 5]
    //concat(array,value)均拆开最外层[]然后放入到一个空数组中XXX 
    //concat第二个及以后的参数均只拆开最外层放入到要连接的数组中
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

    return {
        chunk: chunk,
        compact: compact,
        difference: difference,
        drop: drop,
        flatten: flatten,
        head: head,
        join: join,
        pull: pull,
        reverse: reverse,
        forEach: forEach,
        size: size,
    }
}()



