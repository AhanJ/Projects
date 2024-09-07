import "./App.css";
import "./styles.css";
import Header from "./components/Header";
import Table from "./components/Table";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopicMap, setsubtopicMap] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/questions")
      .then((response) => {
        setQuestions(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://localhost:8080/topics")
      .then((response) => {
        setTopics(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://localhost:8080/subtopics")
      .then((response) => {
        const subtopics = response.data;
        const map = {};
        subtopics.forEach((item) => {
          if (!map[item.topic_id]) {
            map[item.topic_id] = [];
          }
          map[item.topic_id].push({ id: item.id, subtopic: item.subtopic });
        });
        setsubtopicMap(map);
        console.log(map);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Header src="/logo.svg" title="Question Tagging System"></Header>
      <div className="spacer"></div>
      <Table
        questions={questions}
        topics={topics}
        subtopicMap={subtopicMap}
      ></Table>
      <div className="spacer"></div>
    </>
  );
}

export default App;
