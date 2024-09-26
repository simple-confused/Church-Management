import OwnerModel from "@/model/Owner";
import PeopleModel from "@/model/People";
import mongoose from "mongoose";

export async function isChurchAndTagValid(ownerId: string, tagId: string) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "tagitems",
        localField: "_id",
        foreignField: "church",
        as: "Tag_Item",
      },
    },
    {
      $addFields: {
        isTagExist: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(tagId), "$Tag_Item._id"],
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
        isTagExist: 1,
      },
    },
  ]);
}

export async function getTagsInfoAggregateForOwner(ownerId: string) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "taggroups",
        localField: "_id",
        foreignField: "church",
        as: "SubItems",
        pipeline: [
          {
            $lookup: {
              from: "tagitems",
              localField: "_id",
              foreignField: "tag_group",
              as: "SubItem",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "tagitems",
        localField: "_id",
        foreignField: "church",
        as: "items",
        pipeline: [
          {
            $redact: {
              $cond: {
                if: {
                  $gt: ["$tag_group", null],
                },
                then: "$$PRUNE",
                else: "$$KEEP",
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        image: 1,
        "items._id": 1,
        "items.name": 1,
        "SubItems.SubItem._id": 1,
        "SubItems.SubItem.name": 1,
        "SubItems.name": 1,
        "SubItems._id": 1,
      },
    },
  ]);
}

export async function getTagsInfoAggregateForPeople(peopleId: string) {
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
        as: "Tags",
        pipeline: [
          {
            $lookup: {
              from: "tagitems",
              localField: "tag_item",
              foreignField: "_id",
              as: "Tags_Info",
            },
          },
          {
            $addFields: {
              Tags_Info: {
                $first: "$Tags_Info",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        items: "$Tags.Tags_Info",
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        image: 1,
        "items.name": 1,
        "items._id": 1,
      },
    },
  ]);
}

export async function getPeopleInfoFromTagsForOwner(
  ownerId: string,
  tagId: string
) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "tagitems",
        localField: "_id",
        foreignField: "church",
        as: "Tag_Info",
        pipeline: [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(tagId),
            },
          },
          {
            $lookup: {
              from: "tagjoineds",
              localField: "_id",
              foreignField: "tag_item",
              as: "Tag_Joined",
              pipeline: [
                {
                  $lookup: {
                    from: "peoples",
                    localField: "people",
                    foreignField: "_id",
                    as: "People",
                  },
                },
                {
                  $addFields: {
                    People: {
                      $first: "$People",
                    },
                  },
                },
                {
                  $unwind: "$People",
                },
              ],
            },
          },
        ],
      },
    },
    {
      $addFields: {
        People_Info: {
          $first: "$Tag_Info.Tag_Joined.People",
        },
      },
    },
    {
      $addFields: {
        Tag_Info: {
          $first: "$Tag_Info",
        },
      },
    },
    {
      $project: {
        _id: 0,
        "Tag_Info.name": 1,
        "Tag_Info._id": 1,
        "People_Info._id": 1,
        "People_Info.name": 1,
        "People_Info.email": 1,
        "People_Info.image": 1,
        "People_Info.date_of_birth": 1,
      },
    },
  ]);
}
