const deviceHelper = () => {
    const isMobile = ref(false);
    const screenWidth = ref(window.innerWidth);
    window.addEventListener("resize", () => {
        screenWidth.value = window.innerWidth;
    });

    watch(
        screenWidth,
        (newWidth) => {
            if (newWidth < 700) {
                isMobile.value = true;
            } else {
                isMobile.value = false;
            }
        },
        { deep: true, immediate: true },
    );
    return { isMobile };
};

export default deviceHelper;