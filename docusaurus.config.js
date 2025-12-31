// @ts-check
const config = {
  title: 'Physical AI & Humanoid Robotics Textbook',
  tagline: 'A comprehensive guide to humanoid robotics',
  favicon: 'img/favicon.ico',
  url: 'https://humanoid-robotics-book-six.vercel.app',
  baseUrl: '/',
  organizationName: 'raaefkhan44',
  projectName: 'Humanoid-robotics-book',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/raaefkhan44/Humanoid-robotics-book/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig: ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        logo: {
          alt: 'Site Logo',
          src: 'img/logo.png',
        },
        items: [
          { type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Textbook' },
          { href: 'https://github.com/raaefkhan44/Humanoid-robotics-book', label: 'GitHub', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          { title: 'Docs', items: [{ label: 'Textbook', to: '/docs/intro' }] },
          { title: 'Community', items: [{ label: 'GitHub', href: 'https://github.com/raaefkhan44/Humanoid-robotics-book' }] },
          { title: 'More', items: [{ label: 'GitHub', href: 'https://github.com/raaefkhan44/Humanoid-robotics-book' }] },
        ],
        copyright: 'Copyright (c) 2025 Physical AI & Humanoid Robotics Textbook. Built with Docusaurus.',
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
    }),
};
module.exports = config;
