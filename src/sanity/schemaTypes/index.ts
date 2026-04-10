import type { SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContent";
import { postType } from "./post";
import { faqType } from "./faq";
import { reviewType } from "./review";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, postType, reviewType, faqType],
};
