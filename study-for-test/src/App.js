import { Route, Routes, BrowserRouter, Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth, AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SpeakingTest from './pages/SpeakingTest';
import WritingTest from './pages/WritingTest';
import ReadingTest from './pages/ReadingTest';
import ListeningTest from './pages/ListeningTest';
import DashBoard from './pages/Dashboard';
import TestList from './pages/TestList';
import Test from './pages/Test';
import Header from './components/Header';
import Instructor from './pages/Instructor';
import InstructorCreate from './pages/InstructorCreate';
import Resources from './pages/Resources';
import Oauth from './pages/Oauth2';
// import Sample from './pages/Sample';

const queryClient = new QueryClient();

function App() {
  const auth = useAuth();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppWrapper>
          {auth.isAuthenticated && <Header />}
          <Routes>
            {/* Redirect based on authentication status */}
            <Route path="/" element={<PrivateRoute />} />

            {/* Public Routes */}
            <Route path="/sign-in" element={<SignInWrapper />} />
            <Route path="/sign-up" element={<SignUpWrapper />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={DashBoard} />} />
            <Route path="/test-list" element={<ProtectedRoute element={TestList} />} />
            <Route path="/test/:testId" element={<ProtectedRoute element={Test} />} />
            <Route path="/test/">
              <Route path="speaking/:testId/:sectionId" element={<ProtectedRoute element={SpeakingTest} />} />
              <Route path="writing/:testId/:sectionId" element={<WritingTest />} />
              <Route path="reading/:testId/:sectionId" element={<ReadingTest />} />
              <Route path="listening/:testId/:sectionId" element={<ListeningTest />} />
            </Route>
            <Route path="/instructor" element={<ProtectedRoute element={Instructor} />} />
            <Route path="/instructor/create" element={<ProtectedRoute element={InstructorCreate} />} />
            <Route path="/resources" element={<ProtectedRoute element={Resources} />} />
            <Route path="/oauth2" element={<Oauth />} />
            {/* <Route path="/sample" element={<Sample />} /> */}
          </Routes>
        </AppWrapper>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const PrivateRoute = () => {
  const auth = useAuth(); // This should come from your Auth context
  return auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/sign-in" replace />;
};

function SignInWrapper() {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('accessToken');
  return !!token || isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />;
}

function SignUpWrapper() {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('accessToken');
  return !!token || isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />;
}

function ProtectedRoute({ element }) {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('accessToken');
  const RouteElement = element;
  return !!token || isAuthenticated ? (
    <RouteElement />
  ) : (
    <Navigate to="/sign-in" replace />
  );
}