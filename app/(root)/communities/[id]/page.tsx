import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { communityTabs } from "@/constants";
import PrifileHeader from "@/components/shared/PrifileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <PrifileHeader
        authUserId={user.id}
        accountId={communityDetails.id}
        name={communityDetails.name}
        username={communityDetails.username}
        image={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />

      <div className="mt-10">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain" />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.value === "threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityDetails?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadsTab authUserId={user.id} accountId={communityDetails._id} accountType="Community" />
          </TabsContent>
          <TabsContent value="members" className="w-full text-light-1">
            <section className="mt-9 flex flex-col">
              {communityDetails?.members?.map((member: any) => (
                <UserCard
                  id={member._id}
                  name={member.name}
                  username={member.username}
                  image={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>
          <TabsContent value="requests" className="w-full text-light-1">
            <ThreadsTab authUserId={user.id} accountId={communityDetails._id} accountType="Community" />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
