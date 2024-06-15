import styled from "styled-components";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Quiz from "../components/Quiz";
import { Button } from "@mui/material";
import AudioPlayer from "../components/AudioPlayer";
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useGetSectionDetail, useSubmitListeningTest } from "../hooks/api_hooks/test";
import Notification from "../components/Notification";
import { ClipLoader } from "react-spinners";

export default function ListeningTest() {
  const { testId, sectionId } = useParams();
  const { data: sectionDetail } = useGetSectionDetail(testId, sectionId);
  const sectionDetailData = useMemo(() => {
    return sectionDetail?.metadata;
  }, [sectionDetail]);
  const [userAnswers, setUserAnswers] = useState([]);
  const userId = jwtDecode(localStorage.getItem('token'), process.env.JWT_SECRET_KEY).userId;
  const { mutate: submitTest, isLoading } = useSubmitListeningTest();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
    bgColor: 'green'
  });

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
          setTimeout(() => {
            navigate(`/test/${testId}`);
          }, 2000); 
        }
      },
    })
  };

  useEffect(() => {
    const formattedAnswers = Object.entries(userAnswers).map(([key, value]) => ({
      questionId: key,
      userAnswerContent: value
    }));
    console.log(formattedAnswers);
  }, [userAnswers]);  

  if (isLoading) return <div style={{ margin: "20% auto", justifyContent: "center" }}>
    <ClipLoader size={35} color="var(--color-blue-4)" />
  </div>

  return (
    <Wrapper>
    <Notification message={notification.message} visible={notification.visible} bgColor={notification.bgColor} onClose={() => setNotification({ ...notification, visible: false })} />
      <AudioPlayerContainer>
        <AudioPlayer src="https://drive.google.com/file/d/1SB2zjvROEnBiXETp3YzoWsWSn7MOI1z_/preview"/>
      </AudioPlayerContainer>
      <MainPanel>
        {sectionDetailData?.questions && <Quiz questions={sectionDetailData?.questions.map(q => ({
          questionId: q?.question?.questionId,
          question: q?.question?.questionText,
          options: q?.answer?.map(a => a.answerName),
        }))}
          setUserAnswers={setUserAnswers} />}
      </MainPanel>
      <SubmitButton variant="contained" color="primary" onClick={handleSubmit} style={{ position: "absolute", bottom: "20px", right: "10vw" }}>
        Submit
      </SubmitButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  min-height: 500px;
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 10px 20px rgba(0, 0, 0, 0.5);
`

const AudioPlayerContainer = styled.div`
  width: 100%;
  text-align: center; // Đảm bảo rằng audio player nằm giữa theo chiều ngang
`

const MainPanel = styled.div`
  width: calc(100% - 40px); // Trừ đi padding của Wrapper
  max-height: 600px;
  overflow-y: auto;
  margin-top: 20px;
  margin-bottom: 60px; // Tạo không gian cho nút Submit
  border-radius: 20px;
  // border: 1px solid #ccc; // Thêm viền
  // background-color: white; // Màu nền cho Main Panel
  padding: 10px;
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
`
const SubmitButton = styled(Button)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: var(--color-primary);
  color: white;
  &:hover {
    background-color: var(--color-primary-dark);
  }
`