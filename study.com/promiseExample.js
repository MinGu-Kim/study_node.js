// 출처: http://bcho.tistory.com/1086 [조대협의 블로그]

var Promise = require('promise');
var fs = require('fs');

/**
 * Simple Example
 * */
var asyncfunction = function(param){

    return new Promise(function(resolved, rejected){ // 리턴값으로 Promise 객체 리턴
                                                    // Promise 객체 안에서는 처리할 비지니스 로직이 정의되어 있다
        setTimeout(
            function(){
                resolved('hello' + param);
            },2000);
    });

};

var promise = asyncfunction(' goo ');

// promise.then(console.log,console.err); // 여기가 비동기 결과에 대한 콜백함

/**
 * Promise Chaining
 * */
var asyncfunction1a = function(param){

    return new Promise(function(fullfilled, rejected){

        setTimeout(
            function(){
                fullfilled('result 1 ' + param);
            },1000);
    });

};

var asyncfunction2a = function(param){

    return new Promise(function(fullfilled, rejected){

        setTimeout(
            function(){
                fullfilled('result 2 ' + param);
            },1000);
    });

};

var asyncfunction3a = function(param){

    return new Promise(function(fullfilled, rejected){

        setTimeout(
            function(){
                fullfilled('result 3 ' + param);
            },1000);
    });

};

var promise = asyncfunction1a(' goo ');

promise
    .then(asyncfunction2a)
    .then(asyncfunction3a)
    .then(console.log);


/**
 * Promise Denodeify
 */
var src = 'tmp/myfile.txt';
var des = 'tmp/myfile_promise2.txt';

var fs_read = Promise.denodeify(fs.readFile); // promise 패턴을 지원하지 않는 일반 함수들을 promise 를 지원할 수 있는 형태로 변경
var fs_write = Promise.denodeify(fs.writeFile);

fs_read(src,'utf-8')
    .then(function(text){
        console.log('Read done');
        console.log(text);
        return fs_write(des, text); // chaining 하려면 리턴 ㄱㄱ
    })
    .then(function(){
        console.log('Write done');
    })
    .catch(function(reason){ // 에러 핸들링
        console.log('Read or Write file error');
        console.log(reason);
    });

console.log('Promise example');

/**
 * Promise Error Handler
 * */
var asyncfunction1 = function(param){

    return new Promise(function(resolved, rejected){

        setTimeout(
            function(){
                console.log('func1');
                resolved('func 1 success:'+param+'\n');
            },500);
    });

};

var asyncfunction2 = function(param){

    return new Promise(function(resolved, rejected){

        setTimeout(
            function(){
                console.log('func2');
                rejected(new Error('func 2 error:'+param+'\n')); // 강제로 에러 발생시킴
            },500);
    });

};

var asyncfunction3 = function(param){

    return new Promise(function(resolved, rejected){

        setTimeout(
            function(){
                console.log('func3');
                resolved('func 3 success:'+param+'\n');
            },500);
    });

};

var asyncfunction4 = function(param){

    return new Promise(function(resolved, rejected){

        setTimeout(
            function(){
                console.log('func4');
                rejected(Error('func 4 error:'+param+'\n')); // 강제로 에러 발생시킴
            },500);
    });

};

var asyncfunction5 = function(param){

    return new Promise(function(resolved, rejected){

        setTimeout(
            function(){
                console.log('func5');
                resolved('func 5 success:'+param+'\n');
            },500);
    });

};
/**
 * 1,2,3 번 뒤에 catch 를 정의 했기 때문에, 1,2,3번을 수행하던중 에러가 발생하면 수행을 멈추고 첫번째 에러핸들러인 //error handler1으로 가서 에러를 처리
 * 여기서 중요한 점은 에러처리 후에, 다시 원래 제어 흐름으로 복귀한다는 것이다. 흐름을 끝내지 않고, 다음 에러핸들러에 의해서 통제 되는 4,5번을 수행
 * 흐름을 끝내지 않고, 다음 에러핸들러에 의해서 통제 되는 4,5번을 수행
 * 4,5번의 에러는 4,5번 호출 뒤에 붙어 있는 catch //error handler2에 의해서 처리
 * 마찬가지로 //error handler 2에 의해서 실행이 된후에 맨 마지막 비동기 함수인 console.log 를 실행
 * */

var promise = asyncfunction1(' goo ');

promise
    .then(asyncfunction2) // 에러 발생 -> 바로 catch 로~
    .then(asyncfunction3) // func2에서 에러가 발생했기 때문에 실행 안됨
    .catch(console.error) // error handler1, 파라미터 증발
    .then(asyncfunction4) // 위에서 에러 처리 후 실행 됨, 그러나 에러 발생 -> 바로 catch 로~
    .then(asyncfunction5) // func4에서 에러가 발생했기 때문에 실행 안됨
    .catch(console.error)  // error handler2
    .then(console.log); // 위에서 에러 처리 후 실행 됨


// 출처: http://programmingsummaries.tistory.com/325

/**
 * Promise.all
 * */
var promise1 = new Promise(function (resolved, rejected) { // return 하지 않고 바로 new Promise 로 생성하는 방식

    setTimeout(function () {

        // 해결됨
        console.log("첫번째 Promise 완료");
        resolved("11111");

    }, Math.random() * 20000 + 1000);
});

var promise2 = new Promise(function (resolved, rejected) {

    setTimeout(function () {

        // 해결됨
        console.log("두번째 Promise 완료");
        resolved("22222");

    }, Math.random() * 10000 + 1000);
});

// promise1, promise2 가 모두 완료될 때 실행
Promise.all([promise1, promise2]).then(function (values) { // return new Promise 라면 [promise1(), promise2()]
    console.log("모두 완료됨", values);
});

/**
 * Promise for Loop
 * 출처: https://stackoverflow.com/questions/40328932/javascript-es6-promise-for-loop
 * */
var array = [1,2,3,4,5,6,7,8,9,10];

(function loop(i) {
    if (i < array.length) new Promise(resolve => {
        console.log(array[i]);
        setTimeout(resolve, Math.random() * 1000);
    }).then(loop.bind(null, i+1));
})(0);
