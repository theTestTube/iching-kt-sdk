import { elementsKnowlet } from '../index';

describe('elementsKnowlet meta', () => {
  it('uses the distinct Five Elements icon 五 (not Yin-Yang ☯)', () => {
    expect(elementsKnowlet.meta.icon).toBe('五');
  });
});
