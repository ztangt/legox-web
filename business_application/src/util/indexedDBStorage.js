// 创建一个函数，返回一个带有IndexedDB操作方法的对象
export function IndexedDBStorage(dbName, storeName) {
  let db = null;

  // 打开IndexedDB数据库
  async function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, 1);

      request.onupgradeneeded = (event) => {
        db = event.target.result;
        db.createObjectStore(storeName);
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // 存储数据
  async function setItem(key, value) {
    if (!db) {
      await openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // 获取数据
  async function getItem(key) {
    if (!db) {
      await openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.get(key);

      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          resolve(result);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // 删除数据
  async function removeItem(key) {
    if (!db) {
      await openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  return {
    setItem,
    getItem,
    removeItem,
  };
}

// // 使用封装后的方法
// const storage = IndexedDBStorage('tlDB', 'tlStore');

// // 存储数据
// storage
//   .setItem('menus', JSON.stringify(menus))
//   .then(() => {
//     console.log('setItem OK!');
//   })
//   .catch((error) => {
//     console.error('setItem error', error);
//   });

// // 获取数据
// storage
//   .getItem('menus')
//   .then((data) => {
//     console.log('setItem menus OK:', data);
//   })
//   .catch((error) => {
//     console.error('getItem error:', error);
//   });
