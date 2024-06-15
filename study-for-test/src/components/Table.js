import styled from 'styled-components';
import { Fragment, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import moment from 'moment';

const dummyData = [
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},
  {name: "De 1", section: "Reading", time: moment("2015-01-01T00:00:00").format("hh:MM DD/MM/YY"), score: 120},

]

export default function Table({ title, content }) {
  // Thiết lập số hàng mỗi trang
  const rowsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán số trang
  const maxPage = content && content.length > 0 ? Math.ceil(content.length / rowsPerPage) : 1;

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const currentData = content && content.length > 0 ? content.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  ) : [];

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  }

  return (
    <Wrapper>
      <h1>{title}</h1>
      <StyledTable>
        <thead>
          <tr>
            <Th>No</Th>
            <Th>Test Name</Th>
            <Th>Section</Th>
            <Th>Time</Th>
            <Th>Score</Th>
          </tr>
        </thead>
        <tbody>
          {currentData?.map((data, idx) => {
            const no = (currentPage - 1) * rowsPerPage + idx + 1;
            return (
              <Tr key={idx}>
                <Td>{no}</Td>
                <Td>{data?.testName}</Td>
                <Td>{data?.sectionType.toUpperCase()}</Td>
                <Td>{data?.dateTaken}</Td>
                <Td>{data?.score}</Td>
              </Tr>
            );
          })}
          {currentData.length === 0 && (
            <tr>
              <Td colSpan="5">No data available</Td>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <Stack spacing={2}>
        <Pagination count={maxPage} page={currentPage} onChange={handleChangePage} color="primary" />
      </Stack>
    </Wrapper>
  );
}


const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 80%;
  align-items: center;
  // justify-content: center;
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

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`

const Th = styled.th`
  text-align: center;
  font-weight: bold;
  padding: 10px;
`

const Tr = styled.tr`

`

const Td = styled.td`
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`