import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";
import PeopleNavbar from "../../PeopleNavbar";
import { cookies, headers } from "next/headers";
import axios from "axios";
import PeopleProvider from "@/my_components/providers/PeopleProvider";

export const metadata = {
  title: "XYZ | People",
  description: "People",
};

async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { peopleId: string };
}) {
  let peopleInfo;
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(
      `http://${host}/api/v1/people/${params.peopleId}`,
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    if (data.success) {
      peopleInfo = data.data;
    }
  } catch (err: any) {
    console.log(err);
  }
  return (
    <PeopleProvider
      peopleInfo={peopleInfo?.PeopleInfo}
      role={peopleInfo?.role}
      TotalPayment={peopleInfo?.TotalPayment}
      Tags={peopleInfo?.Tags}
    >
      <div>
        <Navbar
          userInfo={{
            imageUrl: peopleInfo?.image,
            name: peopleInfo?.name,
            role: peopleInfo?.role,
          }}
        />
        <PeopleNavbar type="edit" />
        <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-[75dvh] flex items-center justify-center">
          {children}
        </div>
      </div>
    </PeopleProvider>
  );
}

export default layout;
