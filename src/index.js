import Rect from './Rect_class'
import App from './App'
import './index.css'

const rectObject = new Rect(3,4)
console.log('周长： ',rectObject.perimeter())
console.log('面积： ',rectObject.area())