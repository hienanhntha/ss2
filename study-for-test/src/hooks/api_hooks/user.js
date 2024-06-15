import { useMutation, useQuery } from "react-query";
import { signIn, signOut, signUp, getUserInfo } from "../../apis/user";

export function useSignIn() {
  return useMutation(signIn);
}

export function useSignOut() {
  return useMutation(signOut);
}

export function useSignUp() {
  return useMutation(signUp);
}

export function useGetUserInfo() {
  return useQuery("userInfo", getUserInfo);
}