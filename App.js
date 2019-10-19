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

const DEVICE_WIDTH = Dimensions.get('window').width - 20;
const DEVICE_HEIGHT = Dimensions.get('window').height - 20;
const DEVICE_RATE = DEVICE_HEIGHT / DEVICE_WIDTH;

const size = 15
const dimensions = {
  y: size,
  x: Math.floor(DEVICE_RATE * size) - 1
}

export default class App extends Component {

  constructor(props) {
    super(props);

    this.mazeHelper = new MazeHelper(dimensions.x, dimensions.y);
    this.mazeHelper.generateMazeNodes();

    this.ball = new Ball(12, 12, DEVICE_WIDTH / dimensions.y);

    this.onSwipe = this.onSwipe.bind(this);
  }

  drawMaze() {
    let maze = this.mazeHelper.maze;
    let tempArr = [];

    for (let i = 0; i < maze.length; i++) {
      let temp = [];
      for (let j = 0; j < maze[i].length; j++) {
        let t = maze[i][j].paths.t ? 0 : 1;
        let b = maze[i][j].paths.b ? 0 : 1;
        let l = maze[i][j].paths.l ? 0 : 1;
        let r = maze[i][j].paths.r ? 0 : 1;

        //console.log(maze[i][j])
        //console.log(t + ' ' + b + ' ' + l + ' ' + r);


        temp.push(<View style={[styles.SquareShapeView, { borderTopWidth: t, borderBottomWidth: b, borderLeftWidth: l, borderRightWidth: r }]} />)
      }

      tempArr.push(<View style={styles.lineContainer}>{temp}</View>)
    }

    return tempArr;
  }

  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        this.ball.moveTop();
        break;
      case SWIPE_DOWN:
        this.ball.moveBottom();
        break;
      case SWIPE_LEFT:
        this.ball.moveLeft();
        break;
      case SWIPE_RIGHT:
        this.ball.moveRight();
        break;
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
          this.drawMaze()
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
    padding: 10
  },

  lineContainer: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  },

  SquareShapeView: {
    width: DEVICE_WIDTH / dimensions.y,
    height: DEVICE_WIDTH / dimensions.y,
    backgroundColor: '#F5FCFF',
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0
  },

});
