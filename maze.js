export class MazeHelper {
  dimensions = {
    x: 10,
    y: 10
  };

  constructor(row, column) {
    this.dimensions.x = row;
    this.dimensions.y = column;

    let index = 0;
    this.maze = Array(this.dimensions.x)
      .fill()
      .map(() => {
        return Array(this.dimensions.y)
          .fill()
          .map(node => new Node(index++));
      });

    //generateMazeNodes();
  }

  getANextRandomNodeId = (curId, existedNodeIds) => {
    //console.log(curId);
    let x = Math.floor(curId / this.dimensions.y);
    let y = curId - x * this.dimensions.y;

    //console.log(x + " " + y);

    let leftId = y > 0 ? this.maze[x][y - 1].id : -1;
    let rightId = y < this.dimensions.y - 1 ? this.maze[x][y + 1].id : -1;
    let topId = x > 0 ? this.maze[x - 1][y].id : -1;
    let bottomId = x < this.dimensions.x - 1 ? this.maze[x + 1][y].id : -1;

    //console.log(curId + ": " + leftId + " " + rightId + " " + topId + " " + bottomId);

    let availables = [];
    if (this.isValidNodeId(existedNodeIds, leftId)) {
      availables.push(leftId);
    }
    if (this.isValidNodeId(existedNodeIds, rightId)) {
      availables.push(rightId);
    }
    if (this.isValidNodeId(existedNodeIds, topId)) {
      availables.push(topId);
    }
    if (this.isValidNodeId(existedNodeIds, bottomId)) {
      availables.push(bottomId);
    }

    if (availables.length == 0) {
      return -1;
    }

    let random = this.getRandomInt(availables.length);
    return availables[random];
  };

  isValidNodeId = (existedNodeIds, nodeId) => {
    return (
      nodeId > -1 &&
      nodeId < this.dimensions.x * this.dimensions.y &&
      !existedNodeIds.includes(nodeId)
    );
  };

  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  generateMazeNodes = () => {
    let existedNodeIds = [];
    let mazePath = [];

    let curId = this.getRandomInt(this.dimensions.x * this.dimensions.y);
    existedNodeIds.push(curId);
    mazePath.push(curId);

    while (mazePath.length > 0) {
      curId = mazePath[mazePath.length - 1];
      let nextId = this.getANextRandomNodeId(curId, existedNodeIds);

      //console.log(curId + " -> " + nextId);

      if (nextId == -1) {
        let t = mazePath.pop();
        //console.log("pop " + t);
        continue;
      }

      existedNodeIds.push(nextId);
      mazePath.push(nextId);
      this.createConnectionBetweenNodes(curId, nextId);
    }

    //console.log('finish');
  };

  createConnectionBetweenNodes = (srcId, desId) => {
    //console.log("createConnectionBetweenNodes");
    let src = this.getNodeById(srcId);
    let des = this.getNodeById(desId);

    //console.log(src);
    //console.log(des);

    let srcX = Math.floor(srcId / this.dimensions.y);
    let srcY = srcId - srcX * this.dimensions.y;

    //console.log(srcX + ' ' + srcY);

    let desX = Math.floor(desId / this.dimensions.y);
    let desY = desId - desX * this.dimensions.y;

    //console.log(desX + ' ' + desY);

    if (srcY + 1 == desY) {      //src is left, des is right
      src.paths.r = true;
      des.paths.l = true;
    } else if (srcY - 1 == desY) {      //src is right, des is left
      src.paths.l = true;
      des.paths.r = true;
    } else if (srcX + 1 == desX) {      //src is top, des is bottom
      src.paths.b = true;
      des.paths.t = true;
    } else if (srcX - 1 == desX) {      //src is bottom, des is top
      src.paths.t = true;
      des.paths.b = true;
    }
  };

  getNodeById = nodeId => {
    //console.log("getNodeById");
    let x = Math.floor(nodeId / this.dimensions.y);
    let y = nodeId - x * this.dimensions.y;
    //console.log(x + " " + y);
    return this.maze[x][y];
  };
}

class Node {
  constructor(id) {
    this.id = id;
    this.type = "path";
    this.paths = new Paths();
  }
}

class Paths {
  constructor() {
    this.l = false;
    this.r = false;
    this.t = false;
    this.b = false;
  }
}

