import React, { useState } from "react";
import Dropdown from "./Dropdown";
import Button from "./Button";
import axios from "axios";

function Table({ questions, topics, subtopicMap }) {
  const [selectedTopics, setSelectedTopics] = useState({});
  const [selectedSubtopics, setSelectedSubtopics] = useState({});

  function handlePush() {
    const dataToSend = Object.keys(selectedTopics)
      .filter(
        (questionId) =>
          selectedTopics[questionId] && selectedSubtopics[questionId]
      )
      .map((questionId) => ({
        questionId: questionId,
        topicId: selectedTopics[questionId],
        subtopicId: selectedSubtopics[questionId],
      }));

    if (dataToSend.length === 0) {
      alert("No rows with both topic and subtopic selected.");
      return;
    }

    console.log(dataToSend);

    axios
      .patch("http://localhost:8080/update", dataToSend)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        refreshPage();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  }

  function refreshPage() {
    window.location.reload(false);
  }

  function handleReset() {
    axios
      .delete("http://localhost:8080/reset")
      .then((response) => {
        console.log(response.data);
        refreshPage();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleTopicChange(questionId, selectedTopic) {
    setSelectedTopics({
      ...selectedTopics,
      [questionId]: selectedTopic,
    });

    logTopicChange();
  }

  function logTopicChange() {
    console.log(selectedTopics);
  }

  function handleSubtopicChange(questionId, selectedSubtopic) {
    setSelectedSubtopics({
      ...selectedSubtopics,
      [questionId]: selectedSubtopic,
    });

    logSubtopicChange();
  }

  function logSubtopicChange() {
    console.log(selectedSubtopics);
  }

  return (
    <>
      <div className="table-holder container">
        <table className="query-table">
          <thead>
            <tr>
              <th className="qid">QID</th>
              <th className="ques">Question</th>
              <th className="topic">Topic</th>
              <th className="subtopic">Subtopic</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((item) => (
              <tr
                key={item.id}
                className={
                  selectedTopics[item.id] && selectedSubtopics[item.id]
                    ? "highlight-row"
                    : ""
                }
              >
                <td>{item.id}</td>
                <td>{item.question}</td>
                <td>
                  <Dropdown
                    buttonText="Choose Topic"
                    content={topics}
                    keyField={"id"}
                    displayField={"topic"}
                    onSelect={(selectedTopic) =>
                      handleTopicChange(item.id, selectedTopic)
                    }
                  />
                </td>
                <td>
                  <Dropdown
                    buttonText="Choose Subtopic"
                    content={subtopicMap[selectedTopics[item.id]] || []}
                    keyField={"id"}
                    displayField={"subtopic"}
                    onSelect={(selectedSubtopic) =>
                      handleSubtopicChange(item.id, selectedSubtopic)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="actions container">
        <Button
          buttonText="Push Highlighted"
          onClick={handlePush}
          clr="clr-1"
        ></Button>
        <Button buttonText="Refresh" onClick={refreshPage} clr="clr-2"></Button>
        <Button buttonText="Reset" onClick={handleReset} clr="clr-3"></Button>
      </div>
    </>
  );
}

export default Table;
