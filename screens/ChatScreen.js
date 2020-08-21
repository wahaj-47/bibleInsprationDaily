import React, { useEffect } from "react";
import { CrispChatSDK, CrispChatUI } from "react-native-crisp-chat-sdk";
import { View, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function ChatScreen({ navigation }) {
	useEffect(() => {
		CrispChatSDK.show();
	}, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener("didFocus", () => {
			CrispChatSDK.show();
		});

		return () => unsubscribe();
	}, [navigation]);

	return <CrispChatUI style={{ flex: 1, width: "100%" }} />;
}
