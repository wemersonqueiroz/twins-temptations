const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

/** £20.00 */
export const formatPrice = (value: number) => gbp.format(value);
