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
    await User.findOneAndUpdate({ _id: author }, { $push: { threads: thread._id } });
    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to create thread`);
  }
};

export const fetchThreads = async (pageNumber = 1, pageSize = 10) => {
  connectToDB();

  // fetch only parent threads
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

export const fetchThread = async (id: string) => {
  connectToDB();

  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread!`);
  }
};

export async function addComment(threadId: string, text: string, userId: string, path: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    const comment = new Thread({
      text,
      author: userId,
      parentId: threadId,
    });

    const newComment = await comment.save();
    thread.children.push(newComment._id);
    await thread.save();
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
}
