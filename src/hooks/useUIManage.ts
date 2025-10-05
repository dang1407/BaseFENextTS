import React from 'react';

export function useLoading() {
  const [isLoading, setIsLoading] = React.useState<Boolean>(false);
  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);
  return {isLoading, showLoading, hideLoading};
}