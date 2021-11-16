enum UserType {
    Admin = "Admin",
    User = "User",
    Any = "Any",
}

export interface IUser {
    id: number,
    username: string,
    name: string;
    email: string;
    role: UserType;
}