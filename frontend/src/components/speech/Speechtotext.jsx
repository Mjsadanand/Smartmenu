import React, { useState, useRef } from "react";

const App = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const recognitionRef = useRef(null);

  const languageMap = {
    "en-US": "English",
    "hi-IN": "Hindi",
    "kn-IN": "Kannada",
  };

  const translateToEnglish = async (inputText, sourceLangCode) => {
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLangCode.slice(
          0,
          2
        )}&tl=en&dt=t&q=${encodeURIComponent(inputText)}`
      );
      const data = await res.json();
      const translated = data[0].map(item => item[0]).join("");
      setTranslatedText(translated);
      navigator.clipboard.writeText(translated);
    } catch (error) {
      console.error("Translation failed", error);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      translateToEnglish(transcript, language);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div style={styles.container}>
      <h2>🎙 Multi-Language Speech to English Text</h2>
      <select
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
        style={styles.select}
      >
        {Object.entries(languageMap).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>

      <textarea
        rows="3"
        value={text}
        placeholder="Original speech..."
        readOnly
        style={styles.textArea}
      />

      <textarea
        rows="3"
        value={translatedText}
        placeholder="Translated to English..."
        readOnly
        style={styles.textArea}
      />

      <div style={styles.buttonContainer}>
        <button onClick={startListening} disabled={listening} style={styles.button}>
          Start Listening
        </button>
        <button onClick={stopListening} disabled={!listening} style={styles.button}>
          Stop
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "30px auto",
  },
  textArea: {
    width: "90%",
    fontSize: "1rem",
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    resize: "none",
    backgroundColor: "#fff",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  select: {
    fontSize: "1rem",
    padding: "10px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  button: {
    padding: "12px 25px",
    fontSize: "1rem",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007BFF",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
};

export default App;