import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaMicrophone, FaStop } from 'react-icons/fa';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4CAF50; // Green background for buttons
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 10px;
  width: 150px;
  transition: background-color 0.3s;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #45a049; // Darken color on hover
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  svg {
    margin-right: 5px;
  }
`;

const AudioPlayer = styled.audio`
  margin-top: 20px;
`;

function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.addEventListener("dataavailable", event => {
                audioChunksRef.current.push(event.data);
            });

            mediaRecorderRef.current.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
            });

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    return (
        <Container>
            <Button onClick={startRecording} disabled={isRecording}>
                <FaMicrophone />
                Start Recording
            </Button>
            <Button onClick={stopRecording} disabled={!isRecording}>
                <FaStop />
                Stop Recording
            </Button>
            {audioUrl && <AudioPlayer src={audioUrl} controls />}
        </Container>
    );
}

export default AudioRecorder;
