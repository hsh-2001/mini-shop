import axios from "axios";

export const handleUploadImage = async (file: File | null, path = "") => {
    if (!file) return;
    try {
        const { data } = await callUpload(file, path);
        if (!data?.filename) {
            return;
        }
        return {
            filename: data.filename,
            url: data.url,
        }
    } catch (error) {
        console.error("Image upload failed:", error);
    }
};

export const getFallbackImage = (e: Event) => {
    const target = e.target as HTMLImageElement;
    target.src = 'images/no_image.jpg';
}

export const getImageUrl = (filename: string) => {
    const og = window.location.origin;
    return `${og}/api/upload/read?filename=${filename}`;
};

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

export const formatInputNumber = (value: string, allowDot: boolean = true) => {
    value = value.replace(allowDot ? /[^0-9.]/g : /[^0-9]/g, '')
    const parts = value.split('.')
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
    }
    return value
}