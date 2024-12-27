export interface Website {
  id: number;
  title: string;
  url: string;
  description: string;
  addedAt: string;
  requestedAt: string;
  owner: {
    name: string;
    email: string;
  };
}
