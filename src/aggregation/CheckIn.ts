import PeopleModel from "@/model/People";
import mongoose from "mongoose";

export async function isEventAndTagValidForThePeople(
  peopleId: string,
  eventId: string
) {
  return await PeopleModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(peopleId),
      },
    },
    {
      $lookup: {
        from: "tagjoineds",
        localField: "_id",
        foreignField: "people",
        as: "TagInfo",
        pipeline: [
          {
            $lookup: {
              from: "events",
              localField: "tag_item",
              foreignField: "tag",
              as: "Events_Info",
            },
          },
          {
            $unwind: "$Events_Info",
          },
        ],
      },
    },
    {
      $addFields: {
        isValid: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(eventId || ""),
                "$TagInfo.Events_Info._id",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        isValid: 1,
      },
    },
  ]);
}
