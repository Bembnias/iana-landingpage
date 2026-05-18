import type { SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContent";
import { postType } from "./post";
import { faqType } from "./faq";
import { reviewType } from "./review";
import { seoFieldsType } from "./seoFields";
import { seoHomePageType } from "./seoHomePage";
import { seoPolicyPageType } from "./seoPolicyPage";
import { seoBlogListingPageType } from "./seoBlogListingPage";
import { seoProductPageType } from "./seoProductPage";
import { seoRoutinePageType } from "./seoRoutinePage";
import { redirectRuleType } from "./redirectRule";
import { productPageType } from "./productPage";
import { routinePageType } from "./routinePage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    seoFieldsType,
    postType,
    reviewType,
    faqType,
    seoHomePageType,
    seoPolicyPageType,
    seoBlogListingPageType,
    seoProductPageType,
    seoRoutinePageType,
    redirectRuleType,
    productPageType,
    routinePageType,
  ],
};
