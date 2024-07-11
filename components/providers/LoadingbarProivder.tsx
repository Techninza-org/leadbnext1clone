'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const LoadingProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="#e4e4e7"
        options={{ 
            showSpinner: false,
         }}
        shallowRouting
      />
    </>
  );
};

export default LoadingProviders;