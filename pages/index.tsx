import cookie from "cookie";
import { useEffect, useState } from "react";
import Link from "next/link";
import { prisma } from "../lib/db";
import { GetStaticProps, NextPage } from "next";

interface Props {
  bookmarks: {
    name: string;
    icon: string;
    url: string;
  }[];
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const bookmarks = await prisma.bookmark.findMany({
    select: {
      name: true,
      icon: true,
      url: true,
    },
  });

  return {
    props: {
      bookmarks,
    },
  };
};

const Home: NextPage<Props> = ({ bookmarks }) => {
  const [adminKey, setAdminKey] = useState("");

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    setAdminKey(cookies.admin_key);
  }, []);

  return (
    <div>
      {adminKey && (
        <div className="flex h-12 items-center px-4 border-b border-neutral-600">
          <Link href="/create">
            <a className="bg-cyan-600 py-1 px-2 rounded">Admin</a>
          </Link>
        </div>
      )}
      <div className="flex flex-wrap gap-3 p-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.url}
            className="w-60 border-neutral-600 border rounded p-2"
          >
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="icon of the bookmark"
                src={bookmark.icon}
                width={48}
                height={48}
                className="inline-block rounded border border-neutral-700"
              ></img>
              <Link href={bookmark.url}>
                <a className="ml-2">
                  👉{" "}
                  <p className="text-ellipsis overflow-hidden inline-block w-24 align-middle text-center">
                    {bookmark.name}
                  </p>{" "}
                  👈
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
