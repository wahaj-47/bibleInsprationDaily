import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Platform,
	Text,
	ActivityIndicator
} from "react-native";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProgressBar from "react-native-progress/Bar";
import TabBarIcon from "../components/TabBarIcon";
import { set } from "date-fns";

export default function TriviaScreen(props) {
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [correctAnswers, setCorrectAnswers] = useState([]);
	const [questionCount, setQuestionCount] = useState(0);
	const [progress, setProgress] = useState(1);
	const [pressed, setPressed] = useState(false);
	const [state, setState] = useState("Start");
	const [timer, setTimer] = useState(null);
	const [score, setScore] = useState(0);

	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	async function reset() {
		setPressed(true);
		setProgress(1);
		setQuestions([]);
		setQuestionCount(0);
		setAnswers([]);
		setCorrectAnswers([]);
		const response = await axios.get(
			"https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple&encode=url3986"
		);
		let questions = [];
		let answers = [];
		let correctAnswers = [];
		response.data.results.map(response => {
			questions.push(response.question);
			answers.push(
				shuffle([response.correct_answer, ...response.incorrect_answers])
			);
			correctAnswers.push(response.correct_answer);
		});
		setQuestions(questions);
		setAnswers(answers);
		setCorrectAnswers(correctAnswers);
		setScore(0);
	}

	function start() {
		let progressCount = 1;
		let questionCounter = 0;
		setState("Play");

		let interval = setInterval(() => {
			progressCount -= 0.2;
			if (progressCount <= 0) {
				progressCount = 1;
				questionCounter += 1;
				if (questionCounter <= 9) {
					setQuestionCount(questionCounter);
				} else {
					setState("End");
					clearInterval(interval);
				}
			}
			setProgress(progressCount);
		}, 1000);
		setTimer(interval);
	}

	const handleAnswerPicked = answer => {
		clearInterval(timer);
		if (questionCount <= 8) {
			setTimeout(() => {
				setProgress(1);
				setState("End");
				if (questionCount <= 9) {
					setQuestionCount(questionCount + 1);
					start();
				} else {
					setState("End");
					clearInterval(timer);
				}
			}, 700);
			console.log(answer);
			if (answer === correctAnswers[questionCount]) {
				console.log("Correct");
				setScore(score + 1);
			}
		} else {
			setState("End");
			clearInterval(timer);
		}
	};

	return (
		<View style={styles.container}>
			{state === "Start" && (
				<View>
					<View style={styles.headerContainer}>
						<Text style={styles.header}>Daily Inspired</Text>
					</View>
					<View style={{ alignItems: "center", justifyContent: "center" }}>
						<TouchableOpacity
							style={{
								borderWidth: 5,
								borderColor: "steelblue",
								justifyContent: "center",
								alignItems: "center",
								padding: 5,
								borderRadius: 10
							}}
							onPress={async () => {
								await reset();
								start();
							}}
						>
							<Text
								style={{
									fontSize: 50,
									fontWeight: "bold",
									color: "steelblue",
									transform: [{ rotate: "-10deg" }]
								}}
							>
								Play
							</Text>
						</TouchableOpacity>
						{questions.length === 0 && pressed && (
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									marginTop: 20
								}}
							>
								<ActivityIndicator
									size="small"
									color="steelblue"
								></ActivityIndicator>
								<Text
									style={{ fontSize: 17, color: "steelblue", marginLeft: 5 }}
								>
									Loading
								</Text>
							</View>
						)}
					</View>
				</View>
			)}
			{state === "Play" && (
				<View style={{ alignItems: "center", paddingHorizontal: 20 }}>
					<ProgressBar
						indeterminateAnimationDuration={30000}
						progress={progress}
						width={200}
						color="steelblue"
						height={8}
					/>
					<View style={{ marginTop: 20 }}>
						<Text style={{ fontSize: 25 }}>
							{unescape(questions[questionCount])}
						</Text>
					</View>
					<View
						style={{
							marginTop: 20,
							width: "100%"
						}}
					>
						{answers[questionCount].map(answer => {
							return (
								<TouchableOpacity
									key={answer}
									style={{
										borderWidth: 2,
										borderColor: "steelblue",
										borderRadius: 5,
										width: "100%",
										padding: 10,
										marginVertical: 5
									}}
									onPress={() => {
										handleAnswerPicked(answer);
									}}
								>
									<Text style={{ fontSize: 20 }}>{unescape(answer)}</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>
			)}
			{state === "End" && (
				<View>
					<Text style={{ fontSize: 50, fontWeight: "bold" }}>
						Score: {score}
					</Text>
					<Text
						style={{ fontSize: 30, textAlign: "center", color: "steelblue" }}
						onPress={async () => {
							await reset();
							start();
						}}
					>
						Restart{" "}
						<TabBarIcon
							name={Platform.OS === "ios" ? "ios-refresh" : "md-refresh"}
							color="steelblue"
						></TabBarIcon>
					</Text>
					{questions.length === 0 && pressed && (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								marginTop: 20
							}}
						>
							<ActivityIndicator
								size="small"
								color="steelblue"
							></ActivityIndicator>
							<Text style={{ fontSize: 17, color: "steelblue", marginLeft: 5 }}>
								Loading
							</Text>
						</View>
					)}
					<TouchableOpacity
						style={{ marginTop: 40 }}
						onPress={() => {
							props.navigation.navigate("Leaderboard");
						}}
					>
						<Text
							style={{
								textAlign: "center",
								fontSize: 17,
								color: "steelblue"
							}}
						>
							Leaderboard{" "}
							<TabBarIcon name="ios-arrow-forward" size={17}></TabBarIcon>
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}

TriviaScreen.navigationOptions = {
	header: null
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		paddingVertical: 20
	},
	header: {
		fontSize: 35,
		textAlign: "center",
		fontWeight: Platform.OS === "ios" ? "900" : "700"
	},
	headerContainer: {
		width: "100%",
		paddingBottom: 20
	}
});
