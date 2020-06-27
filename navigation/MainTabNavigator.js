import React from "react";
import { Platform, StyleSheet, AsyncStorage } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import TabBarIcon from "../components/TabBarIcon";
import DevotionScreen from "../screens/DevotionScreen";
import NewsScreen from "../screens/NewsScreen";
import ContactScreen from "../screens/ContactScreen";
import PostScreen from "../screens/PostScreen";
import AuthStack from "./AuthStackNavigator";
import { createSwitchNavigator } from "react-navigation";
import TriviaScreen from "../screens/TriviaScreen";
import LeaderBoardScreen from "../screens/LeaderBoardScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: DevotionScreen,
    DevotionPost: PostScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: "Devotions",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-home" : "md-home"}
    />
  ),
};

HomeStack.path = "";

const AboutStack = createStackNavigator(
  {
    About: NewsScreen,
    NewsPost: PostScreen,
  },
  config
);

AboutStack.navigationOptions = {
  tabBarLabel: "Articles",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-paper" : "md-paper"}
    />
  ),
};

AboutStack.path = "";

const ContactStack = createStackNavigator(
  {
    Contact: ContactScreen,
  },
  config
);

ContactStack.navigationOptions = {
  tabBarLabel: "About",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-contact" : "md-contact"}
    />
  ),
};

ContactStack.path = "";

const TriviaStack = createStackNavigator(
  {
    Trivia: TriviaScreen,
    Leaderboard: LeaderBoardScreen,
  },
  { headerMode: "none", initialRouteName: "Trivia" }
);

TriviaStack.path = "";

const TriviaSwitch = createSwitchNavigator(
  {
    Auth: AuthStack,
    Trivia: TriviaStack,
  },
  { initialRouteName: "Auth", headerMode: "none" }
);

TriviaSwitch.navigationOptions = {
  tabBarLabel: "Trivia",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="logo-game-controller-b" />
  ),
};

const tabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    AboutStack,
    ContactStack,
    TriviaSwitch,
  },
  {
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: "#F2EDE9",
        borderTopWidth: 0,
        // backgroundColor: "transparent"
      },
      labelStyle: {
        color: "#F25C5C",
      },
    },
  }
);

tabNavigator.path = "";

export default tabNavigator;
