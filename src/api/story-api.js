export const getAllStories = async (token, page = 1, size = 10, location = 0) => {
    try {
      const url = new URL('https://story-api.dicoding.dev/v1/stories');
      url.searchParams.append('page', page);
      url.searchParams.append('size', size);
      url.searchParams.append('location', location);
  
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch stories',
          stories: []
        };
      }
  
      return {
        success: true,
        message: data.message,
        stories: data.listStory
      };
  
    } catch (error) {
      return {
        success: false,
        message: 'Network error or server not reachable',
        stories: []
      };
    }
  };
  
  export const addStory = async (token, storyData) => {
    try {
      const formData = new FormData();
      formData.append('description', storyData.description);
      formData.append('photo', storyData.photo); // file object
      if (storyData.lat !== undefined && storyData.lat !== null) {
        formData.append('lat', storyData.lat);
      }
      if (storyData.lon !== undefined && storyData.lon !== null) {
        formData.append('lon', storyData.lon);
      }
  
      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Jangan tambahkan Content-Type: multipart/form-data secara manual!
        },
        body: formData
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to add story'
        };
      }
  
      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error or server not reachable'
      };
    }
  };
  