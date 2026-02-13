import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance2 } from "~/lib/axios";

export type UserAuth = {
  "id": number,
  "name": string,
  "email": string,
  "image": null | string,
  "role": string,
  "deletedAt": Date | null,
  "createdAt": Date,
  "updatedAt": Date,
};

type Store = {
  user: UserAuth | null;
  login: (payload: UserAuth) => void;
  logout: () => Promise<void>;
  updateUser: (payload: Partial<UserAuth>) => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      login: (payload) => set(() => ({ user: payload })),
      logout: async () => {
        try {
          await axiosInstance2.post("/auth/logout");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set(() => ({ user: null }));
          window.location.href = "/";
        }
      },
      updateUser: (payload) => set((state) => ({
        user: state.user ? { ...state.user, ...payload } : null
      })),
    }),
    { name: "blog-storage" }
  )
);