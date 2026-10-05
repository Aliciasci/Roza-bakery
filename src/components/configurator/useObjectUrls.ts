"use client";

import { useEffect, useState } from "react";

/** URLs d'aperçu locales pour des fichiers, libérées proprement (compatible StrictMode). */
export function useObjectUrls(files: File[]): string[] {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const created = files.map((f) => URL.createObjectURL(f));
    setUrls(created);
    return () => created.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);
  return urls;
}
