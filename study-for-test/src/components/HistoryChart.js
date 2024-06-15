import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Đảm bảo tất cả các thành phần được đăng ký tự động
import styled from 'styled-components';

const HistoryChart = ({ historyData }) => {
  const dateTaken = historyData.map(data => data?.dateTaken);
  const testCount = historyData.map(data => data?.testCount);
  const data = {
    labels: dateTaken.length > 0 ? dateTaken : "No date found",
    datasets: [
      {
        label: 'Frequency',
        data: testCount.length > 0 && testCount, // Giả sử đây là số lượng enroll trong mỗi tháng
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      }
    ],
  };

  return <Wrapper>
    <h1>NUMBER OF TEST PER WEEK</h1>
    <Bar data={data} />
  </Wrapper>;
}

export default HistoryChart;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 80%;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0 20px;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1), /* Soft shadow for subtle depth */
    0 1px 3px rgba(0, 0, 0, 0.08), /* Smaller shadow for fine detail */
    0 10px 20px rgba(0, 0, 0, 0.5); /* Larger shadow for dramatic effect */
`