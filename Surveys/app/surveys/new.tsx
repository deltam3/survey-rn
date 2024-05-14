import { Redirect, Stack, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function CreateSurvey() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [error, setError] = useState("");

  const { user } = useAuth();

  const createSurvey = async () => {
    setError("");
    if (!question) {
      setError("질문을 적어주세요");
      return;
    }
    const validOptions = options.filter((o) => !!o);
    if (validOptions.length < 2) {
      setError("최소 2개의 선택지를 적어주세요.");
      return;
    }

    const { data, error } = await supabase
      .from("surveys")
      .insert([{ question, options: validOptions }])
      .select();

    if (error) {
      Alert.alert("설문 생성 실패");
      return;
    }
    router.back();
  };

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "새로운 설문 작성하기" }} />

      <Text style={styles.label}>제목</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="설문할 질문을 여기에 적으세요."
        style={styles.input}
      />
      <Text style={styles.label}>선택지</Text>
      {options.map((option, index) => (
        <View key={index} style={{ justifyContent: "center" }}>
          <TextInput
            value={option}
            placeholder={`선택지 ${index + 1}`}
            onChangeText={(text) => {
              const updated = [...options];
              updated[index] = text;
              setOptions(updated);
            }}
            style={styles.input}
          />
          <Feather
            name="x"
            size={18}
            color="gray"
            onPress={() => {
              const updated = [...options];
              updated.splice(index, 1);
              setOptions(updated);
            }}
            style={{ position: "absolute", right: 10 }}
          />
        </View>
      ))}
      <Button
        title="선택지 추가하기"
        onPress={() => setOptions([...options, ""])}
      />
      <Button title="설문 작성하기" onPress={createSurvey} />
      <Text style={{ color: "crimson" }}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 5,
  },
  label: {
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
});
