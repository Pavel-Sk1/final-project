import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./ImageUpload.module.css";
import {
  useModalNotifications,
  SuccessModal,
  ErrorModal,
  axiosInstance,
} from "@/shared";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  onImageClear: () => void;
  placeholder?: string;
  acceptTypes?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  currentImageUrl = "",
  onImageChange,
  onImageClear,
  placeholder = "Введите URL изображения или загрузите файл",
  acceptTypes = "image/*",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(() => {
    // Для предварительного просмотра добавляем полный URL для локальных файлов
    return currentImageUrl?.startsWith("/uploads/")
      ? `http://localhost:3000${currentImageUrl}`
      : currentImageUrl || "";
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    successModal,
    errorModal,
    showSuccess,
    showError,
    closeSuccess,
    closeError,
  } = useModalNotifications();

  // Обновляем previewUrl при изменении currentImageUrl
  useEffect(() => {
    const fullUrl = currentImageUrl?.startsWith("/uploads/")
      ? `http://localhost:3000${currentImageUrl}`
      : currentImageUrl || "";
    setPreviewUrl(fullUrl);
    setUrlInput(currentImageUrl || "");
  }, [currentImageUrl]);

  // Обработка изменения URL
  const handleUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const url = event.target.value;
      setUrlInput(url);

      // Для предварительного просмотра добавляем полный URL для локальных файлов
      const fullUrl = url.startsWith("/uploads/")
        ? `http://localhost:3000${url}`
        : url;
      setPreviewUrl(fullUrl);
      onImageChange(url);
    },
    [onImageChange]
  );

  // Обработка загрузки файла
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Проверка размера файла
      if (file.size > maxSizeMB * 1024 * 1024) {
        showError(
          "Файл слишком большой",
          `Максимальный размер файла: ${maxSizeMB}MB`
        );
        return;
      }

      // Проверка типа файла
      if (!file.type.startsWith("image/")) {
        showError("Неверный тип файла", "Можно загружать только изображения");
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axiosInstance.post("/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.data) {
          const imageUrl = response.data.data.url;
          // Добавляем полный URL для локальных файлов
          const fullImageUrl = imageUrl.startsWith("/uploads/")
            ? `http://localhost:3000${imageUrl}`
            : imageUrl;

          setUrlInput(imageUrl); // В поле ввода оставляем относительный путь
          setPreviewUrl(fullImageUrl); // Для предварительного просмотра используем полный URL
          onImageChange(imageUrl); // В форму передаем относительный путь
          showSuccess(
            "Изображение загружено",
            "Файл успешно загружен на сервер"
          );
        } else {
          showError(
            "Ошибка загрузки",
            response.data?.message || "Не удалось загрузить файл"
          );
        }
      } catch (error: unknown) {
        console.error("Upload error:", error);
        const errorMessage =
          (
            error as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          )?.response?.data?.message ||
          (error as { message?: string })?.message ||
          "Не удалось загрузить файл. Проверьте подключение к интернету.";
        showError("Ошибка загрузки", errorMessage);
      } finally {
        setIsUploading(false);
        // Очищаем input для возможности повторной загрузки того же файла
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [maxSizeMB, onImageChange, showError, showSuccess]
  );

  // Очистка изображения
  const handleClearImage = useCallback(() => {
    setUrlInput("");
    setPreviewUrl("");
    onImageClear();
  }, [onImageClear]);

  // Открытие диалога выбора файла
  const handleSelectFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={styles.imageUpload}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className={styles.urlInput}
        />
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleSelectFile}
            disabled={isUploading}
            className={styles.uploadButton}
          >
            {isUploading ? "Загрузка..." : "Загрузить"}
          </button>
          {(previewUrl || urlInput) && (
            <button
              type="button"
              onClick={handleClearImage}
              className={styles.clearButton}
            >
              Очистить
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        onChange={handleFileUpload}
        className={styles.hiddenInput}
      />

      {previewUrl && (
        <div className={styles.preview}>
          <img
            src={previewUrl}
            alt="Предварительный просмотр"
            className={styles.previewImage}
            onError={() => {
              setPreviewUrl("");
              // Не показываем ошибку для локальных файлов, которые еще загружаются
              if (!urlInput.startsWith("/uploads/")) {
                showError(
                  "Ошибка загрузки",
                  "Не удалось загрузить изображение по указанному URL"
                );
              }
            }}
          />
        </div>
      )}

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccess}
        title={successModal.title}
        message={successModal.message}
        buttonText={successModal.buttonText}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeError}
        title={errorModal.title}
        message={errorModal.message}
        buttonText={errorModal.buttonText}
      />
    </div>
  );
}
