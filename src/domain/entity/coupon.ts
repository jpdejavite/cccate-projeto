import ExpiredCoupon from '../errors/expired-coupon.error';
import InvalidCoupon from '../errors/invalid-coupon.error';

import CouponData from './coupon-data';

const VALID_COUPON_EXPIRATION_TIME = 10000;

const validCouponDatas: CouponMap = {
  '50-discount-coupon-id': new CouponData(0.50, new Date(Date.now() + VALID_COUPON_EXPIRATION_TIME)),
  '50-expired-discount-coupon-id': new CouponData(0.50, new Date(Date.now() - VALID_COUPON_EXPIRATION_TIME)),
};

interface CouponMap {
  [key: string]: CouponData;
}


class Coupon {
  public readonly discountAmount: number;
  public readonly expirationDate: Date;


  public constructor(readonly id: string) {
    const couponData = validCouponDatas[this.id];

    if (!couponData) {
      throw new InvalidCoupon();
    }

    this.discountAmount = couponData.discountAmount;
    this.expirationDate = couponData.expirationDate;
  }

  public isExpired(today: Date): boolean {
    return this.expirationDate.getTime() < today.getTime();
  }
}

export default Coupon;
