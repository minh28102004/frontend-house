const IMG_BB_API_KEY = "be2171867ff7acbda2a0ce0d2dde34e3"; // 🔑 API key ImgBB
const IMG_BB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

/**
 * 🖼️ Upload một hoặc nhiều ảnh lên ImgBB
 * @param files Danh sách ảnh (FileList hoặc File[])
 * @returns Danh sách URLs ảnh sau khi tải lên thành công
 */
export const uploadImagesToImgBB = async (files: FileList | File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
        // ✅ Kiểm tra định dạng file
        if (!file.type.startsWith("image/")) {
            console.error(`File không hợp lệ: ${file.name}`);
            continue; // Bỏ qua file không phải ảnh
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`${IMG_BB_UPLOAD_URL}?key=${IMG_BB_API_KEY}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                uploadedUrls.push(data.data.url); // ✅ Lưu URL ảnh tải lên thành công
                console.log(`✅ Ảnh ${file.name} đã tải lên thành công: ${data.data.url}`);
            } else {
                console.error(`Lỗi tải ảnh ${file.name}:`, data.error.message);
            }
        } catch (error) {
            console.error(`Lỗi kết nối khi tải ảnh ${file.name}:`, error);
        }
    }

    return uploadedUrls; // ✅ Trả về danh sách URLs ảnh
};
