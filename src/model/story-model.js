import { getAllStories, addStory } from '../api/story-api.js';

const StoryModel = {
  fetchStories: async (token) => await getAllStories(token),
  addStory: async (token, storyData) => await addStory(token, storyData),
};

export default StoryModel;
