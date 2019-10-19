import React from 'react';
import {
    StyleSheet,
    View
  } from 'react-native';

export class Ball {
    constructor(top, left, size) {
        this.top = top;
        this.left = left;
        this.size = size;
    }

    moveLeft() {
        this.left = this.left - this.size;
    }

    moveRight() {
        this.left = this.left + this.size;
    }

    moveTop() {
        this.top = this.top - this.size;
    }

    moveBottom() {
        this.top = this.top + this.size;
    }

    drawBall() {
        return (
            <View style={[styles.ballContainer, { top: this.top, left: this.left, width: this.size - 4, height: this.size - 4 }]}>
                <View style={[styles.ball, { width: this.size / 1.5, height: this.size / 1.5, borderRadius: this.size / 1.5 }]} />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    ballContainer: {
        position: 'absolute',
        backgroundColor: '#F5FCFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0
    },

    ball: {
        zIndex: 1,
        backgroundColor: 'red'
    }

});