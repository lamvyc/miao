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
    //concat(array,value)均拆开最外层[]然后放入到一个空数组中

    function flatten(ary) {
        let res = _.concat([],...ary)
        return res
    }



    //--------------String---------------



    return {
        chunk: chunk,
        compact: compact,
        difference: difference,
        drop,
        flatten,
    }
}()