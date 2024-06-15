import { useState, useEffect } from "react"
import styled from "styled-components"
import { Grid, Paper, Typography, Button } from '@mui/material'
import { IoIosTime } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { useGetListTest, useGetListTestDone, useGetListTestNotDone } from "../hooks/api_hooks/test";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setListTest } from "../redux/testSlice";


export default function TestList() {
  const navigate = useNavigate();
  const userSelector = useSelector(state => state.user.user);
  const [isEmptyNewest, setIsEmptyNewest] = useState(false);
  // const { mutate: listTestDone } = useGetListTestDone();
  // const { mutate: listTestNotDone } = useGetListTestNotDone();
  const { data: listTest } = useGetListTest();
  const [listTestData, setListTestData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (listTest?.success) {
      setListTestData(listTest?.metadata);
      setIsEmptyNewest(true);  // Cập nhật trạng thái nếu có dữ liệu mới
    }
  }, [listTest]);
  
  useEffect(() => {
    dispatch(setListTest(listTestData));
  }, [listTestData])
  
  return (
    <Wrapper>
      <Typography variant="h4" gutterBottom>
        Dear, {userSelector?.fullName}
      </Typography>
      <Grid container spacing={2}>
        {isEmptyNewest ? <>
          {listTestData?.map((test, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <TestPaper elevation={3}>
              <Typography variant="h5">{test.testName}</Typography>
              <Typography><IoIosTime /> Time: 240 minutes</Typography>
              <Typography><FaUserEdit /> Created: {test.dateCreated}</Typography>
              <Typography><BsFillQuestionSquareFill /> Contest: 4 parts</Typography>
              {test.status === "incomplete" ? 
              <Button variant="contained" color="primary" style={{marginTop:"5px"}} onClick={() => navigate(`/test/${test?.testId}`)}>Detail</Button> : 
              <Button variant="outlined" color="primary" style={{marginTop:"5px"}} onClick={() => navigate(`/test/${test?.testId}`)}>Completed</Button>}
            </TestPaper>
          </Grid>
        ))}</>:
        <div style={{margin: "30% auto", fontSize: "20px", fontWeight: "600"}}>No test found</div>}
      </Grid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 20px;

`
const TestPaper = styled(Paper)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;