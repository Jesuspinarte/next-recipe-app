import { createClient, createPreviewSubscriptionHook } from "next-sanity";

import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const config = {
  projectId: "e7p1fqlk",
  dataset: "production",
  apiVersion: "2022-04-04",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
};

export const sanityClient = createClient(config);

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

export const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(config).image(source);
