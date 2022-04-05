/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { PortableText } from "@portabletext/react";
import { NextPage } from "next";
import { useState } from "react";
import { sanityClient, usePreviewSubscription, urlFor } from "../../lib/sanity";
import { Recipe, RecipeParams } from "../../types/recipe";

const recipeQuery = `
  *[_type == "recipe" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
      _key,
      unit,
      wholeNumber,
      fraction,
      ingredient->{
        _id,
        name
      }
    },
    instructions,
    likes
  }
`;

interface RecipePageProps {
  data: {
    recipe: Recipe;
  };
  preview: boolean;
}

const RecipePage: NextPage<RecipePageProps> = ({ data, preview }) => {
  const { data: recipe } = usePreviewSubscription(recipeQuery, {
    params: { slug: data.recipe.slug.current },
    initialData: data.recipe,
    enabled: preview,
  });

  const [likes, setLikes] = useState(recipe.likes || 0);

  const addLike = async () => {
    const res = await fetch("/api/handle-like", {
      method: "POST",
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((err) => console.error(err));

    const data = await res?.json();
    setLikes(data.likes);
  };

  if (!data) {
    return <div>Is Loading...</div>;
  }

  return (
    <article className="recipe">
      <h1>{recipe.name}</h1>
      <button className="like-button" onClick={addLike}>
        {likes} ❤
      </button>
      <main className="content">
        <img src={urlFor(recipe.mainImage).url()} alt={recipe.name} />
        <div className="breakdown">
          <ul className="ingredients">
            {recipe.ingredient?.map((ingredient) => (
              <li key={`ingredient-${ingredient._key}`} className="ingredient">
                {ingredient?.wholeNumber || ""} {ingredient?.fraction || ""}{" "}
                {ingredient?.unit || ""}
                <br />
                {ingredient?.ingredient?.name || ""}
              </li>
            ))}
          </ul>
          <div className="instructions">
            <PortableText value={recipe?.instructions} />
          </div>
        </div>
      </main>
    </article>
  );
};

export default RecipePage;

export const getStaticPaths = async () => {
  const paths = await sanityClient.fetch(
    `*[_type == "recipe" && defined(slug.current)]{
      "params": {
        "slug": slug.current
      }
    }`
  );

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params: { slug } }: RecipeParams) => {
  const recipe = await sanityClient.fetch(recipeQuery, { slug });

  return {
    props: {
      data: {
        recipe,
      },
      preview: true,
    },
  };
};
