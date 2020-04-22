import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

import { LOGO } from "../../assets/images";

const HeaderTitle = (props) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Image
        source={LOGO}
        style={{
          width: 120,
          height: 24,
          marginLeft: 10,
        }}
      />
      <View style={styles.track}>
        <Text style={styles.header}>TRACKER APP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    marginLeft: 10,
  },
  header: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    bottom: 1,
    color: "#000000"
  },
});

export default HeaderTitle;
