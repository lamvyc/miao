//让你的用户名(变量名)等于一个对象
var lamvyc = function () {    //这种写法方便递归调用
    //第一个函数
    function chunk(array, size = 1) {
        let newarray = [],
            temp = 0,
            len = Math.ceil(array.length / size);
        if (len == 0 || size < 1) {
            return [];
        }
        for (let j = 0; j < len; j++) {
            let temparray = [];
            for (let i = 0; i < size; i++) {
                if (array[temp] != undefined) {
                    temparray.push(array[temp]);
                    temp++;
                } else {
                    break;
                }
            }
            newarray[j] = temparray;
        }
        return newarray;
    }
}

//第二个函数
function compact() {

}



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