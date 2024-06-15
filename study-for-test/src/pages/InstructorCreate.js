import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextField, Card, CardContent, Typography, Input } from '@mui/material';
import Notification from '../components/Notification';
import { useCreateTest, useCreateTestContentByPdf, useCreateTestResults } from '../hooks/api_hooks/test';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';

export default function InstructorCreate() {
  const [testName, setTestName] = useState('');
  const [readingFile, setReadingFile] = useState(null);
  const [listeningFile, setListeningFile] = useState(null);
  const [speakingFile, setSpeakingFile] = useState(null);
  const [writingFile, setWritingFile] = useState(null);
  const [resultsFile, setResultsFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
    bgColor: 'var(--color-success-darker)'
  });
  const { mutate: createTest } = useCreateTest();
  const { mutate: createTestContent, isLoading: isLoadingTestContent } = useCreateTestContentByPdf();
  // const { mutate: createTestResults, isLoading: isLoadingTestResults } = useCreateTestResults();
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Create form data to submit
    if (!testName) {
      setNotification({
        message: "Test name is required",
        visible: true,
        bgColor: 'red'
      })
      return;
    }
    if (!readingFile) {
      setNotification({
        message: "Reading file is required",
        visible: true,
        bgColor: 'red'
      })
      return;
    }
    if (!listeningFile) {
      setNotification({
        message: "Listening file is required",
        visible: true,
        bgColor: 'red'
      })
      return;
    }
    if (!audioUrl) {
      setNotification({
        message: "Audio url is required",
        visible: true,
        bgColor: 'red'
      })
      return;
    }
    if (!speakingFile) {
      setNotification({
        message: "Speaking file is required",
        visible: true,
        bgColor: 'red'
      })
      return;
    }
    if (!writingFile) {
      setNotification({
        message: "Writing file is required",
        visible: true,
        bgColor: 'red'
      })
    }
    const pdfFiles = [readingFile, listeningFile, speakingFile, writingFile, resultsFile];
    // const file = resultsFile;
    // console.log(file);
    console.log(pdfFiles);
    console.log(audioUrl);
    console.log(testName);
    createTest({ testName: testName }, {
      onSuccess: (data1) => {
        console.log("data1", data1)
        if (data1?.success) {
          const testId = data1?.metadata?.testId;
          createTestContent({ testId: testId, audioUrl: audioUrl, pdfFiles: pdfFiles }, {
            onSuccess: (data2) => {
             console.log("data2", data2)
              if (data2?.success) {
                setNotification({
                  message: "Create test successfully",
                  visible: true,
                  bgColor: 'green'
                })
              }
              navigate("/instructor");
            }
          });
        }
      },
    });
  };

  if (isLoadingTestContent) return <div style={{ margin: "20% auto", justifyContent: "center" }}>
    <ClipLoader size={35} color="var(--color-blue-4)" />
  </div>
  
  return (
    <Wrapper>
      <Notification message={notification.message} visible={notification.visible} bgColor={notification.bgColor} onClose={() => { setNotification({ ...notification, visible: false }) }} />
        <TestCreateContainer>
          <TestCreateCard>
            <CardContent>
              <Typography variant="h5" component="div">
                Enter Test Name:
                <TestNameInput
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </Typography>
            </CardContent>
          </TestCreateCard>

          <TestCreateCard>
            <CardContent>
              <Typography variant="h5" component="div">
                Upload Reading PDF:
                <FileSelectorContainer>
                  <FileNameDisplay
                    value={readingFile?.name || ''}
                    placeholder="No file selected"
                    readOnly
                  />
                  <Button variant="contained" color="primary" onClick={() => document.getElementById('fileInput1').click()}>
                    Select
                  </Button>
                  <input
                    id="fileInput1"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setReadingFile(e.target.files[0])}
                  />
                </FileSelectorContainer>
              </Typography>
            </CardContent>
          </TestCreateCard>

          <TestCreateCard>
            <CardContent>
              <Typography variant="h5" component="div">
                Upload Listening PDF:
                <FileSelectorContainer>
                  <FileNameDisplay
                    value={listeningFile?.name || ''}
                    placeholder="No file selected"
                    readOnly
                  />
                  <Button variant="contained" color="primary" onClick={() => document.getElementById('fileInput2').click()}>
                    Select
                  </Button>
                  <input
                    id="fileInput2"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setListeningFile(e.target.files[0])}
                  />
                </FileSelectorContainer>
                <TextField
                  fullWidth
                  label="Audio URL"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  margin="normal"
                />
              </Typography>
            </CardContent>
          </TestCreateCard>

          <TestCreateCard>
            <CardContent>
              <Typography variant="h5" component="div">
                Upload Speaking PDF:
                <FileSelectorContainer>
                  <FileNameDisplay
                    value={speakingFile?.name || ''}
                    placeholder="No file selected"
                    readOnly
                  />
                  <Button variant="contained" color="primary" onClick={() => document.getElementById('fileInput3').click()}>
                    Select
                  </Button>
                  <input
                    id="fileInput3"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setSpeakingFile(e.target.files[0])}
                  />
                </FileSelectorContainer>
              </Typography>
            </CardContent>
          </TestCreateCard>

          <TestCreateCard>
            <CardContent>
              <Typography variant="h5" component="div">
                Upload Writing PDF:
                <FileSelectorContainer>
                  <FileNameDisplay
                    value={writingFile?.name || ''}
                    placeholder="No file selected"
                    readOnly
                  />
                  <Button variant="contained" color="primary" onClick={() => document.getElementById('fileInput4').click()}>
                    Select
                  </Button>
                  <input
                    id="fileInput4"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setWritingFile(e.target.files[0])}
                  />
                </FileSelectorContainer>
              </Typography>
            </CardContent>
          </TestCreateCard>

          <TestCreateCard>
            <CardContent>
              <Typography variant="h5" component="div">
                Upload Results PDF:
                <FileSelectorContainer>
                  <FileNameDisplay
                    value={resultsFile?.name || ''}
                    placeholder="No file selected"
                    readOnly
                  />
                  <Button variant="contained" color="primary" onClick={() => document.getElementById('fileInput5').click()}>
                    Select
                  </Button>
                  <input
                    id="fileInput5"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setResultsFile(e.target.files[0])}
                  />
                </FileSelectorContainer>
              </Typography>
            </CardContent>
          </TestCreateCard>

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create Test
          </Button>
        </TestCreateContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 500px;
  width: 80%;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 10px 20px rgba(0, 0, 0, 0.6);
`;

const TestCreateContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-blue-1-lighter);
  border-radius: 8px;
  padding: 20px;
`;

const TestCreateCard = styled(Card)`
  margin-bottom: 20px;
`;

const TestNameInput = styled(TextField)`
  width: 100%;
  margin-top: 10px;
`;

const FileSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
`;

const FileNameDisplay = styled(TextField)`
  flex-grow: 1;
  margin-right: 10px;
`;