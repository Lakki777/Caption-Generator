import { useState } from "react";
import DateTime from "react-datetime";
import WebVTT from "node-webvtt";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

const CaptionCreator = () => {
  const [caption, setCaption] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [captionText, setCaptionText] = useState("");

  const convertToSeconds = (timeString) => {
    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const secs = parseInt(timeParts[2], 10);
    return hours * 3600 + minutes * 60 + secs;
  };

  const convertSecondsToTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return formattedTime;
  };
  const handleStartTime = (selectedTime) => {
    const formattedTime = moment(selectedTime).format("HH:mm:ss");
    setStartTime(formattedTime);
  };
  const handleEndTime = (selectedTime) => {
    const formattedTime = moment(selectedTime).format("HH:mm:ss");
    setEndTime(formattedTime);
  };
  const handleCaptionText = (e) => {
    setCaptionText(e.target.value);
  };

  const handleAddCaption = () => {
    const newCaption = {
      startTime: convertToSeconds(startTime),
      endTime: convertToSeconds(endTime),
      text: captionText,
    };
    setCaption([...caption, newCaption]);
    setStartTime(endTime);
    setCaptionText("");
  };
  const handleGenerateCaptionFile = () => {
    const parsedCaption = {
      cues: [],
      valid: true,
    };
    caption.forEach((caption, index) => {
      const cue = {
        identifier: (index + 1).toString(),
        start: caption.startTime,
        end: caption.endTime,
        text: caption.text,
        styles: "",
      };
      parsedCaption.cues.push(cue);
    });
    const modifiedCaption = WebVTT.compile(parsedCaption);
    const modifiedCaptionBlob = new Blob([modifiedCaption], {
      type: "text/vtt",
    });
    const downloadLink = URL.createObjectURL(modifiedCaptionBlob);
    const a = document.createElement("a");
    a.href = downloadLink;
    a.download = "en.vtt";
    a.click();
  };
  return (
    <div className="caption-container">
      <div>
        <div className="text-[10px] text-red-700 text-center">
          all fields mandatory - Download And Replace it with Default en.vtt file
        </div>
        <h1 className="text-center mb-[10px]">Caption Generator</h1>
        <div>
          <div className="flex md:flex-row flex-col">
            <label className="font-bold">Start Time</label>
            <DateTime
              className="border  rounded "
              onChange={handleStartTime}
              dateFormat={false}
              value={startTime}
              timeFormat="HH:mm:ss"
            />
          </div>
          <div className="flex mt-[20px] md:flex-row flex-col">
            <label className="font-bold">End Time</label>
            <DateTime
              className="border  rounded "
              dateFormat={false}
              onChange={handleEndTime}
              value={endTime}
              timeFormat="HH:mm:ss"
            />
          </div>
          <label className="font-bold mt-[10px] block">Caption:</label>
          <textarea
            className="border rounded mt-[10px] p-2 w-full"
            value={captionText}
            onChange={handleCaptionText}
            placeholder="Caption text"
          />
          <button
            onClick={handleAddCaption}
            className="bg-blue-500 w-full text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 "
          >
            Add Caption
          </button>
          {caption.length > 0 && (
            <div>
              <button
                onClick={handleGenerateCaptionFile}
                className="bg-blue-500 w-full text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 "
              >
                Download
              </button>
            </div>
          )}
        </div>
        <div>
          <h2 className="font-bold mt-4">Captions list</h2>
          {caption.map((caption, index) => (
            <p className="font-semibold" key={index}>
              [{convertSecondsToTime(caption.startTime)} -
              {convertSecondsToTime(caption.endTime)}]:{caption.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaptionCreator;
