"use client";
import { useProfileContext } from "@/my_components/providers/ProfileProvider";
import { Key, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { memo } from "react";

function ProfilePage() {
  const { UserInfo } = useProfileContext();

  // console.log(UserInfo);
  const peopleInfo =
    UserInfo?.role === "people"
      ? [
          {
            id: 1,
            title: <Phone />,
            value: UserInfo?.phone_number,
          },
          {
            id: 2,
            title: <Mail />,
            value: UserInfo?.email,
          },
          {
            id: 3,
            title: <UserRound />,
            value:
              new Date().getFullYear() -
              new Date(UserInfo.date_of_birth || "").getFullYear(),
          },
          {
            id: 4,
            title: <UserRound />,
            value: UserInfo.gender,
          },
          {
            id: 5,
            title: <MapPin />,
            value: UserInfo.address,
          },
        ]
      : [
          {
            id: 5,
            title: <Mail />,
            value: UserInfo?.email,
          },
          {
            id: 6,
            title: <Key />,
            value: UserInfo?.razorpay_api_key,
          },
        ];
  return (
    <div className="flex w-full flex-col items-center md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0">
        <img
          src={`${UserInfo?.imageUrl}`}
          alt="User profile"
          className="h-48 w-48 rounded-full border-4 border-gray-200 shadow-lg object-cover"
        />
      </div>
      <div className="flex flex-col w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-zinc-800 mb-4">
          {UserInfo?.name}
        </h1>
        {peopleInfo.map(({ id, title, value }) => (
          <div
            className="flex items-center justify-between py-2 border-b border-zinc-200"
            key={id}
          >
            <span className="font-medium text-zinc-600">{title}</span>
            <p className="ml-4 text-zinc-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ProfilePage);
