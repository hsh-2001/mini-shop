import { Overview, type IOverview } from "~/model/overview";

export default function useOverview() {
    const overview = ref<Overview>({} as Overview);
    const fetchOverview = async () => {
        try {
            const result = await callGetOverview();
            overview.value = new Overview(result.data);
        } catch (error) {
            console.error("Failed to fetch overview:", error);
        }
    }

    return {
        overview,
        fetchOverview,
    }
}