import React, { useRef, useState } from "react";
import { Container, Layout } from "./style";
import SadGirl from "../../assets/SadGirl.svg";
import GithubIcon from "../../assets/github.svg";
import InstagramIcon from "../../assets/instagram.svg";
import YoutubeIcon from "../../assets/youtube.svg";

const peer = new window.Peer(undefined, {
  host: "localhost",
  secure: false,
  port: 21500,
  path: "peerjs/kingaspx",
});

const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
};

const createEmptyVideoTrack = ({ width, height }) => {
  const canvas = Object.assign(document.createElement("canvas"), {
    width,
    height,
  });
  canvas.getContext("2d").fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, { enabled: false });
};

const audioTrack = createEmptyAudioTrack();
const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
const mediaStream = new MediaStream([audioTrack, videoTrack]);

function Home() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStreamer, setIsStreamer] = useState(false);
  const [streamerCode, setStreamerCode] = useState(null);
  const [globalStream, setGlobalStream] = useState(null);
  const [id, setId] = useState(null);
  const videoGrid = useRef(null);
  const myVideo = document.createElement("video");
  myVideo.muted = true;

  peer.on("open", (id) => {
    console.log(id);
    setId(id);
  });

  async function addVideoStream(video, stream) {
    try {
      let div = document.getElementById("video-grid");
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
    } catch (error) {}

    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });

    try {
      videoGrid.append(video);
    } catch (error) {
      videoGrid.current.append(video);
    }
  }

  async function startStream() {
    window.navigator.getMedia =
      window.navigator.getUserMedia ||
      window.navigator.webkitGetUserMedia ||
      window.navigator.mozGetUserMedia ||
      window.navigator.msGetUserMedia;

    window.navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);
        setGlobalStream(stream);
        setIsStreaming(true);
        setIsStreamer(true);

        peer.on("call", (call) => {
          call.answer(stream);
        });
      });
  }

  async function stopStream() {
    globalStream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        console.log("Entrou no if");
        track.stop();
      }
    });

    setIsStreaming(false);
    setIsStreamer(false);
    // window.navigator.mediaDevices.destroy;

    let div = document.getElementById("video-grid");
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }

  async function receiveStream() {
    const call = peer.call(streamerCode, mediaStream);

    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
      setIsStreaming(true);
    });
  }

  return (
    <Layout>
      <Container>
        <div style={{ display: "flex" }}>
          {!isStreaming ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                receiveStream();
              }}
            >
              <input
                id="textarea"
                autoComplete={'off'}
                placeholder="Digite aqui o código do streamer e aperte ENTER"
                value={streamerCode}
                onChange={(e) => setStreamerCode(e.target.value)}
              />
            </form>
          ) : null}
        </div>

        <div className="streamer-data">
          <div>
            <h1>Kingaspx</h1>
            <h3>Follow Me: </h3>

            <div style={{ display: "flex", marginTop: 15 }}>
              <a
                href="https://github.com/kingaspx"
                target="_blank"
                style={{ marginRight: 10 }}
              >
                <img src={GithubIcon} alt="Github" draggable={"false"} />
              </a>
              <a
                href="https://instagram.com/rodriguesabner_"
                target="_blank"
                style={{ marginRight: 10 }}
              >
                <img src={InstagramIcon} alt="Instagram" draggable={"false"} />
              </a>
              <a href="https://youtube.com/kingaspx" target="_blank">
                <img src={YoutubeIcon} alt="Youtube" draggable={"false"} />
              </a>
            </div>
          </div>

          <div></div>
        </div>

        {!isStreaming ? (
          <div
            className="offlineLive"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <img src={SadGirl} draggable={"false"} />
            <h1>Não há nenhuma stream ativa agora...</h1>

            <h3>
              Inicie uma tranmissão ou entre em alguma digitando no campo acima.
            </h3>
          </div>
        ) : null}

        <div id="video-grid" ref={videoGrid} />

        <div className="streamer-data">
          <div>
            <h1>{id}</h1>
            <h3>ID de Transmissão</h3>
          </div>

          <div></div>
        </div>

        <div className="bottom-section">
          {!isStreaming ? (
            <button id="start-stream" onClick={() => startStream()}>
              Iniciar Transmissão
            </button>
          ) : isStreamer ? (
            <button id="start-stream" onClick={() => stopStream()}>
              Desligar Transmissão
            </button>
          ) : null}
        </div>
      </Container>
    </Layout>
  );
}

export default Home;
