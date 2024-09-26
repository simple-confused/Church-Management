import Navbar from "@/my_components/Navbar/Navbar";
import axios from "axios";
import { cookies, headers } from "next/headers";
import { ReactNode } from "react";

export const metadata = {
  title: "XYZ | Giving",
  description: "Giving",
};

async function layout({ children }: { children: ReactNode }) {
  let Giving: any;
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(`http://${host}/api/v1/giving`, {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    });
    if (data.success) {
      Giving = data.data;
    }
  } catch (err: any) {
    console.log(err);
  }

  if (!Giving || Giving.role === "people") {
    return null;
  }
  return (
    <div>
      <Navbar
        userInfo={{
          name: Giving.name,
          imageUrl: Giving.image,
          role: Giving.role,
        }}
      />
      <div className="px-2 pt-24 md:px-4 max-w-7xl mx-auto flex items-center justify-center min-h-dvh">
        {children}
      </div>
    </div>
  );
}

export default layout;
