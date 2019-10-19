import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

export class Ball {
    constructor(top, left, size, x, y) {
        this.top = top + 1;
        this.left = left + 1;
        this.size = size - 1;
        this.x = x;
        this.y = y;
    }

    moveLeft() {
        this.y--;
    }

    moveRight() {
        this.y++;
    }

    moveTop() {
        this.x--;
    }

    moveBottom() {
        this.x++;
    }

    drawBall() {
        let top = this.top + this.x * this.size;
        let left = this.left + this.y * this.size;

        return (
            <View style={[styles.ballContainer, { top: top, left: left, width: this.size - 1, height: this.size - 1 }]}>
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
        //borderWidth: 1,
        zIndex: 0
    },

    ball: {
        zIndex: 1,
        backgroundColor: 'red'
    }

});