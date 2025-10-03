/**
 * Утилиты для работы с изображениями
 */

/**
 * Преобразует относительный путь изображения в полный URL
 * @param imagePath - путь к изображению (может быть относительным или полным URL)
 * @returns полный URL для отображения
 */
export function getFullImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "";
  }

  // Если это уже полный URL (начинается с http/https), возвращаем как есть
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Если это относительный путь к загруженному файлу, добавляем базовый URL
  if (imagePath.startsWith("/uploads/")) {
    return `http://45.140.177.152:3000${imagePath}`;
  }

  // Для других случаев возвращаем как есть
  return imagePath;
}

/**
 * Преобразует массив объектов с изображениями
 * @param items - массив объектов с полем img
 * @returns массив с преобразованными URL изображений
 */
export function transformImageUrls<T extends { img?: string | null }>(
  items: T[]
): T[] {
  return items.map((item) => ({
    ...item,
    img: getFullImageUrl(item.img),
  }));
}

/**
 * Утилиты для работы с изображениями в localStorage
 */

const IMAGE_STORAGE_KEY = "temp_images";

export interface StoredImage {
  id: string;
  file: File;
  previewUrl: string;
  uploadedAt: number;
}

/**
 * Сохраняет изображение в localStorage
 * @param file - файл изображения
 * @returns объект с данными сохраненного изображения
 */
export function saveImageToStorage(file: File): StoredImage {
  const id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const previewUrl = URL.createObjectURL(file);

  const storedImage: StoredImage = {
    id,
    file,
    previewUrl,
    uploadedAt: Date.now(),
  };

  // Получаем существующие изображения
  const existingImages = getStoredImages();

  // Добавляем новое изображение
  const updatedImages = [...existingImages, storedImage];

  // Сохраняем в localStorage
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(updatedImages));

  return storedImage;
}

/**
 * Получает все сохраненные изображения из localStorage
 * @returns массив сохраненных изображений
 */
export function getStoredImages(): StoredImage[] {
  try {
    const stored = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (!stored) return [];

    const images = JSON.parse(stored) as StoredImage[];
    // Восстанавливаем File объекты из base64 (если нужно)
    return images.map((img: StoredImage) => ({
      ...img,
      file: img.file, // File объект должен быть сохранен как есть
    }));
  } catch (error) {
    console.error("Error loading images from localStorage:", error);
    return [];
  }
}

/**
 * Удаляет изображение из localStorage
 * @param id - ID изображения для удаления
 */
export function removeImageFromStorage(id: string): void {
  const existingImages = getStoredImages();
  const imageToRemove = existingImages.find((img) => img.id === id);

  if (imageToRemove) {
    // Освобождаем память для URL объекта
    URL.revokeObjectURL(imageToRemove.previewUrl);
  }

  const updatedImages = existingImages.filter((img) => img.id !== id);
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(updatedImages));
}

/**
 * Очищает все временные изображения из localStorage
 */
export function clearAllStoredImages(): void {
  const existingImages = getStoredImages();

  // Освобождаем память для всех URL объектов
  existingImages.forEach((img) => {
    URL.revokeObjectURL(img.previewUrl);
  });

  localStorage.removeItem(IMAGE_STORAGE_KEY);
}

/**
 * Получает изображение по ID из localStorage
 * @param id - ID изображения
 * @returns изображение или null
 */
export function getStoredImageById(id: string): StoredImage | null {
  const images = getStoredImages();
  return images.find((img) => img.id === id) || null;
}

/**
 * Конвертирует File в base64 строку
 * @param file - файл для конвертации
 * @returns Promise с base64 строкой
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Конвертирует base64 строку в File объект
 * @param base64 - base64 строка
 * @param filename - имя файла
 * @param mimeType - MIME тип
 * @returns File объект
 */
export function base64ToFile(
  base64: string,
  filename: string,
  mimeType: string
): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || mimeType;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Загружает изображение из localStorage на сервер
 * @param storedImage - сохраненное изображение
 * @param axiosInstance - экземпляр axios для запросов
 * @returns Promise с URL загруженного изображения
 */
export async function uploadStoredImageToServer(
  storedImage: StoredImage,
  axiosInstance: {
    post: (
      url: string,
      data: FormData,
      config?: { headers: Record<string, string> }
    ) => Promise<{
      data: {
        data?: { url: string };
        message?: string;
      };
    }>;
  }
): Promise<string> {
  const formData = new FormData();
  formData.append("image", storedImage.file);

  const response = await axiosInstance.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data && response.data.data) {
    return response.data.data.url;
  } else {
    throw new Error(response.data?.message || "Не удалось загрузить файл");
  }
}
