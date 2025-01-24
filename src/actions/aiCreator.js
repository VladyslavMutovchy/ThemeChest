import { actionWrapper } from './actionWrapper';
import { aiCreatorAPI } from './../api/aiCreator';
import { isFetching } from './preloader';

export const aiCreateGuide = (guideData, callback) =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {
      const newGuide = await aiCreatorAPI.aiCreateGuide(guideData);
      callback?.(newGuide);
      dispatch(isFetching(false));
    } catch (error) {
      console.error('Failed to create guide:', error);
      dispatch(isFetching(false));
    }
  });
