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
    return `http://localhost:3000${imagePath}`;
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
