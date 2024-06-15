import React, { useEffect, useMemo, useState } from 'react';
import styled from "styled-components";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSectionDetail, useSubmitWritingTest } from "../hooks/api_hooks/test";
import { jwtDecode } from "jwt-decode";
import Notification from '../components/Notification';
import { ClipLoader } from "react-spinners";

export default function WritingTest() {
  const { testId, sectionId } = useParams();
  const { data: sectionDetail } = useGetSectionDetail(testId, sectionId);
  const [currentPage, setCurrentPage] = useState(1);
  const [writingTestPerGroup, setWritingTestPerGroup] = useState([]);
  const navigate = useNavigate();
  const [inputAnswers, setInputAnswers] = useState([]);
  const [listAnswers, setListAnswers] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [file, setFile] = useState(null);
  const userId = jwtDecode(localStorage.getItem('token'), process.env.JWT_SECRET_KEY).userId;
  const { mutate: submitTest, isLoading } = useSubmitWritingTest();
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
    bgColor: 'green'
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if(file) {
    setFile(file);
    setSelectedFileName(file.name);
    }
  };

  const sectionDetailData = useMemo(() => {
    return sectionDetail?.metadata;
  }, [sectionDetail]);

  useEffect(() => {
    if (sectionDetailData) {
      const groupedByDescription = sectionDetailData.questions.reduce((acc, curr) => {
        const description = curr.question.questionDescription;
        acc[description] = acc[description] || [];
        acc[description].push(curr);
        return acc;
      }, {});
      setListAnswers(Object.values(groupedByDescription)[0][0].answer);
      setWritingTestPerGroup(Object.values(groupedByDescription));
    }
  }, [sectionDetailData]);

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  }

  const currentGroup = writingTestPerGroup[currentPage - 1] || [];
  const currentGroupDescription = currentGroup.length > 0 ? currentGroup[0].question.questionDescription.split("----- Hết -----")[0] : "";

  const handleInputChange = (e, idx) => {
    setInputAnswers({
      ...inputAnswers,
      [idx]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!file) {
      setNotification({
        message: "Please select a file",
        visible: true,
        bgColor:'red'
      })
      return; 
    }
    // Chuyển đổi answers từ object sang mảng của các object
    const formattedAnswers = Object.entries(inputAnswers).map(([key, value]) => (value));

    submitTest({ userId: userId, testId: testId, sectionId: sectionId, userAnswer: formattedAnswers, fileZip: file }, {
      onSuccess: (data) => {
        if (data.success) {
          setNotification({
            message: "Submit successfully",
            visible: true,
            bgColor: 'green'
          })
          navigate(`/test/${testId}`);
        }
      },
    })
  };

  if (isLoading) return <div style={{ margin: "20% auto", justifyContent: "center" }}>
    <ClipLoader size={35} color="var(--color-blue-4)" />
  </div>
  
  return <Wrapper>
    <Notification message={notification.message} visible={notification.visible} bgColor={notification.bgColor} onClose={() => setNotification({ ...notification, visible: false })} />
    <LeftPanel>
      <h3>Đề bài (bài làm các phần viết sẽ được nộp bằng cách nén zip - bao gồm các files pdf hoặc word)</h3>
      <p style={{fontWeight: "500", fontSize: "18px"}}>{currentGroupDescription}</p>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
      }}>
        {currentGroup.map((item, index) => (
          <p key={index} style={{ fontWeight: 600, margin: 0 }}>
            {item.answer.map(answer => answer.answerName).join(', ')}
          </p>
        ))}
      </div>
    </LeftPanel>
    <RightPanel>
      {listAnswers?.map((answer, idx) => 
        <div key={idx} style={{display: "flex", flexDirection: "column", gap: "5px"}}>
          <div>({idx + 1})</div>
          <QuestionInput
            value={inputAnswers[idx] || ''}
            onChange={(e) => handleInputChange(e, idx)}
            placeholder="Nhập câu trả lời"
          />
        </div>
      )}
      <FileSelectorContainer>
        <FileNameDisplay
          value={selectedFileName}
          placeholder="No file selected"
          readOnly
        />
        <Button variant="contained" color="primary" onClick={() => document.getElementById('fileInput').click()}>
          Select
        </Button>
        <input
          id="fileInput"
          type="file"
          accept=".zip"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </FileSelectorContainer>
    </RightPanel>
    <Stack spacing={2} style={{ position: "absolute", bottom: "10px" }}>
      <Pagination count={writingTestPerGroup.length} page={currentPage} onChange={handleChangePage} color="primary" />
    </Stack>
    <Button variant="contained" color="primary" onClick={handleSubmit} style={{ position: "absolute", bottom: "10px", right: "10vw" }}>
      Submit
    </Button>
  </Wrapper>;
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: auto;
  min-height: 500px;
  width: 80%;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08), 0 10px 20px rgba(0, 0, 0, 0.5);
`;

const LeftPanel = styled.div`
  width: 60%;
  height: 80%;
  padding-right: 10px;
`;

const RightPanel = styled.div`
  width: 40%;
  height: 50%;
  max-height: 400px;
  overflow-y: scroll;
  margin-top: 50px;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-blue-3-darker);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #0056b3;
  }
`;

const QuestionInput = styled.input`
  width: 90%;
  margin-bottom: 20px;
  padding: 10px;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
`;

const FileSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 90%;
`;

const FileNameDisplay = styled.input`
  flex: 7;
  padding: 8px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  &:focus {
    outline: none;
  }
`;
