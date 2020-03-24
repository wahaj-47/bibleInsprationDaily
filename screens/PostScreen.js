import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	Platform,
	AsyncStorage,
	SafeAreaView,
	StatusBar
} from "react-native";
import { format, set } from "date-fns";
import {
	TouchableWithoutFeedback,
	TouchableOpacity,
	TextInput,
	FlatList,
	ScrollView
} from "react-native-gesture-handler";
import Constants from "expo-constants";
import HTML from "react-native-render-html";
import TabBarIcon from "../components/TabBarIcon";
import Dimensions from "../constants/Layout";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as FileSystem from "expo-file-system";
import { AdMobBanner } from "expo-ads-admob";
import WebView from "react-native-webview";
import Layout from "../constants/Layout";

export default function PostScreen(props) {
	const [refresh, setRefresh] = useState(false);
	const [likes, setLikes] = useState(0);
	const [downloading, setDownloading] = useState(false);
	const [post, setPost] = useState(props.navigation.getParam("post"));
	const date = new Date(post.date);
	const formattedDate = format(date, "MMMM dd, yyyy");

	const [comments, setComments] = useState("");
	const [comment, setComment] = useState("");

	function getComments() {
		axios
			.get(
				`http://bibleinspirationdaily.online/wp-json/wp/v2/comments?post=${post.id}&per_page=100`
			)
			.then(response => {
				setComments(response.data);
				setRefresh(!refresh);
			});
	}

	const [favourites, setFavourites] = useState([]);
	const [liked, setLiked] = useState(false);

	async function getFavourites() {
		const favs = await AsyncStorage.getItem("favourites");
		if (favs !== null) {
			setFavourites(JSON.parse(favs));
			if (favs.includes(post.id)) setLiked(true);
		}
	}

	const [saved, setSaved] = useState([]);

	async function getSaved() {
		const saves = await AsyncStorage.getItem("saved");
		if (saves !== null) setSaved(JSON.parse(saves));
	}

	const [savedIds, setSavedIds] = useState([]);
	const [isSaved, setIsSaved] = useState(false);

	async function getSavedIds() {
		const savedIds = await AsyncStorage.getItem("savedIds");
		if (savedIds !== null) {
			setSavedIds(JSON.parse(savedIds));
			if (savedIds.includes(post.id)) setIsSaved(true);
		}
	}

	const [likedPosts, setLikedPosts] = useState([]);
	const [isLiked, setIsLiked] = useState(false);

	async function getLikedPosts() {
		const liked = await AsyncStorage.getItem("likedPosts");
		console.log(liked);
		if (liked !== null) {
			setLikedPosts(JSON.parse(liked));
			if (liked.includes(post.id)) setIsLiked(true);
		}
	}

	function bannerError(error) {
		console.log(error);
		return;
	}

	// async function requestAd() {
	// 	AdMobInterstitial.setAdUnitID("ca-app-pub-5832084307445472/7196223658"); // Test ID, Replace with your-admob-unit-id
	// 	AdMobInterstitial.setTestDeviceID("EMULATOR");
	// 	await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
	// 	// await AdMobInterstitial.showAdAsync();
	// }

	// console.log(!downloading && !isSaved && !savedIds.includes(post.id));
	// console.log(downloading && !savedIds.includes(post.id));
	// console.log(isSaved && savedIds.includes(post.id));

	useEffect(() => {
		setLikes(post._liked);
		getComments();
		getFavourites();
		getSaved();
		getSavedIds();
		getLikedPosts();
		axios
			.get(`http://bibleinspirationdaily.online/wp-json/wp/v2/posts/${post.id}`)
			.then(response => {
				setPost(response.data);
			});
		// requestAd();
	}, []);

	// console.log(isSaved);

	return (
		<View>
			<View style={{ height: Constants.statusBarHeight }}></View>
			<KeyboardAwareScrollView
				enableOnAndroid
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						props.navigation.navigate(props.navigation.getParam("parent"));
					}}
					style={{ marginLeft: 20, marginBottom: 20 }}
				>
					<TabBarIcon
						focused
						name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
					/>
				</TouchableWithoutFeedback>
				<View>
					<AdMobBanner
						bannerSize="fullBanner"
						adUnitID="ca-app-pub-5832084307445472/3878605801" // Test ID, Replace with your-admob-unit-id
						// testDeviceID="EMULATOR"
						// servePersonalizedAds // true or false
						onDidFailToReceiveAdWithError={bannerError}
					/>
				</View>
				<View style={{ marginTop: 20, paddingHorizontal: 20 }}>
					<Text style={styles.title}>{post.title.rendered} </Text>

					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}
					>
						<Text style={styles.info}>{formattedDate}</Text>
						<Text style={styles.info}>Daily Inspired</Text>
					</View>
				</View>
				<View
					style={{
						marginTop: 20,
						width: Dimensions.window.width,
						height: 250
					}}
				>
					<Image
						style={{
							flex: 1,
							width: null,
							height: null,
							resizeMode: "cover"
						}}
						source={{ uri: post.better_featured_image.source_url }}
					></Image>
				</View>
				<View style={{ marginHorizontal: 20 }}>
					<HTML
						html={post.content.rendered}
						renderers={{
							iframe: (htmlAttribs, children) => {
								return htmlAttribs.src ? (
									<WebView
										style={{ width: "100%", height: 190 }}
										source={{ uri: htmlAttribs.src }}
									></WebView>
								) : (
									<WebView
										style={{ width: "100%", height: 190 }}
										source={{ html: htmlAttribs.srcdoc }}
									></WebView>
								);
							}
						}}
					></HTML>
				</View>
				<View
					style={{
						width: "100%",
						paddingHorizontal: 20,
						paddingTop: 20,
						borderTopColor: "rgba(0,0,0,0.1)",
						borderTopWidth: StyleSheet.hairlineWidth,
						flexDirection: "row",
						justifyContent: "space-between"
					}}
				>
					<TouchableOpacity
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginHorizontal: 5
						}}
						onPress={async () => {
							const cookie = await axios.post(
								"https://bibleinspirationdaily.online/api/user/generate_auth_cookie?email=appUser@email.com&password=YT@$sqZX29xT58H#yy#qKJuh"
							);
							// console.log(favourites.includes(post.id));
							if (likedPosts.includes(post.id) || isLiked) {
								setLikes(Number(likes) - 1);
								const newLikedPosts = likedPosts.filter(
									likedPost => likedPost !== post.id
								);
								AsyncStorage.setItem(
									"likedPosts",
									JSON.stringify(newLikedPosts)
								);
								axios
									.post(
										`https://bibleinspirationdaily.online/api/user/like?cookie=${
											cookie.data.cookie
										}&post_id=${post.id}&value=${Number(likes) - 1}`
									)
									.then(() => {
										axios
											.get(
												`http://bibleinspirationdaily.online/wp-json/wp/v2/posts/${post.id}`
											)
											.then(response => {
												console.log(response.data._liked);
												setPost(response.data);
											});
									});
								setIsLiked(false);
								getLikedPosts();
							} else {
								// console.log("here");
								setLikes(Number(likes) + 1);

								if (likedPosts !== null)
									AsyncStorage.setItem(
										"likedPosts",
										JSON.stringify([...likedPosts, post.id])
									);
								else
									AsyncStorage.setItem("likedPosts", JSON.stringify([post.id]));

								axios
									.post(
										`https://bibleinspirationdaily.online/api/user/like?cookie=${
											cookie.data.cookie
										}&post_id=${post.id}&value=${Number(likes) + 1}`
									)
									.then(() => {
										axios
											.get(
												`http://bibleinspirationdaily.online/wp-json/wp/v2/posts/${post.id}`
											)
											.then(response => {
												console.log(response.data._liked);
												setPost(response.data);
											});
									});

								setIsLiked(true);
								getLikedPosts();
							}
						}}
					>
						<TabBarIcon
							focused={isLiked && likedPosts.includes(post.id)}
							name={Platform.OS === "ios" ? "ios-thumbs-up" : "md-thumbs-up"}
						></TabBarIcon>
						<Text
							style={{
								marginLeft: 5,
								color:
									isLiked && likedPosts.includes(post.id) ? "steelblue" : "gray"
							}}
						>
							{likes > post._liked
								? likes > 0 && likes
								: post._liked > 0 && post._liked}{" "}
							{post._liked > 1 ? "Likes" : "Like"}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={async () => {
							// console.log(favourites.includes(post.id));
							if (favourites.includes(post.id) || liked) {
								const newFavs = favourites.filter(
									favourite => favourite !== post.id
								);
								AsyncStorage.setItem("favourites", JSON.stringify(newFavs));
								setLiked(false);
								getFavourites();
							} else {
								// console.log("here");
								if (favourites !== null)
									AsyncStorage.setItem(
										"favourites",
										JSON.stringify([...favourites, post.id])
									);
								else
									AsyncStorage.setItem("favourites", JSON.stringify([post.id]));

								setLiked(true);
								getFavourites();
							}
						}}
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginHorizontal: 5
						}}
					>
						<TabBarIcon
							focused={liked && favourites.includes(post.id)}
							name={Platform.OS === "ios" ? "ios-heart" : "md-heart"}
						></TabBarIcon>
						<Text
							style={{
								marginLeft: 5,
								color:
									liked && favourites.includes(post.id) ? "steelblue" : "gray"
							}}
						>
							Favourite
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={async () => {
							if (savedIds.includes(post.id) || isSaved) {
								FileSystem.deleteAsync(
									FileSystem.documentDirectory + "posts/" + post.id + ".jpg"
								);
								const newSavedIds = savedIds.filter(
									savedId => savedId !== post.id
								);
								AsyncStorage.setItem("savedIds", JSON.stringify(newSavedIds));
								const newSaved = saved.filter(save => save.id !== post.id);
								AsyncStorage.setItem("saved", JSON.stringify(newSaved));

								setIsSaved(false);
								getSavedIds();
							} else {
								let info = await FileSystem.getInfoAsync(
									FileSystem.documentDirectory + "posts/" + post.id + ".jpg"
								);
								// console.log(info);
								if (!info.exists) {
									setDownloading(true);
									FileSystem.downloadAsync(
										post.better_featured_image.source_url,
										FileSystem.documentDirectory + "posts/" + post.id + ".jpg"
									)
										.then(({ uri }) => {
											setDownloading(false);
											// console.log("Finished downloading to ", uri);
											let newPost = {
												id: post.id,
												title: {
													rendered: post.title.rendered
												},
												content: {
													rendered: post.content.rendered
												},
												categories: post.categories
											};
											// console.log(saved);
											AsyncStorage.setItem(
												"saved",
												JSON.stringify([...saved, newPost])
											);
											if (savedIds !== null)
												AsyncStorage.setItem(
													"savedIds",
													JSON.stringify([...savedIds, post.id])
												);
											else
												AsyncStorage.setItem(
													"savedIds",
													JSON.stringify([post.id])
												);
											getSavedIds();
											setIsSaved(true);
										})
										.catch(error => {
											console.error(error);
										});
								}
								// console.log(saved);
							}
						}}
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginHorizontal: 5
						}}
					>
						<TabBarIcon
							focused={isSaved && savedIds.includes(post.id)}
							name={
								!downloading &&
								!isSaved &&
								!savedIds.includes(post.id) &&
								Platform.OS === "ios"
									? "ios-save"
									: "md-save" ||
									  (downloading &&
											!savedIds.includes(post.id) &&
											Platform.OS === "ios")
									? "ios-download"
									: "md-download" ||
									  (isSaved &&
											savedIds.includes(post.id) &&
											Platform.OS === "ios")
									? "ios-checkmark-circle"
									: "md-checkmark-circle"
							}
						></TabBarIcon>
						<Text
							style={{
								marginLeft: 5,
								color:
									isSaved && savedIds.includes(post.id) ? "steelblue" : "gray"
							}}
						>
							{(!downloading &&
								!isSaved &&
								!savedIds.includes(post.id) &&
								"Save") ||
								(downloading && !savedIds.includes(post.id) && "Downloading") ||
								(isSaved && savedIds.includes(post.id) && "Saved")}
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						margin: 20
					}}
				>
					<TextInput
						value={comment}
						placeholder="Add a comment"
						style={{
							borderColor: "rgba(0,0,0,0.1)",
							borderWidth: StyleSheet.hairlineWidth,
							borderRadius: 5,
							padding: 20
						}}
						onChangeText={text => {
							setComment(text);
						}}
					></TextInput>
					<View>
						<TouchableOpacity
							style={{
								alignSelf: "stretch",
								marginTop: 10,
								padding: 10,
								backgroundColor: "steelblue",
								borderRadius: 5,
								alignItems: "center"
							}}
							onPress={async () => {
								alert(
									"To ensure the quality of content, your comment will be reviewed and will be automatically added after the review is complete"
								);
								const cookie = await axios.post(
									"https://bibleinspirationdaily.online/api/user/generate_auth_cookie?email=appUser@email.com&password=YT@$sqZX29xT58H#yy#qKJuh"
								);
								axios
									.post(
										`https://bibleinspirationdaily.online/api/user/post_comment?cookie=${cookie.data.cookie}&post_id=${post.id}&content=${comment}&comment_status=hold`
									)
									.then(() => {
										getComments();
										setComment("");
									});
							}}
						>
							<Text style={{ color: "white" }}>Comment</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ marginHorizontal: 20, marginBottom: 40, flex: 1 }}>
					<Text style={{ marginBottom: 10, fontSize: 20, fontWeight: "bold" }}>
						Comments:{" "}
					</Text>
					<FlatList
						data={comments.length > 0 ? comments : []}
						extraData={refresh}
						renderItem={({ item, index, separators }) => {
							return (
								<SafeAreaView>
									<View
										style={{
											backgroundColor: "rgba(0,0,0,0.1)",
											borderRadius: 5,
											paddingHorizontal: 10,
											paddingTop: 10,
											flexDirection: "row",
											alignItems: "center"
										}}
									>
										<View>
											<Text scrollable style={{ fontWeight: "bold" }}>
												Anonymous:{" "}
											</Text>
											<HTML html={item.content.rendered}></HTML>
										</View>
									</View>
								</SafeAreaView>
							);
						}}
						keyExtractor={item => String(item.id)}
						ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>}
					></FlatList>
				</View>
			</KeyboardAwareScrollView>
		</View>
	);
}

PostScreen.navigationOptions = {
	header: null
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		paddingVertical: 20
	},
	title: {
		fontSize: 40,
		fontWeight: Platform.OS === "ios" ? "900" : "700",
		paddingBottom: 20
	},
	info: { color: "gray", textTransform: "capitalize" }
});
