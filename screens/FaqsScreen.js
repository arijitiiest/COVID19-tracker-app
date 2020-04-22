import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { AccordionList } from "accordion-collapse-react-native";
import { FontAwesome } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import FAQsData from "../data/Faqs";
import {
  FEVER,
  CAUGHING,
  THROAT,
  BREATH,
  WASH,
  HOME,
  MASK,
  HANDSHAKE,
  GATHERING,
} from "../assets/images";

const FaqsScreen = (props) => {
  const _header = (section) => {
    return (
      <View style={styles.headerContainer}>
        <View style={{ width: Dimensions.get("window").width - 70 }}>
          <Text style={styles.headerText}>{section.title}</Text>
        </View>
        <FontAwesome name="angle-double-down" size={25} color="white" />
      </View>
    );
  };

  const _content = (section) => {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>{section.content}</Text>
      </View>
    );
  };

  const HeaderComponent = () => {
    return (
      <ScrollView>
        <View>
          <Text style={styles.titleText}>Corona Virus Symtoms</Text>
        </View>
        <View style={styles.symptoms}>
          <Image source={FEVER} style={{ width: 80, height: 80 }} />
          <Text style={{ fontSize: 18, fontFamily: "open-sans-bold" }}>
            Hot Fever
          </Text>
        </View>
        <View style={styles.symptoms}>
          <Text style={{ fontSize: 18, fontFamily: "open-sans-bold" }}>
            Coughing
          </Text>
          <Image source={CAUGHING} style={{ width: 80, height: 80 }} />
        </View>
        <View style={styles.symptoms}>
          <Image source={THROAT} style={{ width: 80, height: 80 }} />
          <Text style={{ fontSize: 18, fontFamily: "open-sans-bold" }}>
            Sore Throat
          </Text>
        </View>
        <View style={styles.symptoms}>
          <Text style={{ fontSize: 18, fontFamily: "open-sans-bold" }}>
            Shortness Of Breath
          </Text>
          <Image source={BREATH} style={{ width: 80, height: 80 }} />
        </View>

        <View style={{ marginVertical: 30 }}>
          <View>
            <Text style={styles.titleText}>Precautions</Text>
          </View>
          <View style={styles.symptoms}>
            <Image source={WASH} style={{ width: 100, height: 150 }} />
            <Text style={{ fontSize: 18, fontFamily: "open-sans-bold" }}>
              Wash Hands
            </Text>
          </View>
          <View style={styles.symptoms}>
            <Text style={{ fontSize: 18, fontFamily: "open-sans-bold" }}>
              Stay at Home
            </Text>
            <Image source={HOME} style={{ width: 100, height: 150 }} />
          </View>
          <View style={styles.symptoms}>
            <Image source={MASK} style={{ width: 100, height: 150 }} />
            <Text style={{ fontSize: 18, fontFamily: "open-sans-bold" }}>
              Wear Masks
            </Text>
          </View>
          <View style={styles.symptoms}>
            <Text style={{ fontSize: 18, fontFamily: "open-sans-bold" }}>
              No Handshake
            </Text>
            <Image source={HANDSHAKE} style={{ width: 100, height: 150 }} />
          </View>
          <View style={styles.symptoms}>
            <Image source={GATHERING} style={{ width: 100, height: 150 }} />
            <Text style={{ fontSize: 18, fontFamily: "open-sans-bold" }}>
              No Parties
            </Text>
          </View>
        </View>
        <Text style={styles.titleText}>FAQs</Text>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      <AccordionList
        keyExtractor={(item) => item.id}
        list={FAQsData}
        header={_header}
        body={_content}
        nestedScrollEnabled={true}
        ListHeaderComponent={HeaderComponent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontFamily: "open-sans-bold",
    fontSize: 19,
    textAlign: "center",
    margin: 5,
    marginTop: 10,
    paddingVertical: 3,
    backgroundColor: Colors.primaryColor,
    color: "white",
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    elevation: 5,
  },
  symptoms: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
    padding: 5,
    borderColor: "black",
    borderWidth: 2,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
    margin: 7,
  },
  headerText: {
    fontFamily: "open-sans-bold",
    fontSize: 15,
    color: "white",
  },
  contentContainer: {
    backgroundColor: "white",
    marginTop: 5,
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 7,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    elevation: 5,
    borderRadius: 1,
    backgroundColor: "white",
    margin: 20,
  },
  contentText: {
    fontFamily: "open-sans",
    fontSize: 15,
    color: Colors.textColor,
    padding: 9,
  },
});

export default FaqsScreen;
