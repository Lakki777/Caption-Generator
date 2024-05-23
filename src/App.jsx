import { useEffect, useRef, useState } from "react";
import "./App.css";
import ReactPlayer from "react-player";
import envtt from "./captions.vtt?url";
import { default_video } from "./constants/constants";
import CaptionCreator from "./components/CaptionCreator";

function App() {
  const [videoUrl, setVideoUrl] = useState(default_video);
  const player = useRef();
  const [playing, setPlaying] = useState(false);
  const [caption, setCaption] = useState("en");
  const [showCaptionCreator, setShowCaptionCreator] = useState(false);

  useEffect(() => {
    const playerInstance = player.current.getInternalPlayer();
    const tracks = playerInstance?.textTracks;
    if (tracks) {
      for (let index = 0; index < tracks.length; index++) {
        tracks[index].mode =
          tracks[index].language === caption ? "showing" : "disabled";
      }
    }
  }, [caption]);

  const handlePlay = () => {
    setPlaying(!playing);
  };

  const toggleCaption = () => {
    setCaption((prevCaption) => (prevCaption ? null : "en"));
  };

  const handleInput = (e) => {
    setVideoUrl(e.target.value);
  };

  const handleCaptionToggle = () => {
    setShowCaptionCreator((prevShow) => !prevShow);
  };

  const videoConfig = {
    file: {
      attributes: {
        crossOrigin: "anonymous",
      },
      tracks: [
        {
          kind: "subtitles",
          src: envtt,
          srcLang: "en",
          default: true,
        },
      ],
    },
  };

  return (
    <>
      <div
        className={`flex max-w-[800px] lg:px-0 px-[10px] mx-auto items-center justify-between my-[15px] ${
          showCaptionCreator ? "blurred" : ""
        }`}
      >
        <input
          className="input"
          placeholder="Enter Video URL"
          value={videoUrl}
          onChange={handleInput}
        />
      </div>
      <div
        className={`max-w-[800px] mx-auto ${
          showCaptionCreator ? "blurred" : ""
        }`}
      >
        <ReactPlayer
          width={"full"}
          height={"auto"}
          controls={true}
          config={videoConfig}
          url={videoUrl}
          playing={playing}
          ref={player}
        />
        <div className="flex max-w-[800px] lg:px-0 px-[10px] mx-auto items-center justify-between my-[15px]">
          <button
            className="btn sm:min-w-[140px] min-w-[70px]"
            onClick={handlePlay}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            className="btn sm:min-w-[140px] min-w-[70px]"
            onClick={handleCaptionToggle}
          >
            Add Captions
          </button>
          <button
            className="btn sm:min-w-[140px] min-w-[70px]"
            onClick={toggleCaption}
          >
            {caption ? "Disable Captions" : "Enable Captions"}
          </button>
        </div>
      </div>
      {showCaptionCreator && (
        <>
          <div className="shadow" onClick={handleCaptionToggle}></div>
          <div className="main_container">
            <CaptionCreator />
          </div>
        </>
      )}
    </>
  );
}

export default App;
