import type * as React from "react";
import ProductActions from "./product-actions";

// default export bridge
export default ProductActions;

// robust type bridge: infer props from the default export
export type Props = React.ComponentProps<typeof ProductActions>;
