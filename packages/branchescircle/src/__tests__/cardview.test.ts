import { branchesCircleKnowlet } from '../index';
import { BranchesCircleCardView } from '@iching-kt/square';

describe('branchesCircleKnowlet board representation', () => {
  it('declares the compact BranchesCircleCardView as its CardView', () => {
    expect(branchesCircleKnowlet.CardView).toBe(BranchesCircleCardView);
  });
});
