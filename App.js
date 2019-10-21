import React, { Component } from 'react';

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions
} from 'react-native';

import { white, bold } from 'ansi-colors';

import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import { Maze } from './maze.js'
import { Ball } from './ball.js'

const paddingTop = 20;
const paddingLeft = 10;

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

let size = 3
let dimensions = {
  y: size,
  x: size//Math.floor(DEVICE_HEIGHT / DEVICE_WIDTH * size) - 1
}

export default class App extends Component {

  constructor(props) {
    super(props);

    this.reloadGame();
    this.state = {
      level: 'LEVEL ' + (size - 2)
    }
    this.point = 0;
    this.onSwipe = this.onSwipe.bind(this);
  }

  reloadGame() {
    let cellSize = Math.floor((DEVICE_WIDTH - 2 * paddingLeft) / dimensions.y);
    let top = paddingTop;
    let left = (DEVICE_WIDTH - (cellSize + (cellSize - 1) * (dimensions.y - 1))) / 2;

    this.maze = new Maze(dimensions.x, dimensions.y, top, left, cellSize);

    let randomStartNodeId = this.maze.getRandomInt(dimensions.x * dimensions.y);
    let ranStartNode = this.maze.getNodeById(randomStartNodeId);
    while (ranStartNode.type != Maze.NODE_TYPE.PATH) {
      randomStartNodeId = this.maze.getRandomInt(dimensions.x * dimensions.y);
      ranStartNode = this.maze.getNodeById(randomStartNodeId);
    }

    let x = Math.floor(randomStartNodeId / dimensions.y);
    let y = randomStartNodeId - x * dimensions.y;
    this.ball = new Ball(top, left, cellSize, x, y);
  }


  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        if (this.maze.nodes[this.ball.x][this.ball.y].paths.t) {
          this.ball.moveTop();
        }
        break;
      case SWIPE_DOWN:
        if (this.maze.nodes[this.ball.x][this.ball.y].paths.b) {
          this.ball.moveBottom();
        }
        break;
      case SWIPE_LEFT:
        if (this.maze.nodes[this.ball.x][this.ball.y].paths.l) {
          this.ball.moveLeft();
        }
        break;
      case SWIPE_RIGHT:
        if (this.maze.nodes[this.ball.x][this.ball.y].paths.r) {
          this.ball.moveRight();
        }
        break;
    }

    this.handleNodeAction();

    this.setState({ level: 'LEVEL ' + (size - 2) });
  }

  handleNodeAction() {
    if (this.ball.x >= dimensions.x || this.ball.y >= dimensions.y || this.ball.x < 0 || this.ball.y < 0) {
      size++;
      dimensions.x++;
      dimensions.y++;
      this.point += Math.floor(Math.sqrt(dimensions.x * dimensions.y));
      this.reloadGame();
      return;
    }
    let ballNode = this.maze.nodes[this.ball.x][this.ball.y];
    switch (ballNode.type) {
      case Maze.NODE_TYPE.POINT:
        this.point += ballNode.typeValue;
        ballNode.type = Maze.NODE_TYPE.PATH;
        break;
      case Maze.NODE_TYPE.BOMB:
        this.point += ballNode.typeValue;
        ballNode.type = Maze.NODE_TYPE.PATH;
        break;
      case Maze.NODE_TYPE.HOLE:
        let nodeId = ballNode.typeValue;
        console.log('HOLE: ' + nodeId);
        this.ball.x = Math.floor(nodeId / dimensions.y);
        this.ball.y = nodeId - this.ball.x * dimensions.y;
        ballNode.type = Maze.NODE_TYPE.PATH;
        break;
    }
  }

  render() {

    const config = {
      velocityThreshold: 0.01,
      directionalOffsetThreshold: 50
    };

    return (
      <GestureRecognizer
        onSwipe={this.onSwipe}
        config={config}
        style={{ flex: 1 }}>

        <View style={styles.header}>
          <Text style={styles.level}>
            {this.state.level}
          </Text>
          <Text style={styles.level}>
            {this.point}
          </Text>
        </View>

        <View style={styles.container}>

          {
            this.maze.drawMaze()
          }

          {
            this.ball.drawBall()
          }

        </View>

      </GestureRecognizer>

    );
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 5,
    backgroundColor: '#F5FCFF'
  },

  header: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },

  level: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  }

});
