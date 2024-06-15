import React, { useEffect, useState } from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { Paper, Container as MuiContainer } from '@mui/material';
import styled from 'styled-components';

function Quiz({ questions, setUserAnswers }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (event, questionId) => {
    setAnswers({
      ...answers,
      [questionId]: event.target.value
    });
  };

  useEffect(() => {
    setUserAnswers(answers);
  }, [answers, setUserAnswers]);

  return (
    <Container component="main" maxWidth="md">
      <StyledPaper>
        {questions.map((question) => (
          <FormControl component="fieldset" key={question.questionId} style={{ marginBottom: "20px", display: "flex" }}>
            <FormLabel component="legend">{question.question}</FormLabel>
            <RadioGroup
              name={`question-${question.questionId}`}
              value={answers[question.questionId] || ''}
              onChange={(e) => handleChange(e, question.questionId)}
            >
              {question.options.map((option, i) => (
                <FormControlLabel key={i} value={option[0]} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
          </FormControl>
        ))}
      </StyledPaper>
    </Container>
  );
}

const Container = styled(MuiContainer)`
  width: 100%; // Chỉnh lại chiều rộng nếu cần
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledPaper = styled(Paper)`
  width: 100%; // Chiếm 100% không gian của Container để nó không tràn ra ngoài
  max-width: 600px; // Giới hạn chiều rộng tối đa để không quá lớn
  padding: 20px; 
  margin: auto; // Tự động canh giữa
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 10px; 
  background-color: #fff;
`;

export default Quiz;
