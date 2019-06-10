import axios from 'axios';
import router from '@/router';

export default {
  setArmy (context, jsonPath) {
    axios
      .get(process.env.BASE_URL + jsonPath)
      .then((response) => {
        context.commit('SET_JSON_PATH', jsonPath);

        router.push({ name: 'Selector' });
      });
  }
};
