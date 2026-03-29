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