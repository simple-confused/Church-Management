import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function isPeopleExistAggregate(userId: string, peopleId: string) {
  return await OwnerModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "peoples",
        localField: "_id",
        foreignField: "church",
        as: "Peoples",
        pipeline: [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(peopleId),
            },
          },
        ],
      },
    },
    {
      $addFields: {
        Peoples: {
          $first: "$Peoples",
        },
      },
    },
    {
      $project: {
        _id: 0,
        "Peoples._id": 1,
        "Peoples.image": 1,
      },
    },
  ]);
}

export async function peopleDetailsAggregate(
  userId: string,
  gender: string,
  page: number,
  limit: number,
  sort: string
) {
  let sortStage: any;
  if (sort === "recent") {
    sortStage = -1;
  } else if (sort === "oldest") {
    sortStage = 1;
  }
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "peoples",
        localField: "_id",
        foreignField: "church",
        as: "Peoples",
        pipeline: [
          {
            $lookup: {
              from: "chats",
              localField: "_id",
              foreignField: "sender",
              as: "Chats_Info",
              pipeline: [
                {
                  $group: {
                    _id: "$seen",
                    count: {
                      $sum: 1,
                    },
                  },
                },
                {
                  $match: {
                    _id: false,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              UnseenChatCount: {
                $first: "$Chats_Info.count",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        Peoples: {
          $filter: {
            input: "$Peoples",
            as: "people",
            cond: gender ? { $eq: ["$$people.gender", gender] } : {},
          },
        },
      },
    },
    {
      $addFields: {
        PeopleCount: {
          $size: "$Peoples",
        },
      },
    },
    {
      $addFields: {
        Peoples: {
          $slice: [
            {
              $sortArray: { input: "$Peoples", sortBy: sortStage },
            },
            page * limit,
            limit,
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        image: 1,
        "Peoples._id": 1,
        "Peoples.name": 1,
        "Peoples.date_of_birth": 1,
        "Peoples.email": 1,
        "Peoples.image": 1,
        "Peoples.UnseenChatCount": 1,
        PeopleCount: 1,
      },
    },
  ]);
}
