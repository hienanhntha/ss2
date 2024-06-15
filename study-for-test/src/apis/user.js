import { jwtDecode } from "jwt-decode";
import api from "./api"

export async function signIn({email, password}) {
  const request = {
    email: email,
    password: password
  }
  const { data } = await api.post('/users/signin', request);
  return data;
}

export async function signUp({fullName, email, password}) {
  const request = {
    fullName: fullName,
    email: email,
    password: password,
  }
  const { data } = await api.post('/users/signup', request);
  return data;
}

export async function signOut() {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error("No token found");
    return null; // Hoặc xử lý khác phù hợp với ứng dụng của bạn
  }

  const { data } = await api.get('/users/signout');
  return data;
}

export async function signInWithGoogle() {
  // window.location.href = `https://study-for-test-backend-1.onrender.com/users/google`;
  window.location.href = `http://localhost:8080/users/google`;
}

export async function getUserInfo() {
  const token = localStorage.getItem('token');
  const decryptedData = jwtDecode(token, process.env.JWT_SECRET_KEY);

  const { data } = await api.get(`/users/user-info/${decryptedData.userId}`);
  return data;
}
