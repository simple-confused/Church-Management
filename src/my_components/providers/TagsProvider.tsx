"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  memo,
  useContext,
  useState,
} from "react";

interface ItemValue {
  _id: string;
  name: string;
}

interface UserInfoValue {
  name: string;
  imageUrl: string;
  role: string;
}

interface TagsContextValue {
  dialogType: "tags" | "groups";
  setDialogType: Dispatch<SetStateAction<"tags" | "groups">>;
  isFormError: boolean;
  setIsFormError: Dispatch<SetStateAction<boolean>>;
  groupOptions: {
    _id: string;
    name: string;
  }[];
  tagsInfo: ItemValue[];
  groupsInfo: {
    _id: string;
    name: string;
    SubItem: ItemValue[];
  }[];
  UserInfo: UserInfoValue | null;
  tagIdForUpdate: string;
  setTagIdForUpdate: Dispatch<SetStateAction<string>>;
  groupIdForUpdate: string;
  setGroupIdForUpdate: Dispatch<SetStateAction<string>>;
}

const CreateTagsContext = createContext<TagsContextValue>({
  dialogType: "tags",
  setDialogType: () => {},
  isFormError: false,
  setIsFormError: () => {},
  groupOptions: [],
  tagsInfo: [],
  groupsInfo: [],
  UserInfo: null,
  tagIdForUpdate: "",
  setTagIdForUpdate: () => {},
  groupIdForUpdate: "",
  setGroupIdForUpdate: () => {},
});

const TagsContextProvider = CreateTagsContext.Provider;

export const useTagsContext = () => {
  return useContext(CreateTagsContext);
};

function TagsProvider({
  children,
  groupOptions,
  tagsInfo,
  groupsInfo,
  UserInfo,
}: {
  children: ReactNode;
  tagsInfo: ItemValue[];
  groupOptions: {
    _id: string;
    name: string;
  }[];
  groupsInfo: {
    _id: string;
    name: string;
    SubItem: ItemValue[];
  }[];
  UserInfo: UserInfoValue;
}) {
  const [isFormError, setIsFormError] = useState(false);
  const [dialogType, setDialogType] = useState<"tags" | "groups">("tags");
  const [tagIdForUpdate, setTagIdForUpdate] = useState<string>("");
  const [groupIdForUpdate, setGroupIdForUpdate] = useState<string>("");
  return (
    <TagsContextProvider
      value={{
        dialogType,
        setDialogType,
        isFormError,
        setIsFormError,
        groupOptions,
        tagsInfo,
        groupsInfo,
        UserInfo,
        tagIdForUpdate,
        setTagIdForUpdate,
        groupIdForUpdate,
        setGroupIdForUpdate,
      }}
    >
      {children}
    </TagsContextProvider>
  );
}

export default memo(TagsProvider);
