"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({ userId, username, name, bio, image, path }: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate({ id: userId }, { $set: { name, username, bio, image, onBoarded: true } }, { upsert: true });

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export const fetchUser = async (userId: string) => {
  // const res = await fetch(`/api/user/${userId}`);
  // const data = await res.json();
  return {};
};
