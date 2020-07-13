import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";

export default class CardFiles extends Component {
    render() {
        return (
            <View style={{ height: 130, width: 130, borderWidth: 1, borderColor: '#bdc3c7', marginLeft: this.props.left, borderRadius: 15  }}>
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center", paddingTop: 10 }}>
                    <Image source={this.props.imageUri}
                        style={{ flex: 1, width: 50, height: 50, resizeMode: 'cover' }}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 10 }}>
                    <Text>{this.props.name.length > 14 ? `${this.props.name.substring(0, 14)}...` : this.props.name}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});