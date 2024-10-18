function productDiscounts({ cart, discountNode }: any) {
  const discountConfig = JSON.parse(discountNode.metafield.value);
  const { tiers, discountType } = discountConfig;

  const totalQuantity = cart.lines.reduce(
    (sum: number, line: any) => sum + line.quantity,
    0
  );
  const selectedTier = tiers.reduce(
    (acc: any, tier: any) =>
      totalQuantity >= tier.quantity && tier.quantity > acc.quantity
        ? tier
        : acc,
    { quantity: 0 }
  );

  if (discountType === "PERCENTAGE") {
    return {
      discountApplicationStrategy: "MAXIMUM",
      discounts: [
        {
          message: selectedTier.title,
          value: {
            percentage: {
              value: selectedTier.amount.toString(),
            },
          },
          targets: cart.lines.map((line: any) => ({
            productVariant: {
              id: line.merchandise.id,
              quantity: line.quantity,
            },
          })),
        },
      ],
    };
  } else if (discountType === "FIXED_BUNDLE_PRICE") {
    const totalOriginalPrice = cart.lines.reduce(
      (sum: number, line: any) =>
        sum + parseFloat(line.cost.amountPerQuantity.amount) * line.quantity,
      0
    );
    const fixedBundlePrice = selectedTier.amount;
    const discountAmount = totalOriginalPrice - fixedBundlePrice;

    return {
      discountApplicationStrategy: "MAXIMUM",
      discounts: [
        {
          message: selectedTier.title,
          value: {
            fixedAmount: {
              amount: discountAmount.toFixed(2),
            },
          },
          targets: cart.lines.map((line: any) => ({
            productVariant: {
              id: line.merchandise.id,
              quantity: line.quantity,
            },
          })),
        },
      ],
    };
  }

  // Default return if no discount type matches
  return {
    discountApplicationStrategy: "MAXIMUM",
    discounts: [],
  };
}

export default productDiscounts;
