import axios from 'axios';

import actions from '@/store/actions';
import getters from '@/store/getters';
import mutations from '@/store/mutations';
import router from '@/router';

const
  jsonPath = 'a jsonPath',
  routerPushSpy = jest.spyOn(router, 'push');

var commit, state;

jest.mock('axios');
axios.get.mockImplementation(() => Promise.resolve({}));

describe('store.js', () => {
  beforeEach(() => state = { jsonPath: '' });

  describe('actions', () => {
    beforeEach(() => commit = jest.fn());

    it('setArmy commits SET_JSON_PATH', async () => {
      await actions.setArmy({ commit }, jsonPath);

      expect(commit).toHaveBeenCalledWith('SET_JSON_PATH', jsonPath);
    });

    it('setArmy pushes Selector location to router', async () => {
      await actions.setArmy({ commit }, jsonPath);
      expect(routerPushSpy).toHaveBeenCalledWith({ name: 'Selector' });
    });
  });

  describe('getters', () => {
    it('jsonPath returns state.jsonPath', () => {
      expect(getters.jsonPath(state)).toEqual('');
      state.jsonPath = jsonPath;
      expect(getters.jsonPath(state)).toEqual(jsonPath);
    });
  });

  describe('mutations', () => {
    it('SET_JSON_PATH sets state.jsonPath', () => {
      expect(state.jsonPath).toEqual('');
      mutations.SET_JSON_PATH(state, jsonPath);
      expect(state.jsonPath).toEqual(jsonPath);
    });
  });
});
