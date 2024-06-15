import { useMutation, useQuery } from "react-query";
import { getHistoryBoard, getWeeklyActivity, getListTest, getListTestDone, getListTestNotDone, getTestDetail, getTestResult, getUserAnswer, getSectionDetail, submitReadingTest, submitListeningTest, submitWritingTest, submitSpeakingTest, getResources, getInstructorTest, searchInstructorTest, createTestResults, createTest, createTestContentByPdf, deleteTest } from "../../apis/test";

export function useGetHistoryBoard() {
  return useQuery("historyBoard", getHistoryBoard);
}

export function useGetWeeklyActivity() {
  return useQuery("weeklyActivity", getWeeklyActivity);
}

export function useGetListTest() {
  return useQuery("listTest", getListTest);
}

export function useGetListTestDone() {
  return useMutation(getListTestDone);
}

export function useGetListTestNotDone() {
  return useMutation(getListTestNotDone);
}

export function useGetTestDetail(testId) {
  return useQuery(["testDetail", testId], () => getTestDetail(testId), {
    enabled: !!testId // chỉ thực hiện query khi testId có giá trị
  });
}

export function useGetTestResult(testId) {
  return useQuery(["testResult", testId], () => getTestResult(testId), {
    enabled: !!testId // chỉ thực hiện query khi testId có giá trị
  });
}

export function useGetUserAnswer() {
  return useMutation(getUserAnswer);
}

export function useGetSectionDetail(testId, sectionId) {
  return useQuery(
    ["sectionDetail", testId, sectionId], 
    () => getSectionDetail({testId, sectionId}), // Chỉnh sửa ở đây để truyền tham số vào hàm
    {
      enabled: !!testId && !!sectionId // Chỉ kích hoạt query khi cả testId và sectionId đều hợp lệ
    }
  );
}

export function useSubmitReadingTest() {
  return useMutation(submitReadingTest);
}

export function useSubmitListeningTest() {
  return useMutation(submitListeningTest);
}

export function useSubmitWritingTest() {
  return useMutation(submitWritingTest);
}

export function useSubmitSpeakingTest() {
  return useMutation(submitSpeakingTest);
}

export function useGetResources() {
  return useQuery("resources", () => getResources());
}

export function useGetInstructorTest(userId) {
  return useQuery(["instructorTest", userId], () => getInstructorTest({userId}), {
    enabled: !!userId // chỉ thực hiện query khi testId có giá trị
  });
}

export function useSearchIntructorTest() {
  return useMutation(searchInstructorTest);
}

export function useCreateTestResults() {
  return useMutation(createTestResults);
}

export function useCreateTest() {
  return useMutation(createTest);
}

export function useCreateTestContentByPdf() {
  return useMutation(createTestContentByPdf);
}

export function useDeleteTest() {
  return useMutation(deleteTest);
}