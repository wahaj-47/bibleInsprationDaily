import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  AsyncStorage,
  ScrollView,
  Image,
  Switch,
  Share,
  Platform,
  ActivityIndicator,
} from "react-native";
import Dimensions from "../constants/Layout";
import { TouchableOpacity } from "react-native-gesture-handler";
import TabBarIcon from "../components/TabBarIcon";
import { Linking } from "expo";
import * as FileSystem from "expo-file-system";
import * as StoreReview from "expo-store-review";

import * as InAppPurchases from "expo-in-app-purchases";

export default function ContactScreen(props) {
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState(props.screenProps.history);

  initPurchases = async () => {
    const response = await InAppPurchases.connectAsync();
    setHistory(response.results);
    // if (response.responseCode === InAppPurchases.IAPResponseCode.OK) {
    //   if (
    //     response.results[0].purchaseState ===
    //     InAppPurchases.InAppPurchaseState.PURCHASED
    //   ) {
    //     AdMobInterstitial.setAdUnitID(null); // Test ID, Replace with your-admob-unit-id
    //   } else {
    //     AdMobInterstitial.setAdUnitID("ca-app-pub-5832084307445472/7196223658"); // Test ID, Replace with your-admob-unit-id
    //     AdMobInterstitial.setTestDeviceID("EMULATOR");
    //   }
    // }
  };

  initItems = async () => {
    const items = Platform.select({
      ios: ["removeAdsV2"],
      android: ["gas", "premium", "gold_monthly", "gold_yearly"],
    });

    try {
      await initPurchases();
    } catch (error) {
      console.log(error);
    }

    // Retrieve product details
    const { responseCode, results } = await InAppPurchases.getProductsAsync(
      items
    );
    console.log(responseCode);
    console.log(results);
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return Promise.resolve(results);
    }
  };

  // useEffect(() => {
  //   initItems();
  // }, []);

  // useEffect(() => {
  //   getHistory = async () => {
  //     const { responseCode, results } = InAppPurchases.getPurchaseHistoryAsync(
  //       true
  //     );
  //     if (responseCode === InAppPurchases.IAPResponseCode.OK) {
  //       setHistory(results);
  //     }
  //   };

  //   getHistory();
  // }, []);

  return (
    <View style={[styles.container]}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Daily Inspired</Text>
      </View>

      <ScrollView>
        <View style={{ width: Dimensions.window.width, height: 250 }}>
          <Image
            source={{
              uri:
                "http://bibleinspirationdaily.online/wp-content/uploads/2019/12/forest-mountains-fog-clouds-9754.jpg",
            }}
            style={{ flex: 1, width: null, height: null, resizeMode: "cover" }}
          ></Image>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <Text>
            We’re here to inspire you daily with the word or God. Daily Bible
            Devotionals, help you grow in your faith, and stay connected more to
            Jesus. Also, today’s main stream media often portrays negative news,
            so we created a “positive news” section that only portrays positive
            news and articles, we hope that they will bring encouragement to
            your life.
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            marginTop: 20,
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              padding: 10,
              borderColor: "steelblue",
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              Remove Ads:
            </Text>
            <Text>Following ads will be removed</Text>
            <Text>- Banner ads</Text>
            <Text>- Full screen ads</Text>
            <TouchableOpacity
              disabled={history === undefined}
              style={[
                history === undefined && { backgroundColor: "gray" },
                styles.button,
                { marginBottom: 0, marginTop: 10 },
              ]}
              onPress={async () => {
                setLoading(true);
                try {
                  const items = await initItems();
                  await InAppPurchases.purchaseItemAsync(
                    items[0].productId
                  ).then(() => {
                    setLoading(false);
                  });
                  InAppPurchases.disconnectAsync();
                } catch (error) {
                  console.log(error);
                  setLoading(false);
                  InAppPurchases.disconnectAsync();
                }
              }}
            >
              {loading ? (
                <ActivityIndicator></ActivityIndicator>
              ) : (
                <Text style={styles.buttonText}>$7.99/month</Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              try {
                StoreReview.requestReview();
              } catch (error) {
                alert(error);
              }
            }}
            style={styles.button}
          >
            <TabBarIcon
              name={Platform.OS === "ios" ? "ios-appstore" : "md-appstore"}
            ></TabBarIcon>
            <Text style={styles.buttonText}>Review on the App Store</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              try {
                const result = await Share.share({
                  title: "Inspired Daily",
                  url: "http://bibleinspirationdaily.online/",
                });

                if (result.action === Share.sharedAction) {
                  if (result.activityType) {
                    // shared with activity type of result.activityType
                  } else {
                    // shared
                  }
                } else if (result.action === Share.dismissedAction) {
                  // dismissed
                }
              } catch (error) {
                alert(error.message);
              }
            }}
            style={styles.button}
          >
            <TabBarIcon
              name={Platform.OS === "ios" ? "ios-share-alt" : "md-share-alt"}
            ></TabBarIcon>
            <Text style={styles.buttonText}>Tell a Friend</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            marginTop: 20,
            marginHorizontal: 20,
          }}
        >
          <Text>
            If you have any suggestions or concerns, make sure to contact us via
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            marginTop: 20,
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("mailto:bibleinspirationdaily@gmail.com");
            }}
            activeOpacity={0.8}
            style={styles.button}
          >
            <TabBarIcon
              name={Platform.OS === "ios" ? "ios-mail" : "md-mail"}
            ></TabBarIcon>
            <Text style={styles.buttonText}>Send us an Email </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            Follow us on Social Media
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 100,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Linking.openURL("https://www.instagram.com/dailyinspiredapp/");
              }}
            >
              <TabBarIcon
                name={
                  Platform.OS === "ios" ? "logo-instagram" : "logo-instagram"
                }
                size={50}
                color="rgba(0,0,0,0.4)"
              ></TabBarIcon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL("https://www.facebook.com/dailyinspiredapp/");
              }}
            >
              <TabBarIcon
                name={Platform.OS === "ios" ? "logo-facebook" : "logo-facebook"}
                size={50}
                color="rgba(0,0,0,0.4)"
              ></TabBarIcon>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            borderTopColor: "rgba(0,0,0,0.1)",
            borderTopWidth: StyleSheet.hairlineWidth,
            justifyContent: "center",
            paddingTop: 20,
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={async () => {
              let info = await FileSystem.getInfoAsync(
                FileSystem.documentDirectory + "posts"
              );
              if (info.exists) {
                FileSystem.deleteAsync(FileSystem.documentDirectory + "posts/");
                AsyncStorage.removeItem("saved");
                AsyncStorage.removeItem("savedIds");
                FileSystem.makeDirectoryAsync(
                  FileSystem.documentDirectory + "posts"
                );
              }
              alert("Posts Deleted");
            }}
          >
            <TabBarIcon
              name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
            ></TabBarIcon>
            <Text style={styles.buttonText}>Delete saved Posts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

ContactScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
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
  button: {
    alignSelf: "stretch",
    backgroundColor: "steelblue",
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    marginLeft: 10,
    color: "white",
  },
});
