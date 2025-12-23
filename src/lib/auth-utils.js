
export const setAuthCookie = async (user) => {
  if (typeof window !== "undefined") {
    if (user) {
      const token = await user.getIdToken();
   
      document.cookie = `firebase-token=${token}; path=/; SameSite=Lax`;
    } else {
      document.cookie = "firebase-token=; path=/; max-age=0; SameSite=Lax";
    }
  }
};