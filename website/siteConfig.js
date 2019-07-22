/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Codelet', // Title for your website.
  tagline: '一个能节省项目开发成本、能找到高质量功能实现的网站',
  url: 'https://codelet.proding.net', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',
  disableHeaderTitle: true,

  // Used for publishing and more
  projectName: 'codelet',
  organizationName: 'facebook',
  description: '「Codelet」提供了基于主流开源技术的系统功能实现，拿来即用。这些实现从真实项目中积累迭代而来，具有良好的系统完整性、可用性和维护性。',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    // { doc: 'doc1', label: '产品' },
    // { page: 'frameworks', label: '基础框架' },
    // { page: 'business', label: '业务系统' },
    // { page: 'features', label: '功能模块' },
    // { href: 'https://github.com', label: '社区' },
    // { doc: 'doc4', label: 'API' },
    // { page: 'help', label: 'Help' },
    // { search: true }
  ],

  // algolia: {
  //   apiKey: '651279d797a3f4e9d32fb68c56c62c8b',
  //   indexName: 'menuet_proding',
  //   algoliaOptions: { } // Optional, if provided by Algolia
  // },

  /* path to images for header/footer */
  headerIcon: 'img/codelet.png',
  footerIcon: 'img/codelet.png',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#48305b',
    secondaryColor: '#2e014e',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `©${new Date().getFullYear()} CodeDance 辽ICP备19008868号-2`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['/js/sidebar.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',

  // No .html extensions for paths.
  cleanUrl: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  docsSideNavCollapsible: false,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  demoUrl: 'http://demo.codelet.net/',

  guideUrl: '/docs/framework/',

  scrollToTop: false,

  separateCss: ['static/css/home', 'static/css/frameworks', 'static/css/splash', 'static/css/business', 'static/css/features']
};

module.exports = siteConfig;
