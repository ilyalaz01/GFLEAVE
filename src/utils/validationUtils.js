// src/utils/validationUtils.js

/**
 * Проверяет, является ли строка пустой или содержит только пробелы
 * @param {string} value - Строка для проверки
 * @returns {boolean} true если строка пустая
 */
export const isEmpty = (value) => {
  return !value || value.toString().trim() === '';
};

/**
 * Проверяет минимальную длину строки
 * @param {string} value - Строка для проверки
 * @param {number} minLength - Минимальная длина
 * @returns {boolean} true если длина соответствует
 */
export const isMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

/**
 * Проверяет максимальную длину строки
 * @param {string} value - Строка для проверки
 * @param {number} maxLength - Максимальная длина
 * @returns {boolean} true если длина соответствует
 */
export const isMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength;
};

/**
 * Проверяет, является ли значение валидным годом
 * @param {number|string} year - Год для проверки
 * @returns {boolean} true если год валидный
 */
export const isValidYear = (year) => {
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  return yearNum >= 1900 && yearNum <= currentYear + 10;
};

/**
 * Проверяет, является ли файл изображением
 * @param {File} file - Файл для проверки
 * @returns {boolean} true если файл - изображение
 */
export const isImageFile = (file) => {
  if (!file) return false;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};

/**
 * Проверяет размер файла
 * @param {File} file - Файл для проверки
 * @param {number} maxSizeMB - Максимальный размер в МБ
 * @returns {boolean} true если размер подходит
 */
export const isValidFileSize = (file, maxSizeMB = 10) => {
  if (!file) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Проверяет, содержит ли строка только эмодзи
 * @param {string} str - Строка для проверки
 * @returns {boolean} true если только эмодзи
 */
export const isOnlyEmoji = (str) => {
  if (!str) return false;
  const emojiRegex = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]+$/u;
  return emojiRegex.test(str.trim());
};

/**
 * Валидация данных фотографии
 * @param {Object} photoData - Данные фотографии
 * @returns {Object} Результат валидации
 */
export const validatePhotoData = (photoData) => {
  const errors = {};
  
  if (isEmpty(photoData.title)) {
    errors.title = 'Название обязательно';
  } else if (!isMaxLength(photoData.title, 100)) {
    errors.title = 'Название не должно превышать 100 символов';
  }
  
  if (!photoData.year) {
    errors.year = 'Год обязателен';
  } else if (!isValidYear(photoData.year)) {
    errors.year = 'Введите корректный год';
  }
  
  if (isEmpty(photoData.location)) {
    errors.location = 'Место обязательно';
  } else if (!isMaxLength(photoData.location, 100)) {
    errors.location = 'Место не должно превышать 100 символов';
  }
  
  if (photoData.description && !isMaxLength(photoData.description, 500)) {
    errors.description = 'Описание не должно превышать 500 символов';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Валидация данных фильма
 * @param {Object} movieData - Данные фильма
 * @returns {Object} Результат валидации
 */
export const validateMovieData = (movieData) => {
  const errors = {};
  
  if (isEmpty(movieData.title)) {
    errors.title = 'Название фильма обязательно';
  } else if (!isMinLength(movieData.title, 2)) {
    errors.title = 'Название должно содержать минимум 2 символа';
  } else if (!isMaxLength(movieData.title, 200)) {
    errors.title = 'Название не должно превышать 200 символов';
  }
  
  if (!movieData.status || !['planned', 'watched'].includes(movieData.status)) {
    errors.status = 'Выберите корректный статус';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Валидация данных плана
 * @param {Object} planData - Данные плана
 * @returns {Object} Результат валидации
 */
export const validatePlanData = (planData) => {
  const errors = {};
  
  if (isEmpty(planData.title)) {
    errors.title = 'Название плана обязательно';
  } else if (!isMinLength(planData.title, 3)) {
    errors.title = 'Название должно содержать минимум 3 символа';
  } else if (!isMaxLength(planData.title, 150)) {
    errors.title = 'Название не должно превышать 150 символов';
  }
  
  if (planData.emoji && !isMaxLength(planData.emoji, 2)) {
    errors.emoji = 'Слишком много символов в эмодзи';
  }
  
  if (planData.description && !isMaxLength(planData.description, 1000)) {
    errors.description = 'Описание не должно превышать 1000 символов';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Валидация данных отзыва
 * @param {Object} feedbackData - Данные отзыва
 * @returns {Object} Результат валидации
 */
export const validateFeedbackData = (feedbackData) => {
  const errors = {};
  
  if (isEmpty(feedbackData.text)) {
    errors.text = 'Текст отзыва обязателен';
  } else if (!isMinLength(feedbackData.text, 5)) {
    errors.text = 'Отзыв должен содержать минимум 5 символов';
  } else if (!isMaxLength(feedbackData.text, 500)) {
    errors.text = 'Отзыв не должен превышать 500 символов';
  }
  
  if (!feedbackData.type || !['positive', 'negative'].includes(feedbackData.type)) {
    errors.type = 'Выберите тип отзыва';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Валидация файла изображения
 * @param {File} file - Файл для проверки
 * @returns {Object} Результат валидации
 */
export const validateImageFile = (file) => {
  const errors = {};
  
  if (!file) {
    errors.file = 'Файл обязателен';
    return { isValid: false, errors };
  }
  
  if (!isImageFile(file)) {
    errors.file = 'Файл должен быть изображением (JPG, PNG, GIF, WebP)';
  }
  
  if (!isValidFileSize(file, 10)) {
    errors.file = 'Размер файла не должен превышать 10 МБ';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Очищает строку от лишних пробелов
 * @param {string} str - Строка для очистки
 * @returns {string} Очищенная строка
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.toString().trim().replace(/\s+/g, ' ');
};

/**
 * Экранирует HTML символы
 * @param {string} str - Строка для экранирования
 * @returns {string} Экранированная строка
 */
export const escapeHtml = (str) => {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Проверяет, содержит ли строка недопустимые символы
 * @param {string} str - Строка для проверки
 * @returns {boolean} true если содержит недопустимые символы
 */
export const hasInvalidCharacters = (str) => {
  if (!str) return false;
  // Проверяем на наличие HTML тегов и скриптов
  const dangerousPattern = /<script|<iframe|javascript:|data:/i;
  return dangerousPattern.test(str);
};