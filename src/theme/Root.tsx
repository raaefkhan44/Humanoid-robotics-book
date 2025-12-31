import React, { ReactNode } from 'react';

// Root component that wraps the entire app
export default function Root({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      </>
  )
}









