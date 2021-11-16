//让你的用户名(变量名)等于一个对象
var lamvyc = function () {    //这种写法方便递归调用
    //第一个函数

    function chunk(array, size) {

        var result = []
        var index = 0
        while (index < array.length) {
            result.push(array.slice(index, index + size))
            index += size
        }
        return result
    }
    //第二个函数
    function compact() {

    }

    return {
        chunk: chunk,
    }
}()

/*
var lamvyc = {//这样写不好递归，因为是个匿名函数
    //第一个函数
    chunk:function(array,size = 2){

    },
    //第二个函数
    compact:function(){
        lamvyc.compact()    //递归
        this.compact        //递归
        compact()   //递归不行
    },
    compact:function f(){   //递归，起个名字

    }
}
*/