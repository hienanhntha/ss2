import React from 'react';
import styled from 'styled-components';
import HistoryChart from '../components/HistoryChart';
import Table from '../components/Table';
import { useGetHistoryBoard, useGetWeeklyActivity } from '../hooks/api_hooks/test';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { data: testResults } = useGetHistoryBoard();
  const { data: weeklyActivities } = useGetWeeklyActivity();
  const [testResultsData, setTestResultsData] = useState([]);
  const [weeklyActivitiesData, setWeeklyActivitiesData] = useState([]);

  useEffect(() => {
    if (testResults?.success) {
      console.log(testResults?.metadata);
      setTestResultsData(testResults?.metadata);
    }
    else {
      setTestResultsData([]);
    }
  }, [testResults]);

  useEffect(() => {
    console.log(weeklyActivities);
    if (weeklyActivities?.success) {
      setWeeklyActivitiesData(weeklyActivities?.metadata);
    }
    else {
      setWeeklyActivitiesData([]);
    }
  }, [weeklyActivities])

  return (
   <DashboardWrapper>
    <DashboardLeft>
      <HistoryChart historyData={weeklyActivitiesData}/>
    </DashboardLeft>
    <DashboardRight>
      <Table title={"TEST RESULTS"} content={testResultsData}/>
    </DashboardRight>
   </DashboardWrapper>
  );
};

export default Dashboard;

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`

const DashboardLeft = styled.div`
  width: 50%;
`

const DashboardRight = styled.div`
  width: 50%;
`