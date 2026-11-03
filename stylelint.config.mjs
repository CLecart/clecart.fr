/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "declaration-no-important": true,
    "keyframe-declaration-no-important": true,
    // Range syntax, (width <= 768px), needs Safari 16.4: an iPhone held on
    // iOS 15 would skip every media query and get the desktop layout.
    "media-feature-range-notation": "prefix",
    // A gradient holding one space-separated colour, rgb(0 0 0 / 10%), is
    // interpolated in Oklab instead of sRGB, which shifts every tint.
    "color-function-notation": "legacy",
    "color-function-alias-notation": "with-alpha",
    "alpha-value-notation": "number",
  },
};
