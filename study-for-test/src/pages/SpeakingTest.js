import styled from "styled-components";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState, useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSectionDetail, useSubmitSpeakingTest } from "../hooks/api_hooks/test";
import Notification from "../components/Notification";
import { ClipLoader } from "react-spinners";

export default function SpeakingTest() {
  const { testId, sectionId } = useParams();
  const { data: sectionDetail } = useGetSectionDetail(testId, sectionId);
  const [currentPage, setCurrentPage] = useState(1);
  const [speakingTestPerGroup, setSpeakingTestPerGroup] = useState([]);
  const navigate = useNavigate();
  const [selectedFileName, setSelectedFileName] = useState('');
  const [file, setFile] = useState(null);
  const userId = jwtDecode(localStorage.getItem('token'), process.env.JWT_SECRET_KEY).userId;
  const { mutate: submitTest, isLoading } = useSubmitSpeakingTest();
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
    bgColor: 'var(--color-success-darker)'
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if(file) {
    setSelectedFileName(file.name);
    setFile(file);
    }
  };

  const sectionDetailData = useMemo(() => {
    console.log(sectionDetail?.metadata);
    return sectionDetail?.metadata;
  }, [sectionDetail]);

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  }

  useEffect(() => {
    if (sectionDetailData) {
      const groupedByDescription = sectionDetailData.questions.reduce((acc, curr) => {
        const description = curr.question.questionText;
        if (!acc[description]) {
          acc[description] = [];
        }
        acc[description].push(curr);
        return acc;
      }, {});
      console.log(Object.values(groupedByDescription));
      setSpeakingTestPerGroup(Object.values(groupedByDescription));
    }
  }, [sectionDetailData]);

  const currentGroup = speakingTestPerGroup[currentPage - 1];
  const currentGroupDescription = useMemo(() => {
    return currentGroup ? currentGroup[0]?.question?.questionText.replace(/\n/g, '<br>') : null;
  }, [currentGroup])

  useEffect(() => {
    document.getElementById('question-text').innerHTML = currentGroupDescription;
  }, [currentGroupDescription])

  const handleSubmit = async () => {
    if (!file) {
      setNotification({
        message: "Please select a file",
        visible: true,
        bgColor:'red'
      });
      return;
    }
    // Chuyển đổi answers từ object sang mảng của các object
    submitTest({ userId: userId, testId: testId, sectionId: sectionId, fileZip: file }, {
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
      <h3>Đề bài (bài làm các phần nói sẽ được nộp bằng cách nén zip - bao gồm các files audio/mp3)</h3>
      <p id="question-text" style={{fontWeight: "500", fontSize: "18px"}}></p>
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
    </LeftPanel>
    <Stack spacing={2} style={{ position: "absolute", bottom: "10px" }}>
      <Pagination count={speakingTestPerGroup?.length} page={currentPage} onChange={handleChangePage} color="primary" />
    </Stack>
    <Button variant="contained" color="primary" onClick={handleSubmit} style={{ position: "absolute", bottom: "10px", right: "10vw" }} >
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
  padding-bottom: 50px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1), /* Soft shadow for subtle depth */
    0 1px 3px rgba(0, 0, 0, 0.08), /* Smaller shadow for fine detail */
    0 10px 20px rgba(0, 0, 0, 0.5); /* Larger shadow for dramatic effect */
`

const LeftPanel = styled.div`
  width: 50%;
  height: 80%;
  padding-right: 10px;
`

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
