import { shallowMount } from '@vue/test-utils';

import Save from '@/views/Save';

var wrapper;

jest.mock('@/store', () => ({
    getters: {
      jsonPath: 'a jsonPath',
      label: 'a label',
      printItems: [{ abbr: 'pi1', title: 'print item 1' }, { abbr: 'pi2', title: 'print item 2' }],
      upgrades: {
        'an upgrade': {
          order: 'au'
        }
      },
      usedUnits: {
        'a unit': {
          order: 0,
          number: 2,
          upgrades: {
            'an upgrade': {
              number: 1
            }
          }
        }
      }
    }
  }));

describe('Save.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Save, { });
  });

  it('renders', () => {
    expect(wrapper.find('textarea').text()).toContain('jsonPath=a%20jsonPath');
    expect(wrapper.find('textarea').text()).toContain('label=a%20label');
    expect(wrapper.find('textarea').text()).toContain('printItems=pi1%2Cpi2');
    expect(wrapper.find('textarea').text()).toContain('0=2');
    expect(wrapper.find('textarea').text()).toContain('0-au=1');
  });
});
