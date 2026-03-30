import axios from "axios";

export const handleUploadImage = async (file: File | null, path = "") => {
    if (!file) return;
    try {
        const { data } = await callUpload(file, path);
        if (!data?.filename) {
            console.warn("No filename returned from upload");
            return;
        }
        const imageResponse = await getImageFile(data.filename) ?? "";
        return {
            filename: data.filename,
            imageUrl: imageResponse.data?.url ?? "",
        }
    } catch (error) {
        console.error("Image upload failed:", error);
    }
};

export const getFallbackImage = (e: Event) => {
    const target = e.target as HTMLImageElement;
    target.src = 'images/no_image.jpg';
}

export const downLoadCSV = async (fileName: string, page: string) => {
    const response = await api.get(`/export/csv?page=${page}`, {
        responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "text/csv" });
    const fileNameWithDate = `${fileName}_${new Date().toISOString().split("T")[0]}.csv`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileNameWithDate;
    link.click();
    URL.revokeObjectURL(url);
};