import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThread } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");

  const thread = await fetchThread(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          userId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7">
        <Comment threadId={thread.id} userImg={userInfo.image} userId={JSON.stringify(userInfo._id)} />
      </div>

      <div className="mt-10">
        {thread.children.map((item: any) => (
          <ThreadCard
            key={item._id}
            id={item._id}
            userId={user?.id || ""}
            parentId={item.parentId}
            content={item.text}
            author={item.author}
            community={item.community}
            createdAt={item.createdAt}
            comments={item.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}
