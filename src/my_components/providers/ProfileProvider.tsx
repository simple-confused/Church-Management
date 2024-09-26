"use client";

import { ReactNode, createContext, memo, useContext } from "react";

interface UserInfoValue {
  _id: string;
  name: string;
  imageUrl: string;
  email: string;
  role: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  razorpay_api_key?: string;
  razorpay_secret_key?: string;
}

interface CreateContextValue {
  UserInfo: UserInfoValue | null;
}

const CreateProfileContext = createContext<CreateContextValue>({
  UserInfo: null,
});

const CreateProfileContextProvider = CreateProfileContext.Provider;

export const useProfileContext = () => {
  return useContext(CreateProfileContext);
};

function ProfileProvider({
  children,
  UserInfo,
}: {
  children: ReactNode;
  UserInfo: UserInfoValue | null;
}) {
  return (
    <CreateProfileContextProvider
      value={{
        UserInfo,
      }}
    >
      {children}
    </CreateProfileContextProvider>
  );
}

export default memo(ProfileProvider);
