import styled from "styled-components";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState, Fragment } from "react";
import Quiz from "../components/Quiz";
import { Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSectionDetail, useSubmitReadingTest } from "../hooks/api_hooks/test";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setTestScore } from "../redux/testSlice";
import Notification from "../components/Notification";
import { ClipLoader } from "react-spinners";

export default function ReadingTest() {
  const { testId, sectionId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: sectionDetail } = useGetSectionDetail(testId, sectionId);
  const [readingTestPerGroup, setReadingTestPerGroup] = useState([]);
  const sectionDetailData = useMemo(() => {
    return sectionDetail?.metadata;
  }, [sectionDetail]);
  const [userAnswers, setUserAnswers] = useState([]);
  const userId = jwtDecode(localStorage.getItem('token'), process.env.JWT_SECRET_KEY).userId;
  const { mutate: submitTest, isLoading } = useSubmitReadingTest();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
    bgColor: 'green'
  });

  useEffect(() => {
    if (sectionDetailData) {
      const groupedByDescription = sectionDetailData.questions.reduce((acc, curr) => {
        const description = curr.question.questionDescription;
        if (!acc[description]) {
          acc[description] = [];
        }
        acc[description].push(curr);
        return acc;
      }, {});

      setReadingTestPerGroup(Object.values(groupedByDescription));
    }
  }, [sectionDetailData]);

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  }

  const currentGroup = readingTestPerGroup[currentPage - 1];
  const currentGroupDescription = currentGroup ? currentGroup[0]?.question?.questionDescription : null;

  const handleSubmit = async () => {
    // Chuyển đổi answers từ object sang mảng của các object
    const formattedAnswers = Object.entries(userAnswers).map(([key, value]) => ({
      questionId: key,
      userAnswerContent: value
    }));

    submitTest({ userId: userId, testId: testId, sectionId: sectionId, userAnswer: formattedAnswers }, {
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
      {currentGroup && (
        <div>
          <h3>Bài đọc</h3>
          <p style={{fontWeight: "500", fontSize: "15px"}}>{currentGroupDescription}</p>
        </div>
      )}
    </LeftPanel>
    <RightPanel>
      {currentGroup && <Quiz questions={currentGroup.map(q => ({
        questionId: q?.question?.questionId,
        question: q?.question?.questionText,
        options: q?.answer?.map(a => a.answerName),
      }))}
        setUserAnswers={setUserAnswers} />}
    </RightPanel>
    <Stack spacing={2} style={{ position: "absolute", bottom: "10px" }}>
      <Pagination count={readingTestPerGroup?.length} page={currentPage} onChange={handleChangePage} color="primary" />
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
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1), /* Soft shadow for subtle depth */
    0 1px 3px rgba(0, 0, 0, 0.08), /* Smaller shadow for fine detail */
    0 10px 20px rgba(0, 0, 0, 0.5); /* Larger shadow for dramatic effect */
`

const LeftPanel = styled.div`
  width: 50%;
  height: 80%;
  padding-right: 10px;
  margin-bottom: 50px;
`

const RightPanel = styled.div`
  width: 50%;
  height: 80%;
  max-height: 600px;
  margin-bottom: 50px;
  overflow-y: scroll;
  overflow-x: hidden;

  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 5px; /* width of the entire scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* color of the tracking area */
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-blue-3-darker); /* color of the scroll thumb */
    border-radius: 10px; /* roundness of the scroll thumb */
    border: none; /* creates padding around scroll thumb */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #0056b3; /* color of the scroll thumb on hover */
  }
`