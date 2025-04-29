"use client";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useNavigate } from "react-router";
import { useSession } from "../SessionContext";
import { loginAPI } from "../api/auth/loginAPI";

const fakeAsyncGetSession = async (formData) => {
  console.log("formData : ", formData.get("email"));

  const username = formData.get("email");
  const password = formData.get("password");

  const data = await loginAPI(username, password);
  console.log("data : ", data);

  return {
    user: {
      id:data.user.id , 
      name:data.user.username , 
      email: data.user.username,
      firstName:data.user.firstName , 
      lastName : data.user.lastName , 
      roles : data.user.roles , 
      image:data.user.profileImageUrl , 
      score:data.user.score , 
      devOps: data.user.devOps , 
      userProject:data.user.userProject
    },
  };
};

export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();

  return (
    <SignInPage
    
      slotProps={{ emailField: { label: "Username", type: "text" } }}
      providers={[{ id: "credentials", name: "username" }]}
      signIn={async (provider, formData, callbackUrl) => {
        // Demo session
        try {
          const session = await fakeAsyncGetSession(formData);
          console.log("Session : ", session);
          if (session) {
            setSession(session);
            navigate(callbackUrl || "/", { replace: true });
            return {};
          }
        } catch (error) {
          return {
            error: error instanceof Error ? error.message : "An error occurred",
          };
        }
        return {};
      }}
    />
  );
}
