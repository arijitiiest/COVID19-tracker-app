import React from "react";
import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";

import WorldStatScreen from "../screens/WorldStatScreen";
import RegionsStatScreen from "../screens/RegionsStatScreen";
import RegionStatScreen from "../screens/RegionStatScreen";
import MyCountryStatScreen from "../screens/MyCountryStatScreen";
import FaqsScreen from "../screens/FaqsScreen";
import HeaderTitle from "../components/UI/HeaderTitle";
import Colors from "../constants/Colors";

const defaultNavStackOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primaryColor : "",
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primaryColor,
  headerTitle: () => <HeaderTitle />,
};

const WorldNavigator = createStackNavigator(
  {
    Home: {
      screen: WorldStatScreen,
    },
    Regions: {
      screen: RegionsStatScreen,
      navigationOptions: {
        headerTitle: "Country Wise Stats",
      },
    },
    Region: {
      screen: RegionStatScreen,
    },
  },
  {
    defaultNavigationOptions: defaultNavStackOptions,
  }
);

const FaqsNavigator = createStackNavigator(
  {
    FAQs: {
      screen: FaqsScreen,
      navigationOptions: {
        headerTitle: "Symtoms and Precautions",
      },
    },
  },
  {
    defaultNavigationOptions: defaultNavStackOptions,
  }
);

const BottomTabNavigator = createBottomTabNavigator(
  {
    World: {
      screen: WorldNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return <AntDesign name="earth" size={22} color={tabInfo.tintColor} />;
        },
      },
    },
    MyCountry: {
      screen: MyCountryStatScreen,
      navigationOptions: {
        tabBarLabel: "My Country",
        tabBarIcon: (tabInfo) => {
          return (
            <FontAwesome name="flag" size={25} color={tabInfo.tintColor} />
          );
        },
      },
    },
    Faqs: {
      screen: FaqsNavigator,
      navigationOptions: {
        tabBarLabel: "FAQs",
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="md-information-circle"
              size={24}
              color={tabInfo.tintColor}
            />
          );
        },
      },
    },
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontFamily: "open-sans",
      },
      activeTintColor: Colors.accentColor,
    },
  }
);

export default createAppContainer(BottomTabNavigator);
