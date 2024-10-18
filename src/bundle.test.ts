import { expect, it, describe, assert } from "vitest";
import productDiscounts from "./bundle-builder";

describe("bundle builder v2", () => {
  it("should be able to handle multiple discounts", () => {
    const result = productDiscounts({
      cart: {
        buyerIdentity: null,
        lines: [
          {
            id: "gid://shopify/CartLine/0",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/39370591273049",
              product: {
                id: "gid://shopify/Product/Apple",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/1",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/32385157005401",
              product: {
                id: "gid://shopify/Product/Banana",
              },
            },
          },
        ],
      },
      discountNode: {
        metafield: {
          value: JSON.stringify({
            id: "148",
            tiers: [
              { title: "3 FRUITS - 10$ OFF", amount: 10, quantity: 3 },
              { title: "6 FRUITS - 17$ OFF", amount: 17, quantity: 6 },
              { title: "9 FRUITS - 20$ OFF", amount: 20, quantity: 9 },
            ],
            collections: [],
            products: [
              "gid://shopify/Product/Apple",
              "gid://shopify/Product/Banana",
              // ... other product IDs ...
            ],
            discountType: "PERCENTAGE",
            title: "Chroma Bundle Builder",
            allowStackingWithSubscription: false,
          }),
        },
      },
    } as any);

    console.log(JSON.stringify(result, null, 2));
    expect(result.discounts).toHaveLength(1);

    const firstDiscount = result.discounts[0];
    if (firstDiscount) {
      if ("percentage" in firstDiscount.value) {
        expect(firstDiscount.value.percentage.value).toBe("17");
        expect(firstDiscount.targets).toHaveLength(2);

        const firstTarget = firstDiscount.targets[0];
        if (firstTarget) {
          expect(firstTarget.productVariant.quantity).toBe(3);
        } else {
          assert(false, "Expected first target to be defined");
        }
      } else {
        assert.fail("Expected first discount to have percentage");
      }
    } else {
      assert.fail("Expected first discount to be defined");
    }
  });

  it("should handle FIXED_BUNDLE_PRICE discount type", () => {
    const result = productDiscounts({
      cart: {
        buyerIdentity: null,
        lines: [
          {
            id: "gid://shopify/CartLine/0",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/39370591273049",
              product: {
                id: "gid://shopify/Product/Apple",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/1",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/32385157005401",
              product: {
                id: "gid://shopify/Product/Banana",
              },
            },
          },
        ],
      },
      discountNode: {
        metafield: {
          value: JSON.stringify({
            id: "149",
            tiers: [
              { title: "3 FRUITS - 25€ BUNDLE", amount: 25, quantity: 3 },
              { title: "6 FRUITS - 45€ BUNDLE", amount: 45, quantity: 6 },
              { title: "9 FRUITS - 60€ BUNDLE", amount: 60, quantity: 9 },
            ],
            collections: [],
            products: [
              "gid://shopify/Product/Apple",
              "gid://shopify/Product/Banana",
              // ... other product IDs ...
            ],
            discountType: "FIXED_BUNDLE_PRICE",
            title: "Fixed Price Fruit Bundle",
            allowStackingWithSubscription: false,
          }),
        },
      },
    } as any);

    console.log(JSON.stringify(result, null, 2));
    expect(result.discounts).toHaveLength(1);

    const firstDiscount = result.discounts[0];
    if (firstDiscount) {
      if ("fixedAmount" in firstDiscount.value) {
        const originalTotal = 6 * 10.95; // 6 items at 10.95 each
        const fixedBundlePrice = 45.0;
        const expectedDiscount = (originalTotal - fixedBundlePrice).toFixed(2);
        expect(firstDiscount.value.fixedAmount.amount).toBe(expectedDiscount);
        expect(firstDiscount.targets).toHaveLength(2);

        const firstTarget = firstDiscount.targets[0];
        if (firstTarget) {
          expect(firstTarget.productVariant.quantity).toBe(3);
        } else {
          assert(false, "Expected first target to be defined");
        }
      } else {
        assert.fail("Expected first discount to have fixedAmount");
      }
    } else {
      assert.fail("Expected first discount to be defined");
    }
  });

  it("should handle PERCENTAGE discount type", () => {
    const result = productDiscounts({
      cart: {
        buyerIdentity: null,
        lines: [
          {
            id: "gid://shopify/CartLine/0",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/39370591273049",
              product: {
                id: "gid://shopify/Product/Apple",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/32385157005401",
              product: {
                id: "gid://shopify/Product/Banana",
              },
            },
          },
        ],
      },
      discountNode: {
        metafield: {
          value: JSON.stringify({
            id: "150",
            tiers: [
              { title: "3 FRUITS - 10% OFF", amount: 10, quantity: 3 },
              { title: "5 FRUITS - 15% OFF", amount: 15, quantity: 5 },
              { title: "7 FRUITS - 20% OFF", amount: 20, quantity: 7 },
            ],
            collections: [],
            products: [
              "gid://shopify/Product/Apple",
              "gid://shopify/Product/Banana",
            ],
            discountType: "PERCENTAGE",
            title: "Percentage Fruit Discount",
            allowStackingWithSubscription: false,
          }),
        },
      },
    } as any);

    console.log(JSON.stringify(result, null, 2));
    expect(result.discounts).toHaveLength(1);

    const firstDiscount = result.discounts[0];
    if (firstDiscount) {
      if ("percentage" in firstDiscount.value) {
        expect(firstDiscount.value.percentage.value).toBe("15");
        expect(firstDiscount.targets).toHaveLength(2);

        const firstTarget = firstDiscount.targets[0];
        if (firstTarget) {
          expect(firstTarget.productVariant.quantity).toBe(3);
        } else {
          assert(false, "Expected first target to be defined");
        }
      } else {
        assert.fail("Expected first discount to have percentage");
      }
    } else {
      assert.fail("Expected first discount to be defined");
    }
  });
});
