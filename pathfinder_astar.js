// Path Finder using A* Algorithm

var rows = 50;
var cols = 50;

var grid = Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w,h;
var path = [];
var done = false;

heuristic = (a, b) => {
    var d = dist(a.i, a.j, b.i, b.j)
    //var d = abs(a.i - b.i) + abs(a.j - b.j)
    return d;
}
 
function Spot(i, j) {
    this.i=i
    this.j=j
    this.f=0
    this.g=0
    this.h=0
    this.neighbors=[]
    this.prev = undefined;
    this.wall = false;

    if(random(1)<0.40) {
        this.wall = true
    }

    this.show = (col) => {
        fill(col);
        if(this.wall) {
            fill(0);
            noStroke();
            ellipse(this.i*w+w/2, this.j*h+h/2, w/2, h/2)
            //rect(this.i*w, this.j*h, w-1, h-1);
        }
  
    }

    this.addNeighbors = () => {
        if(this.i<cols-1) {
            this.neighbors.push(grid[this.i+1] [this.j])
        }
        if(this.i>0) {
            this.neighbors.push(grid[this.i-1] [this.j])
        }
        if(this.j<rows-1) {
            this.neighbors.push(grid[this.i] [this.j+1])
        }
        if(this.j>0) {
            this.neighbors.push(grid[this.i] [this.j-1])
        }
        if(this.i>0 && this.j>0) {
            this.neighbors.push(grid[this.i-1] [this.j-1])
        }
        if(this.i<cols-1 && this.j>0) {
            this.neighbors.push(grid[this.i+1] [this.j-1])
        }
        if(this.i>0 && this.j<rows-1) {
            this.neighbors.push(grid[this.i-1] [this.j+1])
        }
        if(this.i<cols-1 && this.j<rows-1) {
            this.neighbors.push(grid[this.i+1] [this.j+1])
        }
    }
}

setup = () => {
    // hard coded positions, dont forget to change them
    let cnv = createCanvas(600,600);
    cnv.position(400, 50)

    w = width/cols;
    h = height/rows;

    for(var i=0; i<cols; i++) {
        grid[i] = new Array(rows);
    }

    for(var i=0; i<cols; i++) {
        for(var j=0; j<rows; j++) {
            grid[i][j] = new Spot(i ,j);
        }
    }

    for(var i=0; i<cols; i++) {
        for(var j=0; j<rows; j++) {
            grid[i][j].addNeighbors();
        }
    }
    console.log(grid)

    start = grid[0][0]
    end = grid[cols-1][rows-1]
    start.wall = false
    end.wall = false

    openSet.push(start)

}

draw = () => {

    if(openSet.length>0){
        // keep goin

        var winner = 0
        for (var i=0; i<openSet.length; i++) {
            if(openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        
        var current = openSet[winner];


        openSet.splice(current, 1)
        closedSet.push(current)

        var neighbors = current.neighbors;
        for (var i=0; i<neighbors.length; i++) {
            var neighbor = neighbors[i];

            if(!closedSet.includes(neighbor) && !neighbor.wall) {
                var tempG = current.g+1;

                var newPath = false;
                if(openSet.includes(neighbor)) {
                    if(tempG<neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true
                    openSet.push(neighbor);
                }

                if(newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g+neighbor.h;
                    neighbor.prev = current;
                }
        
            }

        }

        if(current === end) {
            console.log('done')
            done = true;
            noLoop();
            return;
        }

    }else {
        //nosoln
        console.log("no solution")
        noLoop();
        return;
    }
    background(255);
    
    for(var i=0; i<cols; i++) {
        for(var j=0; j<rows; j++) {
            grid[i][j].show(color(255));
        }
    }
    
    for(var i=0; i<closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

    for(var i=0; i<openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }

    path = []
    var temp = current
    while(temp.prev) {
        path.push(temp.prev)
        temp = temp.prev
    }

    for(var i=0; i<path.length; i++) {
        //path[i].show(color(0, 0, 255));
    }

    noFill();
    stroke(255, 0, 0);
    strokeWeight(w/3)
    beginShape();
    for(var i=0; i<path.length; i++) {
        vertex(path[i].i*w+w/2, path[i].j*h+h/2);
    }
    endShape();
  
} 



