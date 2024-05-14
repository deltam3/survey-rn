import { useEffect, useState } from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Survey } from "@/types/db";
import { supabase } from "@/lib/supabase";

export default function SurveyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey>(null);

  const [selected, setSelected] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      let { data, error } = await supabase
        .from("surveys")
        .select("*")
        .eq("id", Number.parseInt(id))
        .single();

      if (error) {
        Alert.alert("데이터 로드 실패");
      }
      setSurvey(data);
    };

    fetchSurveys();
  }, []);

  const vote = () => {
    console.warn("Vote: ", selected);
  };

  if (!survey) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "설문 작성하기" }} />
      <Text style={styles.question}>설문 질문: {survey.question}</Text>
      <View style={{ gap: 5 }}>
        {survey.options.map((option) => (
          <Pressable
            key={option}
            style={styles.optionContainer}
            onPress={() => setSelected(option)}
          >
            <Feather
              name={option === selected ? "check-circle" : "circle"}
              size={18}
              color={option === selected ? "green" : "gray"}
            />
            <Text>{option}</Text>
          </Pressable>
        ))}
      </View>
      <Button onPress={vote} title="설문 제출하기" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
  },
  optionContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
