"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { model } from "mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export const createThread = async ({ text, author, communityId, path }: Params) => {
  connectToDB();

  try {
    const thread = await Thread.create({ text, author, community: null });

    // update user
    await User.findOneAndUpdate({ id: author }, { $push: { threads: thread._id } });
    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to create thread`);
  }
};

export const fetchThreads = async (pageNumber = 1, pageSize = 10) => {
  connectToDB();
  const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
  const threads = await threadsQuery.exec();
  const isLastPage = threads.length < pageSize;

  return { threads, totalThreadsCount, isLastPage };
};
