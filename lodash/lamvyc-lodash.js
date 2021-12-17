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

                res.push( ary.slice(i, i + size) )
            } else if (g = 0){
                break
            }else{
                res.push( ary.slice(i, l) )       //.slice()输出的结果是一个数组
            }
        
        }
        return res
    }



    //--------------String---------------



    return {
        chunk: chunk,
    }
}()