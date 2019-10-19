import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

export class MazeHelper {
  dimensions = {
    x: 10,
    y: 10
  };


  constructor(row, column, top, left, cellSize) {
    this.dimensions.x = row;
    this.dimensions.y = column;
    this.top = top;
    this.left = left;
    this.cellSize = cellSize;
    this.targetNodeId = -1;   
    this.maze = [];
  }

  drawMaze() {
    let maze = this.maze;
    let tempArr = [];

    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        let t = maze[i][j].paths.t ? 0 : 1;
        let b = maze[i][j].paths.b ? 0 : 1;
        let l = maze[i][j].paths.l ? 0 : 1;
        let r = maze[i][j].paths.r ? 0 : 1;

        tempArr.push(<View style={[styles.SquareShapeView, { top: maze[i][j].top, left: maze[i][j].left, width: this.cellSize, height: this.cellSize, borderTopWidth: t, borderBottomWidth: b, borderLeftWidth: l, borderRightWidth: r }]} />)
      }
    }

    return tempArr;
  }

  generateMazeNodes() {
    let index = 0;
    this.maze = Array(this.dimensions.x)
      .fill()
      .map(() => {
        return Array(this.dimensions.y)
          .fill()
          .map(node => new Node(index++));
      });

    for (let i = 0; i < this.maze.length; i++) {
      for (let j = 0; j < this.maze[i].length; j++) {
        this.maze[i][j].top = this.top + i * (this.cellSize - 1);
        this.maze[i][j].left = this.left + j * (this.cellSize - 1);
      }
    }

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

    this.selectTargetNode();

    //console.log('finish');
  };

  selectTargetNode() {
    let edgeNodeNo = 2 * this.dimensions.x + 2 * (this.dimensions.y - 2);

    let randomNo = this.getRandomInt(edgeNodeNo);
    if (randomNo == 0) {
      randomNo = 1;
    }
    //randomNo = 2;

    let targetNode;
    let t = edgeNodeNo - (this.dimensions.x - 1);
    if (randomNo > t) {
      targetNode = this.maze[this.dimensions.x - (randomNo - t)][0];

      targetNode.paths.l = true;
      this.targetNodeId = targetNode.id;
      return;
    }

    t = t - (this.dimensions.y - 1);
    if (randomNo > t) {
      targetNode = this.maze[this.dimensions.x - 1][this.dimensions.y - (randomNo - t)];

      targetNode.paths.b = true;
      this.targetNodeId = targetNode.id;
      return;
    }

    t = t - (this.dimensions.x - 1);
    if (randomNo > t) {
      targetNode = this.maze[randomNo - t - 1][this.dimensions.y - 1];

      targetNode.paths.r = true;
      this.targetNodeId = targetNode.id;
      return;
    }

    t = t - (this.dimensions.y - 1);
    if (randomNo > t) {
      targetNode = this.maze[0][randomNo - t - 1];

      targetNode.paths.t = true;
      this.targetNodeId = targetNode.id;
      return;
    }
  }

  getANextRandomNodeId(curId, existedNodeIds) {
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

  isValidNodeId(existedNodeIds, nodeId) {
    return (
      nodeId > -1 &&
      nodeId < this.dimensions.x * this.dimensions.y &&
      !existedNodeIds.includes(nodeId)
    );
  };

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  createConnectionBetweenNodes(srcId, desId) {
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

  getNodeById(nodeId) {
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
    this.top = 0;
    this.left = 0;
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

const styles = StyleSheet.create({

  SquareShapeView: {
    position: 'absolute',
    backgroundColor: '#F5FCFF',
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0
  },

});

