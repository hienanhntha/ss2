import styled from "styled-components";
import { FaRegClock } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { Button } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTestDetail, useGetTestResult, useGetUserAnswer } from "../hooks/api_hooks/test";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setTestDetail } from "../redux/testSlice";
import { DotLoader } from "react-spinners";


export default function Test() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { testId } = useParams();
  const { data: testDetail, isLoading, error } = useGetTestDetail(testId);
  const [testDetailData, setTestDetailData] = useState(null);
  const { data: testResult } = useGetTestResult(testId);
  const [testResultData, setTestResultData] = useState(null);
  const { mutate: userAnswer } = useGetUserAnswer();
  const [userAnswerData, setUserAnswerData] = useState([]);
  const userSelector = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(testDetail?.metadata);
    if (testDetail?.success) {
      setTestDetailData(testDetail?.metadata);
    }
  }, [testDetail])

  useEffect(() => {
    if (testResult?.success) {
      setTestResultData(testResult?.metadata);
    }
  }, [testResult]);

  useEffect(() => {
    userAnswer({userId: userSelector?.userId, testId: testId}, {
      onSuccess: (data) => {
        if (data?.success) {
          setUserAnswerData(data?.metadata);
        }
        else {
          setUserAnswerData([]);
        }
      },
    });
  }, [userAnswer]);

  if (isLoading) return <div style={{margin: "20% auto"}}>
    <DotLoader size={35} color="var(--color-blue-4)"/>
  </div>;

  // Render logic here
  return <Wrapper>
    <TestDetail>
      <h1>{testDetailData?.test.testName}</h1>
      <Information>
        <Button variant={activeTab === 0 ? "contained" : "text"} onClick={() => setActiveTab(0)}>
          Test Information 
        </Button>
        <Button variant={activeTab === 1 ? "contained" : "text"} onClick={() => setActiveTab(1)}>
          Answers
        </Button>
        <Button variant={activeTab === 2 ? "contained" : "text"} onClick={() => setActiveTab(2)}>
          Your Answers
        </Button>
      </Information>
      {activeTab === 0 && <TestInformation testInfo={testDetailData?.test}/>}
      {activeTab === 1 && <TestAnswer results={testResultData}/>}
      {activeTab === 2 && <UserAnswer results={testResultData} userAnswers={userAnswerData} readingScore={testDetailData?.test?.readingScore} writingScore={testDetailData?.test?.writingScore} listeningScore={testDetailData?.test?.listeningScore}/>}
      <div style={{display: "flex", gap: "20px", justifyContent: "center", marginTop: "30px"}}>
        <Button variant="contained" style={{marginBottom: "20px"}} onClick={() => {
          dispatch(setTestDetail(testDetailData))
          navigate(`/test/reading/${testId}/${testDetailData?.readingSection?.sectionId}`)}
        }>
           Reading Test
        </Button>
        <Button variant="contained" style={{marginBottom: "20px"}} onClick={() => {
          dispatch(setTestDetail(testDetailData))
          navigate(`/test/listening/${testId}/${testDetailData?.listeningSection?.sectionId}`)}
        }>
           Listening Test
        </Button>
        <Button variant="contained" style={{marginBottom: "20px"}} onClick={() => {
          dispatch(setTestDetail(testDetailData))
          navigate(`/test/writing/${testId}/${testDetailData?.writingSection?.sectionId}`)}
        }>
           Writing Test
        </Button>
        <Button variant="contained" style={{marginBottom: "20px"}} onClick={() => {
          dispatch(setTestDetail(testDetailData))
          navigate(`/test/speaking/${testId}/${testDetailData?.speakingSection?.sectionId}`)}
        }>
           Speaking Test
        </Button>
      </div>
    </TestDetail>
  </Wrapper>
}

const TestInformation = ({testInfo}) => {
  const dummyTime = 240;
  const dummyPart = 4;
  
  return <TestInformationWrapper>
    <div style={{display: "flex", alignItems: "center", gap: "10px"}}><FaRegClock /> <div>Time to do: {dummyTime}</div>  </div>
    <div style={{display: "flex", alignItems: "center", gap: "10px"}}><BsFillQuestionSquareFill /> <div>Parts: {dummyPart} parts</div></div>
    <div style={{display: "flex", alignItems: "center", gap: "10px"}}><FaUserEdit /> <div>Date Created: {testInfo?.dateCreated}</div></div>
    <div style={{display: "flex", alignItems: "center", gap: "10px"}}><FaUserEdit /> <div>Created By: {testInfo?.userCreatedName}</div> </div>

    <div style={{padding: "20px", background: "var(--color-blue-1)", borderRadius:"10px", marginTop: "20px"}}>This is the test for foreign people who want to train to have an experience with doing the "Capacity Evaluation" Exam </div>
  </TestInformationWrapper> 
}

const TestAnswer = ({ results }) => {
  return (
    <TestAnswerWrapper>
      <div>
        <h3>Reading</h3>
        {results?.readingResults?.map((item, index) => (
          <QuestionItem key={index}>
            Question {index + 1}: Answer - {item.resultContent}
          </QuestionItem>
        ))}
      </div>
      <div>
        <h3>Listening</h3>
        {results?.listeningResults?.map((item, index) => (
          <QuestionItem key={index}>
            Question {index + 1}: Answer - {item.resultContent}
          </QuestionItem>
        ))}
      </div>
      <div>
        <h3>Writing</h3>
        {results?.writingResults?.resultContent?.map((item, index) => (
          <QuestionItem key={index}>
            Answer - {item}
          </QuestionItem>
        ))}
      </div>
    </TestAnswerWrapper>
  );
}

const UserAnswer = ({ results, userAnswers, readingScore, listeningScore, writingScore }) => {
  const listeningAnswers = useMemo(() => {
    const section = userAnswers.find(section => section.sectionType === 'listening');
    return section?.questions ?? [];
  }, [userAnswers]);

  const readingAnswers = useMemo(() => {
    const section = userAnswers.find(section => section.sectionType === 'reading');
    return section?.questions ?? [];
  }, [userAnswers]);

  const writingAnswers = useMemo(() => {
    const section = userAnswers.find(section => section.sectionType === 'writing');
    return section?.questions?.length > 0 ? section.questions[0].userAnswerContent.split(', ') : [];
  }, [userAnswers]);
  
  useEffect(() => {
    console.log(listeningAnswers, readingAnswers, writingAnswers, results);
  }, [listeningAnswers, readingAnswers, writingAnswers, results]);

  return (
    <UserAnswerWrapper>
      <div><h3>Reading Score: {readingScore && <>{readingScore} / {results?.readingResults?.length}</>}</h3></div>
      <div><h3>Listening Score: {listeningScore && <>{listeningScore} / {results?.listeningResults?.length}</>}</h3></div>
      <div><h3>Writing Score: {writingScore && <>{writingScore} correct answer</>}</h3></div>
      <div>
        <h3>Reading</h3>
        {results?.readingResults?.map((item, index) => (
          <QuestionItem key={index}>
            <div>Question {index + 1}: Correct Answer - <Answer>{item.resultContent}</Answer> | Your Answer - <Answer>{readingAnswers?.length > 0 ? readingAnswers[index]?.userAnswerContent : ""}</Answer></div>
          </QuestionItem>
        ))}
      </div>
      <div>
        <h3>Listening</h3>
        {results?.listeningResults?.map((item, index) => (
          <QuestionItem key={index}>
            <div>Question {index + 1}: Correct Answer - <Answer>{item.resultContent}</Answer> | Your Answer - <Answer>{listeningAnswers?.length > 0 ? listeningAnswers[index]?.userAnswerContent : ""}</Answer></div>
          </QuestionItem>
        ))}
      </div>
      <div>
        <h3>Writing</h3>
        {results?.writingResults?.resultContent?.map((item, index) => (
          <QuestionItem key={index}>
            <div>Answer - <Answer>{item}</Answer> | Your Answer - <Answer>{(writingAnswers?.length > 0 && writingAnswers[0] !== 'No answer') ? writingAnswers[index] : 'No answer'}</Answer></div>
          </QuestionItem>
        ))}
      </div>
    </UserAnswerWrapper>
  );
}

const UserAnswerWrapper = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Answer = styled.span`
  font-weight: bold;
`;

const TestAnswerWrapper = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const QuestionItem = styled.div`
  margin: 5px 0;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TestInformationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  font-size: 20px;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const TestDetail = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: 80%;
  margin: 0 auto;
  padding: 0 20px;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1), /* Soft shadow for subtle depth */
    0 1px 3px rgba(0, 0, 0, 0.08), /* Smaller shadow for fine detail */
    0 10px 20px rgba(0, 0, 0, 0.5); /* Larger shadow for dramatic effect */

  h1 {
    font-size: 30px;
    font-weight: 700;
    font-size: 40px;
  }
`

const Information = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`