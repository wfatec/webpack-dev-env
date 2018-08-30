class Rect {
    constructor(x, y) {
      this.width = x;
      this.height = y;
    }
    area() {
      return this.width * this.height;
    }
    perimeter(){
        return (this.width + this.height)*2
    }

  }
  export default Rect;