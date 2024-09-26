import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";
import TagsProvider from "@/my_components/providers/TagsProvider";

export const metadata = {
  title: "XYZ | Tags",
  description: "Tags",
};

async function layout({ children }: { children: ReactNode }) {
  const data = await (await import("@/helpers/db")).getTagsPage();
  if (!data) {
    return null;
  }
  return (
    <TagsProvider
      groupOptions={data.SubItems}
      groupsInfo={data.SubItems}
      tagsInfo={data.items}
      UserInfo={{
        name: data.name,
        imageUrl: data.image,
        role: data.role,
      }}
    >
      <Navbar
        userInfo={{
          name: data.name,
          imageUrl: data.image,
          role: data.role,
        }}
      />

      <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">
        <div className="pt-20 flex flex-col">{children}</div>
      </div>
    </TagsProvider>
  );
}

export default layout;
