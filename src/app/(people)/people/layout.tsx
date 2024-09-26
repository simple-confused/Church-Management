import Navbar from "@/my_components/Navbar/Navbar";
import PeopleProvider from "@/my_components/providers/PeopleProvider";
import axios from "axios";
import { headers, cookies } from "next/headers";

export const metadata = {
  title: "XYZ | People",
  description: "People",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let peopleInfo;
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(`http://${host}/api/v1/people`, {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    });
    if (data.success) {
      peopleInfo = data.data;
    }
  } catch (err: any) {
    console.log(err);
  }

  if (!peopleInfo) {
    return null;
  }

  return (
    <PeopleProvider
      role={peopleInfo.role}
      peopleInfo={peopleInfo?.Peoples}
      PeopleCount={peopleInfo?.PeopleCount}
    >
      <Navbar
        userInfo={{
          name: peopleInfo.name,
          imageUrl: peopleInfo.image,
          role: peopleInfo.role,
        }}
      />
      <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">
        <div className="pt-24 flex flex-col">{children}</div>
      </div>
    </PeopleProvider>
  );
}
