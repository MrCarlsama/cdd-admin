import { Artists } from "./artists";
export interface Photos {
  artists: Artists[];
  id: number;
  url: string;
  createDate: Date;
  status: boolean;
  isAudit: boolean;
  description: string;
}

export interface RandomPhotosResult {
  data: Photos | null;
  total: number;
  nicknames: string[];
  name: string;
}

export class RandomPhotos implements RandomPhotosResult {
  data = null;
  total = 0;
  nicknames = [];
  name = "";
}
