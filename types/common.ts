export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface MainImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}
