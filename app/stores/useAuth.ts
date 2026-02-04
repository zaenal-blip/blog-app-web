import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserAuth = {
    "id": number,
    "name": string,
    "email": string,
    "image": null | string,
    "role": string,
    "deletedAt":Date | null,
    "createdAt": Date,
    "updatedAt": Date,
    "accessToken": string
};

type Store = {
  user: UserAuth | null;
  login: (payload: UserAuth) => void;
  logout: () => void;
  updateUser: (payload: Partial<UserAuth>) => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      login: (payload) => set(() => ({ user: payload })),
      logout: () => set(() => ({ user: null })),
      updateUser: (payload) => set((state) => ({ 
        user: state.user ? { ...state.user, ...payload } : null 
      })),
    }),
    { name: "blog-storage" }
  )
);