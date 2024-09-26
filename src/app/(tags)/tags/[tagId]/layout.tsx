import PeopleProvider from "@/my_components/providers/PeopleProvider";
import axios from "axios";
import dynamic from "next/dynamic";
import { cookies, headers } from "next/headers";
import { ReactNode } from "react";

const SpecificNavbarForTag = dynamic(
  () => import("@/my_components/Navbar/SpecificNavbarForTag")
);

async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { tagId: string };
}) {
  let response;
  const host = headers().get("host");
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  try {
    const { data } = await axios.get(
      `http://${host}/api/v1/tags/tag-item?tagItem=${params.tagId}`,
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    if (data.success) {
      response = data.data;
    }
  } catch (err) {
    console.log(err);
  }
  if (!response) {
    return null;
  }
  console.log(response.Tag_Info);
  return (
    <PeopleProvider
      peopleInfo={response.People_Info}
      tagInfo={response.Tag_Info}
      role={response.role}
    >
      <SpecificNavbarForTag />
      {children}
    </PeopleProvider>
  );
}

export default layout;
