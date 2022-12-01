import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { theme } from "../colors";

export const Header = ({ working, work, study }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={work}>
        <Text
          style={{
            ...styles.btnText,
            color: working ? theme.white : theme.gray,
          }}
        >
          Work
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={study}>
        <Text
          style={{
            ...styles.btnText,
            color: !working ? theme.white : theme.gray,
          }}
        >
          Study
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    fontSize: 32,
    fontWeight: "600",
  },
});
