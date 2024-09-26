import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import axios from "axios";

export const metadata = {
  title: "XYZ | Check In",
  description: "Check In",
};

async function layout({ children }: { children: ReactNode }) {
  let checkInInfo;
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(`http://${host}/api/v1/check-in`, {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    });
    if (data.success) {
      checkInInfo = data.data;
    }
  } catch (err: any) {
    console.log(err);
  }

  if (!checkInInfo) {
    return null;
  }
  return (
    <div>
      <Navbar
        userInfo={{
          name: checkInInfo.name,
          imageUrl: checkInInfo.image,
          role: checkInInfo.role,
        }}
      />
      <div className="px-2 pt-24 md:px-4 max-w-7xl mx-auto flex items-center justify-center min-h-dvh">
        {children}
      </div>
    </div>
  );
}

export default layout;
