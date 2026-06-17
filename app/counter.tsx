import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function CounterScreen() {
    const router = useRouter()
  return (
      <View style={styles.container}>
          <TouchableOpacity onPress={()=>{router.push('/idea')}}>
            <Text style={{fontSize: 24, marginBottom:18, textAlign: "center"}}> Go to /idea</Text>
          </TouchableOpacity>
      <Text style={styles.text}>Counter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
  },
});
