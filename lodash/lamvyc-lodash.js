var lamvyc = function () {


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




    //--------------String---------------



    return {
        chunk:chunk,
    }
}()