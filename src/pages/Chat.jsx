import React, { useContext } from 'react';
import { dataContext, prevUser } from '../context/UserContext';
import { MdVolumeUp } from "react-icons/md";

function Chat() {
  const { showResult, prevFeature, genImgUrl } = useContext(dataContext);

  // Text-to-Speech function
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="chat-page">
      {prevUser.prompt && (
        <div className="user">
          {prevUser.imgUrl && <img src={prevUser.imgUrl} alt="Uploaded" />}
          <span>{prevUser.prompt}</span>
        </div>
      )}

      {prevFeature === "genimg" ? (
        genImgUrl ? (
          <div className="ai">
            <img src={genImgUrl} alt="Generated" />
          </div>
        ) : (
          <div className="ai">Generating image...</div>
        )
      ) : (
        <div className="ai">
          <span>{showResult}</span>
          <button className="tts-button" onClick={() => speakText(showResult)}>
            <MdVolumeUp /> Listen
          </button>
        </div>
      )}
    </div>
  );
}

export default Chat;