// src/firebase/firebaseUtils.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from './config';

// Утилиты для работы с изображениями
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const compressImage = (file, maxSizeKB = 500) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
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
      ctx.drawImage(img, 0, 0, width, height);
      
      let quality = 0.8;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          const sizeKB = blob.size / 1024;
          if (sizeKB <= maxSizeKB || quality <= 0.1) {
            resolve(blob);
          } else {
            quality -= 0.1;
            tryCompress();
          }
        }, 'image/jpeg', quality);
      };
      
      tryCompress();
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Функции для работы с фотографиями
export const savePhoto = async (photoData, imageFile, currentUser) => {
  try {
    console.log('📸 Начинаем сохранение фотографии...');
    
    let finalPhotoData = { ...photoData };
    
    if (imageFile) {
      console.log(`📊 Размер оригинала: ${(imageFile.size / 1024).toFixed(1)}KB`);
      
      const compressedBlob = await compressImage(imageFile, 400);
      console.log(`📊 Размер после сжатия: ${(compressedBlob.size / 1024).toFixed(1)}KB`);
      
      const base64String = await blobToBase64(compressedBlob);
      finalPhotoData.imageData = base64String;
      console.log('✅ Изображение сконвертировано в base64');
    }
    
    const docRef = await addDoc(collection(db, 'photos'), {
      ...finalPhotoData,
      uploadedBy: currentUser,
      createdAt: serverTimestamp(),
      id: Date.now()
    });
    
    console.log('📄 Фотография сохранена с ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Ошибка сохранения фотографии: ', error);
    throw error;
  }
};

export const loadPhotos = async () => {
  try {
    console.log('📥 Загружаем фотографии...');
    
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const photos = querySnapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ Загружено ${photos.length} фотографий`);
    return photos;
  } catch (error) {
    console.error('❌ Ошибка загрузки фотографий: ', error);
    return [];
  }
};

// Функции для работы с фильмами
export const saveMovie = async (movieData, currentUser) => {
  try {
    const docRef = await addDoc(collection(db, 'movies'), {
      ...movieData,
      addedBy: currentUser,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('❌ Ошибка сохранения фильма: ', error);
    throw error;
  }
};

export const loadMovies = async () => {
  try {
    const q = query(collection(db, 'movies'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Ошибка загрузки фильмов: ', error);
    return [];
  }
};

export const deleteMovie = async (movieId) => {
  try {
    await deleteDoc(doc(db, 'movies', movieId));
    console.log('🗑️ Фильм удален');
  } catch (error) {
    console.error('❌ Ошибка удаления фильма: ', error);
    throw error;
  }
};

// Функции для работы с планами
export const savePlan = async (planData, currentUser) => {
  try {
    const docRef = await addDoc(collection(db, 'plans'), {
      ...planData,
      addedBy: currentUser,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('❌ Ошибка сохранения плана: ', error);
    throw error;
  }
};

export const loadPlans = async () => {
  try {
    const q = query(collection(db, 'plans'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Ошибка загрузки планов: ', error);
    return [];
  }
};

export const deletePlan = async (planId) => {
  try {
    await deleteDoc(doc(db, 'plans', planId));
    console.log('🗑️ План удален');
  } catch (error) {
    console.error('❌ Ошибка удаления плана: ', error);
    throw error;
  }
};

// Функции для работы с отзывами
export const saveFeedback = async (feedbackData, currentUser) => {
  try {
    const docRef = await addDoc(collection(db, 'feedback'), {
      ...feedbackData,
      addedBy: currentUser,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('❌ Ошибка сохранения отзыва: ', error);
    throw error;
  }
};

export const loadFeedback = async () => {
  try {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Ошибка загрузки отзывов: ', error);
    return [];
  }
};

export const deleteFeedback = async (feedbackId) => {
  try {
    await deleteDoc(doc(db, 'feedback', feedbackId));
    console.log('🗑️ Отзыв удален');
  } catch (error) {
    console.error('❌ Ошибка удаления отзыва: ', error);
    throw error;
  }
};