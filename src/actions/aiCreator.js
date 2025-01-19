import { actionWrapper } from './actionWrapper';
import { aiCreatorAPI } from './../api/aiCreator';

export const aiCreateGuide = (guideData, callback) =>
  actionWrapper(async () => {
    try {
      const newGuide = await aiCreatorAPI.aiCreateGuide(guideData);
      callback?.(newGuide);
    } catch (error) {
      console.error('Failed to create guide:', error);
    
    }
  });
