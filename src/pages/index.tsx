import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg neon-button"
            to="/docs/intro">
            Start Reading
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Physical AI & Humanoid Robotics Textbook">
      <HomepageHeader />
      <main>
        <section className={styles.modulesSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Learning Modules</h2>
            <div className="row">
              <div className="col col--3">
                <div className="module-card padding-horiz--md text--center">
                  <h3>Module 1: ROS 2 Nervous System</h3>
                  <p>Master the Robot Operating System fundamentals that serve as the backbone for robotic applications</p>
                  <Link
                    className="button button--primary"
                    to="/docs/module1-ros2-nervous-system">
                    Explore
                  </Link>
                </div>
              </div>
              <div className="col col--3">
                <div className="module-card padding-horiz--md text--center">
                  <h3>Module 2: Digital Twin Simulation</h3>
                  <p>Explore simulation environments and digital replicas for testing robotic systems</p>
                  <Link
                    className="button button--primary"
                    to="/docs/module2-digital-twin-simulation">
                    Explore
                  </Link>
                </div>
              </div>
              <div className="col col--3">
                <div className="module-card padding-horiz--md text--center">
                  <h3>Module 3: AI Brain (NVIDIA Isaac)</h3>
                  <p>Implement artificial intelligence and machine learning for robotic decision-making</p>
                  <Link
                    className="button button--primary"
                    to="/docs/module3-ai-brain-isaac">
                    Explore
                  </Link>
                </div>
              </div>
              <div className="col col--3">
                <div className="module-card padding-horiz--md text--center">
                  <h3>Module 4: Vision-Language-Action Robotics</h3>
                  <p>Combine perception, understanding, and action for advanced robotic capabilities</p>
                  <Link
                    className="button button--primary"
                    to="/docs/module4-vla-robotics">
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}