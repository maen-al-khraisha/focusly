"use client";

import { useEffect, useState } from 'react';

const ImagePerformanceMonitor = () => {
    const [metrics, setMetrics] = useState({
        totalImages: 0,
        loadedImages: 0,
        failedImages: 0,
        averageLoadTime: 0,
        totalLoadTime: 0
    });

    useEffect(() => {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.name.includes('img') || entry.name.includes('image')) {
                    const loadTime = entry.duration;
                    setMetrics(prev => ({
                        ...prev,
                        totalImages: prev.totalImages + 1,
                        loadedImages: prev.loadedImages + 1,
                        totalLoadTime: prev.totalLoadTime + loadTime,
                        averageLoadTime: (prev.totalLoadTime + loadTime) / (prev.loadedImages + 1)
                    }));
                }
            });
        });

        observer.observe({ entryTypes: ['resource'] });

        // Monitor image load events
        const handleImageLoad = (event) => {
            const img = event.target;
            const loadTime = performance.now() - performance.timing.navigationStart;
            
            setMetrics(prev => ({
                ...prev,
                totalImages: prev.totalImages + 1,
                loadedImages: prev.loadedImages + 1,
                totalLoadTime: prev.totalLoadTime + loadTime,
                averageLoadTime: (prev.totalLoadTime + loadTime) / (prev.loadedImages + 1)
            }));
        };

        const handleImageError = () => {
            setMetrics(prev => ({
                ...prev,
                totalImages: prev.totalImages + 1,
                failedImages: prev.failedImages + 1
            }));
        };

        // Add event listeners to all images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', handleImageLoad);
            img.addEventListener('error', handleImageError);
        });

        return () => {
            observer.disconnect();
            images.forEach(img => {
                img.removeEventListener('load', handleImageLoad);
                img.removeEventListener('error', handleImageError);
            });
        };
    }, []);

    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs z-50">
            <h3 className="font-bold mb-2">Image Performance</h3>
            <div className="space-y-1">
                <div>Total: {metrics.totalImages}</div>
                <div>Loaded: {metrics.loadedImages}</div>
                <div>Failed: {metrics.failedImages}</div>
                <div>Avg Load Time: {metrics.averageLoadTime.toFixed(2)}ms</div>
            </div>
        </div>
    );
};

export default ImagePerformanceMonitor; 