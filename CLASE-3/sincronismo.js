function a () {
    console.log(1);
    b();
    console.log(2);
}

function b () {
    console.log(3);
    c();
    console.log(4);
}

function c () {
    console.log(5);
}

