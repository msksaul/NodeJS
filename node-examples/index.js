/* let rectangle = {
  perimeter: (x,y) => (2*(x+y)),
  area: (x,y) => (x*y)
} */

let rectangle = require('./rectangle');

function solveRectangle(l,b) {
  console.log('Solving for rectangle with l = ' + l + ' and b = ' + b)

  rectangle(l,b,(err, rect) => {
    if(err) {
      console.log('ERROR: ', err.message)
    }
    else {
      console.log('The area of the rectangle of dimensions l = ' + l + ' and b= ' + b
      + ' is ' + rect.area());
      console.log('The perimeter of the rectangle of dimensions l = ' + l + ' and b= ' + b
      + ' is ' + rect.perimeter());
    }
  })
  console.log('This statement is after the call to rectangle()')
}

solveRectangle(2,4)
solveRectangle(3,5)
solveRectangle(0,5)
solveRectangle(-3,5)