import PrifileHeader from "@/components/shared/PrifileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return redirect("/");

  const userInfo = await fetchUser(params.id);
  if (!userInfo) return redirect("/onboarding");

  return (
    <section>
      <PrifileHeader
        authUserId={user.id}
        accountId={userInfo.id}
        name={userInfo.name}
        username={userInfo.username}
        image={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-10">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain" />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.value === "threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
              <ThreadsTab authUserId={user.id} accountId={userInfo.id} accountType="User" />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
