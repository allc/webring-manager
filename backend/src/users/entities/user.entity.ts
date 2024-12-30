export class UserEntity {
    name: string;
    id: number;
    email: string;
    superuser: boolean;
    createdAt: Date;
    activeAt: Date;
    accessToken: string;
}
