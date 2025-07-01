const token = import.meta.env.VITE_HUGGINGFACE_TOKEN;

export async function generateImage() {
    const response = await fetch("https://router.huggingface.co/fal-ai/fal-ai/fast-sdxl", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sync_mode: true,
            // eslint-disable-next-line no-undef
            prompt: prevUser.prompt,
        }),
    });

    const result = await response.blob();
    return URL.createObjectURL(result);
}
