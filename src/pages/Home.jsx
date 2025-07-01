import React, { useContext, useState } from 'react'
import "../App.css"
import { RiImageAiLine, RiImageAddLine } from "react-icons/ri";
import { MdChatBubbleOutline, MdMic } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaArrowUpLong } from "react-icons/fa6";
import { dataContext, prevUser, user } from '../context/UserContext';
import Chat from './Chat';
import { generateResponse } from '../gemini';
import { generateImage } from '../imageGenerator';

function Home() {
  let {
    startRes, setStartRes,
    popUp, setPopUP,
    input, setInput,
    feature, setFeature,
    showResult, setShowResult,
    prevFeature, setPrevFeature,
    genImgUrl, setGenImgUrl
  } = useContext(dataContext);

  const [isListening, setIsListening] = useState(false);

  // Speech-to-Text function
  const startSpeechRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInput('Speech recognition failed. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setStartRes(true);
    setPrevFeature(feature);
    setShowResult("");

    prevUser.data = user.data;
    prevUser.mime_type = user.mime_type;
    prevUser.imgUrl = user.imgUrl;
    prevUser.prompt = input;

    user.data = null;
    user.mime_type = null;
    user.imgUrl = null;

    setInput("");
    let result = await generateResponse();
    setShowResult(result);
    setFeature("chat");
  }

  function handleImage(e) {
    setFeature("upimg");
    let file = e.target.files[0];

    let reader = new FileReader();
    reader.onload = (event) => {
      let base64 = event.target.result.split(",")[1];
      user.data = base64;
      user.mime_type = file.type;
      user.imgUrl = `data:${user.mime_type};base64,${user.data}`;
    };
    reader.readAsDataURL(file);
  }

  async function handleGenerateImg() {
    setStartRes(true);
    setPrevFeature("genimg");
    setGenImgUrl("");

    prevUser.prompt = input;

    try {
      let url = await generateImage();
      setGenImgUrl(url);
    } catch (error) {
      console.error("Image generation failed:", error);
      setShowResult("Failed to generate image. Please try again.");
    }

    setInput("");
    setFeature("chat");
  }

  return (
    <div
      className='home'
      style={{
        backgroundImage: `url(/imagebot.jpg)`, // Reference image from public directory
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <nav>
        <div className="logo" onClick={() => {
          setStartRes(false);
          setFeature("chat");
          user.data = null;
          user.mime_type = null;
          user.imgUrl = null;
          setPopUP(false);
        }}>
          <img src="/logo.webp" alt="Brainy Bot Logo" className="logo-image" />
          <span>BrainyBot</span>
        </div>
      </nav>

      <input type="file" accept='image/*' hidden id='inputImg' onChange={handleImage} />

      {!startRes ?
        <div className="hero">
          <span id="tag">What can I help with ?</span>
          <div className="cate">
            <div className="upImg" onClick={() => document.getElementById("inputImg").click()}>
              <RiImageAddLine />
              <span>Upload Image</span>
            </div>
            <div className="genImg" onClick={() => setFeature("genimg")}>
              <RiImageAiLine />
              <span>Generate Image</span>
            </div>
            <div className="chat" onClick={() => setFeature("chat")}>
              <MdChatBubbleOutline />
              <span>Let's Chat</span>
            </div>
            <div className="detect" onClick={() => {
              window.open("asn.html", "_blank");
            }}>
              <RiImageAiLine />
              <span>Live Object Detection</span>
            </div>
          </div>
        </div>
        :
        <Chat />
      }

      <form className="input-box" onSubmit={(e) => {
        e.preventDefault();
        if (input) {
          if (feature === "genimg") {
            handleGenerateImg();
          } else {
            handleSubmit(e);
          }
        }
      }}>
        <img src={user.imgUrl} alt="" id="im" />

        {popUp && (
          <div className="pop-up">
            <div className="select-up" onClick={() => {
              setPopUP(false);
              setFeature("chat");
              document.getElementById("inputImg").click();
            }}>
              <RiImageAddLine />
              <span>Upload Image</span>
            </div>
            <div className="select-gen" onClick={() => {
              setFeature("genimg");
              setPopUP(false);
            }}>
              <RiImageAiLine />
              <span>Generate Image</span>
            </div>
          </div>
        )}

        <div id="add" onClick={() => setPopUP(prev => !prev)}>
          {feature === "genimg" ? <RiImageAiLine id="genImg" /> : <FiPlus />}
        </div>

        <input
          type="text"
          placeholder='Ask Something...'
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <div
          id="mic"
          onClick={startSpeechRecognition}
          className={isListening ? 'mic-active' : ''}
        >
          <MdMic />
        </div>
        {input && <button id="submit"><FaArrowUpLong /></button>}
      </form>
    </div>
  );
}

export default Home;