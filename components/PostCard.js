import React from "react";
import {
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	View,
	StatusBar
} from "react-native";
import { format } from "date-fns";
import Layout from "../constants/Layout";

export default function PostCard(props) {
	const date = new Date(props.date);
	const formattedDate = format(date, "MMMM dd, yyyy");

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.cardContainer}
			onPress={() => {
				console.log(props.navigation.state.routeName);
				props.navigation.navigate(
					props.navigation.state.routeName === "Home"
						? "DevotionPost"
						: "NewsPost",
					{
						post: props.post,
						parent: props.navigation.state.routeName
					}
				);
			}}
		>
			<Image
				source={{
					uri: props.media
				}}
				style={styles.cardImage}
			></Image>
			<View style={styles.cardInfoContainer}>
				<Text style={styles.title}>{props.title}</Text>
				<View style={styles.cardInfo}>
					<Text style={styles.author}>Daily Inspired</Text>
					<Text style={styles.date}>{formattedDate}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		maxHeight: Layout.window.width,
		width: Layout.window.width - 20,
		height: Layout.window.width - 10,
		flexDirection: "row",
		justifyContent: "center",
		alignSelf: "center"
	},
	cardImage: { width: "100%", height: "100%", borderRadius: 25 },
	cardInfoContainer: {
		position: "absolute",
		bottom: 1,
		width: "92%",
		backgroundColor: "rgba(255,255,255,0.7)",
		borderRadius: 20,
		marginBottom: 10,
		paddingTop: 15,
		paddingBottom: 50,
		paddingHorizontal: 20
	},
	title: { fontSize: Layout.isSmallDevice ? 20 : 30, fontWeight: "700" },
	cardInfo: {
		position: "absolute",
		bottom: 15,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
		alignSelf: "center"
	},
	author: {
		color: "steelblue",
		textTransform: "uppercase",
		fontWeight: "600"
	},
	date: { color: "rgba(0,0,0,0.8)", textTransform: "capitalize" }
});
