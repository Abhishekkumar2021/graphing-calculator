import { derivative, simplify } from 'mathjs'

function newtonRhapson(fn: string, initialX: number) : number {
    const f = simplify(fn);
    const fPrime = derivative(f, 'x');
    let x = initialX;
    let i = 0;
    while(i < 100) {
        x = x - f.evaluate({x}) / fPrime.evaluate({x});
        i++;
    }
    // First check whether the result is a root or not
    if(Math.abs(f.evaluate({x})) < 0.0001) {
        return parseFloat(x.toFixed(3));
    }
    
    return NaN;
}

export { newtonRhapson }

