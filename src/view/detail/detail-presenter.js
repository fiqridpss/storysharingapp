import DetailView from './detail.js';
import StoryModel from '../../model/story-model.js';

const DetailPresenter = {
  init: async (id) => {
    const token = localStorage.getItem('token');
    const { success, stories } = await StoryModel.fetchStories(token);

    if (!success) {
      DetailView.showError('Gagal memuat data.');
      return;
    }

    const story = stories.find(s => s.id === id);
    if (!story) {
      DetailView.showError('Story tidak ditemukan.');
      return;
    }

    await DetailView.show(id, story);
  }
};

export default DetailPresenter;
