import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
import {
	Platform,
	StatusBar,
	StyleSheet,
	View,
	AsyncStorage
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WebView from "react-native-webview";
import * as FileSystem from "expo-file-system";

import AppNavigator from "./navigation/AppNavigator";

export default function App(props) {
	const [isLoadingComplete, setLoadingComplete] = useState(false);

	if (WebView.defaultProps == null) WebView.defaultProps = {};
	WebView.defaultProps.useWebKit = true;

	if (!isLoadingComplete && !props.skipLoadingScreen) {
		return (
			<AppLoading
				startAsync={loadResourcesAsync}
				onError={handleLoadingError}
				onFinish={() => handleFinishLoading(setLoadingComplete)}
			/>
		);
	} else {
		return (
			<View style={styles.container}>
				{Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
				<AppNavigator />
			</View>
		);
	}
}

async function loadResourcesAsync() {
	let info = await FileSystem.getInfoAsync(
		FileSystem.documentDirectory + "posts"
	);
	if (!info.exists) {
		FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "posts");
	}
	await Promise.all([
		Asset.loadAsync([
			require("./assets/images/icon.png"),
			require("./assets/images/splash.png")
		]),
		Font.loadAsync({
			// This is the font that we are using for our tab bar
			...Ionicons.font,
			// We include SpaceMono because we use it in HomeScreen.js. Feel free to
			// remove this if you are not using it in your app
			"space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
		})
	]);
}

function handleLoadingError(error) {
	// In this case, you might want to report the error to your error reporting
	// service, for example Sentry
	console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
	setLoadingComplete(true);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	}
});
