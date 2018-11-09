
function Horse() {
    this.run = function() {
        console.log('run');
    };
}

function Bird() {
    this.fly = function() {
        console.log('fly');
    };
}

const bird = new Bird();
const horse = new Horse();

function Pegas (a) {
    console.log(a);
};

Pegas.prototype = {...horse, ...bird};

function myNew(Class, ...args) {
    let _this = { __proto__: Class.prototype };
    Class.apply(_this, args);
    return _this;
}

const somePegas = myNew(Pegas, 1);

somePegas.fly();

