"use client";

import { ReactNode, createContext, memo, useContext } from "react";

interface UserInfo {
  name: string;
  _id: string;
  email: string;
  phone_number: string;
}

interface ChurchInfo {
  _id: string;
  name: string;
  imageUrl: string;
  email: string;
  razorpay_api_key?: string;
}

interface OnlineGivingValue {
  UserInfo: UserInfo | null;
  ChurchInfo: ChurchInfo | null;
}

const CreateOnlineGivingContext = createContext<OnlineGivingValue>({
  UserInfo: null,
  ChurchInfo: null,
});

const OnlineGiving_Provider = CreateOnlineGivingContext.Provider;

export const useOnlineGivingContext = () => {
  return useContext(CreateOnlineGivingContext);
};

function OnlineGivingProvider({
  children,
  UserInfo,
  ChurchInfo,
}: {
  children: ReactNode;
  UserInfo: UserInfo;
  ChurchInfo: ChurchInfo;
}) {
  return (
    <OnlineGiving_Provider value={{ ChurchInfo, UserInfo }}>
      {children}
    </OnlineGiving_Provider>
  );
}

export default memo(OnlineGivingProvider);
