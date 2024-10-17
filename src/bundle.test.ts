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
              "gid://shopify/Product/Cherry",
              "gid://shopify/Product/Date",
              "gid://shopify/Product/Elderberry",
              "gid://shopify/Product/Fig",
              "gid://shopify/Product/Grape",
              "gid://shopify/Product/Honeydew",
              "gid://shopify/Product/Kiwi",
              "gid://shopify/Product/Lemon",
              "gid://shopify/Product/Mango",
              "gid://shopify/Product/Nectarine",
              "gid://shopify/Product/Orange",
              "gid://shopify/Product/Papaya",
              "gid://shopify/Product/Quince",
              "gid://shopify/Product/Raspberry",
              "gid://shopify/Product/Strawberry",
              "gid://shopify/Product/Tangerine",
              "gid://shopify/Product/Ugli",
              "gid://shopify/Product/Voavanga",
              "gid://shopify/Product/Watermelon",
              "gid://shopify/Product/Xigua",
              "gid://shopify/Product/Yuzu",
              "gid://shopify/Product/Zucchini",
              "gid://shopify/Product/Apricot",
              "gid://shopify/Product/Blackberry",
              "gid://shopify/Product/Coconut",
              "gid://shopify/Product/Durian",
              "gid://shopify/Product/Eggplant",
              "gid://shopify/Product/Feijoa",
              "gid://shopify/Product/Guava",
              "gid://shopify/Product/Huckleberry",
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
      if (firstDiscount.value.percentage) {
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
});
