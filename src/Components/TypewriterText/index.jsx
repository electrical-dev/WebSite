import { useState, useEffect } from "react";

const TypewriterText = ({ text, speed }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      console.log("index", currentIndex);
      console.log(text[currentIndex]);
      setDisplayText((prevText) => prevText + text[currentIndex]);
      currentIndex++;
      if (currentIndex === text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayText}</span>;
};
export default TypewriterText;
