export type CategoryId =
  | "image"
  | "updates"
  | "sdk"
  | "system"
  | "interface"
  | "comms"
  | "media"
  | "adaptation"
  | "qt"
  | "docs"
  | "distro";

export type Repo = {
  name: string;
  description: string;
  stars: number;
  forks: number;
  pushed: string | null;
  language: string | null;
  archived: boolean;
  url: string;
  category: CategoryId;
};

export type Category = {
  id: CategoryId;
  label: string;
  count: number;
  active: number;
};

export type Catalog = {
  categories: Category[];
  repos: Repo[];
};

export type Stats = {
  org: string;
  orgUrl: string;
  claimedPublicRepos: number;
  indexed: number;
  archived: number;
  withoutLanguage: number;
  fetchedAt: string;
  categories: Category[];
};
