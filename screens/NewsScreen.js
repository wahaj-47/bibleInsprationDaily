import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	FlatList,
	Platform,
	TextInput,
	Switch,
	AsyncStorage,
} from "react-native";
import axios from "axios";
import PostCard from "../components/PostCard";
import * as Network from "expo-network";
import Wordpress from "../constants/Wordpress";

let arrayholder = [];

export default function NewsScreen(props) {
	const [posts, setPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [favFilter, setFavFilter] = useState(false);
	const [favourites, setFavourites] = useState([]);

	async function getPosts() {
		setRefreshing(true);
		const response = await axios.get(
			Wordpress.url + "/wp-json/wp/v2/posts?categories=6&per_page=20"
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
		getFavourites();
		if (getNetworkState()) getPosts();
		else getSavedPosts();
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
					}}
				></Switch>
			</View>

			<FlatList
				horizontal={true}
				style={{ paddingTop: 0 }}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
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
				ItemSeparatorComponent={() => <View style={{ width: 30 }}></View>}
				ListFooterComponent={() => <View style={{ width: 10 }}></View>}
				ListHeaderComponent={() => <View style={{ width: 10 }}></View>}
				list
			></FlatList>
		</View>
	);
}

NewsScreen.navigationOptions = {
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
