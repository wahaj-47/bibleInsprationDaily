import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
} from "react-native";
import axios from "axios";
import TabBarIcon from "../components/TabBarIcon";

export default function LeaderBoardScreen(props) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const response = await axios.get(
        "https://dailyinspiredhub.com/api/user/get_all_users"
      );
      let users = [];
      Object.values(response.data).map((response) => {
        if (response.id) users.push(response);
      });
      users.sort((a, b) => {
        return b.score[0] || 0 - a.score[0] || 0;
      });
      setUsers(users);
    }
    getUsers();
  }, []);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function getCurrentUser() {
      const userId = await AsyncStorage.getItem("userId");
      setCurrentUser(userId);
    }
    getCurrentUser();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Trivia");
        }}
        style={{
          position: "absolute",
          top: StatusBar.currentHeight + 27 || 47,
          left: 20,
          zIndex: 50,
        }}
      >
        <TabBarIcon name="ios-arrow-back"></TabBarIcon>
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Daily Inspired</Text>
      </View>
      <ScrollView style={{ paddingHorizontal: 20, width: "100%" }}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
            Leaderboard
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.tableHeader}>Name</Text>
            </View>
            <View
              style={{
                backgroundColor: "black",
                width: StyleSheet.hairlineWidth,
              }}
            ></View>
            <View style={styles.tableCell}>
              <Text style={styles.tableHeader}>Score</Text>
            </View>
          </View>

          {users.length > 0 &&
            users.map((user) => {
              return (
                <View
                  key={user.id}
                  style={[
                    styles.tableRow,
                    user.id == currentUser && { backgroundColor: "#F25C5C" },
                  ]}
                >
                  <View style={styles.tableCell}>
                    <Text
                      style={[
                        { fontSize: 18, color: "black" },
                        user.id == currentUser && { color: "white" },
                      ]}
                    >
                      {user.displayName}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "black",
                      width: StyleSheet.hairlineWidth,
                    }}
                  ></View>
                  <View style={styles.tableCell}>
                    <Text
                      style={[
                        { fontSize: 18, color: "black" },
                        user.id == currentUser && { color: "white" },
                      ]}
                    >
                      {user.score[0] > 0 ? user.score[0] : "0"}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}

LeaderBoardScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2EDE9",
    paddingVertical: 20,
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
  table: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "black",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "black",
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: "black",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  tableHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tableRow: {
    width: "100%",
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tableCell: { flex: 1, padding: 10 },
});
