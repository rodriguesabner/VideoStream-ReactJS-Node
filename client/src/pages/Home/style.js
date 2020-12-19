import styled from "styled-components";

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  form {
    display: flex;
    width: 100%;
  }

  #textarea {
    background: #2b2b2c;
    border-radius: 3px;
    padding: 13px 15px;
    font-family: "Heebo", sans-serif;
    width: 95%;
    margin: 20px auto;
    border: 0;
    outline: 0;
    color: #fff;
  }

  .streamer-data {
    display: flex;
    justify-content: space-between;

    padding: 15px 20px;
  }

  .offlineLive {
    width: 100%;
    background: #181818;
    height: 500px;
  }

  #video-grid {
    video {
      width: 100%;
      height: 500px;
      object-fit: contain;
      background: #181818;
    }
  }

  .bottom-section {
    position: fixed;
    bottom: 0;

    width: 100%;
    max-width: 1200px;
    padding: 15px;

    #start-stream {
      background: #5a00cb;

      font-size: 16px;
      font-weight: 600;
      color: #fff;

      border-radius: 5px;
      border: 0;
      outline: 0;

      padding: 15px 25px;

      width: 100%;

      cursor: pointer;
    }
  }
`;
