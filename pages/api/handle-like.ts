import type { NextApiRequest, NextApiResponse } from 'next'
import { sanityClient } from "../../lib/sanity";

interface LikeData {
  likes: number;
}

export default async function likeButtonHandler(req: NextApiRequest, res: NextApiResponse<LikeData>) {
  const { _id } = JSON.parse(req.body);
  const data = await sanityClient
    .patch(_id)
    .setIfMissing({ likes: 0 })
    .inc({ likes: 1 })
    .commit()
    .catch((err) => console.error(err));

  res.status(200).json({ likes: data?.likes });
};
