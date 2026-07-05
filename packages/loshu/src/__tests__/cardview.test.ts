import { loshuKnowlet } from '../index';
import { LoShuCardView } from '@iching-kt/square';

describe('loshuKnowlet board representation', () => {
  it('declares the compact LoShuCardView as its CardView', () => {
    expect(loshuKnowlet.CardView).toBe(LoShuCardView);
  });
});
