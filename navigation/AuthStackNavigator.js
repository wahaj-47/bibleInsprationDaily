import React from "react";
import { createStackNavigator } from "react-navigation-stack";

import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import ForgotPassword from "../screens/ForgotPassword";

const AuthStack = createStackNavigator(
	{
		SignIn: SignIn,
		SignUp: SignUp
		// ForgotPassword: ForgotPassword
	},
	{ initialRouteName: "SignIn", headerMode: "none" }
);

export default AuthStack;
