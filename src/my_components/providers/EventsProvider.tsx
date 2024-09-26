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

interface EventMonthValue {
  month: string;
  year: string;
}

interface EventInfoValue {
  name: string;
  description: string;
  date_day: number;
  date_month: number;
  date_year: number;
  time: string;
  Tag_Name: string;
  _id: string;
  Tag_Id: string;
}

interface UserInfoValue {
  name: string;
  imageUrl: string;
  role: string;
}

interface CreateContextValue {
  eventMonth: EventMonthValue | null;
  setEventMonth: Dispatch<SetStateAction<EventMonthValue | null>>;
  eventsInfo: EventInfoValue[];
  setEventsInfo: Dispatch<SetStateAction<EventInfoValue[]>>;
  eventIdForUpdate: string;
  setEventIdForUpdate: Dispatch<SetStateAction<string>>;
  UserInfo: UserInfoValue | null;
}

const CreateEventsContext = createContext<CreateContextValue>({
  eventMonth: null,
  setEventMonth: () => {},
  eventsInfo: [],
  setEventsInfo: () => {},
  eventIdForUpdate: "",
  setEventIdForUpdate: () => {},
  UserInfo: null,
});

const CreateEventsContextProvider = CreateEventsContext.Provider;

export const useEventsContext = () => {
  return useContext(CreateEventsContext);
};

function EventsProvider({
  children,
  events,
  UserInfo,
}: {
  children: ReactNode;
  events: EventInfoValue[];
  UserInfo: UserInfoValue | null;
}) {
  const [eventMonth, setEventMonth] = useState<EventMonthValue | null>(null);
  const [eventsInfo, setEventsInfo] = useState<EventInfoValue[]>(events);
  const [eventIdForUpdate, setEventIdForUpdate] = useState<string>("");
  return (
    <CreateEventsContextProvider
      value={{
        eventMonth,
        setEventMonth,
        eventsInfo,
        setEventsInfo,
        setEventIdForUpdate,
        eventIdForUpdate,
        UserInfo,
      }}
    >
      {children}
    </CreateEventsContextProvider>
  );
}

export default memo(EventsProvider);
