import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDeleteTest, useGetInstructorTest, useSearchIntructorTest } from '../hooks/api_hooks/test';
import { jwtDecode } from 'jwt-decode';
import { PiIdentificationCardFill } from "react-icons/pi";
import { FaRegNoteSticky } from "react-icons/fa6";
import { BsCalendarDate } from "react-icons/bs";
import { FaDeleteLeft } from "react-icons/fa6";
import { DotLoader } from 'react-spinners';
import Notification from '../components/Notification';


export default function Instructor() {
  // const tests = [
  //   { id: 1, name: 'Test 1', description: 'Description of Test 1' },
  //   { id: 2, name: 'Test 2', description: 'Description of Test 2' },
  //   { id: 3, name: 'Test 3', description: 'Description of Test 3' },
  //   { id: 3, name: 'Test 3', description: 'Description of Test 3' },
  //   { id: 3, name: 'Test 3', description: 'Description of Test 3' },
  //   { id: 3, name: 'Test 3', description: 'Description of Test 3' },
  //   { id: 3, name: 'Test 3', description: 'Description of Test 3' },
  //   { id: 3, name: 'Test 3', description: 'Description of Test 3' },

  // ];
  const navigate = useNavigate();
  const userId = jwtDecode(localStorage.getItem('token'), process.env.JWT_SECRET_KEY).userId;
  const { data: tests, refetch: refetchTest } = useGetInstructorTest(userId);
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    setTestData(tests?.metadata);
  }, [tests]);

  const [input, setInput] = useState('');
  const { mutate: search, isLoading: isSearchLoading } = useSearchIntructorTest(input);
  const { mutate: deleteTest, isLoading: isDeleteLoading } = useDeleteTest();
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
    bgColor: 'green'
  });

  async function submitInput(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the form from being submitted
      search({ input }, {
        onSuccess: (data) => {
          console.log(data);
          if (data?.success) {
            setTestData(data?.metadata);
          }
        },
      });
    }
  }

  async function handleDelete(testId) {
    deleteTest({testId: Number(testId)}, {
      onSuccess: (data) => {
        if (data?.success || data?.code === 200) {
          setNotification({
            message: data.message,
            visible: true,
            bgColor: 'green'
          })
          refetchTest(userId);
        }
      }
    })
  }


  if (isSearchLoading || isDeleteLoading) return <div style={{margin: "30% auto"}}>
    <DotLoader size={35} color="var(--color-blue-4)"/>
  </div>;

  return (
    <Wrapper>
      <Notification message={notification.message} visible={notification.visible} bgColor={notification.bgColor} onClose={() => { setNotification({ ...notification, visible: false }) }} />
      <SearchCreateContainer>
        <StyledTextField
          id="search-test"
          label="Search Tests"
          variant="outlined"
          size="small"
          style={{ marginRight: '20px' }}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={submitInput}
        />
        <Button variant="contained" color="primary" onClick={() => navigate("/instructor/create")}>
          Create New Test
        </Button>
      </SearchCreateContainer>
      <TestListContainer>
        {testData?.length > 0 ? 
        <>
        {testData?.map(test => (
          <TestCard key={test.testId}>
            <CardContent style={{position: "relative"}}>
              <Typography variant="h6" component="div">
                <FaRegNoteSticky /> Test Name: {test?.testName}
              </Typography>
              <Typography variant="h6" component="div">
                <PiIdentificationCardFill /> Test ID: {test?.testId}
              </Typography>
              <Typography variant="h6" component="div">
                <BsCalendarDate /> Date Created: {test?.dateCreated} 
              </Typography>
              <div style={{position: "absolute", top: "10px", right: "20px", cursor: "pointer"}} onClick={() => handleDelete(test?.testId)}>
                <FaDeleteLeft size={25}/>
              </div>
            </CardContent>
          </TestCard>
        ))}
        </> : 
        <div style={{margin: "30px auto", fontSize: "30px", fontWeight: "600"}}> No test created before</div>}
      </TestListContainer>
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
  margin: 20px auto;
  padding: 20px;
  padding-bottom: 50px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 10px 20px rgba(0, 0, 0, 0.5);
`;

const SearchCreateContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px; // Adds space between the search/create area and any content below
`;

const StyledTextField = styled(TextField)`
  flex-grow: 1; // Allows the text field to take up as much space as possible
`;

const TestListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-blue-1-lighter);
  border-radius: 8px;
  padding: 10px;
  margin-top: 20px;
`;

const TestCard = styled(Card)`
  margin-bottom: 10px;
`;