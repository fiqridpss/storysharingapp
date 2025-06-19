import SaveView from './save.js';
import Database from '../../api/database.js';

const SavePresenter = {
  async init() {
    const savedStories = await Database.getAllSavedStories();
    await SaveView.show(savedStories);
  }
};

export default SavePresenter;
