// import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
import {
	Platform,
	StatusBar,
	StyleSheet,
	View,
	AsyncStorage,
	Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WebView from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { AdMobInterstitial } from "expo-ads-admob";
import * as InAppPurchases from "expo-in-app-purchases";

import AppNavigator from "./navigation/AppNavigator";

export default function App(props) {
	const [isLoadingComplete, setLoadingComplete] = useState(false);

	useEffect(() => {
		const purchaseListener = InAppPurchases.setPurchaseListener(
			({ responseCode, results, errorCode }) => {
				// Purchase was successful
				if (responseCode === InAppPurchases.IAPResponseCode.OK) {
					results.forEach((purchase) => {
						if (!purchase.acknowledged) {
							console.log(`Successfully purchased ${purchase.productId}`);
							// Process transaction here and unlock content...
							// AdMobInterstitial.setAdUnitID("");
							setHistory(results);

							// Then when you're done
							InAppPurchases.finishTransactionAsync(purchase, true);
						}
					});
				}

				// Else find out what went wrong
				if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
					console.log("User canceled the transaction");
				} else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
					console.log(
						"User does not have permissions to buy but requested parental approval (iOS only)"
					);
				} else {
					console.warn(
						`Something went wrong with the purchase. Received errorCode ${errorCode}`
					);
				}
			}
		);

		return () => purchaseListener.remove();
	}, []);

	const [history, setHistory] = useState(undefined);

	const initPurchases = async () => {
		const response = await InAppPurchases.connectAsync();
		console.log(response.results[0]);
		setHistory(response.results);
		// if (response.responseCode === InAppPurchases.IAPResponseCode.OK) {
		//   if (
		//     response.results[0].purchaseState ===
		//     InAppPurchases.InAppPurchaseState.PURCHASED
		//   ) {
		//     AdMobInterstitial.setAdUnitID(""); // Test ID, Replace with your-admob-unit-id
		//   } else {
		//     AdMobInterstitial.setAdUnitID("ca-app-pub-5832084307445472/7196223658"); // Test ID, Replace with your-admob-unit-id
		//     AdMobInterstitial.setTestDeviceID("EMULATOR");
		//   }
		// }
		InAppPurchases.disconnectAsync();
	};

	useEffect(() => {
		try {
			loadResourcesAsync().then(() => {
				handleFinishLoading(setLoadingComplete);
			});
		} catch (error) {
			handleLoadingError(error);
		}

		setInterval(async () => {
			if (history !== undefined)
				if (history.length > 0)
					if (
						history[0].purchaseState === InAppPurchaseState.PURCHASED ||
						history[0].purchaseState === InAppPurchaseState.RESTORED
					)
						return;
			const ad = await AdMobInterstitial.requestAdAsync();
			AdMobInterstitial.showAdAsync();
		}, 180000);
	}, []);

	if (WebView.defaultProps == null) WebView.defaultProps = {};
	WebView.defaultProps.useWebKit = true;

	if (!isLoadingComplete) {
		return <View></View>;
	} else {
		return (
			<View style={styles.container}>
				{Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
				<AppNavigator
					screenProps={{ history: history, restorePurchases: initPurchases }}
				/>
			</View>
		);
	}
}

async function loadResourcesAsync() {
	// initPurchases();
	let info = await FileSystem.getInfoAsync(
		FileSystem.documentDirectory + "posts"
	);
	if (!info.exists) {
		FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "posts");
	}
	await Promise.all([
		Asset.loadAsync([
			require("./assets/images/icon.png"),
			require("./assets/images/splash.png"),
		]),
		Font.loadAsync({
			// This is the font that we are using for our tab bar
			...Ionicons.font,
			// We include SpaceMono because we use it in HomeScreen.js. Feel free to
			// remove this if you are not using it in your app
			"space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
		}),
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
		backgroundColor: "#fff",
	},
});
