import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) return redirect("/");

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mt-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length === 0 ? (
          <p className="no-result">No activity found!</p>
        ) : (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image src={activity.author.image} alt={"image"} width={20} height={20} className="rounded-full" />

                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">{activity.author.name}</span> replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        )}
      </section>
    </section>
  );
};

export default Page;
