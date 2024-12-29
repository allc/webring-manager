import { Website } from "./Website";

interface User {
  id: number;
  email: string;
  name: string;
  superuser: boolean;
  createdAt: string;
  activeAt: string;
  website: Website[];
  accessToken: string;
}
