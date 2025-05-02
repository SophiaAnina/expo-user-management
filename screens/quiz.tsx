import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Quiz() {
    return (
        <View>
            <TouchableOpacity style={styles.button}>
                <Text>Start</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 10,
        margin: 20,
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
        justifyContent: 'center',
    },
})