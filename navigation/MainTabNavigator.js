import React from "react";
import { Platform, StyleSheet, AsyncStorage } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import TabBarIcon from "../components/TabBarIcon";
import DevotionScreen from "../screens/DevotionScreen";
import NewsScreen from "../screens/NewsScreen";
import ContactScreen from "../screens/ContactScreen";
import PostScreen from "../screens/PostScreen";

const config = Platform.select({
	web: { headerMode: "screen" },
	default: {}
});

const HomeStack = createStackNavigator(
	{
		Home: DevotionScreen,
		DevotionPost: PostScreen
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
	)
};

HomeStack.path = "";

const AboutStack = createStackNavigator(
	{
		About: NewsScreen,
		NewsPost: PostScreen
	},
	config
);

AboutStack.navigationOptions = {
	tabBarLabel: "Christian Articles",
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === "ios" ? "ios-paper" : "md-paper"}
		/>
	)
};

AboutStack.path = "";

const ContactStack = createStackNavigator(
	{
		Contact: ContactScreen
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
	)
};

ContactStack.path = "";

const tabNavigator = createBottomTabNavigator(
	{
		HomeStack,
		AboutStack,
		ContactStack
	},
	{
		tabBarOptions: {
			style: {
				borderTopWidth: 0
				// backgroundColor: "transparent"
			}
		}
	}
);

tabNavigator.path = "";

export default tabNavigator;
