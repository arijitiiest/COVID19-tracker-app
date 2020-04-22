import React from "react";
import { View, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";

const StatusCard = (props) => {
  return (
    <View style={{...styles.cardContainer, ...props.style}}>
      <View style={styles.card}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default StatusCard;
