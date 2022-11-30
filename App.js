import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { theme } from "./colors";

const TYPE_KEY = "@type";
const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadToDos();
    loadType();
  }, []);
  const study = async () => {
    setWorking(false);
    try {
      await AsyncStorage.setItem(TYPE_KEY, "false");
    } catch (e) {
      console.log(e);
    }
  };
  const work = async () => {
    setWorking(true);
    try {
      await AsyncStorage.setItem(TYPE_KEY, "true");
    } catch (e) {
      console.log(e);
    }
  };
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };
  const loadToDos = async () => {
    try {
      const storageData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storageData === null) return;
      setToDos(JSON.parse(storageData));
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  const loadType = async () => {
    try {
      const storageType = await AsyncStorage.getItem(TYPE_KEY);
      setWorking(JSON.parse(storageType));
    } catch (e) {
      console.log(e);
    }
  };
  const addToDo = async () => {
    if (text === "") return;
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, finish: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = async (id) => {
    Alert.alert("Delete To DO?", "Are You Sure?", [
      { text: "Cancel" },
      {
        text: "I'm sure",
        style: "destructive",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[id];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
    return;
  };
  const finishToDo = async (id) => {
    const newToDos = { ...toDos };
    const finishToDo = newToDos[id];
    finishToDo.finish = !finishToDo.finish;
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  const editToDo = async (id) => {
    Alert.prompt(
      "Edit To Do?",
      "Please Edit To DO",
      [
        { text: "Cancel" },
        {
          text: "Edit",
          style: "destructive",
          onPress: async (text) => {
            const newToDos = { ...toDos };
            const editToDo = newToDos[id];
            editToDo.text = text;
            setToDos(newToDos);
            await saveToDos(newToDos);
          },
        },
      ],
      "plain-text",
      toDos[id].text
    );
  };
  const deleteAll = async () => {
    const newToDos = { ...toDos };
    const newToDosKey = Object.keys(toDos).filter((todo) => {
      return toDos[todo].working === working;
    });
    newToDosKey.filter((key) => delete newToDos[key]);
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
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
              color: working ? theme.gray : theme.white,
            }}
          >
            Study
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        style={styles.input}
        placeholder={working ? "Add a To Do" : "Add your study plan"}
      />
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="white" />
      ) : (
        <ScrollView>
          {Object.keys(toDos)
            .map((key) =>
              toDos[key].working === working ? (
                <View style={styles.toDo} key={key}>
                  <View style={styles.toDoContianer}>
                    <TouchableOpacity onPress={() => finishToDo(key)}>
                      {toDos[key].finish ? (
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
                        textDecorationLine: toDos[key].finish
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {toDos[key].text}
                    </Text>
                  </View>
                  <View style={styles.toDoContianer}>
                    <TouchableOpacity onPress={() => editToDo(key)}>
                      <Entypo
                        name="edit"
                        size={20}
                        color="white"
                        style={{ marginRight: 10 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteToDo(key)}>
                      <Ionicons name="ios-trash" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null
            )
            .sort()
            .reverse()}
        </ScrollView>
      )}
      <TouchableOpacity onPress={deleteAll} style={styles.deleteBtn}>
        <Text style={styles.deleteBtnText}>Delete All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    fontSize: 32,
    fontWeight: "600",
  },
  input: {
    backgroundColor: theme.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
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
  loading: {
    marginTop: 50,
  },
  deleteBtn: {
    marginTop: 50,
    marginBottom: 100,
    alignItems: "center",
  },
  deleteBtnText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.gray,
    color: theme.white,
    textAlign: "center",
    borderRadius: 20,
  },
});
