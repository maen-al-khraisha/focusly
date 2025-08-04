import { useState, useEffect, useRef } from 'react';

export const useImageLazyLoading = (src, options = {}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [error, setError] = useState(null);
    const imgRef = useRef(null);

    const {
        threshold = 0.1,
        rootMargin = '50px',
        fallbackSrc = null,
        onLoad = null,
        onError = null
    } = options;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold,
                rootMargin
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [threshold, rootMargin]);

    const handleLoad = () => {
        setIsLoaded(true);
        setError(null);
        if (onLoad) onLoad();
    };

    const handleError = () => {
        setError('Failed to load image');
        if (fallbackSrc && src !== fallbackSrc) {
            // Try fallback image
            const img = new Image();
            img.onload = () => {
                setIsLoaded(true);
                setError(null);
            };
            img.onerror = () => {
                setError('Failed to load fallback image');
                if (onError) onError();
            };
            img.src = fallbackSrc;
        } else {
            if (onError) onError();
        }
    };

    return {
        imgRef,
        isLoaded,
        isInView,
        error,
        handleLoad,
        handleError,
        shouldLoad: isInView
    };
}; 