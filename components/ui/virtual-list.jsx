"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export function VirtualList({ 
    items, 
    itemHeight = 60, 
    containerHeight = 400,
    renderItem,
    className = ""
}) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);
    
    // Calculate visible range
    const visibleRange = useMemo(() => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(
            startIndex + Math.ceil(containerHeight / itemHeight) + 1,
            items.length
        );
        return { startIndex, endIndex };
    }, [scrollTop, itemHeight, containerHeight, items.length]);
    
    // Get visible items
    const visibleItems = useMemo(() => {
        return items.slice(visibleRange.startIndex, visibleRange.endIndex);
    }, [items, visibleRange]);
    
    // Calculate total height
    const totalHeight = items.length * itemHeight;
    
    // Calculate offset for visible items
    const offsetY = visibleRange.startIndex * itemHeight;
    
    const handleScroll = useCallback((e) => {
        setScrollTop(e.target.scrollTop);
    }, []);
    
    return (
        <div 
            ref={containerRef}
            className={`overflow-auto ${className}`}
            style={{ height: containerHeight }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map((item, index) => (
                        <div key={index + visibleRange.startIndex} style={{ height: itemHeight }}>
                            {renderItem(item, index + visibleRange.startIndex)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 