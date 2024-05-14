import { View, Text, Button } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={{ padding: 10 }}>
      <Text>유저 아이디: {user?.id}</Text>

      <Button title="로그아웃" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
