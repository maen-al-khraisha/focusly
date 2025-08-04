import { useState, useEffect, useRef, useCallback } from 'react';

export function useOptimizedTimer() {
    const [timers, setTimers] = useState({});
    const [elapsed, setElapsed] = useState({});
    const timersRef = useRef({});
    const elapsedRef = useRef({});
    const animationFrameRef = useRef(null);
    const lastUpdateRef = useRef(0);

    // Throttle updates to reduce main thread blocking
    const updateTimers = useCallback(() => {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateRef.current;
        
        // Only update if at least 100ms have passed to reduce frequency
        if (timeSinceLastUpdate < 100) {
            animationFrameRef.current = requestAnimationFrame(updateTimers);
            return;
        }

        const updated = {};
        let hasChanges = false;
        
        Object.keys(timersRef.current).forEach((taskId) => {
            const elapsedTime = Math.floor((now - timersRef.current[taskId]) / 1000);
            if (elapsedTime !== elapsedRef.current[taskId]) {
                updated[taskId] = elapsedTime;
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            setElapsed(prev => ({ ...prev, ...updated }));
            elapsedRef.current = { ...elapsedRef.current, ...updated };
        }
        
        lastUpdateRef.current = now;
        
        // Continue the animation loop only if there are active timers
        if (Object.keys(timersRef.current).length > 0) {
            animationFrameRef.current = requestAnimationFrame(updateTimers);
        }
    }, []);

    useEffect(() => {
        if (Object.keys(timersRef.current).length > 0) {
            animationFrameRef.current = requestAnimationFrame(updateTimers);
        }
        
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [updateTimers]);

    const startTimer = useCallback((taskId) => {
        const now = Date.now();
        setTimers(prev => ({ ...prev, [taskId]: now }));
        setElapsed(prev => ({ ...prev, [taskId]: 0 }));
        timersRef.current[taskId] = now;
        elapsedRef.current[taskId] = 0;
        
        // Start the animation loop if it's not already running
        if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(updateTimers);
        }
    }, [updateTimers]);

    const stopTimer = useCallback((taskId) => {
        setTimers(prev => {
            const updated = { ...prev };
            delete updated[taskId];
            return updated;
        });
        setElapsed(prev => {
            const updated = { ...prev };
            updated[taskId] = 0;
            return updated;
        });
        delete timersRef.current[taskId];
        delete elapsedRef.current[taskId];
        
        // Stop the animation loop if no timers are running
        if (Object.keys(timersRef.current).length === 0 && animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    }, [updateTimers]);

    return {
        timers,
        elapsed,
        startTimer,
        stopTimer,
    };
} 