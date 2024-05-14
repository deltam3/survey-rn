import { useState } from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Pressable, Button } from "react-native";
import { Feather } from "@expo/vector-icons";
const survey = {
  question: "탕수육 찍먹 vs 탕수육 부먹",
  options: ["찍먹", "부먹"],
};

export default function SurveyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selected, setSelected] = useState("찍먹");

  const vote = () => {
    console.warn("Vote: ", selected);
  };

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
