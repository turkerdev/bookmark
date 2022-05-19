import { NextApiHandler } from "next";
import { prisma } from "../../lib/db";
import { Input } from "../../lib/validations/createBookmark";

const handler: NextApiHandler<
  "OK" | "Not Found" | "Not Allowed" | "Internal Server Error" | "Bad Request"
> = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(404).send("Not Found");
  }

  const validation = await Input.spa(req.body);

  if (!validation.success) {
    return res.status(400).send("Bad Request");
  }

  const isValid = validation.data.adminKey === process.env.ADMIN_KEY;

  if (!isValid) {
    return res.status(401).send("Not Allowed");
  }

  await prisma.bookmark.create({
    data: {
      name: validation.data.name,
      url: validation.data.url,
      icon: validation.data.icon,
    },
  });

  try {
    await res.unstable_revalidate("/");
    return res.status(200).send("OK");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

export default handler;
