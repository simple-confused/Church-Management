import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function getPeopleInfoAggregateForOwner(
  ownerId: string,
  userId: string
) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
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
            $match: {
              _id: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $lookup: {
              from: "tagjoineds",
              localField: "_id",
              foreignField: "people",
              as: "TagJoineds",
              pipeline: [
                {
                  $lookup: {
                    from: "tagitems",
                    localField: "tag_item",
                    foreignField: "_id",
                    as: "TagItems",
                  },
                },
                {
                  $addFields: {
                    TagItems: {
                      $first: "$TagItems",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "church",
        as: "Payments",
        pipeline: [
          {
            $match: {
              people: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $group: {
              _id: null,
              amount: {
                $sum: "$amount",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        PeopleInfo: {
          $first: "$Peoples",
        },
      },
    },
    {
      $addFields: {
        TotalPayment: {
          $first: "$Payments.amount",
        },
      },
    },
    {
      $addFields: {
        Tags: "$PeopleInfo.TagJoineds.TagItems",
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        image: 1,
        "Tags._id": 1,
        "Tags.name": 1,
        TotalPayment: 1,
        "PeopleInfo._id": 1,
        "PeopleInfo.email": 1,
        "PeopleInfo.name": 1,
        "PeopleInfo.phone_number": 1,
        "PeopleInfo.gender": 1,
        "PeopleInfo.address": 1,
        "PeopleInfo.date_of_birth": 1,
        "PeopleInfo.image": 1,
      },
    },
  ]);
}

export async function getPeopleAttendanceAggregateForOwner(
  ownerId: string,
  userId: string
) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
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
            $match: {
              _id: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $lookup: {
              from: "checkins",
              localField: "_id",
              foreignField: "people",
              as: "Attendance",
              pipeline: [
                {
                  $lookup: {
                    from: "events",
                    localField: "event",
                    foreignField: "_id",
                    as: "Event_Info",
                  },
                },
                {
                  $addFields: {
                    Event_Info: {
                      $first: "$Event_Info",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $addFields: {
        PeopleInfo: {
          $first: "$Peoples",
        },
      },
    },
    {
      $addFields: {
        Attendance: "$PeopleInfo.Attendance",
      },
    },
    {
      $project: {
        _id: 0,
        "Attendance._id": 1,
        "Attendance.createdAt": 1,
        "Attendance.Event_Info.name": 1,
      },
    },
  ]);
}

export async function getPeoplePaymentsAggregateForOwner(
  ownerId: string,
  userId: string
) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "church",
        as: "Payments",
        pipeline: [
          {
            $match: {
              people: new mongoose.Types.ObjectId(userId),
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        "Payments._id": 1,
        "Payments.amount": 1,
        "Payments.createdAt": 1,
      },
    },
  ]);
}
