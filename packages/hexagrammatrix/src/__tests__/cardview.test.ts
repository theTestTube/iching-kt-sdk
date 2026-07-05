import { hexagramMatrixKnowlet } from '../index';
import { HexagramMatrixCardView } from '@iching-kt/square';

describe('hexagramMatrixKnowlet board representation', () => {
  it('declares the compact HexagramMatrixCardView as its CardView', () => {
    expect(hexagramMatrixKnowlet.CardView).toBe(HexagramMatrixCardView);
  });
});
