import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  userId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    name: string;
    image: string;
    id: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard = ({ id, userId, parentId, content, author, community, createdAt, comments, isComment }: Props) => {
  return (
    <article className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"}`}>
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image src={author.image} alt={author.name} fill className="rounded-full cursor-pointer" />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h3 className="text-base-semibold text-light-1 cursor-pointer">{author.name}</h3>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className={`${isComment && "mb-8"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Image src="/assets/heart-gray.svg" alt="comment" width={16} height={16} className="cursor-pointer" />
                <Link href={`/thread/${id}`}>
                  <Image src="/assets/reply.svg" alt="comment" width={16} height={16} className="cursor-pointer" />
                </Link>
                <Image src="/assets/repost.svg" alt="comment" width={16} height={16} className="cursor-pointer" />
                <Image src="/assets/share.svg" alt="comment" width={16} height={16} className="cursor-pointer" />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-small-regular text-light-2 cursor-pointer">View all {comments.length} comments</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
