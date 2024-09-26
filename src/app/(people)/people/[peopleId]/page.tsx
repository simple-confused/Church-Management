"use client";

import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import {
  Banknote,
  Loader2,
  Mail,
  MapPin,
  Phone,
  TagsIcon,
  UserRound,
} from "lucide-react";

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function Page() {
  const { peopleInfo, TotalPayment, Tags } = usePeopleContext();

  const info = [
    {
      id: 1,
      title: <Phone />,
      value: peopleInfo.phone_number,
    },
    {
      id: 2,
      title: <Mail />,
      value: peopleInfo.email,
    },
    {
      id: 3,
      title: <UserRound />,
      value:
        new Date().getFullYear() -
        new Date(peopleInfo.date_of_birth).getFullYear(),
    },
    {
      id: 4,
      title: <UserRound />,
      value: peopleInfo.gender,
    },
    {
      id: 5,
      title: <MapPin />,
      value: peopleInfo.address,
    },
    {
      id: 6,
      title: <Banknote />,
      value: TotalPayment,
    },
  ];

  return (
    <div className="flex w-full flex-col items-center md:flex-row justify-center h-full p-6 bg-white rounded-lg shadow-lg">
      <div className="w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
        <img
          src={`${peopleInfo.image}`}
          alt="User image"
          className="h-48 w-48 rounded-full object-cover border-4 border-gray-200 shadow-md"
        />
      </div>
      <div className="flex flex-col w-full md:w-1/2 px-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {peopleInfo.name}
        </h1>
        {info.map((e) => (
          <div
            className="py-2 flex items-center justify-between border-b border-gray-200"
            key={e.id}
          >
            <span className="font-medium text-gray-600">{e.title}</span>
            <p className="ml-4 text-gray-800">{e.value}</p>
          </div>
        ))}
        <div className="py-4 flex items-center">
          <TagsIcon className="mr-2 text-gray-600" />
          <div className="flex flex-wrap">
            {Tags?.map(({ _id, name }, i) => (
              <span key={_id} className="mr-1 text-gray-700">
                {name}
                {Tags.length - 1 !== i && <span className="mr-1">,</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
