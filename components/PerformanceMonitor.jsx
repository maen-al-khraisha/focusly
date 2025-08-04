"use client";

import { useEffect, useState } from 'react';

export function PerformanceMonitor({ children }) {
    const [metrics, setMetrics] = useState({
        fcp: 0,
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0
    });

    useEffect(() => {
        // Monitor First Contentful Paint (FCP)
        const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcp = entries[entries.length - 1];
            setMetrics(prev => ({ ...prev, fcp: fcp.startTime }));
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Monitor Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcp = entries[entries.length - 1];
            setMetrics(prev => ({ ...prev, lcp: lcp.startTime }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Monitor Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
            let cls = 0;
            list.getEntries().forEach((entry) => {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            });
            setMetrics(prev => ({ ...prev, cls }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Monitor Time to First Byte (TTFB)
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        if (navigationEntry) {
            setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
        }

        return () => {
            fcpObserver.disconnect();
            lcpObserver.disconnect();
            fidObserver.disconnect();
            clsObserver.disconnect();
        };
    }, []);

    // Log performance warnings in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const warnings = [];
            
            if (metrics.fcp > 2000) warnings.push('FCP is too high (>2s)');
            if (metrics.lcp > 2500) warnings.push('LCP is too high (>2.5s)');
            if (metrics.fid > 100) warnings.push('FID is too high (>100ms)');
            if (metrics.cls > 0.1) warnings.push('CLS is too high (>0.1)');
            if (metrics.ttfb > 600) warnings.push('TTFB is too high (>600ms)');
            
            if (warnings.length > 0) {
                console.warn('Performance issues detected:', warnings);
            }
        }
    }, [metrics]);

    return children;
} 