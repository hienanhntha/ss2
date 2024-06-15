import { jwtDecode } from "jwt-decode";
import api from "./api"

export async function getHistoryBoard() {
  const token = localStorage.getItem('token');
  const decryptedData = jwtDecode(token, process.env.JWT_SECRET_KEY);

  const { data } = await api.get(`/tests/get-history-board/${decryptedData.userId}`);
  return data;
} 

export async function getWeeklyActivity() {
  const token = localStorage.getItem('token');
  const decryptedData = jwtDecode(token, process.env.JWT_SECRET_KEY);

  const { data } = await api.get(`/tests/get-weekly-activity/${decryptedData.userId}`);
  return data;
}

export async function getListTest() {
  const token = localStorage.getItem('token');
  const decryptedData = jwtDecode(token, process.env.JWT_SECRET_KEY);
 
  const { data } = await api.get(`/tests/get-list-test/${decryptedData.userId}`);
  return data;
}

export async function getListTestDone() {
  const token = localStorage.getItem('token');
  const decryptedData = jwtDecode(token, process.env.JWT_SECRET_KEY);

  const { data } = await api.post(`/tests/get-list-test-done`, {
    userId: decryptedData.userId
  });
  console.log(data);
  return data;
}

export async function getListTestNotDone() {
  const token = localStorage.getItem('token');
  const decryptedData = jwtDecode(token, process.env.JWT_SECRET_KEY);

  const { data } = await api.post(`/tests/get-list-test-not-done`, {
    userId: decryptedData.userId
  });
  return data;
}

export async function getTestDetail(testId) {
  const userId = jwtDecode(localStorage.getItem('token'), process.env.JWT_SECRET_KEY).userId;
  const { data } = await api.get( `/tests/get-test-detail/${userId}/${testId}`);
  return data;
}

export async function getTestResult(testId) {
  const { data } = await api.get( `/tests/get-test-results/${testId}`);
  return data;
}

export async function getUserAnswer({userId, testId}) {
  const { data } = await api.post( `/tests/get-user-answer`, {
    userId: Number(userId),
    testId: Number(testId)
  });
  return data;
}

export async function getSectionDetail({testId, sectionId}) {
  const { data } = await api.get( `/tests/get-section-detail/${testId}/${sectionId}`);
  return data;
}

export async function submitReadingTest({userId, testId, sectionId, userAnswer}) {
  const { data } = await api.post( `/tests/submit-quiz-test`, {
    userId: Number(userId),
    testId: Number(testId),
    sectionId: Number(sectionId),
    userAnswer
  });
  return data;
}

export async function submitListeningTest({userId, testId, sectionId, userAnswer}) {
  const { data } = await api.post( `/tests/submit-quiz-test`, {
    userId: Number(userId),
    testId: Number(testId),
    sectionId: Number(sectionId),
    userAnswer
  });
  return data;
}

export async function submitWritingTest({userId, testId, sectionId, userAnswer, fileZip}) {
  const formData = new FormData();

  formData.append('userId', userId);
  formData.append('testId', testId);
  formData.append('sectionId', sectionId);
  formData.append('userAnswer', JSON.stringify(userAnswer));
  formData.append('fileZip', fileZip);

  console.log({userId, testId, sectionId, userAnswer, fileZip});

  const { data } = await api.post('/tests/submit-writing-test', formData, {
    headers: {
      'Accept': 'application/json'
    }
  });
  return data;
}

export async function submitSpeakingTest({userId, testId, sectionId, fileZip}) {
  const formData = new FormData();

  formData.append('userId', userId);
  formData.append('testId', testId);
  formData.append('sectionId', sectionId);
  formData.append('fileZip', fileZip);

  const { data } = await api.post('/tests/submit-speaking-test', formData, {
    headers: {
      'Accept': 'application/json'
    }
  });
  return data;
}

export async function getResources() {
  const { data } = await api.get('/tests/get-resources');
  console.log(data);
  return data;
}
 
export async function getInstructorTest({userId}) {
  const { data } = await api.get(`/tests/get-intructor-test/${userId}`);
  return data;
}

export async function searchInstructorTest({input}) {
  const { data } = await api.post(`/tests/search-instructor-test/`, {
    input: input
  });
  return data;
}

export async function createTest({testName}) {
  const userId = jwtDecode(localStorage.getItem('token'), process.env.JWT_SECRET_KEY).userId;
  const { data } = await api.post(`/tests/create-test`, {
    testName: testName,
    createdBy: Number(userId),
  });
  return data;
}

export async function createTestContentByPdf({testId, audioUrl, pdfFiles}) {
  const userId = jwtDecode(localStorage.getItem('token'), process.env.JWT_SECRET_KEY).userId;
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('testId', testId);
  formData.append('audioUrl', audioUrl);

  // Append each file as a separate entry under the same key "pdfFiles"
  pdfFiles.forEach((file, index) => {
    formData.append(`pdfFiles`, file);
  });

  const { data } = await api.post(`/tests/create-test-content-by-pdf`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

export async function createTestResults({testId, file}) {
  const formData = new FormData();

  formData.append('testId', testId);
  formData.append('file', file);

  const { data } = await api.post(`/tests/create-test-results`, formData, {
    headers: {
      'Accept': 'application/json'
    }
  });
  return data;
}

export async function deleteTest({testId}) {
  const { data } = await api.delete(`/tests/delete-test/${testId}`);
  return data;
}