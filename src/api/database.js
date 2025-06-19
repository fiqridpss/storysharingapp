// database.js
import { openDB } from 'idb';

const DATABASE_NAME = 'StoriesDatabase';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'savedStories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

const Database = {
  async saveStory(story) {
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
  async getStory(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async isStorySaved(id) {
    const story = await (await dbPromise).get(OBJECT_STORE_NAME, id);
    return !!story;
  },
  async getAllSavedStories() {
    const db = await dbPromise;
    return db.getAll(OBJECT_STORE_NAME);
  }
};

export default Database;
