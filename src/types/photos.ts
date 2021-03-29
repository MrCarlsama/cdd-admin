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
