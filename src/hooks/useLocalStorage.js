import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  const readValue = () => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const saved = window.localStorage.getItem(key);

      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.error("Gagal membaca localStorage:", error);
      return initialValue;
    }
  };

  const [value, setValue] = useState(readValue);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Gagal menyimpan localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;