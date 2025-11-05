export const sum = (a: number, b: number): number => {
    return a+b;
}

export const multipleSum = (...numbers: number[]): number => {
    let r: number = 0;
    for(const n of numbers){
        r+=n;
    }
    return r;
}

export const subtruction = (a:number, b:number): number =>  {
    return a-b;
}

export const multiplication = (a:number, b:number): number => {
    return a*b;
}

const division = (a:number, b:number): number => {
    return a/b;
}

export default multiplication;

export class Calculator {

}

export const PI = 3.1416;