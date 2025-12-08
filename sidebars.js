// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Physical AI & Humanoid Robotics Textbook',
      items: [
        'intro',

        {
          type: 'category',
          label: 'Module 1: ROS 2 Nervous System',
          items: ['module1-ros2-nervous-system/index'],
        },

        {
          type: 'category',
          label: 'Module 2: Digital Twin Simulation',
          items: ['module2-digital-twin-simulation/index'],
        },

        {
          type: 'category',
          label: 'Module 3: AI Brain (NVIDIA Isaac)',
          items: ['module3-ai-brain-isaac/index'],
        },

        {
          type: 'category',
          label: 'Module 4: Vision-Language-Action Robotics',
          items: ['module4-vla-robotics/index'],
        },

        {
          type: 'category',
          label: 'Additional Materials',
          items: [
            'additional-materials/index',
            'additional-materials/cloud',
            'additional-materials/hardware',
            'additional-materials/final_materials',
          ],
        },

        {
          type: 'doc',
          id: 'weekly-roadmap',
        },
      ],
    },
  ],
};

module.exports = sidebars;
