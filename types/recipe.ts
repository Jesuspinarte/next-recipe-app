import { MainImage, SanitySlug } from "./common";
import type { SanityFraction, SanityUnit } from "./enums";
import { IngredientPreview } from "./ingredient";

export interface RecipeParams {
  params: {
    slug: string;
  };
}

export interface RecipePreview {
  _id: string;
  name: string;
  slug: SanitySlug;
  mainImage: MainImage;
}

export interface Recipe {
  _id: string;
  name: string;
  slug: SanitySlug;
  mainImage: MainImage;
  ingredient: {
    _key: string;
    unit?: SanityUnit;
    wholeNumber?: number;
    fraction?: SanityFraction;
    ingredient?: IngredientPreview;
  }[];
  instructions: any;
  likes: number;
}
