import { User } from "src/users/models/user.entity";

export interface RegisterDto {
    user: User
}

export interface ConfirmDto {
    code: number,
    email: string,
}

export interface LoginDto {
    email: string,
    password: string
}

export interface ChangePasswordDto {
    oldPassword: string,
    newPassword: string,
    repeatPassword: string
}

export interface ChangeMailDto {
    newMail: string;
}