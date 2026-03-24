export const getImageUrl = (filename?: string) => {
    if (!filename || filename === "string") return undefined;
    if (filename.startsWith("http")) return filename;

    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
    return `${BASE_URL}/files/preview/${filename}`;
};
