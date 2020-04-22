import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";

import Colors from "../../constants/Colors";

const RegionItems = (props) => {
  const {
    region,
    countryCode,
    newConfirmed,
    totalConfirmed,
    newDeaths,
    totalDeaths,
    newRecovered,
    totalRecovered,
  } = props.data;

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.region}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View style={styles.dataContainer}>
            <View style={styles.RegionTitleImage}>
              <Text style={styles.regionTitle}>{region.toUpperCase()}</Text>
            </View>
            <View style={styles.regionData}>
              <Text style={styles.infected}>CONFIRMED: {totalConfirmed} [+{newConfirmed}]</Text>
              <Text style={styles.active}>
                ACTIVE: {totalConfirmed - totalRecovered - totalDeaths}
              </Text>
              <Text style={styles.recovered}>RECOVERED: {totalRecovered} [+{newRecovered}]</Text>
              <Text style={styles.death}>
                DEATH: {totalDeaths} [+{newDeaths}]
              </Text>
            </View>
          </View>
        </TouchableCmp>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  region: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  dataContainer: {
    display: "flex",
    flexDirection: "row",
  },
  RegionTitleImage: {
    width: 140,
    height: 115,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 15,
  },
  regionTitle: {
    fontFamily: "open-sans-bold",
    fontSize: 15,
    paddingBottom: 5,
  },
  imageContainer: {
    width: 80,
    height: 64,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  regionData: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  infected: {
    fontFamily: "open-sans-bold",
    fontSize: 12,
    padding: 3,
    color: Colors.deathColor,
  },
  active: {
    fontFamily: "open-sans-bold",
    fontSize: 12,
    padding: 3,
    color: Colors.activeColor
  },
  recovered: {
    fontFamily: "open-sans-bold",
    fontSize: 12,
    padding: 3,
    color: Colors.recoveredColor
  },
  death: {
    fontFamily: "open-sans-bold",
    fontSize: 12,
    padding: 3,
    color: Colors.infectedColor
  },
});

export default RegionItems;
