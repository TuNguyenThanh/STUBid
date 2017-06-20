import { TestBed, inject } from '@angular/core/testing';

import { AuctionService } from './auction.service';

describe('AuctionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuctionService]
    });
  });

  it('should ...', inject([AuctionService], (service: AuctionService) => {
    expect(service).toBeTruthy();
  }));
});
