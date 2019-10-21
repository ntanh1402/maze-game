import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export class Maze {
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
    this.nodes = [];

    this.generateMazeNodes();
  }

  drawMaze() {
    let tempArr = [];

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[i].length; j++) {
        tempArr.push(this.nodes[i][j].draw());
      }
    }

    return tempArr;
  }

  generateMazeNodes() {
    let index = 0;
    this.nodes = Array(this.dimensions.x)
      .fill()
      .map(() => {
        return Array(this.dimensions.y)
          .fill()
          .map(node => new Node(index++, Maze.NODE_TYPE.PATH, this.cellSize));
      });

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[i].length; j++) {
        this.nodes[i][j].top = this.top + i * (this.cellSize - 1);
        this.nodes[i][j].left = this.left + j * (this.cellSize - 1);
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
    this.generateSpecialNodes();

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
      targetNode = this.nodes[this.dimensions.x - (randomNo - t)][0];

      targetNode.paths.l = true;
      targetNode.type = Maze.NODE_TYPE.TARGET;
      targetNode.typeValue = Math.floor(Math.sqrt(this.dimensions.x * this.dimensions.y));
      this.targetNodeId = targetNode.id;
      return;
    }

    t = t - (this.dimensions.y - 1);
    if (randomNo > t) {
      targetNode = this.nodes[this.dimensions.x - 1][this.dimensions.y - (randomNo - t)];

      targetNode.paths.b = true;
      targetNode.type = Maze.NODE_TYPE.TARGET;
      targetNode.typeValue = Math.floor(Math.sqrt(this.dimensions.x * this.dimensions.y));
      this.targetNodeId = targetNode.id;
      return;
    }

    t = t - (this.dimensions.x - 1);
    if (randomNo > t) {
      targetNode = this.nodes[randomNo - t - 1][this.dimensions.y - 1];

      targetNode.paths.r = true;
      targetNode.type = Maze.NODE_TYPE.TARGET;
      targetNode.typeValue = Math.floor(Math.sqrt(this.dimensions.x * this.dimensions.y));
      this.targetNodeId = targetNode.id;
      return;
    }

    t = t - (this.dimensions.y - 1);
    if (randomNo > t) {
      targetNode = this.nodes[0][randomNo - t - 1];

      targetNode.paths.t = true;
      targetNode.type = Maze.NODE_TYPE.TARGET;
      targetNode.typeValue = Math.floor(Math.sqrt(this.dimensions.x * this.dimensions.y));
      this.targetNodeId = targetNode.id;
      return;
    }
  }

  generateSpecialNodes() {
    this.selectPointNodes();
    this.selectBombNodes();
    this.selectHoleNodes();
  }

  selectPointNodes() {
    let max = this.getRandomNumber(1, this.dimensions.y / 2);
    console.log('selectPointNodes ' + max);

    for (let i = 0; i < max; i++) {
      let ranNodeId = this.getRandomInt(this.dimensions.x * this.dimensions.y);
      let ranNode = this.getNodeById(ranNodeId);
      if (ranNode.type == Maze.NODE_TYPE.PATH) {
        ranNode.type = Maze.NODE_TYPE.POINT;
        ranNode.typeValue = this.getRandomInt(100);
      }
    }
  }

  selectBombNodes() {
    let max = this.getRandomNumber(1, this.dimensions.y / 2);
    console.log('selectBombNodes ' + max);

    for (let i = 0; i < max; i++) {
      let ranNodeId = this.getRandomInt(this.dimensions.x * this.dimensions.y);
      let ranNode = this.getNodeById(ranNodeId);
      if (ranNode.type == Maze.NODE_TYPE.PATH) {
        ranNode.type = Maze.NODE_TYPE.BOMB;
        ranNode.typeValue = 0 - this.getRandomInt(100);
      }
    }
  }

  selectHoleNodes() {
    let max = this.getRandomNumber(1, this.dimensions.y / 2);
    console.log('selectHoleNodes ' + max);

    for (let i = 0; i < max; i++) {
      let ranNodeId = this.getRandomInt(this.dimensions.x * this.dimensions.y);
      let ranNode = this.getNodeById(ranNodeId);
      if (ranNode.type == Maze.NODE_TYPE.PATH) {
        ranNode.type = Maze.NODE_TYPE.HOLE;
        ranNode.typeValue = this.getRandomInt(this.dimensions.x * this.dimensions.y);
      }
    }
  }

  getANextRandomNodeId(curId, existedNodeIds) {
    //console.log(curId);
    let x = Math.floor(curId / this.dimensions.y);
    let y = curId - x * this.dimensions.y;

    //console.log(x + " " + y);

    let leftId = y > 0 ? this.nodes[x][y - 1].id : -1;
    let rightId = y < this.dimensions.y - 1 ? this.nodes[x][y + 1].id : -1;
    let topId = x > 0 ? this.nodes[x - 1][y].id : -1;
    let bottomId = x < this.dimensions.x - 1 ? this.nodes[x + 1][y].id : -1;

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

  getRandomNumber(min, max) {
    return Math.max(min, Math.floor(Math.random() * Math.floor(max)));
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
    return this.nodes[x][y];
  };
}

Maze.NODE_TYPE = {
  PATH: 1,
  TARGET: 2,
  BOMB: 3,
  HOLE: 4,
  POINT: 5
}

class Node {
  constructor(id, type, cellSize) {
    this.id = id;
    this.paths = new Paths();
    this.top = 0;
    this.left = 0;
    this.cellSize = cellSize;
    this.type = type;
    this.typeValue = 0;
  }

  draw() {
    let t = this.paths.t ? 0 : 1;
    let b = this.paths.b ? 0 : 1;
    let l = this.paths.l ? 0 : 1;
    let r = this.paths.r ? 0 : 1;

    switch (this.type) {
      case Maze.NODE_TYPE.PATH:
      case Maze.NODE_TYPE.TARGET:
        return (<View style={[styles.SquareShapeView, { top: this.top, left: this.left, width: this.cellSize, height: this.cellSize, borderTopWidth: t, borderBottomWidth: b, borderLeftWidth: l, borderRightWidth: r }]} />);
      case Maze.NODE_TYPE.BOMB:
        return this.drawBombNode(t, b, l, r);
      case Maze.NODE_TYPE.POINT:
        return this.drawPointNode(t, b, l, r);
      case Maze.NODE_TYPE.HOLE:
        return this.drawHoleNode(t, b, l, r);
      default:
        return null;
    }

  }

  drawBombNode(t, b, l, r) {
    return (
      <View style={[styles.SquareShapeView, { top: this.top, left: this.left, width: this.cellSize, height: this.cellSize, borderTopWidth: t, borderBottomWidth: b, borderLeftWidth: l, borderRightWidth: r }]}>
        <Text style={styles.bomb}>
          {this.typeValue}
        </Text>
      </View>
    );
  }

  drawPointNode(t, b, l, r) {
    return (
      <View style={[styles.SquareShapeView, { top: this.top, left: this.left, width: this.cellSize, height: this.cellSize, borderTopWidth: t, borderBottomWidth: b, borderLeftWidth: l, borderRightWidth: r }]}>
        <Text style={styles.point}>
          {this.typeValue}
        </Text>
      </View>
    );
  }

  drawHoleNode(t, b, l, r) {
    return (
      <View style={[styles.SquareShapeView, { top: this.top, left: this.left, width: this.cellSize, height: this.cellSize, borderTopWidth: t, borderBottomWidth: b, borderLeftWidth: l, borderRightWidth: r }]}>
        <View style={[styles.hole, { width: this.cellSize / 4, height: this.cellSize / 4, borderRadius: this.cellSize / 4 }]} />
      </View>
    );
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

  point: {
    color: 'blue',
    fontSize: 15,
  },

  bomb: {
    color: 'red',
    fontSize: 15,
  },

  hole: {
    backgroundColor: 'black'
  }

});

