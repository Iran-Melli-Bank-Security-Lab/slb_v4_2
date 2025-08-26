"use client";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useNavigate } from "react-router";
import { useSession } from "../SessionContext";
import { loginAPI } from "../api/auth/loginAPI";

const fakeAsyncGetSession = async (formData) => {
  console.log("formData line 8 in signIn: ", formData.get("email"));

  const username = formData.get("email");
  const password = formData.get("password");

  const data = await loginAPI(username, password);

  const plainUser = (typeof data.user.toJSON === "function" ? data.user.toJSON() : data.user);

  // const plainUser = data.user._doc;

  const result = {
    token: data?.token,
    user: {
      id: plainUser.id,
      name: plainUser.username,
      email: plainUser.username,
      firstName: plainUser.firstName,
      lastName: plainUser.lastName,
      roles: plainUser.roles,
      image: plainUser.image,
      score: plainUser.score,
      devOps: plainUser.devOps,
      userProject: plainUser.userProject,
    }
  };


  return result;
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
          console.log("Session in line 45 : ", session);

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
