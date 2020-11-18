const grid = document.querySelector("#grid");
const smallGrid = document.querySelector(".small-grid");
const mediumGrid = document.querySelector(".medium-grid");
const largeGrid = document.querySelector(".large-grid");
const start = document.querySelector(".start-visual");
const reset = document.querySelector(".reset");
let board;
let cols;
let source = null, destination = null;
let sRow = -1, sCol = -1;
let dRow = -1, dCol = -1;

const gridGenerator = (gridType) => {
    let nRows = 0;
    let nCols = 0;
    let content = "";
    let height = 0;
    let width = 0;
    if (gridType == "small") {
        nRows = 10;
        nCols = 10;
        height = 45;
        width = 50;
    } else if (gridType == "medium") {
        nRows = 17;
        nCols = 17;
        height = 25;
        width = 30;
    } else {
        nRows = 26;
        nCols = 26;
        height = 15;
        width = 20;
    }


    //Initialising new board
    board = new Array(nRows);

    //Initialising col

    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(nCols);
    }

    for (let i = 0; i < nRows; ++i) {
        let innerContent = `<div class = "row row-${i}">`;
        for (let j = 0; j < nCols; j++) {

            innerContent += `<div class="col col-${i}-${j}" row=${i} col = ${j} style="height: ${height}px;width:${width}px;border: 2px solid  #0a0349;"></div>`;
        }
        innerContent += `</div>`;
        content += innerContent;
        grid.innerHTML = content;
    }
    activateColumns();
}

//Highlighting source and destination in board(when created).
const activateColumns = () => {
    cols = document.querySelectorAll(".col");
    console.log(cols);
    for (let i = 0; i < cols.length; i++) {
        cols[i].addEventListener("click", () => {

            if (!source) {
                source = cols[i];
                cols[i].style.backgroundColor = "green";

                sRow = cols[i].getAttribute("row");
                sCol = cols[i].getAttribute("col");
                board[sRow][sCol] = 1;

            }
            else {
                destination = cols[i];
                cols[i].style.backgroundColor = "red";
                dRow = cols[i].getAttribute("row");
                dCol = cols[i].getAttribute("col");
                board[dRow][dCol] = 2;
            }

        });
    }


}
const createVisitedArray = () => {
    let boardRow = board.length;
    let boardCol = board[0].length;

    let vis = new Array(boardRow);
    for (let i = 0; i < vis.length; i++)
        vis[i] = new Array(boardCol);

    for (let i = 0; i < vis.length; i++)
        vis[i].fill(false);
    return vis;
}
class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

const validNode = (vis, node) => {

    if (node.row < 0 || node.row >= vis.length || node.col < 0 || node.col >= vis[0].length) {
        return false;
    }
    console.log(node);
    if (vis[node.row][node.col])
        return false;

    return true;
}

const bfs = () => {
    let queue = [];
    let vis = createVisitedArray();
    vis[sRow][sCol] = true;

    queue.push(new Node(parseInt(sRow), parseInt(sCol)));

    while (queue.length > 0) {
        let curr = queue.shift();
        console.log(curr);
        if (curr.row == dRow && curr.col == dCol) {
            //reaches destination
            return;
        }
        let rightNode = new Node(curr.row, parseInt(curr.col) + 1);
        let topNode = new Node(parseInt(curr.row) + 1, curr.col);
        let leftNode = new Node(parseInt(curr.row), parseInt(curr.col) - 1);
        let bottomNode = new Node(parseInt(curr.row) - 1, parseInt(curr.col));
        if (validNode(vis, rightNode)) {
            fillColor(rightNode.row, rightNode.col);
            vis[rightNode.row][rightNode.col] = true;
            queue.push(rightNode);
        }
        if (validNode(vis, topNode)) {
            fillColor(topNode.row, topNode.col);
            vis[topNode.row][topNode.col] = true;
            queue.push(topNode);
        }
        if (validNode(vis, leftNode)) {
            fillColor(leftNode.row, leftNode.col);
            vis[leftNode.row][leftNode.col] = true;
            queue.push(leftNode);
        }
        if (validNode(vis, bottomNode)) {
            fillColor(bottomNode.row, bottomNode.col);
            vis[bottomNode.row][bottomNode.col] = true;
            queue.push(bottomNode);
        }

    }

}

const fillColor = (r, c) => {
    console.log(r, c);
    for (let i = 0; i < cols.length; i++) {
        if (cols[i].getAttribute("row") == r && cols[i].getAttribute("col") == c) {
            cols[i].style.backgroundColor = "#b7a329";

        }
    }
}

smallGrid.addEventListener("click", () => {
    gridGenerator("small");
});


mediumGrid.addEventListener("click", () => {
    gridGenerator("medium");
});

largeGrid.addEventListener("click", () => {
    gridGenerator("large");
});

reset.addEventListener("click", () => {
    grid.innerHTML = "";
});
start.addEventListener("click", () => {
    if (!source || !destination) {
        alert("Choose source and destination carefully");
    } else {
        bfs();
    }
});

