import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { theme } from "../colors";

export const ToDo = ({ toDos, finishToDo, editToDo, deleteToDo, id }) => {
  return (
    <View style={styles.toDo}>
      <View style={styles.toDoContianer}>
        <TouchableOpacity onPress={() => finishToDo(id)}>
          {toDos[id].finish ? (
            <MaterialCommunityIcons
              name="checkbox-marked"
              size={24}
              color="white"
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-blank"
              size={24}
              color="white"
            />
          )}
        </TouchableOpacity>
        <Text
          style={{
            ...styles.toDoText,
            textDecorationLine: toDos[id].finish ? "line-through" : "none",
          }}
        >
          {toDos[id].text}
        </Text>
      </View>
      <View style={styles.toDoContianer}>
        <TouchableOpacity onPress={() => editToDo(id)}>
          <Entypo
            name="edit"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteToDo(id)}>
          <Ionicons name="ios-trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toDo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  toDoContianer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toDoText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
});
