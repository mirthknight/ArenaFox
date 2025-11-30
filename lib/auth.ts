"use client";

export type AuthUser = {
  email: string;
};

const STORAGE_KEY = "arenafox:user";

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    console.warn("Unable to read stored user", error);
    return null;
  }
};

export const setStoredUser = (user: AuthUser) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
};

export const isAuthenticated = () => Boolean(getStoredUser());
