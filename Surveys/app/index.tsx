import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomeScreen() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      let { data, error } = await supabase.from("surveys").select("*");
      if (error) {
        Alert.alert("데이터 가져오기 실패");
      }
      setSurveys(data);
    };

    fetchSurveys();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "설문",
          headerRight: () => (
            <Link href={"/surveys/new"}>
              <AntDesign name="plus" size={20} color="gray" />
            </Link>
          ),
          headerLeft: () => (
            <Link href={"/login"}>
              <AntDesign name="user" size={20} color="gray" />
            </Link>
          ),
        }}
      />
      <FlatList
        data={surveys}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Link href={`/surveys/${item.id}`} style={styles.surveyContainer}>
            <Text style={styles.surveyTitle}>설문 질문</Text>
          </Link>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 5,
  },
  surveyContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  surveyTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
