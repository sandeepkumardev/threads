"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

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
