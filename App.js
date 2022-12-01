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
import { Header } from "./components/header";
import { ToDo } from "./components/todo";

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
      <Header working={working} work={work} study={study} />
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
                <ToDo
                  key={key}
                  id={key}
                  toDos={toDos}
                  finishToDo={finishToDo}
                  editToDo={editToDo}
                  deleteToDo={deleteToDo}
                />
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
  loading: {
    marginTop: 50,
  },
  deleteBtn: {
    marginVertical: 100,
    marginHorizontal: 120,
    paddingVertical: 10,
    backgroundColor: theme.gray,
    borderRadius: 30,
  },
  deleteBtnText: {
    color: theme.white,
    textAlign: "center",
  },
});
