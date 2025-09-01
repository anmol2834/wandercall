export default {
  plugins: {
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' && {
      '@fullhuman/postcss-purgecss': {
        content: [
          './index.html',
          './src/**/*.{js,jsx,ts,tsx}',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: [
            /^MuiBox-/,
            /^MuiContainer-/,
            /^MuiTypography-/,
            /^MuiButton-/,
            /^MuiCard-/,
            /^MuiGrid-/,
            /^MuiAppBar-/,
            /^MuiToolbar-/,
            /^MuiDrawer-/,
            /^MuiList-/,
            /^MuiAvatar-/,
            /^MuiChip-/,
            /^MuiDialog-/,
            /^MuiTextField-/,
            /^MuiCircularProgress-/,
            /^MuiLinearProgress-/,
            /^MuiSkeleton-/,
            /^Mui.*-root$/,
            /^css-/,
            /^framer-motion/,
            /^swiper/,
            /active$/,
            /selected$/,
            /hover$/,
            /focus$/,
            /disabled$/,
            /error$/,
            /success$/,
            /warning$/,
            /info$/
          ],
          deep: [
            /MuiSvgIcon/,
            /MuiTouchRipple/,
            /MuiBackdrop/,
            /MuiModal/,
            /MuiPaper/,
            /MuiPopover/,
            /MuiPopper/,
            /MuiMenu/,
            /MuiMenuItem/,
            /MuiFormControl/,
            /MuiInputBase/,
            /MuiOutlinedInput/,
            /MuiInputLabel/,
            /MuiFormHelperText/
          ]
        }
      },
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          minifySelectors: true,
          minifyFontValues: true,
          colormin: true
        }]
      }
    })
  }
}