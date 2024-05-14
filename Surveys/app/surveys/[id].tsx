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
import { Survey, Vote } from "@/types/db";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

export default function SurveyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey>(null);
  const [userVote, setUserVote] = useState<Vote>(null);
  const [selected, setSelected] = useState("");

  const { user } = useAuth();

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

    const fetchUserVote = async () => {
      if (!user) {
        return;
      }
      let { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("survey_id", Number.parseInt(id))
        .eq("user_id", user.id)
        .limit(1)
        .single();

      setUserVote(data);
      if (data) {
        setSelected(data.option);
      }
    };

    fetchSurveys();
    fetchUserVote();
  }, []);

  const vote = async () => {
    const newVote = {
      option: selected,
      survey_id: survey.id,
      user_id: user?.id,
    };
    if (userVote) {
      newVote.id = userVote.id;
    }
    const { data, error } = await supabase
      .from("votes")
      .upsert([newVote])
      .select()
      .single();

    if (error) {
      Alert.alert("투표 실패");
    } else {
      setUserVote(data);
      Alert.alert("투표해주셔서 감사합니다.");
    }
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
