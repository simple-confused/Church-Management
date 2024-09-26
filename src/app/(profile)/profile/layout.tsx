import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import axios from "axios";
import ProfileProvider from "@/my_components/providers/ProfileProvider";
import SubNavbar from "./SubNavbar";

export const metadata = {
  title: "XYZ | Profile",
  description: "Profile information",
};

async function layout({ children }: { children: ReactNode }) {
  let profileInfo;
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(`http://${host}/api/v1/profile`, {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    });
    if (data.success) {
      profileInfo = data.data;
      // console.log(profileInfo);
    }
  } catch (err: any) {
    console.log(err);
  }

  if (!profileInfo) {
    return null;
  }
  return (
    <ProfileProvider
      UserInfo={{
        _id: profileInfo._id,
        email: profileInfo.email,
        name: profileInfo.name,
        imageUrl: profileInfo.image,
        role: profileInfo.role,
        razorpay_api_key: profileInfo.razorpay_api_key,
        razorpay_secret_key: profileInfo.razorpay_secret_key,
        date_of_birth: profileInfo.date_of_birth,
        phone_number: profileInfo.phone_number,
        gender: profileInfo.gender,
        address: profileInfo.address,
      }}
    >
      <Navbar
        userInfo={{
          name: profileInfo.name,
          imageUrl: profileInfo.image,
          role: profileInfo.role,
        }}
      />
      <div className="px-2 pt-24 md:px-4 max-w-7xl mx-auto flex flex-col min-h-dvh">
        <SubNavbar />
        {children}
      </div>
    </ProfileProvider>
  );
}

export default layout;
