import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect, Component } from "react";
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	FlatList,
	Platform,
	Button,
	AsyncStorage,
	Switch,
} from "react-native";
import axios from "axios";
import PostCard from "../components/PostCard";
import { TextInput } from "react-native-gesture-handler";
import * as Network from "expo-network";
// import { Notifications } from "expo";
import * as Notifications from "expo-notifications";
import Wordpress from "../constants/Wordpress";
import { Constants } from "react-native-unimodules";

let arrayholder = [];

export default function DevotionScreen(props) {
	const [posts, setPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [favFilter, setFavFilter] = useState(false);
	const [favourites, setFavourites] = useState([]);

	async function registerForPushNotificationsAsync() {
		const { status } = await Notifications.requestPermissionsAsync();
		console.log("asking for notifications");

		// only asks if permissions have not already been determined, because
		// iOS won't necessarily prompt the user a second time.
		// On Android, permissions are granted on app installation, so
		// `askAsync` will never prompt the user
		console.log("Status", status);

		// Stop here if the user did not grant permissions
		if (status !== 1) {
			// alert("No notification permissions!");
			return;
		}

		// let deviceToken = await Notifications.getDevicePushTokenAsync();

		// console.log(deviceToken);

		// Get the token that identifies this device
		let { data: token } = await Notifications.getExpoPushTokenAsync({
			experienceId: "@whaj47/bibleInspirationDaily",
		});

		console.log(token);

		axios.put(
			`${Wordpress.url}/wp-json/tsd/v1/push-notification/users/${token}`,
			{
				subscribing: {
					list: ["app"],
					category_ids: [5, 6],
					author_ids: [1],
				},
			}
		);
	}

	useEffect(() => {
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: false,
				shouldSetBadge: false,
			}),
		});
	}, []);

	async function getPosts() {
		setRefreshing(true);
		const response = await axios.get(
			Wordpress.url + "/wp-json/wp/v2/posts?categories=5&per_page=20"
		);
		setPosts(response.data);
		arrayholder = response.data;
		setRefreshing(false);
	}

	async function getFavourites() {
		const favs = await AsyncStorage.getItem("favourites");
		if (favs !== null) {
			setFavourites(JSON.parse(favs));
		}
	}

	async function getSavedPosts() {
		setRefreshing(true);
		const offlinePosts = await AsyncStorage.getItem("saved");
		setPosts(offlinePosts);
	}

	async function getNetworkState() {
		const network = await Network.getNetworkStateAsync();
		console.log(network);
		return network.isInternetReachable;
	}

	useEffect(() => {
		const focus = props.navigation.addListener("didFocus", getFavourites);
		try {
			registerForPushNotificationsAsync();
		} catch (error) {
			console.log(errror);
		}
		getFavourites();
		if (getNetworkState()) getPosts();
		else getSavedPosts();
		return function cleanup() {
			focus.remove();
		};
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.header}>Daily Inspired</Text>
			</View>

			<View
				style={{
					marginVertical: 10,
					marginHorizontal: 10,
					alignSelf: "stretch",
				}}
			>
				<TextInput
					placeholder="Search"
					style={{
						borderColor: "rgba(0,0,0,0.1)",
						borderWidth: StyleSheet.hairlineWidth,
						alignSelf: "stretch",
						padding: 10,
						borderRadius: 5,
					}}
					onChangeText={(text) => {
						const newData = arrayholder.filter((post) => {
							const itemData = post.title.rendered.toUpperCase();

							const textData = text.toUpperCase();

							return itemData.indexOf(textData) > -1;
						});
						setPosts(newData);
					}}
				></TextInput>
			</View>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					width: "100%",
					paddingHorizontal: 20,
					marginBottom: 10,
				}}
			>
				<Text style={{ color: "gray" }}>Favourites Only</Text>
				<Switch
					value={favFilter}
					onValueChange={(v) => {
						setFavFilter(v);

						getFavourites().then(() => {
							if (v) {
								const favPosts = [];
								favourites.map((favourite) => {
									posts.map((post) => {
										if (favourite === post.id) favPosts.push(post);
									});
								});
								setPosts(favPosts);
							} else {
								setPosts(arrayholder);
							}
						});
					}}
				></Switch>
			</View>

			<FlatList
				style={{ paddingVertical: 20 }}
				showsVerticalScrollIndicator={false}
				refreshing={refreshing}
				onRefresh={() => {
					getPosts();
				}}
				data={posts.length > 0 ? posts : []}
				renderItem={({ item, index, separators }) =>
					item.better_featured_image !== null && (
						<PostCard
							media={item.better_featured_image.source_url}
							post={item}
							navigation={props.navigation}
							title={item.title.rendered}
							date={item.date}
						></PostCard>
					)
				}
				keyExtractor={(item) => String(item.id)}
				ItemSeparatorComponent={() => <View style={{ height: 30 }}></View>}
				ListFooterComponent={() => <View style={{ height: 30 }}></View>}
			></FlatList>
		</View>
	);
}

DevotionScreen.navigationOptions = {
	header: null,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F2EDE9",
		alignItems: "center",
		paddingTop: StatusBar.currentHeight + 20 || 40,
	},
	header: {
		fontSize: 35,
		textAlign: "center",
		fontWeight: Platform.OS === "ios" ? "900" : "700",
	},
	headerContainer: {
		width: "100%",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "rgba(0,0,0,0.1)",
		paddingBottom: 20,
	},
});
