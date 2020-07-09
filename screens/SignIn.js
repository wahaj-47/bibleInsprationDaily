import React from "react";
import {
	Button,
	Image,
	Keyboard,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	AsyncStorage,
} from "react-native";
import Constants from "expo-constants";
import { RkAvoidKeyboard, RkCard } from "react-native-ui-kitten";
import { FontAwesome } from "@expo/vector-icons";
import { scale, scaleVertical } from "./utilities/scale";
import GradientButton from "react-native-gradient-buttons";
import axios from "axios";
import Wordpress from "../constants/Wordpress";

const styles = StyleSheet.create({
	screen: {
		paddingTop: Constants.statusBarHeight,
		paddingBottom: scaleVertical(24),
		paddingHorizontal: scale(16),
		flex: 1,
		backgroundColor: "#F2EDE9",
	},
	close: {
		position: "absolute",
		top: Constants.statusBarHeight + 4,
		left: 16,
		zIndex: 1,
	},
	header: {
		marginTop: 75,
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		height: scaleVertical(100),
		resizeMode: "contain",
	},
	all: {
		marginTop: scaleVertical(24),
		flex: 1,
		justifyContent: "center",
	},
	content: {
		justifyContent: "space-between",
		paddingHorizontal: 8,
		paddingVertical: scaleVertical(12),
	},
	input: {
		borderWidth: 0.5,
		borderColor: "#D3D3D3",
		borderRadius: 50,
		padding: 18,
		marginVertical: scaleVertical(6),
		fontWeight: "bold",
		color: "black",
	},
	footer: {
		justifyContent: "space-between",
		marginTop: scaleVertical(28),
		paddingHorizontal: 30,
		paddingVertical: scaleVertical(12),
	},
	textRow: {
		flexDirection: "row",
		justifyContent: "center",
	},
});

class SignIn extends React.PureComponent {
	state = { username: "", password: "", errorMsg: "" };

	handleUsernameChange = (value) => {
		this.setState({ username: value });
	};
	handlePasswordChange = (value) => {
		this.setState({ password: value });
	};

	handleLoginPressed = () => {
		axios
			.post(
				Wordpress.url +
					"/api/get_nonce/?controller=user&method=generate_auth_cookie"
			)
			.then(({ data }) => {
				axios
					.post(
						`${Wordpress.url}/api/user/generate_auth_cookie?username=${this.state.username}&password=${this.state.password}&nonce=${data.nonce}`
					)
					.then(({ data }) => {
						if (data.error) {
							this.setState({ errorMsg: data.error });
						} else {
							AsyncStorage.setItem("userId", String(data.user.id));
							AsyncStorage.setItem("cookie", data.cookie).then(() => {
								this.props.navigation.navigate("Trivia");
							});
						}
					});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	render() {
		const { username, password, errorMsg } = this.state;

		const renderIcon = () => (
			<Image
				style={styles.image}
				source={require("../assets/images/icon.png")} // eslint-disable-line global-require
			/>
		);

		return (
			<RkAvoidKeyboard
				style={styles.screen}
				onStartShouldSetResponder={() => true}
				onResponderRelease={() => Keyboard.dismiss()}
			>
				<View style={styles.header}>{renderIcon()}</View>

				<View style={styles.all}>
					<RkCard rkType="heroImage shadowed" style={styles.content}>
						<TextInput
							textContentType="username"
							placeholder="EMAIL OR USERNAME"
							placeholderTextColor="#707070"
							style={styles.input}
							value={username}
							onChangeText={this.handleUsernameChange}
						/>
						<TextInput
							textContentType="password"
							secureTextEntry={true}
							placeholder="PASSWORD"
							placeholderTextColor="#707070"
							style={styles.input}
							value={password}
							onChangeText={this.handlePasswordChange}
						/>
						<GradientButton
							style={{ marginTop: 8 }}
							textStyle={{ fontSize: 20 }}
							text="LOGIN"
							// text="COMING SOON"
							height={50}
							impact
							onPressAction={this.handleLoginPressed}
							disabled={!(username.length > 0 && password.length > 0)}
							// disabled={true}
						/>
					</RkCard>
				</View>

				<View style={styles.textRow}>
					<Text style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</Text>
				</View>

				<View style={styles.footer}>
					{/* <View style={styles.textRow}>
						<Text style={{ color: "#484848", fontSize: 16, marginTop: 8 }}>
							Forgot your password?
						</Text>
						<TouchableOpacity
						// onPress={() => this.props.navigation.navigate("ForgotPassword")}
						>
							<Text
								style={{
									color: "#F25C5C",
									fontSize: 16,
									marginTop: 8,
									fontWeight: "bold"
								}}
							>
								{" "}
								Reset now
							</Text>
						</TouchableOpacity>
					</View> */}
					<View style={styles.textRow}>
						<Text style={{ color: "#484848", fontSize: 16, marginTop: 8 }}>
							Don&rsquo;t have an account?
						</Text>
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate("SignUp")}
						>
							<Text
								style={{
									color: "#F25C5C",
									fontSize: 16,
									marginTop: 8,
									fontWeight: "bold",
								}}
							>
								{" "}
								Sign Up
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</RkAvoidKeyboard>
		);
	}
}

export default SignIn;
