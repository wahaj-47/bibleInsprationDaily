import React from "react";
import {
	Button,
	Keyboard,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	KeyboardAvoidingView
} from "react-native";
import Constants from "expo-constants";
import { RkCard, RkAvoidKeyboard } from "react-native-ui-kitten";
import { FontAwesome } from "react-native-vector-icons";
import { scale, scaleVertical } from "./utilities/scale";
import GradientButton from "react-native-gradient-buttons";

import axios from "axios";

const styles = StyleSheet.create({
	screen: {
		paddingTop: Constants.statusBarHeight,
		paddingBottom: scaleVertical(28),
		paddingHorizontal: scale(16),
		flex: 1,
		backgroundColor: "rgb(245, 245, 245)"
	},
	back: {
		position: "absolute",
		top: Constants.statusBarHeight + 8,
		left: 16,
		zIndex: 1
	},
	header: {
		marginTop: scaleVertical(36),
		alignItems: "center",
		justifyContent: "center"
	},
	all: {
		flex: 1,
		justifyContent: "space-evenly"
	},
	image: {
		height: scaleVertical(70),
		resizeMode: "contain"
	},
	content: {
		justifyContent: "space-between",
		paddingHorizontal: 8,
		paddingVertical: scaleVertical(12)
	},
	input: {
		borderWidth: 0.5,
		borderColor: "#D3D3D3",
		borderRadius: 50,
		padding: 18,
		marginVertical: scaleVertical(6),
		fontWeight: "bold"
	},
	textRow: {
		flexDirection: "row",
		justifyContent: "center",
		paddingHorizontal: 8
	}
});

class SignUp extends React.PureComponent {
	state = {
		name: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		errorMsg: ""
	};

	handleNameChange = value => {
		this.setState({ name: value });
	};
	handleUsernameChange = value => {
		this.setState({ username: value });
	};
	handleEmailChange = value => {
		this.setState({ email: value });
	};
	handlePasswordChange = value => {
		this.setState({ password: value });
	};
	handleConfirmPasswordChange = value => {
		this.setState({ confirmPassword: value });
	};

	handleSignUpPressed = () => {
		axios
			.post(
				"https://bibleinspirationdaily.online/api/get_nonce/?controller=user&method=signup"
			)
			.then(({ data }) => {
				axios
					.post(
						`https://bibleinspirationdaily.online/api/user/signup?username=${this.state.username}&display_name=${this.state.name}&email=${this.state.email}&user_pass=${this.state.password}&nonce=${data.nonce}`
					)
					.then(({ data }) => {
						data.error
							? this.setState({ errorMsg: data.error })
							: this.props.navigation.navigate("SignIn");
					});
			});
	};

	render() {
		const {
			name,
			username,
			email,
			password,
			confirmPassword,
			errorMsg
		} = this.state;

		return (
			<View
				style={styles.screen}
				behavior="padding"
				onStartShouldSetResponder={() => true}
				onResponderRelease={() => Keyboard.dismiss()}
			>
				<View style={styles.header}></View>

				<KeyboardAvoidingView behavior="padding" style={styles.all}>
					<RkCard rkType="heroImage shadowed" style={styles.content}>
						<TextInput
							textContentType="name"
							placeholder="NAME"
							placeholderTextColor="#707070"
							style={styles.input}
							value={name}
							onChangeText={this.handleNameChange}
						/>
						<TextInput
							textContentType="username"
							placeholder="USERNAME"
							placeholderTextColor="#707070"
							style={styles.input}
							value={username}
							onChangeText={this.handleUsernameChange}
						/>
						<TextInput
							textContentType="emailAddress"
							placeholder="EMAIL"
							placeholderTextColor="#707070"
							style={styles.input}
							value={email}
							onChangeText={this.handleEmailChange}
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
						<TextInput
							textContentType="password"
							secureTextEntry={true}
							placeholder="CONFIRM PASSWORD"
							placeholderTextColor="#707070"
							style={styles.input}
							value={confirmPassword}
							onChangeText={this.handleConfirmPasswordChange}
						/>
						<GradientButton
							disabled={
								!(
									name.length > 0 &&
									username.length > 0 &&
									email.length > 0 &&
									password.length > 0 &&
									confirmPassword.length > 0
								)
							}
							style={{ marginTop: 8 }}
							textStyle={{ fontSize: 20 }}
							text="SIGN UP"
							height={50}
							impact
							onPressAction={this.handleSignUpPressed}
						/>
					</RkCard>
				</KeyboardAvoidingView>

				<View style={styles.textRow}>
					<Text style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</Text>
				</View>

				<View>
					<View style={styles.textRow}>
						<Text style={{ color: "#484848", fontSize: 16, marginTop: 8 }}>
							Already have an account?
						</Text>
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate("SignIn")}
						>
							<Text
								style={{
									color: "steelblue",
									fontSize: 16,
									marginTop: 8,
									fontWeight: "bold"
								}}
							>
								{" "}
								Sign In
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				<TouchableOpacity
					style={styles.back}
					onPress={() => this.props.navigation.goBack()}
				>
					<FontAwesome
						name="chevron-left"
						size={27}
						style={{ color: "#4A4A4A" }}
					/>
				</TouchableOpacity>
			</View>
		);
	}
}

export default SignUp;
