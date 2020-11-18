const grid = document.querySelector("#grid");
const smallGrid = document.querySelector(".small-grid");
const mediumGrid = document.querySelector(".medium-grid");
const largeGrid = document.querySelector(".large-grid");
const start = document.querySelector(".start-visual");
const reset = document.querySelector(".reset");
const status = document.querySelector(".status");
let board;
let cols;
let source = null, destination = null;
let sRow = -1, sCol = -1;
let dRow = -1, dCol = -1;
let dest = null;
let reached = false;

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

            innerContent += `<div class="col col-${i}-${j}" row=${i} col = ${j} style="height: ${height}px;width:${width}px;border: 2px solid  #0a0349; 
            "></div>`;
        }
        innerContent += `</div>`;
        content += innerContent;
        grid.innerHTML = content;
    }
    activateColumns(height, width);
}

//Highlighting source and destination in board(when created).
const activateColumns = (height, width) => {

    cols = document.querySelectorAll(".col");
    console.log(cols);
    for (let i = 0; i < cols.length; i++) {
        cols[i].addEventListener("click", () => {

            if (!source) {
                source = cols[i];
                cols[i].style.backgroundColor = "red";
                cols[i].style.background = "url('./assets/starting.jpg')";
                cols[i].style.backgroundPosition = "center";
                cols[i].style.backgroundRepeat = "no-repeat";
                cols[i].style.backgroundSize = `${height}px ${width}px`;

                sRow = cols[i].getAttribute("row");
                sCol = cols[i].getAttribute("col");
                board[sRow][sCol] = 1;

            }
            else if (!destination) {
                destination = cols[i];

                cols[i].style.background = "url('./assets/trophy.jpg')";
                cols[i].style.backgroundPosition = "center";
                cols[i].style.backgroundRepeat = "no-repeat";
                cols[i].style.backgroundSize = `${height}px ${width}px`;
                dRow = cols[i].getAttribute("row");
                dCol = cols[i].getAttribute("col");
                board[dRow][dCol] = 2;
            } else {
                let blockRow = parseInt(cols[i].getAttribute("row"));
                let blockCol = parseInt(cols[i].getAttribute("col"));
                cols[i].style.background = "url('./assets/danger.jpg')";
                cols[i].style.backgroundPosition = "center";
                cols[i].style.backgroundRepeat = "no-repeat";
                cols[i].style.backgroundSize = `${height}px ${width}px`;
                board[blockRow][blockCol] = -1;

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
    // console.log(vis);
    return vis;
}
class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

const validNode = (vis, node) => {


    if (node.row < 0 || node.row >= vis.length || node.col < 0 || node.col >= vis[0].length || board[node.row][node.col] == -1) {
        return false;
    }

    return true;
}

const bfs = async () => {
    reached = false;
    let queue = [];
    let vis = createVisitedArray();
    vis[sRow][sCol] = true;

    queue.push(new Node(parseInt(sRow), parseInt(sCol)));


    while (queue.length > 0) {
        let curr = queue.shift();

        console.log(curr);
        if (board[curr.row][curr.col] == 2) {
            reached = true;

            destination.style.background = "url('./assets/winner.png')";
            destination.style.backgroundPosition = "center";
            destination.style.backgroundRepeat = "no-repeat";
            destination.style.backgroundSize = "50px 50px";

            // alert("Position found at" + curr.row + " " + curr.col);
            return true;
        }

        let rightNode = new Node(curr.row, parseInt(curr.col) + 1);

        let topNode = new Node(parseInt(curr.row) + 1, curr.col);

        let leftNode = new Node(parseInt(curr.row), parseInt(curr.col) - 1);
        let bottomNode = new Node(parseInt(curr.row) - 1, parseInt(curr.col));

        if (validNode(vis, rightNode) && !vis[rightNode.row][rightNode.col]) {
            await fillColor(curr.row, curr.col).then(() => {
                vis[rightNode.row][rightNode.col] = true;
                queue.push(rightNode);
            });

        }

        if (validNode(vis, topNode) && !vis[topNode.row][topNode.col]) {
            await fillColor(curr.row, curr.col).then(() => {
                vis[topNode.row][topNode.col] = true;
                queue.push(topNode);
            });

        }

        if (validNode(vis, leftNode) && !vis[leftNode.row][leftNode.col]) {
            await fillColor(curr.row, curr.col).then(() => {
                console.log(2);
                vis[leftNode.row][leftNode.col] = true;
                queue.push(leftNode);
            });

        }
        if (validNode(vis, bottomNode) && !vis[bottomNode.row][bottomNode.col]) {
            await fillColor(curr.row, curr.col).then(() => {
                console.log(3);
                vis[bottomNode.row][bottomNode.col] = true;
                queue.push(bottomNode);
            });

        }

    }
    return false;

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const fillColor = async (r, c) => {
    await sleep(10);

    for (let i = 0; i < cols.length; i++) {

        if (board[r][c] == 1) return;


        if (parseInt(cols[i].getAttribute("row")) == r && parseInt(cols[i].getAttribute("col")) == c) {
            const elem = document.querySelector(`.col-${cols[i].getAttribute("row")}-${cols[i].getAttribute("col")}`);

            // cols[i].style.backgroundColor = "#0a0349";
            cols[i].style.background = "url('./assets/cartoon.png')";
            cols[i].style.backgroundPosition = "center";
            cols[i].style.backgroundRepeat = "no-repeat";
            cols[i].style.backgroundSize = "50px 50px";


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
start.addEventListener("click", async () => {

    if (!source || !destination) {
        alert("Choose source and destination carefully");
    } else {
        let res = await bfs();
        if (res) {
            status.innerHTML = `Destination found at (${dRow},${dCol})`;
        } else {
            status.innerHTML = `Destination Not found`;
        }
    }
});
