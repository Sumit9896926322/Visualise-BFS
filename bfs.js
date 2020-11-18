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
let result = false;

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

            innerContent += `<div class="col col-${i}-${j}" row=${i} col = ${j} style="height: ${height}px;width:${width}px;border: 2px solid  #b7a329; 
            "></div>`;
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
            else if (!destination) {
                dRow = cols[i].getAttribute("row");
                dCol = cols[i].getAttribute("col");
                if (dRow == sRow && dCol == sCol) {
                    alert("Source and destination can't be same");
                    return;
                }
                destination = cols[i];
                cols[i].style.backgroundColor = "red";
                board[dRow][dCol] = 2;
            }
            // } else {
            //     cols[i].style.backgroundColor = "black";
            //     board[cols[i].getAttribute("row")][cols[i].getAttribute("col")] = -1;
            //     console.log(board);
            // }

        });
    }


}
const createVisitedArray = () => {
    console.log(board);
    let boardRow = board.length;
    let boardCol = board[0].length;

    let vis = new Array(boardRow);
    for (let i = 0; i < vis.length; i++)
        vis[i] = new Array(boardCol);

    for (let j = 0; j < vis.length; j++)
        vis[j].fill(false);

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

    if (vis[node.row][node.col])
        return false;

    return true;
}

const bfs = async () => {
    let queue = [];
    let vis = createVisitedArray();
    vis[sRow][sCol] = true;

    queue.push(new Node(parseInt(sRow), parseInt(sCol)));

    while (queue.length > 0) {
        let curr = queue.shift();
        if (curr.row == dRow && curr.col == dCol) {
            //reaches destination
            return;
        }

        let rightNode = new Node(parseInt(curr.row), parseInt(curr.col) + 1);

        let topNode = new Node(parseInt(curr.row) + 1, parseInt(curr.col));

        let leftNode = new Node(parseInt(curr.row), parseInt(curr.col) - 1);
        let bottomNode = new Node(parseInt(curr.row) - 1, parseInt(curr.col));

        if (validNode(vis, rightNode)) {
            await fillColor(rightNode.row, rightNode.col).then(() => {
                vis[rightNode.row][rightNode.col] = true;
                queue.push(rightNode);
            });

        }

        if (validNode(vis, topNode)) {
            await fillColor(topNode.row, topNode.col).then(() => {

                vis[topNode.row][topNode.col] = true;
                queue.push(topNode);
            });

        }

        if (validNode(vis, leftNode)) {
            await fillColor(leftNode.row, leftNode.col).then(() => {

                vis[leftNode.row][leftNode.col] = true;
                queue.push(leftNode);
            });

        }
        if (validNode(vis, bottomNode)) {
            await fillColor(bottomNode.row, bottomNode.col).then(() => {

                vis[bottomNode.row][bottomNode.col] = true;
                queue.push(bottomNode);
            });

        }
    }

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const fillColor = async (r, c) => {
    await sleep(10);

    for (let i = 0; i < cols.length; i++) {
        if (cols[i].getAttribute("row") == dRow && cols[i].getAttribute("col") == dCol) {
            return;
        }
        if (cols[i].getAttribute("row") == r && cols[i].getAttribute("col") == c) {
            const elem = document.querySelector(`.col-${cols[i].getAttribute("row")}-${cols[i].getAttribute("col")}`);

            cols[i].style.backgroundColor = "#0a0349";

        }
    }
}

smallGrid.addEventListener("click", () => {
    source = null, destination = null;
    gridGenerator("small");
});


mediumGrid.addEventListener("click", () => {
    source = null, destination = null;
    gridGenerator("medium");
});

largeGrid.addEventListener("click", () => {
    source = null, destination = null;
    gridGenerator("large");
});

reset.addEventListener("click", () => {
    source = null, destination = null;
    grid.innerHTML = "";
});
start.addEventListener("click", () => {

    if (!source || !destination) {
        alert("Choose source and destination carefully");
    } else {
        bfs();
    }
});

