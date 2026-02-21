import { useState, memo, useCallback } from 'react';

interface Props {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ImageWithSkeleton = memo(function ImageWithSkeleton({
  src,
  fallbackSrc,
  alt,
  className = '',
  loading,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);

  const handleError = useCallback(() => {
    if (!error && fallbackSrc) {
      setError(true);
      setLoaded(false);
    } else {
      setFallbackError(true);
      setLoaded(true);
    }
  }, [error, fallbackSrc]);

  const currentSrc = error && fallbackSrc ? fallbackSrc : src;

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-700" aria-hidden="true" />
      )}
      {fallbackError ? (
        <div className="flex h-full w-full items-center justify-center text-2xl text-gray-600" aria-label={alt}>?</div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
});
