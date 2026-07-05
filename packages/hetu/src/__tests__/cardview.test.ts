import { hetuKnowlet } from '../index';
import { HeTuCardView } from '@iching-kt/square';

describe('hetuKnowlet board representation', () => {
  it('declares the compact HeTuCardView as its CardView', () => {
    expect(hetuKnowlet.CardView).toBe(HeTuCardView);
  });
});
