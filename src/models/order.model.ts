import EmptyItems from '../errors/empty-items.error';
import InvalidCpf from '../errors/invalid-cpf.error';
import CpfValidator from '../validators/cpf.validator';

import Coupon from './coupon.model';
import OrderItem from './order-item.model';

const MINIMUM_SHIPPING_COST = 10;

class Order {
  public static makeOrder(clientCpf: string, items: OrderItem[], couponId?: string): Order {
    if (!CpfValidator.validate(clientCpf)) {
      throw new InvalidCpf();
    }

    if (items.length === 0) {
      throw new EmptyItems();
    }
    const order = new Order(clientCpf, items, couponId);
    order.calculateFinalPrice();
    return order;
  }


  private readonly clientCpf: string;
  private readonly items: OrderItem[];
  private readonly couponId?: string;
  private finalPrice: number;

  private constructor(clientCpf: string, items: OrderItem[], couponId?: string) {
    this.clientCpf = clientCpf;
    this.items = items;
    this.couponId = couponId;
    this.finalPrice = 0;
  }

  public getFinalPrice(): number {
    return this.finalPrice;
  }

  public getShippingCost(): number {
    const shippingCost = this.items.reduce((sum, item) => {
      return sum + item.getShippingCost();
    }, 0);

    return shippingCost < MINIMUM_SHIPPING_COST ? MINIMUM_SHIPPING_COST : shippingCost;
  }

  private calculateFinalPrice(): void {
    if (this.couponId) {
      this.calculateFinalPriceWithDiscount();
      return;
    }
    this.finalPrice = this.items.reduce((sum, item) => sum + item.getFinalPrice(), 0);
  }

  private calculateFinalPriceWithDiscount(): void {
    const discount = new Coupon(this.couponId!).calculateDiscount();
    this.finalPrice = this.items.reduce((sum, item) => {
      item.applyDiscount(discount);
      return sum + item.getFinalPrice();
    }, 0);
  }

}

export {
  Order,
  MINIMUM_SHIPPING_COST,
};
