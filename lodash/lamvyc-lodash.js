var aut1smer = function() {


    /*-----------------------------------
     *              Array
     *------------------------------------
     */

    //将ary拆分成size长度的区块，返回拆分后的二维数组
    function chunk(ary, size = 1) {
        if (size >= ary.length) {
            return [ary.slice()]
        }
        let res = []
        let len = ary.length
        for (let i = 0; i < len; i += size) {
            let temp = []
            let end = (i + size) <= len ? i + size : len //end取不到
            for (let j = i; j < end; j++) {
                temp.push(ary[j])
            }
            res.push(temp)
        }
        return res
    }


    //返回无假值数组  假值：false、null、0、''、undefined、NaN
    function compact(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            if (ary[i]) {
                res.push(ary[i])
            }
        }
        return res
    }


    //有展平一层的功能
    function concat(ary, ...args) {
        let res = ary.slice()
        for (let i = 0; i < args.length; i++) {
            let item = args[i]
            if (Array.isArray(item)) {
                for (let j = 0; j < item.length; j++) {
                    res.push(item[j])
                }
            } else {
                res.push(item)
            }
        }
        return res
    }

    // 二维数组变一维
    function flatten(ary) {
        let result = []
        for (let i = 0; i < ary.length; i++) {
            let item = ary[i]
            if (Array.isArray(item)) {
                for (let it of item) {
                    result.push(it)
                }
            } else {
                result.push(item)
            }
        }
        return result
    }

    //深度展平为一维数组
    function flattenDeep(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            let item = ary[i]
            if (Array.isArray(ary[i])) { //如果是数组就展平成一维数组
                item = flattenDeep(ary[i])
                for (let j = 0; j < item.length; j++) {
                    res.push(item[j])
                }
            } else {
                res.push(item)
            }
        }
        return res
    }

    function flattenDeep2(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            res = res.concat(Array.isArray(ary[i]) ? flattenDeep2(ary[i]) : ary[i])
        }
        return res
    }

    function flattenDeep3(ary) {
        return ary.reduce((res, item) => res.concat(Array.isArray(item) ? flattenDeep3(item) : item), [])
    }


    //根据depth递归减少ary的层级
    function flattenDepth(ary, depth = 1) {
        if (depth == 0) {
            return ary.slice()
        }

        let res = []
        for (let i = 0; i < ary.length; i++) {
            if (Array.isArray(ary[i])) {
                let item = flattenDepth(ary[i], depth - 1)
                for (let j = 0; j < item.length; j++) {
                    res.push(item[j])
                }
            } else {
                res.push(ary[i])
            }
        }
        return res
    }


    function difference(ary, ...values) {
        var result = []
        var valuesAry = flattenDeep(values)
        for (let i = 0; i < ary.length; i++) {
            if (!valuesAry.includes(ary[i])) {
                result.push(ary[i])
            }
        }
        return result
    }

    // _.differenceBy(array, [values], [iteratee=_.identity])
    function differenceBy(ary, ...values) {
        var differ = values[values.length - 1]
        var valuesAry
        if (!Array.isArray(differ)) {
            differ = iteratee(differ) //_.property
            valuesAry = flattenDeep(values.slice(0, -1)).map((it) => differ(it))
        } else {
            differ = identity // it => it
            valuesAry = flattenDeep(values).map((it) => differ(it))
        }
        var result = []
        for (let i = 0; i < ary.length; i++) {
            if (!valuesAry.includes(differ(ary[i], i))) {
                result.push(ary[i])
            }
        }
        return result
    }


    function differenceWith(ary, ...values) {
        var differWith = values[values.length - 1]

        if (Array.isArray(differWith)) {
            differWith = isEqual
            values = flattenDeep(values)
        } else { //not ary, but function
            values = flattenDeep(values.slice(0, -1))
        }
        return ary.filter(it => {
            for (let item of values) {
                if (differWith(it, item)) {
                    return false
                }
            }
            return true
        })
    }

    function intersection(...arys) {
        var ary = arys[0]
        var values = arys.slice(1)
        var result = []
        for (var value of values) { //values二维数组
            for (var item of ary) {
                if (value.includes(item)) {
                    result.push(item)
                }
            }
        }
        return result
    }

    //_.intersectionBy([arrays], [iteratee=_.identity])
    function intersectionBy(...arys) {
        var predicate = arys[arys.length - 1]
        var ary = arys[0]
        var values
        if (Array.isArray(predicate)) { //没传iteratee
            predicate = identity
            values = flattenDeep(arys.slice(1)).map(it => predicate(it))
        } else {
            predicate = iteratee(predicate)
            values = flattenDeep(arys.slice(1, -1)).map(it => predicate(it))
        }

        var result = []
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
            comparator = iteratee(comparator) //maybe it needs
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

    //找到第一个插入位置 the lowest index at which value should be inserted into array in order to maintain its sort order.
    // _.sortedIndex(30, 40);返回NaN  _.sortedIndex('512', 40);返回3  _.sortedIndex(30, 40);返回1
    function sortedIndex(ary, value) { //ary为sorted
        if (!Array.isArray(ary) && typeof ary != 'string') {
            return NaN
        }
        let start = 0,
            end = ary.length; //不包括end
        //最后要取什么？取start：因为end取不到且end代表前面是>=value的位置。到最后只可能从[30,40,40]的前一个40的mid值返回，或者其他例子：[30,40,40,60]  [40,40,40] 皆从 return mid处返回。 [50,50],80，从return start处返回
        while (start < end) {
            let mid = (start + end) >> 1
            if (value < ary[mid]) {
                end = mid
            } else if (value > ary[mid]) {
                start = mid + 1
            } else { //相等
                if (ary[mid - 1] != value) {
                    return mid
                } else {
                    end = mid
                }
            }
        }
        return start //start = end... [50,50],80。 这个位置即大于等于又小于value
    }

    //找到第一个插入位置
    //sortedIndexBy([1,2,3,3,4,4,5],3) => 2
    function sortedIndexBy(ary, value, predicate = identity) {
        if (!Array.isArray(ary) && typeof ary != 'string') {
            return NaN
        }
        predicate = iteratee(predicate)

        let v = predicate(value)
        let left = 0,
            right = ary.length //有可能插到ary.length
        while (left < right) {
            let mid = (left + right) >> 1 //奇数项正中间，偶数项右半部分第一个
            let midVal = predicate(ary[mid])
            if (midVal < v) {
                left = mid + 1
            } else if (midVal > v) {
                right = mid
            } else {
                if ((mid - 1) < 0 || predicate(ary[mid - 1]) != v) { //(mid -1)<0说明left = mid = 0，找到最前面了且ary[mid - 1]无效索引值
                    return mid
                } else { //前面还有相等的
                    right = mid
                }
            }
        }
        return left //找到最右边了，即ary[ary.length - 1] < value
            //找到最左边了，即ary[right]>value
    }

    //binary search on a sorted ary. find first index of val which was in ary
    // sortedIndexOf([4, 5, 5, 5, 6], 5); => 1
    function sortedIndexOf(ary, val) {
        if (val == undefined) {
            return -1
        }
        let begin = 0,
            end = ary.length
        while (begin < end) {
            let mid = (begin + end) >> 1
            if (ary[mid] >= val) {
                end = mid
            } else {
                begin = mid + 1
            }
        }
        //begin为第一个大于等于val的位置
        if (ary[begin] === val) {
            return begin
        }
        return -1
    }

    //the highest index at which value should be inserted into array in order to maintain its sort order. 
    //sortedLastIndex([4, 5, 5, 5, 6], 5); => 4
    function sortedLastIndex(ary, val) {
        if (!Array.isArray(ary) && typeof ary != 'string') {
            return NaN
        }
        if (Number(val) != val) {
            return 0
        }
        let begin = 0,
            end = ary.length
        while (begin < end) {
            let mid = (begin + end) >> 1
            if (ary[mid] > val) {
                end = mid
            } else {
                begin = mid + 1
            }
        }
        return begin
    }

    //every element of ary has been sorted by predicate in past time.
    function sortedLastIndexBy(ary, val, predicate = identity) {
        if (!Array.isArray(ary) && typeof ary != 'string') {
            return NaN
        }
        predicate = iteratee(predicate)
        let v = predicate(val)
        let begin = 0,
            end = ary.length
        while (begin < end) {
            let mid = (begin + end) >> 1
            if (predicate(ary[mid]) > v) {
                end = mid
            } else {
                begin = mid + 1
            }
        }
        return begin
    }

    //sortedLastIndexOf([4, 5, 5, 5, 6], 5) => 3
    function sortedLastIndexOf(ary, val) {
        if (!Array.isArray(ary) || typeof val != 'number') {
            return -1
        }
        //法1.找最后插入位置，看前项是否为val
        //法2.直接在相等时分情况讨论，能够出来循环说明begin=end，指向的值一定不等于val
        let begin = 0,
            end = ary.length
        while (begin < end) {
            let mid = (begin + end) >> 1
            if (ary[mid] < val) {
                begin = mid + 1
            } else if (ary[mid] > val) {
                end = mid
            } else {
                if (ary[mid + 1] != val) {
                    return mid
                } else {
                    begin = mid + 1
                }
            }
        }
        return -1
    }

    // a string can be dealed yet.This ary has been sorted.
    function sortedUniq(ary) {
        if ((!Array.isArray(ary) && typeof ary != 'string') || ary.length == 0) {
            return []
        }
        if (typeof ary == 'string') {
            ary = ary.split('')
        }
        //方法1. res=ary.slice()，双指针游走，最后res.length = slow指针
        //方法2. 遍历ary，ary[i]不等res的最后一项，res就把此项拿过来.时间复杂度是方法1的1/2，空间复杂度更少一点.
        let res = [ary[0]] //be careful with undefined because of ary.length = 0
        let ri = 0,
            len = ary.length
        for (let i = 1; i < len; i++) {
            if (res[ri] !== ary[i]) {
                res[++ri] = ary[i]
            }
        }
        return res
    }


    function sortedUniqBy(ary, predicate = identity) {
        if ((!Array.isArray(ary) && typeof ary != 'string') || ary.length == 0) {
            return []
        }
        if (typeof ary == 'string') {
            ary = ary.split()
        }
        let res = [ary[0]]
        predicate = iteratee(predicate)
        let ri = 0,
            len = ary.length
        for (let i = 1; i < len; i++) {
            if (predicate(res[ri]) !== predicate(ary[i])) {
                res[++ri] = ary[i]
            }
        }
        return res
    }


    //除了Set哈希表以外，去重都是n^2，最低不过nlogn(排序后遍历一遍)
    function uniq(ary) {
        // return Array.from(new Set(ary))
        let set = new Set()
        for (let i = 0; i < ary.length; i++) {
            set.has(ary[i]) || set.add(ary[i])
        }
        var result = []
        for (var item of set) {
            result.push(item)
        }
        return result
    }
    // O(n^2)写法
    function uniq2(ary) {
        let result = []
        for (let i = 0; i < ary.length; i++) {
            if (!result.includes(ary[i])) {
                result.push(ary[i])
            }
        }
        return result
    }

    //根据断言判断计算出的key是否相同，相同则去重
    function uniqBy(ary, predicate = identity) {
        predicate = iteratee(predicate)
        let hashMap = new Map()
        for (let i = 0; i < ary.length; i++) {
            let key = predicate(ary[i], i, ary)
            hashMap.has(key) || hashMap.set(key, ary[i])
        }
        let result = []
        for (let item of hashMap) {
            result.push(item[1])
        }
        return result
    }

    //xieran
    function uniqBy2(ary, predicate = identity) {
        predicate = iteratee(predicate)
        var result = []
        var seen = new Set()
        for (var i = 0; i < ary.length; i++) {
            var computed = predicate(ary[i], i, ary)
            if (!seen.has(computed)) {
                result.push(ary[i])
                seen.add(computed)
            }
        }
        return result
    }
    // _.uniqWith([{a:1,b:2},{a:2,b:5},{a:1,b:2},{a:2,b:5}],_.isEqual);返回[{a:1,b:2},{a:2,b:5}]
    //时间退化到O(n^2)
    function uniqWith(ary, comparator = isEqual) {
        if (ary.length < 1) {
            return []
        }
        let result = [ary[0]]
        for (let i = 1; i < ary.length; i++) {
            let flag = true
            let item = ary[i]
            for (let j = 0; j < result.length; j++) {
                if (comparator(ary[j], item)) {
                    flag = false //有重复
                    break
                }
            }
            if (flag) {
                result.push(ary[i])
            }
        }
        return result
    }
    //xieran
    function uniqWith2(ary, comparator = isEqual) {
        var result = []
        for (let i = 0; i < ary.length; i++) {
            if (!result.some(it => comparator(it, ary[i]))) { //遍历result，有一项和ary[i]深度相等就不放入result里
                result.push(ary[i])
            }
        }
        return result
    }

    //扔掉前0项的新数组
    function drop(ary, n = 1) {
        return ary.slice(n)
    }

    //扔掉最后n项的新数组
    function dropRight(ary, n = 1) {
        if (n >= ary.length) {
            return []
        } else if (n <= 0) {
            return ary.slice()
        }
        return ary.slice(0, ary.length - n)

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

    function findIndex(ary, predicate = identity, fromIndex = 0) {
        predicate = iteratee(predicate)
        for (let i = fromIndex; i < ary.length; i++) {
            if (predicate(ary[i], i, ary)) {
                return i
            }
        }
        return -1
    }

    function findLastIndex(ary, predicate = identity, fromIndex = ary.length - 1) {
        predicate = iteratee(predicate)
        for (let i = fromIndex; i >= 0; i--) {
            if (predicate(ary[i], i, ary)) {
                return i
            }
        }
        return -1
    }


    function fromPairs(pairs) {
        var result = {}
        for (var item of pairs) {
            result[item[0]] = item[1]
        }
        return result
    }

    function head(ary) {
        return ary[0]
    }

    function indexOf(ary, val, fromIndex = 0) {
        for (let i = fromIndex; i < ary.length; i++) {
            if (ary[i] === val) {
                return i
            }
        }
        return -1
    }

    function lastIndexOf(ary, val, fromIndex = ary.length - 1) {
        for (let i = fromIndex; i >= 0; i--) {
            if (val === ary[i]) {
                return i
            }
        }
        return -1
    }

    function initial(ary) {
        let len = ary.length - 1
        let result = []
        for (let i = 0; i < len; i++) {
            result.push(ary[i])
        }
        return result
    }

    function tail(ary) {
        let res = []
        for (let i = 1; i < ary.length; i++) {
            res.push(ary[i])
        }
        return res
    }

    function last(ary) {
        return ary[ary.length - 1]
    }


    function join(ary, separator = ',') {
        let str = ''
        for (let i = 0; i < ary.length - 1; i++) {
            str += ary[i].toString() + separator
        }
        str += ary[ary.length - 1]
        return str
    }

    function nth(ary, n = 0) {
        if (n < 0) {
            n = n + ary.length
        }
        return ary[n]
    }

    //移除和values相等的全部值
    function pull(ary, ...values) {
        let set = new Set(values)
        let temp = []
        for (let i = 0; i < ary.length; i++) {
            if (!set.has(ary[i])) {
                temp.push(ary[i])
            }
        }
        ary = temp
        return ary
    }

    function pullAll(ary, values) {
        let set = new Set(values)
        let temp = []
        for (let i = 0; i < ary.length; i++) {
            if (!set.has(ary[i])) {
                temp.push(ary[i])
            }
        }
        ary = temp
        return ary
    }

    function pullAllBy(ary, values, predicate = identity) {
        predicate = iteratee(predicate)
        values = new Set(values.map(it => predicate(it)))
        ary = ary.filter(it => {
            var val = predicate(it)
            return !values.has(val)
        })
        return ary
    }

    function pullAllWith(ary, values, comparator = isEqual) {
        ary = ary.filter(it => {
            for (let value of values) {
                if (comparator(it, value)) {
                    return false
                }
            }
            return true
        })
        return ary
    }

    function fill(ary, value, start = 0, end = ary.length) {
        for (let i = start; i < end; i++) {
            ary[i] = value
        }
        return ary
    }

    function reverse(ary) {
        let left = 0,
            right = ary.length - 1
        while (left < right) {
            let temp = ary[left]
            ary[left] = ary[right]
            ary[right] = temp
            left++
            right--
        }
        return ary
    }


    //这里对数组的zip是挑选相同位置的元素归为一组
    //允许每个数组长度不一，选最大长度数组迭代，没有值填入undefined
    function zip(...args) {
        let res = []
        let maxLength = 0
        for (let i = 0; i < args.length; i++) {
            maxLength = args[i].length > maxLength ? args[i].length : maxLength
        }
        for (let i = 0; i < maxLength; i++) {
            let temp = []
            for (let j = 0; j < args.length; j++) {
                temp.push(args[j][i])
            }
            res.push(temp)
        }
        return res
    }

    /* zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
    return a + b + c; }); => [111, 222]  */
    function zipWith(...arys) {
        let predicate = arys.pop()
        if (typeof predicate != 'function') {
            arys.push(predicate)
            predicate = identity
        }
        let result = []
        for (let i = 0; i < arys[0].length; i++) {
            let item = predicate.apply(null, arys.reduce((param, ary) => {
                param.push(ary[i])
                return param
            }, []))
            result.push(item)
        }
        return result
    }


    function unzip(ary) {
        let res = []
        let len = ary[0].length
        for (let i = 0; i < len; i++) {
            let temp = []
            for (let j = 0; j < ary.length; j++) {
                temp.push(ary[j][i])
            }
            res.push(temp)
        }
        return res
    }

    function unzipWith(ary, predicate = identity) {
        predicate = iteratee(predicate)
            //ary is like as [[1, 10, 100], [2, 20, 200]]
        let res = []
        let resLen = ary[0].length
        for (let i = 0; i < resLen; i++) {
            let temp = []
            for (let j = 0; j < ary.length; j++) {
                temp.push(ary[j][i])
            }
            let val = predicate.apply(null, temp)
            res.push(val)
        }
        return res
    }

    //zipObject(['a', 'b'], [1, 2]); => { 'a': 1, 'b': 2 }
    function zipObject(props = [], values = []) {
        if (typeof props != 'string' && !Array.isArray(props)) {
            return {}
        }

        let res = {}
        for (let i = 0; i < props.length; i++) {
            res[props[i]] = values[i]
        }
        return res
    }


    /*有点麻，Deep会误导人去想递归*/
    function zipObjectDeep(props = [], values = []) {
        let res = {}
        for (let i = 0; i < props.length; i++) {
            let propAry = toPath(props[i])
            let resPointer = res
            if (propAry.length > 0) {
                for (let j = 0; j < propAry.length - 1; j++) {
                    if (Number(propAry[j + 1]) == propAry[j + 1] && !resPointer[propAry[j]]) {
                        resPointer[propAry[j]] = []
                    } else if (!resPointer[propAry[j]]) {
                        resPointer[propAry[j]] = {}
                    }
                    resPointer = resPointer[propAry[j]]
                }
                resPointer[propAry[propAry.length - 1]] = values[i]
            }
        }
        return res
    }








    // using `SameValueZero` for equality comparisons.Unique values is collected in order of ARYS.
    function union(...arys) {
        let res = []
        arys.forEach(ary => {
            ary.forEach(val => {
                if (!res.includes(val)) {
                    res.push(val)
                }
            })
        })
        return res
    }

    function unionBy(...arys) {
        let mapper = identity
        if (!Array.isArray(arys[arys.length - 1])) {
            mapper = arys.pop()
        }
        mapper = iteratee(mapper)
        let res = []
        let compareRes = []
        arys.forEach(ary => {
            ary.forEach(val => {
                let compareVal = mapper(val)
                if (!compareRes.includes(compareVal)) {
                    compareRes.push(compareVal)
                    res.push(val)
                }
            })
        })
        return res
    }

    //The comparator is invoked with two arguments: (arrVal, othVal).
    function unionWith(...arys) {
        let comparator = isEqual
        if (!Array.isArray(arys[arys.length - 1])) {
            comparator = arys.pop()
        }
        let result = []
        arys.forEach(ary => {
            ary.forEach(item => {
                let flag = true
                forEach(result, val => {
                    if (comparator(val, item)) {
                        flag = false
                        return false
                    }
                })
                if (flag) {
                    result.push(item)
                }
            })
        })
        return result
    }

    // using SameValueZero for equality comparisons.filter ary has,but values dont have
    function without(ary, ...values) {
        let res = []
        ary.forEach(item => {
            if (!values.includes(item)) {
                res.push(item)
            }
        })
        return res
    }


    //ary.slice(1,~)
    function take(ary, n = 1) {
        if ((!Array.isArray(ary) && typeof ary != 'string') || n == 0) {
            return []
        }
        if (typeof ary == 'string') {
            ary = ary.split('')
        }
        if (n > ary.length) {
            n = ary.length
        } else if (n < 0) {
            n = 0
        }
        return ary.slice(0, n)

    }
    // 从前向后探测predicate(val)，如不符合，结束探测
    function takeWhile(ary, predicate = identity) {
        if (!Array.isArray(ary) && typeof ary == 'string') {
            return []
        }
        if (typeof ary == 'string') {
            ary = ary.split('')
        }
        predicate = iteratee(predicate)
        let res = [],
            len = ary.length
        for (let i = 0; i < len; i++) {
            if (predicate(ary[i], i, ary)) {
                res.push(ary[i])
            } else {
                break
            }
        }
        return res
    }

    //ary.slice(ary.length - n)
    function takeRight(ary, n = 1) {
        if ((!Array.isArray(ary) && typeof ary != 'string') || n == 0) {
            return []
        }
        if (typeof ary == 'string') {
            ary = ary.split('')
        }
        let start = ary.length - n
        if (start < 0) {
            start = 0
        }
        return ary.slice(start)
    }


    //从后向前探测predicate(val)，如果不符合则探测结束
    function takeRightWhile(ary, predicate = identity) {
        if (!Array.isArray(ary) && typeof ary != 'string') {
            return []
        }
        if (typeof ary == 'string') {
            ary = split('')
        }
        predicate = iteratee(predicate)

        let res = []
        for (let i = ary.length - 1; i >= 0; i--) {
            if (predicate(ary[i], i, ary)) {
                res.push(ary[i])
            } else {
                break
            }
        }

        return res.reverse()
    }



    //异或：所有数组的值中只出现一次//数组交集后的补集取并集
    //写法1，利用浏览器的map.forEach实现
    function xor(...arys) {
        let map = new Map()
        let res = []
        for (let i = 0; i < arys.length; i++) {
            let ary = arys[i]
            if (Array.isArray(ary)) {
                for (let j = 0; j < ary.length; j++) {
                    if (map.has(ary[j])) {
                        map.set(ary[j], 2)
                    } else {
                        map.set(ary[j], 1)
                    }
                }
            }
        }
        map.forEach((v, k) => { //map.forEach能够保证遍历顺序是存入顺序
            if (v == 1) {
                res.push(k)
            }
        })
        return res
    }

    //写法2,非信任的map遍历
    function xor2(...arys) {
        let map = new Map()
        let res = []
        for (let i = 0; i < arys.length; i++) {
            let ary = arys[i]
            if (Array.isArray(ary)) {
                for (let j = 0; j < ary.length; j++) {
                    if (map.has(ary[j])) {
                        map.set(ary[j], 2)
                    } else {
                        map.set(ary[j], 1)
                    }
                }
            }
        }

        for (let i = 0; i < arys.length; i++) {
            let ary = arys[i]
            if (Array.isArray(ary)) {
                for (let j = 0; j < ary.length; j++) {
                    if (map.get(ary[j]) == 1) {
                        res.push(ary[j])
                    }
                }
            }
        }
        return res
    }


    //space exchange time(timeless first)
    function xorBy(...arys) {
        let predicate
        if (Array.isArray(arys[arys.length - 1])) {
            predicate = identity
        } else {
            predicate = iteratee(arys.pop())

        }
        let map = new Map()
        let res = []
        for (let i = 0; i < arys.length; i++) {
            let ary = arys[i]
            if (Array.isArray(ary)) {
                for (let j = 0; j < ary.length; j++) {
                    let val = predicate(ary[j])
                    if (map.has(val)) {
                        map.set(val, 2)
                    } else {
                        map.set(val, 1)
                    }
                }
            }
        }
        //非信任map.forEach写法
        for (let i = 0; i < arys.length; i++) {
            let ary = arys[i]
            if (Array.isArray(ary)) {
                for (let j = 0; j < ary.length; j++) {
                    let val = predicate(ary[j])
                    if (map.get(val) == 1) {
                        res.push(ary[j])
                    }
                }
            }
        }
        return res
    }

    //没办法化为O(n)了，只能O(n^2)
    function xorWith(...arys) {
        let comparator
        if (typeof arys[arys.length - 1] == 'function') {
            comparator = arys.pop()
        } else {
            comparator = isEqual
        }
        let res = []

        for (let i = 0; i < arys.length; i++) {
            let ary = arys[i]
            if (Array.isArray(ary)) {
                for (let j = 0; j < ary.length; j++) {
                    let val = ary[j]
                    let pushFlag = true
                        //对比
                    for (let p = 0; p < arys.length; p++) {
                        let aryTest = arys[p]
                        if (Array.isArray(aryTest)) {
                            for (let q = 0; q < aryTest.length; q++) {
                                if (p == i && q == j) {
                                    continue
                                }
                                let valTest = aryTest[q]
                                if (comparator(val, valTest)) {
                                    pushFlag = false
                                    break
                                }
                            }
                            if (!pushFlag) {
                                break
                            }
                        }
                    }
                    if (pushFlag) {
                        res.push(val)
                    }
                }
            }
        }
        return res
    }

    function pullAt(ary, idxes) {
        //默认它俩都是符合规则的类型
        //mutate origin ary, return values deleted from ary
        let result = []
        idxes = idxes.sort((a, b) => b - a)
        for (let i = 0; i < idxes.length; i++) {
            result.push(...ary.splice(idxes[i], 1)) //splice以数组形式返回内容
        }

        return result.reverse()
    }

    /* --------------------------Array-------------------------- */



    /*-----------------------------------
     *              Collection
     *------------------------------------
     */

    function groupBy(collection, predicate = identity) {
        if (typeof predicate == 'string') {
            predicate = property(predicate) // property(propPath)
        }
        let res = {}
        for (var cKey in collection) {
            var key = predicate(collection[cKey], cKey, collection)
            if (Array.isArray(res[key])) {
                res[key].push(collection[cKey])
            } else {
                res[key] = [collection[cKey]]
            }
        }
        return res
    }


    //会出现覆盖的情况，即res.length <= collection.length
    function keyBy(collection, predicate = identity) {
        if (typeof predicate == 'string') {
            predicate = iteratee(predicate)
        }
        let res = {}
        for (var cKey in collection) {
            var key = predicate(collection[cKey], cKey, collection)
            res[key] = collection[cKey]
        }
        return res
    }

    //遍历对象自有可枚举属性
    function forEach(collection, predicate = identity) {
        // forOwn(collection, action)
        predicate = iteratee(predicate)
        for (var key in collection) {
            if (predicate(collection[key], key, collection) === false)
                break
        }
        return collection
    }


    function forEachRight(collection, predicate = identity) {
        let keys = Object.keys(collection)

        for (let i = keys.length - 1; i >= 0; i--) {
            if (predicate(collection[keys[i]], keys[i], collection) == false) {
                break
            }
        }
        return collection
    }



    //_.map([1,2,3],function(v,i,o) {return v+i+o.length*2}) =>  [7, 9, 11]
    // lodash的map对于数组的key来说有Number(key)的行为，所以仍需划分obj还是ary
    function map(collection, mapper = identity) {
        // if (typeof mapper === 'string') {
        //     mapper = property(mapper) //_.property('a.b')
        // }
        mapper = iteratee(mapper)
        var result = []
        if (Array.isArray(collection)) {
            for (let i = 0; i < collection.length; i++) {
                result.push(mapper(collection[i], i, collection))
            }
        } else {
            for (var key in collection) {
                if (collection.hasOwnProperty(key)) {
                    result.push(mapper(collection[key], key, collection))
                }
            }
        }
        return result
    }


    function filter(collection, predicate) {
        predicate = iteratee(predicate)
        var result = []
        for (var key in collection) {
            if (predicate(collection[key], key, collection) === true) {
                result.push(collection[key])
            }
        }
        return result
    }


    //支持对象reduce
    function reduce(collection, reducer = identity, initial) {
        let keyAry = []
        for (let key in collection) { //对象也可能从1开始数
            if (collection.hasOwnProperty(key)) {
                keyAry.push(key)
            }
        } //等同于Object.keys(collection)

        let startIdx = 0
        if (arguments.length == 2) {
            startIdx = 1
            initial = collection[keyAry[0]]
        }
        for (let i = startIdx; i < keyAry.length; i++) {
            initial = reducer(initial, collection[keyAry[i]], keyAry[i], collection)
        }
        return initial
    }



    function reduceRight(collection, reducer = identity, initial) {
        let keyAry = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                keyAry.push(key)
            }
        }
        let len = keyAry.length
        let startIdx = len - 1
        if (arguments.length == 2) {
            startIdx = len - 2
            initial = collection[keyAry[len - 1]]
        }
        for (let i = startIdx; i >= 0; i--) {
            initial = reducer(initial, collection[keyAry[i]], keyAry[i], collection)
        }
        return initial
    }


    function every(collection, test = identity) {
        test = iteratee(test)
        for (var key in collection) {
            if (!test(collection[key])) {
                return false
            }
        }
        return true
    }


    function every1(ary, test) {
        let len = ary.length
        for (let i = 0; i < len; i++) {
            if (!test(ary[i], i)) {
                return false
            }
        }
        return true
    }

    function every2(ary, test) {
        return ary.reduce((res, item, idx) => {
            return res && test(item, idx)
        }, true)
    }

    function every3(ary, test) {
        return !some(ary, (item, idx) => {
            return !test(item, idx)
        })
    }


    function some(collection, test = identity) {
        test = iteratee(test)
        for (var item of collection) {
            if (test(item)) {
                return true
            }
        }
        return false
    }

    function some1(ary, test) {
        let len = ary.length
        for (let i = 0; i < len; i++) {
            if (test(ary[i], i)) {
                return true
            }
        }
        return false
    }

    function some2(ary, test) {
        return ary.reduce((res, item, idx) => {
            return res || test(item, idx)
        }, false)
    }


    //随机打乱顺序 Fisher-Yates Shuffle
    function shuffle(collection) {
        let res = []
        for (var k in collection) {
            res.push(collection[k])
        }
        let len = res.length - 1
        for (let i = len; i >= 0; i--) {
            let idx = Math.random() * (i + 1) | 0
            swap(res, idx, i)
        }
        return res
    }

    function swap(ary, i, j) {
        let t = ary[i]
        ary[i] = ary[j]
        ary[j] = t
        return ary
    }


    //lodash可以取出对象里的值进行排序，返回新数组
    function sortBy(collection, ary) { //ary could be [function(o) { return o.user; }] or ['user', 'age']

        //need a compare func
        function compare(a, b, ary, idx = 0) {
            if (typeof ary[idx] == 'function') {
                if (ary[idx](a) < ary[idx](b)) {
                    return -1
                } else if (ary[idx](a) > ary[idx](b)) {
                    return 1
                } else {
                    if (idx < ary.length - 1) {
                        return compare(a, b, ary, idx + 1)
                    } else {
                        return 0
                    }
                }
            }
            if (typeof ary[idx] == 'string') {
                if (a[ary[idx]] < b[ary[idx]]) {
                    return -1
                } else if (a[ary[idx]] > b[ary[idx]]) {
                    return 1
                } else {
                    if (idx < ary.length - 1) {
                        return compare(a, b, ary, idx + 1)
                    } else {
                        return 0
                    }
                }
            }
        }


        // need return a new array
        if (typeof collection == 'object') {
            if (Array.isArray(collection)) {
                collection = collection.slice()
            } else {
                let temp = []
                for (let k in collection) {
                    if (collection.hasOwnProperty(k)) {
                        temp.push(collection[k])
                    }
                }
                collection = temp
            }
        }

        //insertion sort
        for (let i = 1; i < collection.length; i++) {
            let temp = collection[i]
            for (var j = i - 1; j >= 0; j--) {
                if (compare(temp, collection[j], ary) < 0) {
                    collection[j + 1] = collection[j]
                } else {
                    break
                }
            }
            collection[j + 1] = temp
        }
        return collection
    }


    //创建一个数组，以谓词处理的结果升序排列。需要稳定排序。collection可以是Array|Object一个可迭代的集合。predicate谓词是函数。
    function sortByWrong(collection, predicate = identity) {
        let res = []
        if (!collection) {
            return []
        }
        //插入排序是稳定的
        if (Array.isArray(collection)) {
            for (let i = 1; i < collection.length; i++) {
                let t = collection[i]
                let temp = predicate(collection[i], i)

                for (var j = i - 1; j >= 0; j--) {
                    if (predicate(collection[j]) > temp) {
                        collection[j + 1] = collection[j]
                    } else {
                        break
                    }
                }
                collection[j + 1] = t
            }
            //排好序了，按照特定格式输出
            for (let i = 0; i < collection.length; i++) {
                let temp = []
                for (let k in collection[i]) {
                    temp.push(collection[i][k])
                }
                res.push(temp)
            }

        }

        return res
    }

    // 根据谓词计数，谓词可以是函数也可以是属性
    function countBy2(collection, predicate = identity) {
        if (typeof predicate === 'function') {
            return collection.reduce((res, item, idx) => {

                let key = predicate(item, idx)
                if (!(key in res)) {
                    res[key] = 1
                } else {
                    res[key] += 1
                }
                return res
            }, {})
        } else { //把predicate当做一个属性看待
            return collection.reduce((res, item, idx) => {

                let key = item[predicate]
                if (!(key in res)) {
                    res[key] = 1
                } else {
                    res[key] += 1
                }
                return res
            }, {})
        }
    }

    //重构countBy,lodash里的collection似乎只支持函数
    function countBy(collection, predicate = identity) {
        predicate = iteratee(predicate) //maybe need _.property
        return collection.reduce((accum, item, idx, collection) => {
            let key = predicate(item)
            if (key in accum) {
                accum[key]++
            } else {
                accum[key] = 1
            }
            return accum
        }, {})
    }


    function find(collection, test = identity, fromIdx = 0) {
        test = iteratee(test)

        if (Array.isArray(collection)) {
            if (fromIdx < 0) {
                fromIdx += collection.length
                fromIdx = fromIdx < 0 ? 0 : fromIdx
            }
            for (let i = fromIdx; i < collection.length; i++) {
                if (test(collection[i], i, collection)) {
                    return collection[i]
                }
            }
        } else { //object
            let count = 0
            if (fromIdx < 0) {
                fromIdx += Object.keys(collection).length
                fromIdx = fromIdx < 0 ? 0 : fromIdx
            }
            for (let key in collection) {
                if (count >= fromIdx) {
                    if (test(collection[key], key, collection)) {
                        return collection[key]
                    }
                }
                count++
            }

        }
        return
    }

    //从右向前找到第一个元素. 这个函数可以用Object.keys简化代码
    function findLast(collection, predicate = identity, fromIndex = collection.length - 1) {
        predicate = iteratee(predicate)
        let midAry = collection
        if (!Array.isArray(collection)) {
            midAry = reduce(collection, (accum, val, key) => {
                accum.push([key, val])
                return accum
            }, [])
        }

        if (fromIndex >= midAry.length) {
            fromIndex = midAry.length - 1
        } else if (fromIndex < 0) {
            fromIndex += midAry.length
            fromIndex = fromIndex < 0 ? 0 : fromIndex
        }
        if (Array.isArray(collection)) {
            for (let i = fromIndex; i >= 0; i--) {
                if (predicate(midAry[i], i, collection)) {
                    return midAry[i]
                }
            }
        } else {
            for (let i = fromIndex; i >= 0; i--) {
                if (predicate(midAry[i][1], midAry[i][0], collection)) {
                    return midAry[i][1]
                }
            }
        }

        return
    }

    //Creates a flattened array of values by running each element in collection thru iteratee and flattening the mapped results.
    function flatMap(collection, predicate = identity) {
        predicate = iteratee(predicate)
        let midAry = []
        for (let key in collection) {
            midAry.push(predicate(collection[key], key, collection))
        }
        return flatten(midAry)
    }


    function flatMapDeep(collection, predicate = identity) {
        predicate = iteratee(predicate)
        let midAry = []
        for (let key in collection) {
            midAry.push(predicate(collection[key], key, collection))
        }
        return flattenDeep(midAry)
    }


    function flatMapDepth(collection, predicate = identity, depth = 1) {
        predicate = iteratee(predicate)
        let midAry = []
        for (let key in collection) {
            midAry.push(predicate(collection[key], key, collection))
        }
        return flattenDepth(midAry, depth)
    }


    function includes(collection, val, fromIndex = 0) {
        if (typeof collection == 'string' && typeof val != 'string') {
            return false
        }
        let keys = Object.keys(collection) //string有效
        if (fromIndex < 0) {
            fromIndex += keys.length
            fromIndex = fromIndex < 0 ? 0 : fromIndex
        }
        if (typeof collection == 'string') {
            let end = collection.length - val.length
            for (let i = fromIndex; i < end; i++) {
                let subStr = collection.substr(i, val.length)
                if (subStr == val) {
                    return true
                }
            }
        } else {
            if (isNaN(val)) {
                for (let i = fromIndex; i < keys.length; i++) {
                    if (isNaN(collection[keys[i]])) {
                        return true
                    }
                }
            } else {
                for (let i = fromIndex; i < keys.length; i++) {
                    if (val === collection[keys[i]]) {
                        return true
                    }
                }
            }
        }
        return false
    }

    //内置函数路由，考察用字符串寻找函数名
    function invokeMap(collection, path, ...args) {
        let result = []
        let predicate
        let everyFlag = false
        if (Array.isArray(path)) {
            predicate = property(path)
        } else if (typeof path == 'function') {
            predicate = path
        } else if (typeof path == 'string') {
            everyFlag = true // 对每个元素调用元素上的方法,such as sort, reverse,and so on...
            for (let i = 0; i < path.length; i++) {
                if (path[i] == '[' || path[i] == '.') {
                    everyFlag = false
                    break
                }
            }
            if (!everyFlag) {
                predicate = property(path) // [a].b[0].c
            }
        }
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (everyFlag) {
                    predicate = collection[key].__proto__[path]
                }
                let item = predicate.apply(collection[key], args)
                result.push(item)
            }
        }
        return result
    }



    //asc is default, dont need key but only value.
    function orderBy(collection, comparators = [identity], orders = ['asc']) {
        while (orders.length < comparators.length) {
            orders.push('asc')
        }

        //compare can assert relative position between a and b, this func will iterate all of functions in 'comparators'.
        function compare(a, b, ary, orderAry, idx = 0) {
            if (typeof ary[idx] == 'function') {
                if ((ary[idx](a) < ary[idx](b) && orderAry[idx] == 'asc') || (ary[idx](a) > ary[idx](b) && orderAry[idx] == 'desc')) {
                    return -1
                } else if ((ary[idx](a) > ary[idx](b) && orderAry[idx] == 'asc') || (ary[idx](a) < ary[idx](b) && orderAry[idx] == 'desc')) {
                    return 1
                } else if (idx < ary.length) {
                    return compare(a, b, ary, orderAry, idx + 1)
                } else {
                    return 0
                }

            } else if (typeof ary[idx] == 'string') {
                if ((a[ary[idx]] < b[ary[idx]] && orderAry[idx] == 'asc') || (a[ary[idx]] > b[ary[idx]] && orderAry[idx] == 'desc')) {
                    return -1
                } else if ((a[ary[idx]] > b[ary[idx]] && orderAry[idx] == 'asc') || (a[ary[idx]] < b[ary[idx]] && orderAry[idx] == 'desc')) {
                    return 1
                } else if (idx < ary.length) {
                    return compare(a, b, ary, orderAry, idx + 1)
                } else {
                    return 0
                }
            } else {
                return 0 //In this case that typeof every item in ary are neither func and string, we think a equals with b. By myself but not lodash official.
            }
        }

        //stable swapper algorithm need iterate array but not object, and return value belongs to type of array.
        if (typeof collection == 'object') {
            if (Array.isArray(collection)) {
                collection = collection.slice()
            } else {
                let temp = []
                for (let k in collection) { //dont need key but only value
                    if (collection.hasOwnProperty(k)) {
                        temp.push(collection[k])
                    }
                }
                collection = temp
            }
        } else {
            console.log('collection parameter is wrong type!');
            return collection
        }

        for (let i = 1; i < collection.length; i++) {
            let selectVal = collection[i]
            for (var j = i - 1; j >= 0; j--) {
                if (compare(selectVal, collection[j], comparators, orders) < 0) {
                    collection[j + 1] = collection[j]
                } else {
                    break
                }
            }
            collection[j + 1] = selectVal
        }

        return collection
    }

    //two groups: [true group, false group].  The predicate is invoked with one argument: (value).
    function partition(collection, predicate = identity) {
        predicate = iteratee(predicate)
        let result = [
            [],
            []
        ]
        for (let k in collection) {
            if (collection.hasOwnProperty(k)) {
                if (predicate(collection[k]) == true) {
                    result[0].push(collection[k])
                } else {
                    result[1].push(collection[k])
                }
            }
        }
        return result
    }

    //the opposite of filter().
    function reject(collection, predicate = identity) {
        predicate = iteratee(predicate)
        let result = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (predicate(collection[key], key, collection) == false) {
                    result.push(collection[key])
                }
            }
        }
        return result
    }

    //Gets a random element from collection.
    function sample(collection) {
        let keys = Object.keys(collection)
        let len = keys.length
        let idx = Math.random() * len | 0
        return collection[keys[idx]]
    }

    // we need n * sample
    function sampleSize(collection, n = 1) {
        let keys = Object.keys(collection)
        let len = keys.length
        if (n <= 0) {
            return []
        } else if (n > len) {
            n = len
        }
        let result = []
        while (n) {
            let idx = Math.random() * keys.length | 0
            swap(keys, idx, keys.length - 1)
            result.push(collection[keys.pop()])
            n--
        }
        return result
    }

    //Object.keys完成了for in + hasOwnProperty
    function size(collection) {
        if (collection && typeof collection == 'object') {
            if (Array.isArray(collection)) {
                return collection.length
            }
            return Object.keys(collection).length
        } else if (typeof collection == 'string') {
            return collection.length
        }
        return
    }





    //-------------------Collection--------------------------

    /*-----------------------------------
     *              Date
     *------------------------------------
     */



    /*-----------------------------------
     *              Function
     *------------------------------------
     */

    //可跳跃绑定的bind  
    bind.placeholder = window;

    function bind(f, thisArg, ...fixedArgs) { //bind(f, {}, 1, 2, _, 3, _, 4)
        return function(...args) { // 5,8, 9,10
            var parameters = fixedArgs.slice()
            var j = 0
            for (var i = 0; i < parameters.length; i++) {
                if (Object.is(parameters[i], bind.placeholder)) { //Object.is()能够做到NaN===NaN
                    if (j < args.length) {
                        parameters[i] = args[j++]
                    } else {
                        parameters[i] = undefined
                    }
                }
            }
            while (j < args.length) {
                parameters.push(args[j++])
            }
            return f.apply(thisArg, parameters)
        }
    }

    //延迟 1ms执行func
    function defer(func, ...args) {
        let timerId = setTimeout(() => {
            func.apply(null, args)
        })
        return timerId - 1
    }

    //setTimeout会自动进行'1000' => 1000，里面应该是用了Number()而非parseInt
    function delay(func, wait, ...args) {
        let timerId = setTimeout(() => {
            func.apply(null, args)
        }, wait)
        return timerId - 1
    }

    // 使func只接n个参数
    function ary(func, n = func.length) {
        return function(...args) {
            return func.apply(window, args.slice(0, n))
        }
    }

    // 使func只接受1个参数
    function unary(func) {
        return function(...args) {
            return func.call(null, args[0])
        }
    }

    // 返回predicate运行的否定的结果
    function negate(predicate) {
        return function(...args) {
            if (typeof predicate != 'function') {
                throw new Error('negate只能接一个函数')
            }
            let result = predicate.call(this, ...args)
            return !result
        }
    }

    //限制func只能被调用一次，调用多次时返回第一次的调用结果
    //function a (k) { return k + 1 };var init = _.once(a);
    //init(5) //6  init(10) //6
    function once(func) {
        let n = 0
        let firstResult //把第一次结果与是否是第一次调用保存在闭包里
        return function(...args) {
            if (n == 0) {
                firstResult = func.apply(this, args)
                n++
            }
            return firstResult
        }
    }


    //经大量测验：start意味着视arguments[0]为全参还是params里的仅仅一项
    //不足：
    //   var say = _.spread(function(who, what,c,d,e,f) {
    //   return who + ' says ' + what+c+d+e+f;
    // },2);
    // say(['cy','q','asd'],['aaa',['bbbb','vvvv'],'c'],'ggg',['c']) 
    //返回了 'cy,q,asd says aaabbbb,vvvvcgggundefined'
    //lodash返回了 'cy,q,asd says aaa,bbbb,vvvv,cgggundefined' 多一个逗号
    function spread(func, start = 0) { //零式战机上陈旧的lodash写法
        start = Number(start)
        return function() {
            while (start < 0) {
                start += arguments.length
            }
            var funcLen = func.length
            var params = []
            if (start == 0) {
                return func.apply(this, arguments[start].slice(0, funcLen))
            } else {
                params[0] = arguments[0]
                outmost:
                    for (var i = 1; i <= start; i++) { //测试得出结果最多两层嵌套遍历
                        var val = arguments[i]
                        if (Array.isArray(val)) {
                            for (var j = 0; j < val.length; j++) {
                                params.push(val[j])
                                if (params.length == funcLen) {
                                    break outmost
                                }
                            }
                        } else {
                            params.push(val)
                        }
                        if (params.length == funcLen) {
                            break
                        }
                    }
                return func.apply(this, params)
            }
        }
    }


    //传播参数，延展操作符 spread operator 比lodash还要好的实现思路！
    function spreadGreat(func, start = 0) {
        start = Number(start)
            //应该是要用es5的方式实现...
        return function() {
            let length = func.length
            let params = []
            let flattenArgs = []
            for (let i = 0; i < arguments.length; i++) {
                flattenArgs.push(arguments[i])
            }
            flattenArgs = flattenDeep(flattenArgs)
            while (start < length) {
                params.push(flattenArgs[start++])
            }
            return func.apply(this, params)
        }
    }
    //空翻 希望func函数在调用时，参数是反向传递的
    function flip(func) {
        return function(...args) {
            return func.apply(this, args.reverse())
        }
    }

    //函数柯里化：强制接参个数直到指定的数量，否则就不
    function curry(func, arity = func.length) {
        return _curry.call(this, func, arity)
    }

    function _curry(func, arity, ...args) {
        return function(...restArgs) {
            let params = args.concat(restArgs)
            if (params.length >= arity) {
                return func.call(this, ...params)
            } else {
                return _curry.call(this, func, arity, ...params)
            }
        }
    }

    //from xieran
    function curry2(func, arity = func.length) {
        return function curried(...args) {
            if(args.length < arity) {
                return curry2(func.bind(this, ...args), arity - args.length)
            } else {
                return func.call(this, ...args)
            }
        }
    }



    function curryWrong(func, arity = func.length) {
        return function exec(func, ...args) {
                if (args.length >= arity) {
                    func.apply(this, args)
                } else {
                    return curryWrong(exec.bind(this, func, ...args), arity - (args.length))
                }
            }
            // bind(exec, bind.placeholder, func)
    }


    function curryWrong(func, arity = func.length) {
        return function exec(...args) {
            if (arity <= args.length) {
                return func.call(this, ...args)
            } else { //直到参数个数
                return function(...rest) {
                    let params = args.concat(rest)
                    if (params.length >= arity) {
                        return func.call(this, ...params)
                    } else {
                        return exec(params)
                    }
                }

            }
        }
    }


    //传进来的对象作键，值只缓存最初的
    function memoize(func, resolver) {
        memoize.Cache = memoize.Cache || Map
        let that = this //func在调用时this会被绑定在缓存函数上
        function _memoize(...args) {
            if (resolver && typeof resolver == 'function') {
                _memoize.cache.set(args[0], resolver(...args))
            }
            let result
            if (_memoize.cache.has(args[0])) {
                result = _memoize.cache.get(args[0])
            } else {
                result = func.call(that, ...args)
                _memoize.cache.set(args[0], result)
            }
            return result
        }
        _memoize.cache = new memoize.Cache()
        return _memoize
    }

    //xieran版本
    function memoize(func, resolver = (...args) => args[0]) {
        var cache = new memoize.Cache()
    
        var f = function(...args) {
            var key = resolver(...args)
            if (cache.has(key)) {
                return cache.get(key)
            } else {
                var result = func(key)
                cache.set(key, result)
                return result
            }
        }
    
        f.cache = cache
    
        return f
    }

    //-----------------Function--------------------



    /*-----------------------------------
     *              Lang
     *------------------------------------
     */


    //判断obj是否全包含src，src的每个属性及值都在obj上找到并相等.支持深层
    //测试用例 isMatch({a:1,b:2,c:3,d:{x:1,y:2}}, {b:2,d:{x:1}})
    function isMatch(obj, src) {
        if (obj === src) {
            return true
        }
        if ((typeof obj == 'object') + (typeof src == 'object') == 1) { //不是都为对象
            return false
                //lodash规则奇怪，src可以不是对象，也返回true
        }
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                if (typeof src[key] !== 'object') {
                    if (!obj.hasOwnProperty(key) || obj[key] !== src[key]) {
                        return false
                    }
                } else { //src[key]是Object，深层判断
                    if (src[key] === null && obj[key] !== null) {
                        return false
                    } else if (!isMatch(obj[key], src[key])) {
                        return false
                    }
                }
            }
        }
        return true
    }


    function isMatchWith(obj, src, customizer = function() {}) {
        if (customizer(obj, src) || obj === src) {
            return true
        }
        if ((typeof obj == 'object') + (typeof src == 'object') == 1) {
            return false
        }

        for (let key in src) {
            if (src.hasOwnProperty(key)) {
                if (!obj.hasOwnProperty(key)) {
                    return false
                } else {
                    if (customizer(obj[key], src[key], key, obj, src)) {
                        continue
                    }
                    if (typeof src[key] != 'object') {
                        return src[key] === obj[key]
                    } else {
                        if ((src[key] === null) + (obj[key] === null) === 1) {
                            return false
                        } else
                        if (!isMatchWith(obj[key], src[key], customizer)) {
                            return false

                        }
                    }
                }
            }
        }

        return true
    }



    function isEqual(a, b) {
        if (a === b) {
            return true
        }
        var typea = typeof a
        var typeb = typeof b
        if (typea !== typeb) { //类型不同
            return false
        } else {
            //类型相同,同为obj
            if (typea === 'object') {
                //数组、对象
                if (Array.isArray(a) + Array.isArray(b) == 1) { //一个数组一个不是数组
                    return false
                }
                if (Array.isArray(a)) { //两个数组
                    if (a.length !== b.length) {
                        return false
                    }
                } else { //两个对象
                    if (Object.keys(a).length !== Object.keys(b).length) {
                        return false
                    }
                }
                for (let key in a) {
                    if (!(key in b)) {
                        return false
                    }
                    if (!isEqual(a[key], b[key])) {
                        return false
                    }
                }
                return true
            } else {
                return a == b
            }
        }
    }


    function isGreeting(val) {
        return /^h(?:i|ello)$/.test(val)
    }

    //The customizer is invoked with up to six arguments: (objValue, othValue [, index|key, object, other, stack]).
    function customizer(objValue, othValue, idx, obj, other, stack) {
        if (isGreeting(objValue) && isGreeting(othValue)) {
            return true
        }
        //否则返回undefined
    }

    // If customizer returns undefined, comparisons are handled by the method instead.
    function isEqualWith(val, other, customizer = function() {}) {

        if (customizer(val, other) || val === other) { //maybe undefined
            return true
        }
        let typeVal = typeof val
        let typeOther = typeof other
        if (typeVal != typeOther) {
            return false
        } else {
            if (val && typeVal == 'object') {
                let valKeys = keys(val)
                let otherKeys = keys(other)
                if (valKeys.length != otherKeys.length) {
                    return false
                }
                for (let key in val) {
                    if (val.hasOwnProperty(key)) {
                        if (!other.hasOwnProperty(key)) {
                            return false
                        }
                        if (customizer(val[key], other[key], key, val, other)) { //比较函数比较不出来会返回undefined，再进行相等比较
                            continue
                        }
                        if (!isEqualWith(val[key], other[key])) {
                            return false
                        }
                    }
                }
                return true
            } else {
                return customizer(val, other) || val == other
            }
        }
    }


    //存疑  全局isNaN(undefined)=true，Number.isNaN(undefined)=false,
    // 全局 isNaN(new Number(NaN))=true  Number.isNaN(new Number(NaN)) = false 
    //该函数只检测作为数字的NaN。NaN与new Number(NaN)
    function isNaN(val) {
        if (typeof val === 'object') {
            return val.valueOf() !== val.valueOf()
        }
        return val !== val
    }

    function isNil(val) {
        if (val === null || val === undefined) {
            return true
        }
        return false
    }

    function isUndefined(val) {
        if (val === undefined) return true
        return false
    }

    function isNull(val) {

        if (val === null) {
            return true
        }
        return false
    }

    //Checks if value is classified as a Function object.
    function isFunction(val) {
        if (typeof val == 'function') {
            return true
        }
        return false
    }

    function isArguments(val) {
        return toString.call(val) === '[object Arguments]'
    }

    function isArray(val) {
        return toString.call(val) === '[object Array]'
    }

    function isArrayBuffer(val) { //指定字节长度的ArrayBuffer对象，表示通用的、固定长度的二进制数据缓冲区
        return Object.prototype.toString.call(val) === '[object ArrayBuffer]'
    }
    //检测值是否为类数组，只要不是function且有有效length属性即可，包括字符串
    function isArrayLike(val) {
        if (typeof val == 'function') {
            return false
        }
        //val.hasOwnProperty('length') document.body.children的length属性是个继承来的getter,故document.body.children.__proto__.hasOwnProperty('length')为true
        if (val.length >= 0 && val.length <= Number.MAX_SAFE_INTEGER) { //53位
            return true
        }
        return false
    }
    //类数组对象：对象里有有效的length属性且不是函数对象
    function isArrayLikeObject(val) {
        if (val && typeof val == 'object') {
            if (val.length >= 0 && val.length <= Number.MAX_SAFE_INTEGER) {
                return true
            }
        }
        return false
    }

    function isBoolean(val) {
        return Object.prototype.toString.call(val) === '[object Boolean]'
    }

    function isDate(val) {
        return Object.prototype.toString.call(val) === '[object Date]'
    }
    //dom元素从html开始皆继承于ELement.prototype 
    function isElement(val) {
        while (val) {
            if (val.__proto__ == Element.prototype) {
                return true
            }
            val = val.__proto__
        }
        return false
    }


    //https://lodash.com/docs/4.17.15#isEmpty
    //原子类型、对象、类数组对象、Map、Set
    function isEmpty(val) {
        if (typeof val != 'object' || !val) {
            return true
        }
        if (Object.prototype.toString(val) !== '[object Object]') {
            if (('size' in val && val.size == 0) || ('length' in val && val.length == 0)) {
                return true
            }
            return false
        }
        if (typeof val == 'object') {
            for (let key in val) {
                if (val.hasOwnProperty(key)) {
                    return false
                }
            }
            return true
        }
    }
    //EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError object.
    function isError(val) {
        while (val) {
            if (val.__proto__ === Error.prototype) {
                return true
            }
            val = val.__proto__
        }
        return false
    }
    //写法二 不循环
    function isError2(val) {
        if (Object.prototype.toString.call(val) == '[object Error]') {
            return true
        }
        return false
    }

    //Number.MAX_VALUE + 10**(308-16) === Infinity //IEEE754规定，大于1.7976931348623158e+308的数才为Infinity.同 Number.isFinite(),不会进行强制转换
    function isFinite(val) {
        if (typeof val == 'number' && Math.abs(val) !== Infinity) {
            return true
        }
        return false
    }

    //同 Number.isInterger()
    function isInteger(val) {
        // return val === (val | 0) //没法判断64位数
        return typeof val == 'number' && val - Math.floor(val) === 0
    }

    //类数组对象可用length,范围0到4字节
    function toLength(val) {
        if (val >= 0) {
            if (val <= 4294967295) { // 2147483648 * 2 - 1   2^32
                return val | 0
            }
            return 4294967295
        }
        return 0
    }

    function isLength(val) {
        return val === toLength(val)
    }

    function isMap(val) {
        return Object.prototype.toString.call(val) == '[object Map]'
    }

    //Checks if value is a pristine native function.
    function isNative2(val) {
        if (val) {
            return val.__proto__ == Function.prototype
        }
        return false
    }

    function isNative(val) {
        return Object.prototype.toString.call(val) == '[object Function]'
    }

    // exclude Infinity, -Infinity, and NaN
    function isNumber(val) {
        if (Math.abs(val) == Infinity || val != val || isFinite(val)) {
            return true
        }
        return false
    }

    // (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
    function isObject(val) {
        while (val) {
            if (val.__proto__ == Object.prototype) {
                return true
            }
            val = val.__proto__
        }
        return false
    }

    //A value is object-like if it's not null and has a typeof result of "object".
    function isObjectLike(val) {
        if (val !== null && typeof val == 'object') {
            return true
        }
        return false
    }

    //朴素对象
    function isPlainObject(val) {
        return val.__proto__ === Object.prototype || val.__proto__ === null
    }


    function toArray(value) {
        let res = [],
            type = typeof value
        if (type === 'object') {
            for (let k in value) {
                res.push(value[k])
            }
        } else if (type === 'string') {
            for (let i = 0; i < value.length; i++) {
                res.push(value[i])
            }
        }
        return res
    }

    function isRegExp(val) {
        return Object.prototype.toString.call(val) == '[object RegExp]'
    }

    //This method is based on Number.isSafeInteger.
    function isSafeInteger(val) {
        if (typeof val == 'number' &&
            Math.round(val) === val &&
            val >= Number.MIN_SAFE_INTEGER && val <= Number.MAX_SAFE_INTEGER) { //2^53 - 1 ~ -2^53
            return true
        }
        return false
    }

    function isSet(val) {
        return Object.prototype.toString.call(val) == '[object Set]'
    }

    function isString(val) {
        //new String() is true
        return Object.prototype.toString.call(val) == '[object String]'
    }

    //Casts value as an array if it's not one.
    //array = [1, 2, 3]; console.log(_.castArray(array) === array);// => true
    function castArray(val) {
        if (arguments.length == 0) {
            return []
        }
        if (Array.isArray(val)) {
            return val
        } else {
            return [val]
        }
    }

    //src属性对应着obj属性，src属性值是个检测obj属性值的函数。
    function conformsTo(obj, src) {
        for (let key in src) {
            if (src.hasOwnProperty(key)) {
                if (!obj.hasOwnProperty(key) || !src[key](obj[key])) {
                    return false
                }
            }
        }
        return true
    }

    //SameValueZero  +0 === -0 === 0
    function eq(val, other) {
        if (isNaN(val)) {
            return isNaN(other)
        }
        return val === other
    }

    // great than
    function gt(val, other) {
        if (val - other > Number.EPSILON) {
            return true
        }
        return false
    }

    function gte(val, other) {
        if (val - other > Number.EPSILON || Math.abs(val - other) < Number.EPSILON) {
            return true
        }
        return false
    }
    //如果other是String，就只解析它的第一位数字位，如果val也是String，就对比他俩的第一位
    function lt(val, other) {
        let num1 = parseFloat(val)
        let type1 = typeof val
        let num2 = parseFloat(other)
        if (type1 != 'string' && type1 != 'number') {
            return false
        }
        if (typeof other == 'string') {
            if (num2 < 0) {
                num2 = parseFloat(other.substr(0, 2))
            }
            if (type1 == 'string') {
                if (num1 < 0) {
                    // num1 = parseFloat(val.subStr(0, 2)) //lt('-1','-5')=>true
                    return true
                } else { //_.lt('1','-5')=>false _.lt('50','100')=>false _.lt('10','200')=>true
                    if (num2 < 0) {
                        return false
                    } else {
                        for (var i = 0; i < val.length; i++) {
                            if (Number(val[i]) > Number(other[i])) {
                                return false
                            }
                        }
                        return true
                    }
                }
            } else {
                return num1 < num2
            }

        } else if (typeof other == 'number') {
            return num2 - num1 > Number.EPSILON
        }
        return false
    }

    function lte(val, other) {
        let type1 = typeof val
        let type2 = typeof other
        let num1 = parseFloat(val)
        let num2 = parseFloat(other)
        if (type1 == 'string' && type2 == 'string') {
            for (let i = 0; i < num1.length; i++) {
                if (!other[i] || val.charCodeAt(i) > other.charCodeAt(i)) {
                    return false
                }
            }
            return true
        } else if ((type2 == 'number' && type1 == 'string') || (type1 == 'number' && type2 == 'string')) {
            return Number(val) <= Number(other)
        } else if (type2 == 'number' && type1 == 'number') {
            return Math.abs(other - val) < Number.EPSILON || other > val
        }
        return false
    }

    function isTypedArray(val) {
        if (!val) {
            return false
        }
        return Object.prototype.toString.call(val) === '[object Uint8Array]'
    }

    function isSymbol(val) {
        if (!val) {
            return false
        }
        return Object.prototype.toString.call(val) == '[object Symbol]'
    }

    function isWeakMap(val) {
        if (!val) {
            return false
        }
        return Object.prototype.toString.call(val) == '[object WeakMap]'
    }

    function isWeakSet(val) {
        if (!val) {
            return false
        }
        return Object.prototype.toString.call(val) == '[object WeakSet]'
    }

    function toFinite(val) {
        //Converts value to a finite number.
        if (Math.abs(val) == Infinity) {
            return val < 0 ? -Number.MAX_VALUE : Number.MAX_VALUE
        }
        return isNaN(Number(val)) ? 0 : Number(val)
    }

    /**
     * Let number be ? ToNumber(argument).
     * If number is NaN, return +0.
     * If number is +0, -0, +∞, or -∞, return number.
     * Return the number value that is the same sign as number and whose magnitude isfloor(abs(number)).
     */

    // it will 去掉 last 位,正负数向0取整
    function toInteger(val) {
        if (typeof val != 'number') {
            if (isNaN(Number(val))) {
                return +0
            }
            val = Number(val)
        }
        if (Math.abs(val) == Infinity) {
            return val < 0 ? -Number.MAX_VALUE : Number.MAX_VALUE
        }
        return val < 0 ? -Math.floor(Math.abs(val)) : Math.floor(val)
    }

    function toNumber(val) {
        return Number(val)
    }

    //将srcs中每个src的实例可枚举属性
    function assign(obj, ...srcs) {
        for (let i = 0; i < srcs.length; i++) {
            let src = srcs[i]
            if (typeof src == 'object') {
                for (let key in src) {
                    if (src.hasOwnProperty(key)) {
                        obj[key] = src[key]
                    }
                }
            }
        }
        return obj
    }

    function assignIn(obj, ...srcs) {
        for (let i = 0; i < srcs.length; i++) {
            let src = srcs[i]
            if (typeof src == 'object') {
                for (let key in src) {
                    obj[key] = src[key]
                }
            }
        }
        return obj
    }

    function toSafeInteger(val) {
        val = toInteger(val)
        if (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER) {
            val = val < 0 ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER
        }
        return val
    }

    function cloneDeep(val, map = new Map(), latestObj = val, latestKey) {
        //cloneDeep最好的实现版本还是笔记上的双函数：deepClone+deepMutate，本方案的实现会将cloneDeep传染成async，对cloneDeep的调用者也会被传染成async且必须await cloneDeep的结果
        let circleVal
        if (map.has(val)) {
            circleVal = map.get(val)
            if (typeof circleVal == 'function' && (circleVal.name == '_needToMap' || circleVal.name == '_needToSet')) {
                circleVal().then(() => { latestObj[latestKey] = map.get(val) })
                    //我并不需要resolve出的结果
            } else {
                return circleVal
            }
        }

        let result
        latestObj = val //获取本轮更新的对象
        if (val === null) {
            return null
        } else if (Array.isArray(val)) {
            result = []
            map.set(val, result)
            for (let key in val) {
                if (val.hasOwnProperty(key)) {
                    latestKey = key
                    result[key] = cloneDeep(val[key], map, latestObj, latestKey) //不用push怕数组上挂载了其他自定义属性
                }
            }
        } else if (val instanceof RegExp) { //dont think about val.xxx in constructor of RegExp and Date.
            return new RegExp(val, val.flags)
        } else if (val instanceof Date) {
            return new Date(val)
        } else if (val instanceof Map) {
            let valToAry = [...val.entries()] //also can be [...val]
                // valToAry._needToMap = true
            map.set(val, function _needToMap() { return Promise.resolve(valToAry) }) //先拿这个数组凑个数
                //迭代map的核心数组
            for (let key in valToAry) { //也可以直接迭代val
                if (valToAry.hasOwnProperty(key)) {
                    latestKey = key
                    result.push(cloneDeep(valToAry[key], map, latestObj, latestKey)) //如果这里面有环：属性xx指向这里的val，那么只有到第二次cloneDeep当前层的result时，才能从map里发现它；亦或者是死循环；解决：利用微任务的时间差拿到值
                }
            }
            result = new Map(result)
            map.set(val, result)
        } else if (val instanceof Set) {
            let valToAry = Array.from(val)
            map.set(val, function _needToSet() { return Promise.resolve(valToAry) })
            for (let key in valToAry) {
                if (valToAry.hasOwnProperty(key)) {
                    latestKey = key
                    result.push(cloneDeep(valToAry[key], map, latestObj, latestKey))
                }
            }
            result = new Set(result)
            map.set(val, result)
        } else if (typeof val == 'object') {
            result = {}
            map.set(val, result)
            for (let key in val) {
                if (val.hasOwnProperty(key)) {
                    latestKey = key
                    result[key] = cloneDeep(val[key], map, latestObj, latestKey)
                }
            }
        } else { //非对象
            return val
        }
        return result
    }


    //----------------Lang-----------------





    /*-----------------------------------
     *              Math
     *------------------------------------
     */

    function sum(ary) {
        let res = 0
        for (let i = 0; i < ary.length; i++) {
            res += ary[i]
        }
        return res
    }

    function sum2(ary) {
        return ary.reduce((res, item) => {
            return res + item
        })
    }

    function sum3(ary) {
        return sumBy(ary)
    }
    //根据谓词求和，谓词用来计算每项的值，或是在对象里作为属性传属性值
    function sumBy(ary, predicate = identity) { //即predicate= it=>it
        predicate = iteratee(predicate)
        var result = 0
        for (let i = 0; i < ary.length; i++) {
            result += predicate(ary[i], i, ary)
        }
        return result
    }


    function floor(num, precision = 0) {
        var digit = Math.pow(10, precision)
        var result = num * digit | 0
        return result / digit
    }

    function max(ary) {
        if (isArray(ary)) {
            let result = ary.reduce((max, it) => {
                if (typeof it == 'string') {
                    if (typeof max == 'number') {
                        return Math.max(max, Number(it.charCodeAt(0)))
                    } else if (typeof max == 'string') {
                        return Math.max(Number(max))
                    }
                } else if (typeof it == 'number') {
                    return Math.max()
                }
            }, -Infinity)
        }
    }

    function add(augend, addend) {
        return augend + addend
    }


    function ceil(number, precision = 0) {
        if (number == 0) {
            return 0
        }
        if (!precision) {
            precision = 0
        }
        precision = toInteger(precision)
        let result = number * Math.pow(10, precision) | 0
        return result * Math.pow(10, -precision) == number ? result * Math.pow(10, -precision) : (result + 1) * Math.pow(10, -precision)
    }

    function ceilWrong(number, precision = 0) {
        // ???我在干嘛
        if (number == 0) {
            return 0
        }
        if (!precision) { // prevent undefined
            precision = 0
        }
        precision = toInteger(precision)

        let absNumber = Math.abs(number)
        let sign = absNumber == number ? 1 : -1
        let strNum = absNumber.toString()
        let dot = '.',
            dotIdx = strNum.length
        for (let i = 0; i < strNum.length; i++) {
            dotIdx = strNum[i] == dot ? i : dotIdx
        }
        if (precision >= 0) {
            if (dotIdx + precision >= strNum.length - 1) {
                return number
            } else {
                return Number(strNum.substr(0, dotIdx + precision + 1)) + 1 * Math.pow(10, -precision)
            }
        } else { //precision < 0
            let dealedIdx = dotIdx - 1
            dealedIdx = dealedIdx + precision
            if (dealedIdx > 0) {
                strNum.slice(0, dealedIdx)
            }
        }
    }

    function divide(dividend, devisor = 1) {
        dividend = Number(dividend)
        devisor = Number(devisor)
        return dividend / devisor
    }




    function max(ary) {
        if (typeof ary == 'string' || Array.isArray(ary)) {
            if (!ary.length) {
                return undefined
            }
            let max = -Infinity
            for (let i = 0; i < ary.length; i++) {
                max = ary[i] > max ? ary[i] : max
            }
            return max
        }
        return undefined
    }

    function maxBy(ary, predicate = identity) {
        predicate = iteratee(predicate)
        if (typeof ary == 'string' || Array.isArray(ary)) {
            if (!ary.length) {
                return undefined
            }
            let max = -Infinity,
                maxIdx = -1
            for (let i = 0; i < ary.length; i++) {
                if (predicate(ary[i]) > max) {
                    max = predicate(ary[i])
                    maxIdx = i
                }
            }
            if (maxIdx == -1) {
                return -Infinity
            }
            return ary[maxIdx]
        }
        return undefined
    }

    //average of ary 
    function mean(ary) {
        if (!('length' in ary)) {
            return NaN
        }
        let len = ary.length
        let sumofAry = sum(ary)
        return sumofAry / len
    }


    function meanBy(ary, predicate = identity) {
        if (!('length' in ary)) {
            return NaN
        }
        let sum = 0
        let len = ary.length
        predicate = iteratee(predicate)
        for (let i = 0; i < len; i++) {
            sum += predicate(ary[i])
        }
        return sum / len
    }

    function min(ary) {
        if (typeof ary == 'string' || Array.isArray(ary)) {
            let len = ary.length
            if (!len) {
                return undefined
            }
            let result = Infinity
            for (let i = 0; i < len; i++) {
                result = ary[i] < result ? ary[i] : result
            }

            return result
        }
        return undefined
    }

    function minBy(ary, predicate = identity) {
        if (typeof ary == 'string' || Array.isArray(ary)) {
            let len = ary.length
            if (!len) {
                return undefined
            }
            predicate = iteratee(predicate)
            let min = Infinity,
                minIdx = -1
            for (let i = 0; i < len; i++) {
                let val = predicate(ary[i])
                if (val < min) {
                    min = val
                    minIdx = i
                }
            }
            if (minIdx == -1) {
                return Infinity
            }
            return ary[minIdx]
        }
        return undefined

    }

    function multiply(multiplier, multiplicand) {
        return multiplier * multiplicand
    }

    function round(number, precision = 0) {
        let temp = number * Math.pow(10, precision)
        let ft = Math.abs(temp - Math.floor(temp))
        if (ft >= 0.5) {
            if (precision >= 0) {
                return Number(((Math.floor(temp) + 1) * Math.pow(10, -precision)).toFixed(precision))
            } else {
                return (Math.floor(temp) + 1) * Math.pow(10, -precision)
            }
        } else {
            if (precision >= 0) {
                return Number((Math.floor(temp) * Math.pow(10, -precision)).toFixed(precision)) //round(0.25,1)=>0.30000000000000004× 0.3√
            } else {
                return Math.floor(temp) * Math.pow(10, -precision)
            }
        }
    }

    function subtract(minuend, subtrahend) {
        return minuend - subtrahend
    }

    // -------------------Math--------------------



    /*-----------------------------------
     *              Number
     *------------------------------------
     */

    //类似夹逼定理的夹数
    function clamp(num, lower, upper) {
        if (arguments.length == 2) {
            upper = lower
            return num > upper ? upper : num
        } else if (arguments.length == 3) {
            if (upper < lower) {
                return num < lower ? lower : num
            } else {
                if (num < lower) {
                    return lower
                } else if (num >= lower && num < upper) {
                    return num
                } else {
                    return upper
                }
            }
        } else {
            return num
        }
    }

    //number is in range of [start, end)
    function inRange(number, start = 0, end) {
        if (arguments.length == 2) {
            end = start
            start = 0
        }
        if (end < start) {
            let temp = start
            start = end
            end = temp
        }
        if (number >= start && number < end) {
            return true
        }
        return false
    }

    function random(lower = 0, upper = 1, floating = false) {
        if (typeof lower != 'number' && typeof lower != 'boolean') {
            lower = 0
        }
        if (typeof upper != 'number' && typeof upper != 'boolean') {
            upper = 0
        }
        if (lower - Math.floor(lower) > 0 || upper - Math.floor(upper) > 0) {
            floating = true
        }

        if (arguments.length == 0) {
            return Math.round(Math.random())
        }
        if (arguments.length == 1) {
            if (typeof lower == 'number') {
                if (lower > 0) {
                    upper = lower
                    lower = 0
                } else {
                    upper = 0
                }
                let result = lower + Math.random() * (upper - lower)
                if (floating) {
                    return result
                } else {
                    return Math.round(result)
                }

            } else {
                if (lower == true) {
                    return Math.random()
                } else {
                    return Math.round(Math.random())
                }
            }
        }

        if (arguments.length == 2) {
            if (typeof upper == 'number') {
                if (upper < lower) {
                    let temp = lower
                    lower = upper
                    upper = lower
                }
                let result = lower + Math.random() * (upper - lower)
                if (floating) {
                    return result
                } else {
                    return Math.round(result)
                }
            } else { //boolean
                if (upper == true) {
                    floating = true
                }
                if (lower > 0) {
                    upper = lower
                    lower = 0
                } else {
                    upper = 0
                }
                let result = lower + Math.random() * (upper - lower)
                if (floating) {
                    return result
                } else {
                    return Math.round(result)
                }
            }
        }

        if (arguments.length == 3) {
            if (lower > upper) {
                let temp = lower
                lower = upper
                upper = temp
            }
            let result = lower + Math.random() * (upper - lower)
            if (floating) {
                return result
            } else {
                return Math.round(result)
            }
        }
    }


    //----------------Number------------------


    /*-----------------------------------
     *              Object
     *------------------------------------
     */

    //获取object的'a.b.c'属性
    //传参方式一：get(object, 'a[0].b.c',defalut)
    //传参方式二：get(object, ['a','0','b','c'])
    function get(object, path, defaultVal) {
        if (typeof path === 'string') {
            path = toPath(path) //将字符串path转为数组，如传参方式二
        }
        for (let i = 0; i < path.length; i++) {
            if (object == undefined) { //null == undefined//true，或是循环中读到空。 不用reduce：reduce没有办法提前返回；null也读不到属性
                return defaultVal
            }
            object = object[path[i]]
        }
        return object
    }

    //递归写法，获取object的path路径上的属性
    function get2(object, path, defaultVal = undefined) {
        if (object == undefined) { //object传进来时可能为null，递归过程中可能为undefined
            return defaultVal
        } else if (path.length == 0) {
            return object
        } else {
            return get2(object[path[0]], path.slice(1), defaultVal)
        }
    }


    function forIn(obj, predicate = identity) {
        // predicate = 
        for (var key in obj) {
            if (predicate(obj[key], key, obj) === false) {
                break
            }
        }
        return obj
    }

    function forInRight(obj, predicate = identity) {
        var keyAry = []
        for (var key in obj) {
            keyAry.push(key)
        }
        for (let i = keyAry.length - 1; i >= 0; i--) {
            predicate(obj[keyAry[i]], keyAry[i], obj)
            if (predicate(obj[keyAry[i]], keyAry[i], obj) === false) {
                break
            }
        }
        return obj
    }

    function forOwn(obj, predicate = identity) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (predicate(obj[key], key, obj) === false) {
                    break
                }
            }
        }
        return obj
    }

    function forOwnRight(obj, predicate = identity) {
        var keyAry = []
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keyAry.push(key)
            }
        }
        for (let i = keyAry.length - 1; i >= 0; i--) {
            if (predicate(obj[keyAry[i]], keyAry[i], obj) === false) {
                break
            }
        }
        return obj
    }

    //将实例对象上的key:val变为[key,val]
    function toPairs(obj) {
        if (isMap(obj) || isSet(obj)) {
            return [...obj.entries()]
        }

        var result = []
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push([key, obj[key]])
            }
        }
        return result
    }

    function toPairsIn(obj) {
        if (isMap(obj) || isSet(obj)) {
            return [...obj.entries()]
        }
        let result = []
            // if(typeof obj[Symbol.iterator] == 'function'){
            //     // for(let item of obj) //需要生成器挂载到Object.prototype，并重写内容使其合法
            // }

        for (let key in obj) {
            result.push([key, obj[key]])
        }
        return result
    }

    //返回对象上的所有自有方法名组成的数组
    function functions(obj) {
        var result = []
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && isFunction(obj[key])) {
                result.push(key)
            }
        }
        return result
    }
    //返回对象上所有 自有方法+原型继承方法的方法名组成的数组
    function functionsIn(obj) {
        var result = []
        for (let key in obj) {
            if (isFunction(obj[key])) {
                result.push(key)
            }
        }
        return result
    }


    function keys(obj) {
        let res = []
        for (let k in obj) {
            if (obj.hasOwnProperty(k))
                res.push(k)
        }
        return res
    }

    function keysIn(obj) {
        let res = []
        for (let k in obj) {
            res.push(k)
        }
        return res
    }

    //对于obj的可枚举属性，依托断言函数修改这些属性名，返回新对象
    function mapKeys(obj, mapper = identity) {
        let res = {}
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                res[mapper(obj[k], k, obj)] = obj[k]
            }
        }
        return res
    }
    //对于obj的可枚举属性，依托断言函数修改这些属性值，返回和原对象property相同的新对象
    function mapValues(obj, mapper = identity) {
        mapper = iteratee(mapper)
        let res = {}
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                res[k] = mapper(obj[k], k, obj)
            }
        }
        return res
    }

    function mapValuesWrong(obj, mapper = identity) {
        mapper = iteratee(mapper)
        return reduce(obj, mapper, {})
    }

    function values(obj) {
        let dealed = new Object(obj)
        let res = []
        for (let k in dealed) {
            if (dealed.hasOwnProperty(k)) {
                res.push(dealed[k])
            }
        }
        return res
    }

    function valuesIn(obj) {
        let result = []
        for (let key in obj) {
            result.push(obj[key])
        }
        return result
    }




    function at(obj, path) {
        if (!Array.isArray(path) && typeof path != 'string') {
            return []
        }
        let result = []
        for (let i = 0; i < path.length; i++) {
            result.push(get(obj, path[i]))
        }
        return result
    }

    // 仅仅补全obj上不存在的属性啦
    function defaults(obj, ...srcs) {
        for (let i = 0; i < srcs.length; i++) {
            let src = srcs[i]
            if (src && typeof src == 'object') {
                for (let key in src) {
                    if (src.hasOwnProperty(key) && obj[key] == undefined) {
                        obj[key] = src[key]
                    }
                }
            }
        }
        return obj
    }

    function defaultsDeep(obj, ...srcs) {
        for (let i = 0; i < srcs.length; i++) {
            let src = srcs[i]
            if (src && typeof src == 'object') {
                for (let key in src) {
                    if (src.hasOwnProperty(key)) {
                        if (src[key] && typeof src[key] == 'object') {
                            if (obj[key] === undefined) {
                                obj[key] = {}
                            }
                            if (obj[key] && typeof obj[key] == 'object') {
                                obj[key] = defaultsDeep(obj[key], src[key])
                            }
                        } else {
                            if (obj[key] === undefined) {
                                obj[key] = src[key]
                            }
                        }
                    }
                }
            }
        }
        return obj
    }

    function findKey(obj, predicate = identity) {
        predicate = iteratee(predicate)
        for (let key in obj) {
            if (predicate(obj[key], key, obj)) {
                return key
            }
        }
    }

    function findLastKey(obj, predicate = identity) {
        predicate = iteratee(predicate)
        let keys = Object.keys(obj)
        for (let i = keys.length - 1; i >= 0; i--) {
            if (predicate(obj[keys[i]], keys[i], obj)) {
                return keys[i]
            }
        }
    }

    function has(obj, path) { //  own
        path = toPath(path)
        for (let i = 0; i < path.length; i++) {
            if (!obj.hasOwnProperty(path[i])) {
                return false
            }
            obj = obj[path[i]]
        }
        return true
    }

    function hasIn(obj, path) { //prototype included
        path = toPath(path)
        for (let i = 0; i < path.length; i++) {
            if (!(path[i] in obj)) {
                return false
            }
            obj = obj[path[i]]
        }
        return true
    }


    function invert(obj) { //no deep
        let result = {}
        let keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            result[obj[key]] = key
        }
        return result
    }

    function invertBy(obj, predicate = identity) {
        let result = {}
        let keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) { //lodash很奇怪，By却不倒着遍历了
            let key = predicate(obj[keys[i]])
            let val = keys[i]
            if (key in result) {
                result[key].push(val)
            } else {
                result[key] = [val]
            }
        }
        return result
    }

    function invoke(obj, path, ...args) {
        path = toPath(path)
        for (var i = 0; i < path.length - 1; i++) {
            if (!(path[i] in obj)) { //insurance
                return -1
            }
            obj = obj[path[i]]
        }
        return obj[path[i]].call(obj, ...args)
    }

    function merge(obj, ...srcs) {
        for (let i = 0; i < srcs.length; i++) {
            let src = srcs[i]
            for (let key in src) {
                if (src[key] && typeof src[key] == 'object' && obj[key] && typeof obj[key] == 'object') {
                    obj[key] = merge(obj[key], src[key])
                } else {
                    obj[key] = src[key]
                }
            }
        }
        return obj
    }

    function mergeWith(obj, ...srcs) {
        let customizer = function() {}
        if (typeof srcs[srcs.length - 1] == 'function') {
            customizer = srcs.pop()
        }
        for (let i = 0; i < srcs.length; i++) {
            let src = srcs[i]
            for (let key in src) {

                let val = customizer(obj[key], src[key], key, obj, src)
                if (val === undefined) {
                    if (src[key] && typeof src[key] == 'object' && obj[key] && typeof obj[key] == 'object') {
                        obj[key] = mergeWith(obj[key], src[key])
                    } else {
                        obj[key] = src[key]
                    }
                } else {
                    obj[key] = val
                }

            }
        }
        return obj
    }

    //就只剩path里没有的属性啦，每一项paths[i]都可能是数组||字符串，不deep只一层.toPath仅仅是解析成单个的属性
    function omit(obj, ...paths) {
        let path = paths.reduce((accum, item) => {
            return accum.concat(toPath(item))
        }, [])
        let pathSet = new Set(path)
        let result = {}
        for (let key in obj) {
            if (!pathSet.has(key)) {
                result[key] = obj[key]
            }
        }
        return result
    }

    function omitBy(obj, predicate = identity) {
        predicate = iteratee(predicate)
        let result = {}
        for (let key in obj) {
            if (predicate(obj[key], key) === false) {
                result[key] = obj[key]
            }
        }
        return result
    }

    function pick(obj, ...paths) {
        let path = paths.reduce((accum, item) => {
            return accum.concat(toPath(item))
        }, [])
        let pathSet = new Set(path)
        let result = {}
        for (let key in obj) {
            if (pathSet.has(key)) {
                result[key] = obj[key]
            }
        }
        return result
    }

    function pickBy(obj, predicate = identity) {
        predicate = iteratee(predicate)
        let result = {}
        for (let key in obj) {
            if (predicate(obj[key], key) === true) {
                result[key] = obj[key]
            }
        }
        return result
    }

    function result(obj, path, defaultVal) {
        path = toPath(path)
        let flag = typeof defaultVal == 'function'
        if (obj == undefined) {
            return flag ? defaultVal.call(undefined) : defaultVal
        }
        for (let i = 0; i < path.length; i++) {

            let next = obj[path[i]]
            if (next == undefined) {
                return flag ? defaultVal.call(obj) : defaultVal
            }

            if (i == path.length - 1) {
                if (typeof next == 'function') {
                    return next.call(obj)
                }
            }
            obj = next
        }
        return obj
    }

    function set(obj, path, val) {
        if (typeof obj != 'object' || !obj) {
            return obj
        }
        let p = obj
        path = toPath(path)

        for (var i = 0; i < path.length - 1; i++) {
            if (p.hasOwnProperty(path[i])) {
                p = p[path[i]] //可能这里还需要看看这一项是不是obj的type，
            } else { //p没有这一项，看看这一项应该是什么
                let nextVal
                if (Number(path[i + 1]) == path[i + 1]) {
                    nextVal = Array(Number(path[i + 1]) + 1)
                } else {
                    nextVal = {}
                }
                p[path[i]] = nextVal
                p = p[path[i]]
            }
        }
        p[path[i]] = val
        return obj
    }

    function setWith(obj, path, val, customizer = function() {}) {
        //这个代码起码能够达到效果
        path = toPath(path)

        if (customizer === Object) {
            let p = obj
            for (var i = 0; i < path.length - 1; i++) {
                let key = path[i]
                let nextVal = p[key]
                if (p.hasOwnProperty(key)) {
                    if (typeof nextVal != 'object') {
                        p[key] = {}
                    }
                    p = p[key]
                } else {
                    p[key] = {}
                    p = p[key]
                }
            }
            p[path[i]] = val
            return obj
        } else {
            return set(obj, path, val)
        }

    }


    function transform(obj, predicate = identity, accum) {
        let keys = Object.keys(obj)
        let startIdx = 0
        if (arguments.length == 2) {
            accum = obj[keys[0]]
            startIdx = 1
        }
        for (let i = startIdx; i < keys.length; i++) {
            if (predicate(accum, obj[keys[i]], keys[i], obj) === false) {
                break
            }
            // if(accum === false){
            //     break
            // }
        }
        return accum
    }

    function unset(obj, path) {
        path = toPath(path)
        for (var i = 0; i < path.length - 1; i++) {
            if (!obj.hasOwnProperty(path[i])) {
                return true //lodash很奇怪，它只要求里面没有path这条属性，不要求删没删成功.
            }
            obj = obj[path[i]]
        }
        return delete obj[path[i]] //操作完后，只要里面没有那个属性就会返回true
    }

    function update(obj, path, updater = () => {}) {
        if (typeof obj != 'object' || !obj) {
            return obj
        }
        path = toPath(path)
        let p = obj

        for (var i = 0; i < path.length - 1; i++) {
            let nextVal = p[path[i]]
            if (p.hasOwnProperty(path[i])) {
                if (typeof nextVal == 'object') {
                    p = p[path[i]]
                } else {
                    if (Number(path[i + 1]) == path[i + 1]) {
                        nextVal = Array(Number(path[i + 1]) + 1)
                    } else {
                        nextVal = {}
                    }
                    p[path[i]] = nextVal
                    p = p[path[i]]
                }
            } else {
                if (Number(path[i + 1]) == path[i + 1]) {
                    nextVal = Array(Number(path[i + 1]) + 1)
                } else {
                    nextVal = {}
                }
                p[path[i]] = nextVal
                p = p[path[i]]
            }
        }
        p[path[i]] = updater(p[path[i]])
        return obj
    }


    function updateWith(obj, path, updater, customizer = () => {}) {
        //customizer will create a new path.but...
        // i cant understand, but be appalled. suibianxiexie
        if (typeof obj != 'object' || !obj) {
            return obj
        }
        path = toPath(path)
        let p = obj
        if (customizer === Object) {

            for (var i = 0; i < path.length - 1; i++) {
                let nextVal = p[path[i]]
                if (p.hasOwnProperty(path[i])) {
                    if (typeof nextVal == 'object') {
                        p = p[path[i]]
                    } else {
                        nextVal = {}
                        p[path[i]] = nextVal
                        p = p[path[i]]
                    }
                } else {
                    nextVal = {}
                    p[path[i]] = nextVal
                    p = p[path[i]]
                }
            }

            p[path[i]] = updater(p[path[i]])
            return obj
        } else {
            return update(obj, path, updater)
        }

    }

    //----------------------Object----------------------------

    /*-----------------------------------
     *              Seq
     *------------------------------------
     */





    /*-----------------------------------
     *              String
     *------------------------------------
     */




    /*-----------------------------------
     *              Util
     *------------------------------------
     */

    //根据不同类型生成不同的断言函数
    function iteratee(maybePredicate) {
        if (typeof maybePredicate === 'function') {
            return maybePredicate
        } else if (typeof maybePredicate === 'string') {
            return property(maybePredicate) //输入属性，返回属性值
        } else if (Array.isArray(maybePredicate)) {
            return matchesProperty(...maybePredicate) // 输入...[key,val]，返回断言是否其超集
        } else if (maybePredicate instanceof RegExp) {
            return isMatchByRegexp(maybePredicate) //输入正则，返回断言是否匹配string
        } else if (typeof maybePredicate === 'object') {
            return matches(maybePredicate) //输入对象，返回断言是否其超集
        }
    }


    //传入什么属性名，它返回的函数就用来获取对象的属性值
    function property(prop) {
        // return bind(get,null, _, prop) //当一个函数调用另一个函数，传入的参数不变的情况下，永远可以被优化为bind写法
        return function(obj) {
            // return obj[prop]
            return get(obj, prop) //get(obj, path)得到深层路径下的属性值
        }
    }

    //_.map(['a[2]', 'c[0]'], _.propertyOf(object));
    // => [2, 0]
    function propertyOf(obj) {
        return function(...args) {
            let valPath = args[0]
            return get(obj, valPath)
        }
    }



    //将String的路径转为数组 
    //假设路径合法， 'a[0].b.c[0][3][4].foo.bar[2]'  ---> ['a','0','b','c','0','3','4','foo','bar']  右括号必须遇到左括号或者.，单独的左括号和单独的.
    function toPath(val) {
        if (Array.isArray(val)) {
            return val
        } else {
            var res = val.split(/\]\[|\]\.|\.|\[|\]/)
            if (res[0] === '') {
                res.shift()
            }
            if (res[res.length - 1] === '') {
                res.pop()
            }
            return res
        }
    }

    function toPath2(val) {
        if (Array.isArray(val)) {
            return val
        } else {
            var result = val.split('][')
                .reduce((res, it) => res.concat(it.split('].')), [])
                .reduce((res, it) => res.concat(it.split('[')), [])
                .reduce((res, it) => res.concat(it.split('.')), [])
            var item = result[result.length - 1]
            if (item[item.length - 1] === ']') { //val最后属性为[2]时，该项为2]，需要把]去掉
                result[result.length - 1] = item.slice(0, item.length - 1)
            }
            return result
        }
    }


    //src为filter接收的对象，判断src是否是obj的子集.没有考虑深层次嵌套
    //函数构造器matches，返回的函数传入的参数应是传入matches里的超集。不支持深层
    function matches2(src) {
        return function(obj) {
            if (obj === src) {
                return true
            }
            for (var key in src) {
                if (!obj.hasOwnProperty(key) || obj[key] !== src[key]) {
                    return false
                }
            }
            return true
        }
    }
    //对matches的优化改进，支持了深层比较
    function matches(src) {
        // return bind(isMatch, null, window, src)
        return function(obj) {
            return isMatch(obj, src)
        }
    }



    //判断obj在path路径下的属性值与val是否深度相等
    function matchesProperty(path, val) {
        return function(obj) {
            return isEqual(get(obj, path), val)
        }
    }


    //返回它自己
    function identity(val) {
        return val
    }
    //调用iteratee n次，返回调用结果
    function times(n, iteratee = identity) {
        let result = []
        let idx = 0
        while (n) {
            result.push(iteratee(idx))
            idx++
            n--
        }
        return result
    }
    //常量函数，创建一个返回val的函数
    function constant(val) {
        return function() {
            return val
        }
    }

    //返回第一个接收到的参数
    function identity(val) {
        return arguments[0]
    }
    //实测了很多类型与上下界情况...
    function range(start = 0, end, step = 1) {
        let result = []
        start = Number(start)
        end = Number(end)
        step = Number(step)
        start = isNumber(start) && !isNaN(start) ? start : 0
        end = isNumber(end) && !isNaN(end) ? end : 0
        step = isNumber(step) && !isNaN(step) ? step : 0

        if (arguments.length == 0) {
            return result
        } else if (arguments.length == 1) {
            if (start >= 0) {
                for (let i = 0; i < start; i++) {
                    result.push(i)
                }
            } else {
                for (let i = 0; i > start; i--) {
                    result.push(i)
                }
            }
        } else if (arguments.length == 2) {
            if (start <= end) {
                for (let i = start; i < end; i++) {
                    result.push(i)
                }
            } else {
                for (let i = start; i > end; i--) {
                    result.push(i)
                }
            }
        } else if (arguments.length == 3) {
            if (step == 0) {
                result = Array(end - start > 0 ? end - start : 0).fill(start)
            } else {
                if (step > 0 && end - start > 0) {
                    for (let i = start; i < end; i += step) {
                        result.push(i)
                    }
                } else if (step < 0 && end - start < 0) {
                    for (let i = start; i > end; i += step) {
                        result.push(i)
                    }
                }
            }
        }
        return result
    }

    function rangeRight(start = 0, end, step = -1) {
        let result = []
        start = Number(start)
        end = Number(end)
        step = Number(step)
        start = isNumber(start) && !isNaN(start) ? start : 0
        end = isNumber(end) && !isNaN(end) ? end : 0
        step = isNumber(step) && !isNaN(step) ? step : 0
            //not unshift写法，but reverse写法
        if (arguments.length == 0) {
            return result
        } else if (arguments.length == 1) {
            if (start >= 0) {
                for (let i = 0; i < start; i++) {
                    result.push(i)
                }
            } else {
                for (let i = 0; i > start; i--) {
                    result.push(i)
                }
            }
        } else if (arguments.length == 2) {
            if (start <= end) {
                for (let i = start; i < end; i++) {
                    result.push(i)
                }
            } else {
                for (let i = start; i > end; i--) {
                    result.push(i)
                }
            }
        } else if (arguments.length == 3) {
            if (step == 0) {
                result = Array(end - start > 0 ? end - start : 0).fill(start)
            } else {
                if (step > 0 && end - start > 0) {
                    for (let i = start; i < end; i += step) {
                        result.push(i)
                    }
                } else if (step < 0 && end - start < 0) {
                    for (let i = start; i > end; i += step) {
                        result.push(i)
                    }
                }
            }
        }
        return result.reverse()
    }


    function defaultTo(val, defaultVal) {
        //如果val传的是个函数,loadsh并没有查看函数的返回值符不符合规则
        if (val === null || val === undefined || isNaN(val)) {
            return defaultVal
        }
        return val
    }

    //得到第n个参数
    function nthArg(n = 0) {
        return function(...args) {
            return n >= 0 ? args[n] : args[args.length + n]
        }
    }

    //创建的方法被调用在接受对象的path路径上。应付着答案写
    function method(path, ...args) {
        path = toPath(path)
        return function(...argms) {
            let v = argms[0]
            if (!(path[0] in v) || path.length < 1) {
                return
            }
            for (let i = 1; i < path.length; i++) {
                v = v[path[i - 1]]
                if ((!path[i] in v)) {
                    return
                }
            }
            v = v[path[path.length - 1]]
            return v.apply(this, argms.concat(args))
        }

    }


    function methodOf(obj, ...args) {
        return function(...argms) {
            let valPath = argms[0]
            let f = get(obj, valPath)
            return f.apply(this, argms.concat(args))
        }
    }

    //很像reduce，reduce是对连续的值使用单个函数得到最终累计结果；flow是对连续的函数灌入生成的值得到最终累计结果
    function flow(funcs) {
        if (!Array.isArray(funcs)) {
            funcs = Array.from(arguments)
        }
        return function(...args) {
            if (!funcs.length || typeof funcs[0] != 'function') {
                return
            }
            let result = funcs[0].apply(this, args)
            for (let i = 1; i < funcs.length; i++) {
                if (typeof funcs[i] != 'function') {
                    return
                }
                result = funcs[i].call(this, result) // union return value
            }
            return result
        }
    }

    //generate a uniqueID.
    function uniqueId(prefix = '') {
        let sObj = Symbol.for('uniqueId')
            //  window.[Symbol(uniqueId)]= {lastId: 1}
        if (typeof window[sObj] !== 'object') {
            window[sObj] = {}
            window[sObj].lastId = 1
        }
        return prefix + (window[sObj].lastId++)
    }

    //创建一个函数。 这个函数会 调用 source 的属性名对应的 predicate 与传入对象相对应属性名的值进行断言处理。 如果都符合返回 true ，否则返回 false 。
    function conforms(src) {
        return function(obj) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key) && typeof src[key] == 'function') {
                    if (src[key](obj[key]) === false) {
                        return false
                    }
                }
            }
            return true
        }
    }


    function bindAll(obj, methodsNames) {
        if (Array.isArray(methodsNames)) {
            for (let i = 0; i < methodsNames.length; i++) {
                obj[methodsNames[i]] = obj[methodsNames[i]].bind(obj)
            }
        } else if (typeof methodsNames == 'string') {
            obj[methodsNames] = obj[methodsNames].bind(obj)
        }
        return obj
    }

    function _() {}
    // https://cloud.tencent.com/developer/article/1507017
    function mixin(obj = _, src, options = {}) {
        //简易实现一下mixin
        let isFunc = false
        let funcProps = []
        if (arguments.length == 1) {
            src = obj
            obj = _
            options.chain = true
        } else if (arguments.length == 2) {
            if ('chain' in src) {
                options = src
                options.chain = !!options.chain
                src = obj
                obj = _
            } else {
                isFunc = isFunction(obj)
            }
        } else {
            isFunc = isFunction(obj)
            options.chain = !!options.chain
        }
        for (let key in src) {
            if (src.hasOwnProperty(key) && isFunction(src[key])) {
                funcProps.push([key, src[key]])
            }
        }
        if (isFunc) {
            for (let entry of funcProps) {
                obj.prototype[entry[0]] = entry[1]
            }
        } else {
            for (let entry of funcProps) {
                obj[entry[0]] = entry[1]
            }
        }
        return obj
    }

    //------------------------Util---------------------



    /*-----------------------------------
     *              Properties
     *------------------------------------
     */



    //---------------Properties--------------


    /*-----------------------------------
     *              Methods
     *------------------------------------
     */





    //递归下降parseJson   str = '{"aa":"123","b":{"x":1,"y":[35,36,37],"z":null},"ccc":false}'
    function parseJson(str) {
        var i = 0
        return parseValue()
            //将str的不同类型分发到各个函数
        function parseValue() {
            var c = str[i]
            if (c === '[') {
                return parseArray()
            }
            if (c === '{') {
                return parseObject()
            }
            if (c === '"') {
                return parseString()
            }
            if (c === 't') {
                return parseTrue()
            }
            if (c === 'f') {
                return parseFalse()
            }
            if (c === 'n') {
                return parseNull()
            }
            return parseNumber()
        }

        function parseArray() {
            var thisAry = []
            i++
            while (str[i] !== ']') {
                var val = parseValue()
                thisAry.push(val)
                if (str[i] == ',') {
                    i++
                }
            }
            i++
            return thisAry
        }

        function parseObject() {
            var thisObj = {}
            i++
            while (str[i] !== '}') {
                var key = parseString()
                i++
                var val = parseValue()
                thisObj[key] = val
                if (str[i] === ',') {
                    i++
                }
            }
            i++
            return thisObj
        }

        function parseString() {
            var thisStr = ''
            i++
            while (str[i] !== '"') {
                thisStr += str[i++]
            }
            i++
            return thisStr
        }

        function parseNumber() {
            var thisNum = ''
            while (str[i] >= '0' && str[i] <= '9') {
                thisNum += str[i++]
            }
            return Number(thisNum)
        }

        function parseTrue() {
            var s = str.substr(i, 4)
            if (s === 'true') {
                i += 4
                return true
            } else {
                throw new SyntaxError('unexpected token ' + s + ' in pos of ' + i)
            }
        }

        function parseFalse() {
            var s = str.substr(i, 5)
            if (s === 'false') {
                i += 5
                return false
            } else {
                throw new SyntaxError('unexpected token ' + s + ' in pos of ' + i)
            }
        }

        function parseNull() {
            var s = str.substr(i, 4)
            if (s === 'null') {
                i += 4
                return null
            } else {
                throw new SyntaxError('unexpected token ' + s + ' in pos of ' + i)
            }
        }
    }


    function stringifyJson(value) {
        if (value === null) {
            return null
        } else if (Array.isArray(value)) {
            let str = '['
            for (let i = 0; i < value.length; i++) {
                str += stringifyJson(value[i]) + ','
            }
            str = str.slice(0, -1) + ']'
            return str
        } else if (typeof value === 'object') {
            let str = '{'
            for (let key in value) {
                if (value.hasOwnProperty(key)) {
                    if (value[key] === undefined) {
                        continue
                    }
                    str += '"' + key + '":' + stringifyJson(value[key]) + ','
                }
            }
            str = str.slice(0, -1) + '}'
            return str
        } else if (typeof value == 'string') {
            return '"' + value + '"'
        } else if (typeof value == 'number') {
            if (value !== value || Math.abs(value) === Infinity) {
                return null
            }
            return value
        } else if (typeof value == 'boolean') {
            return value ? 'true' : 'false'
        } else if (value === undefined || typeof value == 'function') {
            return null
        }
    }

    //--------------------Methods------------------------


    /*-----------------------------------
     *              String
     *------------------------------------
     */

    function camelCase(str) {
        let re = /[\W_]*([0-9A-Za-z]+)[\W_]*/g //坑：_算\w
        let result = []
        let matches
        while (matches = re.exec(str)) {
            result.push(matches[1].toLowerCase())
        }
        return result.reduce((accum, item, idx) => {
            let code = item.charCodeAt(0)
            let firstLetter = (code >= 97 && code <= 122) ? String.fromCharCode(code - 32) : item[0] //precisely!
            return accum + firstLetter + item.slice(1)
        })
    }


    function capitalize(str) {
        //lodash非常奇怪，就算是第一个字符是空格，也把它视为第一个字母
        // return str.toLowerCase().replace(/\w/, first => first.toUpperCase()) 
        str = str.toLowerCase()
        return str[0].toUpperCase() + str.slice(1)
    }

    //!wrong
    function deburr(str) { //去毛刺儿..
        //i cant understand but be appalled.
        return str.replace(/[éà]/g, function(match){
            if(match == 'é'){
                return 'e'
            } else if(match == 'à') {
                return 'a'
            } else {
                return match
            }
        })
    }

    function endsWith(str =
        '', target, position = str.length) {
        //trick 1.
        str = str.substr(0, position)
        return target === str.substr(str.length - target.length, target.length)
    }

    function endsWith2(str = '', target, postion = str.length) {
        //trick 2.
        let j = target.length - 1
        if (j == -1) {
            return true
        }
        for (let i = postion - 1; i >= 0; i--, j--) {
            if (target[j] != str[i]) {
                return false
            }
            if (j == 0) {
                return true
            }
        }
        return false
    }


    function escape(str = '') {
        let result = ''
        for (let i = 0; i < str.length; i++) {
            switch (str[i]) {
                case '&':
                    result += '&amp;'
                    break;
                case '<':
                    result += '&lt;'
                    break;
                case '>':
                    result += '&gt;'
                    break;
                case '"':
                    result += '&quot;'
                    break;
                case "'":
                    result += '&apos;'
                    break;
                case '`':
                    result += '&#96;'
                    break;
                default:
                    result += str[i]
            }
        }
        return result
    }

    function escape2(str = '') {
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&apos;',
            '`': '&#96;',
        }
        return str.replace(/[&><"'`]/g, val => map[val])
    }

    function unescape(str = '') {
        let map = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&apos;': "'",
            '&#96;': '`',
        }
        return str.replace(/(&amp;)|(&lt;)|(&gt;)|(&quot;)|(&apos;)|(&#96;)/g, val => map[val])
    }

    function escapeRegExp(str) {
        if (typeof str != 'string') {
            return str
        }
        let result = ''
        for (let i = 0; i < str.length; i++) {
            let temp = ''
            switch (str[i]) {
                case '^':
                    temp = '\\^'
                    break;
                case '$':
                    temp = '\\$'
                    break;
                case '.':
                    temp = '\\.'
                    break;
                case '*':
                    temp = '\\*'
                    break;
                case '+':
                    temp = '\\+'
                    break;
                case '?':
                    temp = '\\?'
                    break;
                case '(':
                    temp = '\\('
                    break;
                case ')':
                    temp = '\\)'
                    break;
                case '[':
                    temp = '\\['
                    break;
                case ']':
                    temp = '\\]'
                    break;
                case '{':
                    temp = '\\{'
                    break;
                case '}':
                    temp = '\\}'
                    break;
                case '|':
                    temp = '\\|'
                    break;
                default:
                    temp = str[i]
                    break;
            }
            result += temp
        }
        return result
    }

    //转成中划线分割的
    //Foo bar    fooBar   __FOO_BAR__  
    function kebabCase(str = '') {
        str = str.trim().replace(/[\s_]+|([a-z])([A-Z])/g, (match, small, big) => {
            if (small && big) {
                return small + '-' + big
            }
            return '-'
        })

        if (str[0] == '-') {
            str = str.slice(1)
        }
        if (str[str.length - 1] == '-') {
            return str.substr(0, str.length - 1).toLowerCase()
        }
        return str.toLowerCase()
    }

    //result is about foo_bar
    function snakeCase(str = '') {
        str = str.trim().replace(/[_\s-]+|([a-z])([A-Z])/g, (match, small, big) => { //this function will accept all of [match] properties. Be careful !!
            if (big && small) {
                return small + '_' + big
            }
            return '_'
        })
        if (str[0] == '_') {
            str = str.slice(1)
        }
        if (str[str.length - 1] == '_') {
            return str.substr(0, str.length - 1).toLowerCase()
        }
        return str.toLowerCase()
    }

    function startCase(str = '') {
        str = str.trim().replace(/[_-\s]+([a-z]|[A-Z])|([a-z])([A-Z])|[_-\s]+/g, (match, char, small, big) => {
            if (char) {
                return ' ' + char.toUpperCase()
            } else if (small && big) {
                return small + ' ' + big
            } else {
                return ' '
            }

        })
        str = str.trim()
        return str[0].toUpperCase() + str.slice(1)
    }

    function lowerCase(str = '') {
        str = str.trim().replace(/[\W_]+|([a-z])([A-Z])/g, (match, small, big) => {
            if (small && big) {
                return small + ' ' + big.toLowerCase()
            }
            return ' '
        })
        return str.trim().toLowerCase()
    }

    function lowerFirst(str = '') {
        if (str[0]) {
            return str[0].toLowerCase() + str.slice(1)
        } else {
            return str
        }
    }


    function upperCase(str = '') {
        str = str.trim().replace(/[_-\s]+|([a-z])([A-Z])/g, (match, small, big) => {
            if (small && big) {
                return small + ' ' + big
            }
            return ' '
        })
        return str.trim().toUpperCase()
    }

    function upperFirst(str = '') {
        if (str[0]) {
            return str[0].toUpperCase() + str.slice(1)
        }
        return str
    }


    function pad(str = '', length = 0, chars = ' ') {
        if (length <= str.length) {
            return str
        }
        let count = Math.ceil((length - str.length) / chars.length)
        let result = ''
        if (count > 0) {
            if (count & 1) {
                result = chars.repeat(count >> 1) + str + chars.repeat((count >> 1) + 1)
            } else {
                result = chars.repeat(count >> 1) + str + chars.repeat(count >> 1)
            }
        } else {
            result = str
        }
        return result.substr(0, length)
    }

    function padEnd(str = '', length = 0, chars = ' ') {
        if (length <= str.length) {
            return str
        }
        return (str + chars.repeat(Math.ceil((length - str.length) / chars.length))).substr(0, length)
    }

    function padStart(str = '', length = 0, chars = ' ') {
        if (length <= str.length) {
            return str
        }
        let prefix = chars.repeat(Math.ceil((length - str.length) / chars.length))
        return prefix.length + str.length == length ? prefix + str : prefix.substr(0, length - str.length) + str
    }


    function parseInt(str, radix = 10) {
        // 1.find them out who belongs to my radix
        let inTenRadix = true // <10 handle bar
        if (!radix || arguments[2]) { //奇怪的lodash，传第三个参数隐式转换是true就按10进制理解
            radix = 10
        }
        let target = ''
        let maxAcceptCode = 48 + radix
        if (radix < 10) {
            for (let i = 0; i < str.length; i++) {
                let code = str.charCodeAt(i)
                if (code >= 48 && code <= maxAcceptCode) { // 0-9 radix
                    target += str[i]
                } else {
                    break
                }
            }
        } else if (radix >= 10 && radix <= 36) {
            inTenRadix = false
            maxAcceptCode = 97 + radix
            for (let i = 0; i < str.length; i++) {
                let code = str.charCodeAt(i)
                if ((code >= 48 && code <= 57) || (code >= 97 && code <= maxAcceptCode)) { // 0-9 & a-z
                    target += str[i]
                } else if (code >= 65 && code <= 90) {
                    target += str[i].toLowerCase()
                } else {
                    break
                }
            }
        } else {
            throw new Error('给个正常点的radix, ありがとう～')
        }
        //2. deal them
        let result = 0
        let len = target.length
        if (inTenRadix) {
            for (let i = len - 1; i >= 0; i--) {
                result += Number(target[i]) * Math.pow(radix, len - 1 - i)
            }
        } else {
            for (let i = len - 1; i >= 0; i--) {
                if (target[i] >= 'a') { //字母
                    result += (target.charCodeAt(i) - 65 + 10) * Math.pow(radix, len - 1 - i)
                } else { //数字
                    result += Number(target[i]) * Math.pow(radix, len - 1 - i)
                }
            }
        }

        return result
    }


    function repeat(str = '', n = 1) {
        if (n <= 0) {
            return ''
        }
        let result = ''
        while (n--) {
            result += str
        }
        return result
    }

    function replace(str = '', replacer, replacement) {
        if (typeof replacer == 'string' || typeof replacer == 'number') {
            let idx = str.indexOf(replacer)
            if (idx == -1) {
                return str
            }
            if (typeof replacement == 'function') { //除了function都是拼字串
                replacement = replacement(replacer, idx, str) // got a string
            }
            // 针对replacement是$&的情况，仅它适用于非正则替换;把$&换为replacer
            replacement = replacement.split('$&').join(replacer)
            return str.slice(0, idx) + replacement + str.slice(idx + replacer.length)

        } else if (replacer instanceof RegExp) {
            replacer = new RegExp(replacer, replacer.flags) //second param can be ignored
            if (typeof replacement == 'string') {
                replacement = tranformReplacement_stringToFunction(replacement)
            }
            let match = null
            if (!replacer.global) {
                match = replacer.exec(str)
                if (!match) { //null
                    return str
                }
                return str.slice(0, match.index) + replacement(match) + str.slice(replacer.lastIndex)
            }
            let result = ''
            let startIndex = replacer.lastIndex
            while (match = replacer.exec(str)) {
                result += str.slice(startIndex, match.index) + replacement(match)
                startIndex = replacer.lastIndex
                if (match[0] == '') {
                    replacer.lastIndex++
                }
            }
            result += str.slice(startIndex)
            return result
        } else {
            return str
        }

    }

    function tranformReplacement_stringToFunction(replacement) {
        let splitted = replacement.split(/($[\d&])/) //if want $& $1 $2.. , remember add the (),then split func will insert captures into 隔板
        return function(args) { // i need index but not another parts of match object
            // [aa, $&, b, $1, ccd, $2, dq]
            let result = ''
            for (let part of splitted) {
                if (part.length == 2 && part[0] == '$') {
                    if (part[1] == '&') {
                        result += args[0]
                    } else if (part[1] >= 0 && part[1] <= 9) {
                        result += args[part[2]] || ''
                    }
                } else {
                    result += part
                }
            }
            return result
        }
    }


    function split(str = '', separator, limit = Infinity) {
        let result = []
        if (typeof separator == 'string') {
            let startIdx = 0,
                matchIdx
            while ((matchIdx = str.indexOf(separator, startIdx)) > -1) {
                result.push(str.slice(startIdx, matchIdx))
                startIdx = matchIdx + separator.length
            }
            result.push(str.slice(startIdx))
        } else if (separator instanceof RegExp) {
            if (separator.global) {
                separator = new RegExp(separator, separator.flags)
            } else {
                separator = new RegExp(separator, separator.flags + 'g')
            }
            let match = null
            let startIdx = separator.lastIndex
            while (match = separator.exec(str)) {
                result.push(str.slice(startIdx, match.index))
                startIdx = separator.lastIndex
                if (match[0] == '') {
                    separator.lastIndex++
                }
            }
            result.push(str.slice(startIdx))
        } else {
            result = [str]
        }

        if (limit < 0) {
            return result
        }
        return result.slice(0, limit)
    }

    function startsWith(str = '', target, postion = 0) {
        return str.slice(postion).indexOf(target) == 0
    }

    /**
     * there are `template` function,
     * about 模板, like pug.
     * 
     */


    function toUpper(str = '') {
        let result = ''
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i)
            if (code >= 0x61 && code <= 0x7A) {
                result += String.fromCharCode(code - 32)
            } else {
                result += str[i]
            }
        }
        return result
    }

    function toLower(str = '') {
        let result = ''
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i)
            if (code >= 0x41 && code <= 0x5A) {
                result += String.fromCharCode(code + 32)
            } else {
                result += str[i]
            }
        }
        return result
    }


    function trim(str = '', chars = ' ') {
        return trimEnd(trimStart(str, chars), chars)
    }

    function trimStart(str = '', chars = ' ') {
        let set = new Set()
        for (let i = 0; i < chars.length; i++) {
            if (!set.has(chars[i])) {
                set.add(chars[i])
            }
        }
        let sliceIdx = 0
        for (; sliceIdx < str.length; sliceIdx++) {
            if (!set.has(str[sliceIdx])) {
                break
            }
        }
        return str.slice(sliceIdx)
    }


    function trimEnd(str = '', chars = ' ') {
        let set = new Set()
        for (let i = 0; i < chars.length; i++) {
            if (!set.has(chars[i])) {
                set.add(chars[i])
            }
        }
        let endIdx = str.length - 1
        for (; endIdx >= 0; endIdx--) {
            if (!set.has(str[endIdx])) {
                break
            }
        }
        return str.slice(0, endIdx + 1)
    }

    function WrongtrimStart(str = '', chars = ' ') {
        let len = str.length
        let charsLen = chars.length
        let sliceIdx = 0
        for (let i = 0; i < len; i += charsLen) {
            if (str.slice(i, i + charsLen) == chars) {
                sliceIdx = i + charsLen
            } else {
                break
            }
        }
        return str.slice(sliceIdx)
    }

    // https://mgear-blogs.obs-website.cn-east-3.myhuaweicloud.com/articles/source-code/lodash/lodash.html
    function truncate(str = '', options = {}) {
        let length = options.length || 30
        let omission = options.omission || '...'
        let separator = options.separator

        /**
         * 【Unicode乱码问题】
         * "𝌆".length是2，但它在被按顺序读取时，会分解成两个字符  "𝌆".split('') // ["�", "�"]
         * 这两个字符长度为1，在控制台长相与前者也不相同，后者长得像这样：�；
         * lodash && 我们应该把这个字串信息保留，作为【1】个字符看待，Array.from()具有这一神奇功效，之后处理数组再join回来就好
         * 
         * 暂时没有找到 判断str中是否含有Unicode字符 的方法，索性全转数组处理了
         */

        str = Array.from(str) //toArray

        if (length >= str.length) {
            return str.join('') //_.truncate('abc',{length:3}) --> 'abc'
        }

        let end = length - omission.length //str应截取的长度
        str = end >= 0 ? str.slice(0, end).join('') : ''

        if (!separator) {
            return str + omission
        }
        //如果有分隔符，把结果裁剪到最后一个分隔符的位置（最后一个分隔符之后的不要）
        if (typeof separator == "string") {
            let endIdx = str.lastIndexOf(separator)
            return endIdx == -1 ? str + omission : str.slice(0, endIdx) + omission
        } else if (separator instanceof RegExp) {
            if (separator.global) {
                separator = new RegExp(separator, separator.flags)
            } else {
                separator = new RegExp(separator, separator.flags + 'g')
            }
            let match = null,
                endIdx = str.length
            while (match = separator.exec(str)) {
                endIdx = match.index
            }
            return str.slice(0, endIdx) + omission
        } else {
            return str + omission
        }
    }

    function words(str = '', pattern) {
        let result = []
            //比lodash还好用的自动加g
        pattern = pattern ? (new RegExp(pattern, pattern.global ? pattern.flags : pattern.flags + 'g')) : /\b[a-zA-Z]+\b/g
        let match = null
        while (match = pattern.exec(str)) {
            result.push(match[0])
            if (match[0] == '') {
                pattern.lastIndex++
            }
        }
        return result
    }

    //--------------String---------------



    return {
        memoize: memoize,
        bindAll: bindAll,
        mixin: mixin,
        curry: curry,
        cloneDeep: cloneDeep,
        flip: flip,
        conforms: conforms,
        negate: negate,
        once: once,
        spread: spread,
        ary: ary,
        unary: unary,
        nthArg: nthArg,
        method: method,
        methodOf: methodOf,
        propertyOf: propertyOf,
        flow: flow,
        pullAt: pullAt,
        uniqueId: uniqueId,
        defaultTo: defaultTo,
        range: range,
        rangeRight: rangeRight,
        words: words,
        truncate: truncate,
        trimStart: trimStart,
        trimEnd: trimEnd,
        trim: trim,
        toUpper: toUpper,
        toLower: toLower,
        startsWith: startsWith,
        split: split,
        replace: replace,
        repeat: repeat,
        parseInt: parseInt,
        padStart: padStart,
        padEnd: padEnd,
        pad: pad,
        lowerFirst: lowerFirst,
        lowerCase: lowerCase,
        upperFirst: upperFirst,
        upperCase: upperCase,
        escapeRegExp: escapeRegExp,
        startCase: startCase,
        snakeCase: snakeCase,
        kebabCase: kebabCase,
        chunk: chunk,
        compact: compact,
        concat: concat,
        uniq: uniq,
        uniqBy: uniqBy,
        uniqWith: uniqWith,
        flattenDeep: flattenDeep,
        flattenDepth: flattenDepth,
        groupBy: groupBy,
        keyBy: keyBy,
        forEach: forEach,
        map: map,
        filter: filter,
        reduce: reduce,
        zip: zip,
        unzip: unzip,
        unzipWith: unzipWith,
        zipObject: zipObject,
        zipObjectDeep: zipObjectDeep,
        zipWith: zipWith,
        keys: keys,
        values: values,
        valuesIn: valuesIn,
        every: every,
        some: some,
        fill: fill,
        sortBy: sortBy,
        isEqual: isEqual,
        reverse: reverse,
        countBy: countBy,
        reduceRight: reduceRight,
        shuffle: shuffle,
        isNaN: isNaN,
        isNull: isNull,
        isNil: isNil,
        isUndefined: isUndefined,
        toArray: toArray,
        sum: sum,
        sumBy: sumBy,
        parseJson: parseJson,
        stringifyJson: stringifyJson,
        forIn: forIn,
        forInRight: forInRight,
        forOwn: forOwn,
        forOwnRight: forOwnRight,
        difference: difference,
        differenceBy: differenceBy,
        differenceWith: differenceWith,
        intersection: intersection,
        intersectionBy: intersectionBy,
        sortedIndex: sortedIndex,
        sortedIndexBy: sortedIndexBy,
        sortedIndexOf: sortedIndexOf,
        sortedLastIndex: sortedLastIndex,
        sortedLastIndexBy: sortedLastIndexBy,
        sortedLastIndexOf: sortedLastIndexOf,
        sortedUniq: sortedUniq,
        sortedUniqBy: sortedUniqBy,
        floor: floor,
        isMatch: isMatch,
        matches: matches,
        property: property,
        get: get,
        toPath: toPath,
        matchesProperty: matchesProperty,
        drop: drop,
        dropRight: dropRight,
        dropWhile: dropWhile,
        dropRightWhile: dropRightWhile,
        findIndex: findIndex,
        findLastIndex: findLastIndex,
        flatten: flatten,
        fromPairs: fromPairs,
        toPairs: toPairs,
        toPairsIn: toPairsIn,
        head: head,
        indexOf: indexOf,
        lastIndexOf: lastIndexOf,
        initial: initial,
        intersectionWith: intersectionWith,
        join: join,
        last: last,
        nth: nth,
        pull: pull,
        pullAll: pullAll,
        pullAllBy: pullAllBy,
        pullAllWith: pullAllWith,
        times: times,
        constant: constant,
        isFunction: isFunction,
        functions: functions,
        functionsIn: functionsIn,
        keysIn: keysIn,
        mapKeys: mapKeys,
        mapValues: mapValues,
        isArguments: isArguments,
        isArray: isArray,
        isBoolean: isBoolean,
        isDate: isDate,
        isEmpty: isEmpty,
        isEqualWith: isEqualWith,
        isArrayLike: isArrayLike,
        isArrayLikeObject: isArrayLikeObject,
        isArrayBuffer: isArrayBuffer,
        isElement: isElement,
        isError: isError,
        isFinite: isFinite,
        isPlainObject: isPlainObject,
        isObjectLike: isObjectLike,
        isObject: isObject,
        isNumber: isNumber,
        isNative: isNative,
        isMap: isMap,
        isLength: isLength,
        toLength: toLength,
        isInteger: isInteger,
        isMatchWith: isMatchWith,
        isRegExp: isRegExp,
        isSafeInteger: isSafeInteger,
        isSet: isSet,
        isString: isString,
        union: union,
        unionBy: unionBy,
        unionWith: unionWith,
        without: without,
        tail: tail,
        take: take,
        takeWhile: takeWhile,
        takeRight: takeRight,
        takeRightWhile: takeRightWhile,
        xor: xor,
        xorBy: xorBy,
        xorWith: xorWith,
        find: find,
        findLast: findLast,
        flatMap: flatMap,
        flatMapDeep: flatMapDeep,
        flatMapDepth: flatMapDepth,
        forEachRight: forEachRight,
        includes: includes,
        invokeMap: invokeMap,
        orderBy: orderBy,
        partition: partition,
        reject: reject,
        sample: sample,
        sampleSize: sampleSize,
        size: size,
        defer: defer,
        delay: delay,
        castArray: castArray,
        conformsTo: conformsTo,
        eq: eq,
        gt: gt,
        gte: gte,
        isTypedArray: isTypedArray,
        isSymbol: isSymbol,
        isWeakMap: isWeakMap,
        isWeakSet: isWeakSet,
        lt: lt,
        lte: lte,
        toNumber: toNumber,
        toInteger: toInteger,
        toFinite: toFinite,
        assign: assign,
        assignIn: assignIn,
        toSafeInteger: toSafeInteger,
        add: add,
        divide: divide,
        ceil: ceil,
        max: max,
        maxBy: maxBy,
        mean: mean,
        meanBy: meanBy,
        min: min,
        minBy: minBy,
        multiply: multiply,
        round: round,
        subtract: subtract,
        clamp: clamp,
        inRange: inRange,
        random: random,
        at: at,
        defaults: defaults,
        defaultsDeep: defaultsDeep,
        findKey: findKey,
        findLastKey: findLastKey,
        has: has,
        hasIn: hasIn,
        invert: invert,
        invertBy: invertBy,
        invoke: invoke,
        merge: merge,
        mergeWith: mergeWith,
        omit: omit,
        omitBy: omitBy,
        pick: pick,
        pickBy: pickBy,
        result: result,
        set: set,
        setWith: setWith,
        transform: transform,
        unset: unset,
        update: update,
        updateWith: updateWith,
        camelCase: camelCase,
        capitalize: capitalize,
        deburr: deburr,
        endsWith: endsWith,
        escape: escape,
        unescape: unescape,
        identity: identity,
    }
}()