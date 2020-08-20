/* let rectangle = {
  perimeter: (x,y) => (2*(x+y)),
  area: (x,y) => (x*y)
} */

let rectangle = require('./rectangle');

function solveRectangle(l,b) {
  console.log('Solving for rectangle with l = ' + l + ' and b = ' + b)

  if (l <= 0 || b<= 0) {
    console.log('Rectangle dimensions sholud be greater than zero: l = ' + l + ', and b = ' + b)
  }
  else {
    console.log('The area of the rectangle is ' + rectangle.area(l,b))
    console.log('the perimeter of the rectangle is ' + rectangle.perimeter(l,b))
  }
}

solveRectangle(2,4)
solveRectangle(3,5)
solveRectangle(0,5)
solveRectangle(-3,5)