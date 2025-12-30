import { User } from "@/types";
import { create } from "zustand";

type UserType = {
    user: User | null;
    token: string;

    setUser: (user: User | null) => void;
    setToken: (string: string) => void;

};

export const useAuth = create<UserType>((set) => ({
    user: null,
    token: "",

    setUser: (user) => set({
        user: user
    }),
    setToken: (token) => set({
        token: token
    }),
}));