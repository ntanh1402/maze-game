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

import { white } from 'ansi-colors';

import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import { MazeHelper } from './maze.js'
import { Ball } from './ball.js'

const size = 10
const paddingTop = 20;
const paddingLeft = 20;

const DEVICE_WIDTH = Dimensions.get('window').width - paddingLeft;
const DEVICE_HEIGHT = Dimensions.get('window').height - paddingTop;
const DEVICE_RATE = DEVICE_HEIGHT / DEVICE_WIDTH;

const dimensions = {
  y: size,
  x: Math.floor(DEVICE_RATE * size) - 1
}

export default class App extends Component {

  constructor(props) {
    super(props);

    let cellSize = Math.floor(DEVICE_WIDTH / dimensions.y);

    this.mazeHelper = new MazeHelper(dimensions.x, dimensions.y, paddingTop, paddingLeft, cellSize);
    this.ball = new Ball(paddingTop, paddingLeft, cellSize, 0, 0);

    this.reloadGame();

    this.onSwipe = this.onSwipe.bind(this);
  }

  reloadGame() {
    this.mazeHelper.generateMazeNodes();

    let randomStartNodeId = this.mazeHelper.getRandomInt(dimensions.x * dimensions.y);
    while (randomStartNodeId == this.mazeHelper.targetNodeId) {
      randomStartNodeId = this.mazeHelper.getRandomInt(dimensions.x * dimensions.y);
    }

    this.ball.x = Math.floor(randomStartNodeId / dimensions.y);
    this.ball.y = randomStartNodeId - this.ball.x * dimensions.y;
  }


  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        if (this.mazeHelper.maze[this.ball.x][this.ball.y].paths.t) {
          this.ball.moveTop();
        }
        break;
      case SWIPE_DOWN:
        if (this.mazeHelper.maze[this.ball.x][this.ball.y].paths.b) {
          this.ball.moveBottom();
        }
        break;
      case SWIPE_LEFT:
        if (this.mazeHelper.maze[this.ball.x][this.ball.y].paths.l) {
          this.ball.moveLeft();
        }
        break;
      case SWIPE_RIGHT:
        if (this.mazeHelper.maze[this.ball.x][this.ball.y].paths.r) {
          this.ball.moveRight();
        }
        break;
    }

    if (this.mazeHelper.maze[this.ball.x][this.ball.y].id == this.mazeHelper.targetNodeId) {
      this.reloadGame();
    }

    this.setState({});
  }


  render() {

    const config = {
      velocityThreshold: 0.1,
      directionalOffsetThreshold: 80
    };

    return (
      <GestureRecognizer
        onSwipe={this.onSwipe}
        config={config}
        style={styles.container}>

        {
          this.mazeHelper.drawMaze()
        }

        {
          this.ball.drawBall()
        }

      </GestureRecognizer>

    );
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    paddingTop: paddingTop,
    paddingLeft: paddingLeft
  }

});
