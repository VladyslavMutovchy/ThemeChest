import { get } from './api';

export const guidesAPI = {
  fetchGuidesPaginated(url) {
    console.log('======>', url);
    return get(url);
  },
};
