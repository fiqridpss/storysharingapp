import DashboardView from './dashboard.js';
import StoryModel from '../../model/story-model.js';

const DashboardPresenter = {
  init: async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');

    if (!isLoggedIn || !token) {
      window.location.hash = '#/login';
      return;
    }

    const { success, stories } = await StoryModel.fetchStories(token);
    DashboardView.render(success ? stories : []);
  }
};


export default DashboardPresenter;
