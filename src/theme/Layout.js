import React from 'react';
import Layout from '@theme-original/Layout';
import BookChatbot from '../components/BookChatbot';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props}>
        {props.children}
      </Layout>
      <BookChatbot />
    </>
  );
}