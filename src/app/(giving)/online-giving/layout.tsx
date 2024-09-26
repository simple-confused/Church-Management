import Navbar from "@/my_components/Navbar/Navbar";
import OnlineGivingProvider from "@/my_components/providers/OnlineGivingProvider";
import axios from "axios";
import { cookies, headers } from "next/headers";
import { ReactNode } from "react";

export const metadata = {
  title: "XYZ | Online Giving",
  description: "Online Giving",
};

async function layout({ children }: { children: ReactNode }) {
  let OnlineGiving: any;
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(`http://${host}/api/v1/online-giving`, {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    });
    if (data.success) {
      OnlineGiving = data.data;
    }
  } catch (err: any) {
    console.log(err);
  }

  if (!OnlineGiving || OnlineGiving.role !== "people") {
    return null;
  }
  return (
    <OnlineGivingProvider
      UserInfo={{
        name: OnlineGiving.User_Info.name,
        _id: OnlineGiving.User_Info._id,
        email: OnlineGiving.User_Info.email,
        phone_number: OnlineGiving.User_Info.phone_number,
      }}
      ChurchInfo={{
        _id: OnlineGiving._id,
        email: OnlineGiving.email,
        imageUrl: OnlineGiving.image,
        name: OnlineGiving.name,
        razorpay_api_key: OnlineGiving.razorpay_api_key,
      }}
    >
      <Navbar
        userInfo={{
          name: OnlineGiving.name,
          imageUrl: OnlineGiving.image,
          role: OnlineGiving.role,
        }}
      />
      <div className="px-2 pt-24 md:px-4 max-w-7xl mx-auto flex items-center justify-center min-h-dvh">
        {children}
      </div>
    </OnlineGivingProvider>
  );
}

export default layout;
