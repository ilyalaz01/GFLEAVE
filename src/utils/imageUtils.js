// src/utils/imageUtils.js

/**
 * Конвертирует blob в base64 строку
 * @param {Blob} blob - Blob объект изображения
 * @returns {Promise<string>} Base64 строка
 */
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Сжимает изображение до указанного размера
 * @param {File} file - Файл изображения
 * @param {number} maxSizeKB - Максимальный размер в KB (по умолчанию 500)
 * @returns {Promise<Blob>} Сжатое изображение как Blob
 */
export const compressImage = (file, maxSizeKB = 500) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Вычисляем новые размеры
      let { width, height } = img;
      const maxDimension = 1200;
      
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Рисуем изображение на canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Начинаем с качества 0.8 и постепенно уменьшаем
      let quality = 0.8;
      
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          const sizeKB = blob.size / 1024;
          
          // Если размер подходит или качество уже минимальное
          if (sizeKB <= maxSizeKB || quality <= 0.1) {
            console.log(`📊 Итоговый размер: ${sizeKB.toFixed(1)}KB при качестве ${(quality * 100).toFixed(0)}%`);
            resolve(blob);
          } else {
            quality -= 0.1;
            tryCompress();
          }
        }, 'image/jpeg', quality);
      };
      
      tryCompress();
    };
    
    img.onerror = () => {
      console.error('Ошибка загрузки изображения');
      resolve(file); // Возвращаем оригинальный файл в случае ошибки
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Создает превью изображения
 * @param {File} file - Файл изображения
 * @returns {Promise<string>} URL для превью
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Проверяет, является ли файл изображением
 * @param {File} file - Файл для проверки
 * @returns {boolean} true если файл - изображение
 */
export const isImageFile = (file) => {
  return file && file.type.startsWith('image/');
};

/**
 * Форматирует размер файла в читаемый вид
 * @param {number} bytes - Размер в байтах
 * @returns {string} Отформатированный размер
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Проверяет поддержку WebP браузером
 * @returns {Promise<boolean>} true если WebP поддерживается
 */
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Получает EXIF данные изображения (упрощенная версия)
 * @param {File} file - Файл изображения
 * @returns {Promise<Object>} EXIF данные
 */
export const getImageMetadata = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(2),
        size: formatFileSize(file.size),
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleDateString('ru-RU')
      });
    };
    
    img.onerror = () => {
      resolve({
        width: 0,
        height: 0,
        aspectRatio: '0',
        size: formatFileSize(file.size),
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleDateString('ru-RU')
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
};