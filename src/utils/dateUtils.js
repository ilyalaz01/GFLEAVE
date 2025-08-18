// src/utils/dateUtils.js

/**
 * Форматирует дату в читаемый вид
 * @param {Date|string|number} date - Дата для форматирования
 * @param {string} format - Формат ('short', 'long', 'relative')
 * @returns {string} Отформатированная дата
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Неверная дата';
  }
  
  const now = new Date();
  const diff = now - dateObj;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
    case 'long':
      return dateObj.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
    case 'relative':
      return getRelativeTime(diff);
      
    case 'time':
      return dateObj.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
    case 'datetime':
      return dateObj.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
    default:
      return dateObj.toLocaleDateString('ru-RU');
  }
};

/**
 * Возвращает относительное время (например, "2 часа назад")
 * @param {number} diffMs - Разница в миллисекундах
 * @returns {string} Относительное время
 */
const getRelativeTime = (diffMs) => {
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) return 'только что';
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days < 7) return `${days} дн. назад`;
  if (weeks < 4) return `${weeks} нед. назад`;
  if (months < 12) return `${months} мес. назад`;
  return `${years} г. назад`;
};

/**
 * Проверяет, является ли год високосным
 * @param {number} year - Год для проверки
 * @returns {boolean} true если год високосный
 */
export const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * Возвращает количество дней в месяце
 * @param {number} year - Год
 * @param {number} month - Месяц (0-11)
 * @returns {number} Количество дней
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Вычисляет разницу между двумя датами
 * @param {Date|string} startDate - Начальная дата
 * @param {Date|string} endDate - Конечная дата
 * @returns {Object} Объект с разницей в годах, месяцах, днях
 */
export const getDateDifference = (startDate, endDate = new Date()) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { years: 0, months: 0, days: 0, totalDays: 0 };
  }
  
  const diffTime = Math.abs(end - start);
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  
  if (days < 0) {
    months--;
    days += getDaysInMonth(end.getFullYear(), end.getMonth() - 1);
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days, totalDays };
};

/**
 * Возвращает красивую строку с длительностью отношений
 * @param {Date|string} startDate - Дата начала отношений
 * @returns {string} Строка типа "2 года, 3 месяца и 15 дней"
 */
export const getRelationshipDuration = (startDate) => {
  const { years, months, days } = getDateDifference(startDate);
  
  const parts = [];
  
  if (years > 0) {
    parts.push(`${years} ${getPluralForm(years, 'год', 'года', 'лет')}`);
  }
  
  if (months > 0) {
    parts.push(`${months} ${getPluralForm(months, 'месяц', 'месяца', 'месяцев')}`);
  }
  
  if (days > 0) {
    parts.push(`${days} ${getPluralForm(days, 'день', 'дня', 'дней')}`);
  }
  
  if (parts.length === 0) {
    return 'меньше дня';
  }
  
  if (parts.length === 1) {
    return parts[0];
  }
  
  if (parts.length === 2) {
    return parts.join(' и ');
  }
  
  return `${parts.slice(0, -1).join(', ')} и ${parts[parts.length - 1]}`;
};

/**
 * Возвращает правильную форму слова в зависимости от числа
 * @param {number} number - Число
 * @param {string} one - Форма для 1 (год)
 * @param {string} few - Форма для 2-4 (года)
 * @param {string} many - Форма для 5+ (лет)
 * @returns {string} Правильная форма слова
 */
const getPluralForm = (number, one, few, many) => {
  const n = Math.abs(number);
  const n10 = n % 10;
  const n100 = n % 100;
  
  if (n10 === 1 && n100 !== 11) {
    return one;
  }
  
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) {
    return few;
  }
  
  return many;
};

/**
 * Возвращает массив лет от startYear до текущего года
 * @param {number} startYear - Начальный год
 * @returns {number[]} Массив лет
 */
export const getYearsRange = (startYear = 2020) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
};

/**
 * Проверяет, является ли дата сегодняшней
 * @param {Date|string} date - Дата для проверки
 * @returns {boolean} true если дата сегодняшняя
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return today.toDateString() === checkDate.toDateString();
};

/**
 * Проверяет, является ли дата вчерашней
 * @param {Date|string} date - Дата для проверки
 * @returns {boolean} true если дата вчерашняя
 */
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  
  return yesterday.toDateString() === checkDate.toDateString();
};

/**
 * Возвращает начало дня для указанной даты
 * @param {Date|string} date - Дата
 * @returns {Date} Начало дня
 */
export const getStartOfDay = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Возвращает конец дня для указанной даты
 * @param {Date|string} date - Дата
 * @returns {Date} Конец дня
 */
export const getEndOfDay = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};