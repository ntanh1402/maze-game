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

import { MazeHelper } from './maze.js'
import { Ball } from './ball.js'

const paddingTop = 20;
const paddingLeft = 20;

const DEVICE_WIDTH = Dimensions.get('window').width - paddingLeft * 2;
const DEVICE_HEIGHT = Dimensions.get('window').height - paddingTop;
const DEVICE_RATE = DEVICE_HEIGHT / DEVICE_WIDTH;

let size = 3
let dimensions = {
  y: size,
  x: size//Math.floor(DEVICE_RATE * size) - 1
}

export default class App extends Component {

  constructor(props) {
    super(props);

    this.reloadGame();
    this.state = {
      level: 'LEVEL ' + (size - 2)
    }

    this.onSwipe = this.onSwipe.bind(this);
  }

  reloadGame() {
    let cellSize = Math.floor(DEVICE_WIDTH / dimensions.y);

    this.mazeHelper = new MazeHelper(dimensions.x, dimensions.y, paddingTop, paddingLeft, cellSize);

    this.mazeHelper.generateMazeNodes();

    let randomStartNodeId = this.mazeHelper.getRandomInt(dimensions.x * dimensions.y);
    while (randomStartNodeId == this.mazeHelper.targetNodeId) {
      randomStartNodeId = this.mazeHelper.getRandomInt(dimensions.x * dimensions.y);
    }

    let x = Math.floor(randomStartNodeId / dimensions.y);
    let y = randomStartNodeId - x * dimensions.y;
    this.ball = new Ball(paddingTop, paddingLeft, cellSize, x, y);
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
      size++;
      dimensions.x++;
      dimensions.y++;
      this.reloadGame();
    }

    this.setState({ level: 'LEVEL ' + (size - 2) });
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
        style={{ flex: 1 }}>

        <View style={styles.header}>
          <Text style={styles.level}>
            {this.state.level}
          </Text>
        </View>

        <View style={styles.container}>

          {
            this.mazeHelper.drawMaze()
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
    flex: 4,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    paddingTop: paddingTop,
    paddingLeft: paddingLeft,
    paddingRight: paddingLeft
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
