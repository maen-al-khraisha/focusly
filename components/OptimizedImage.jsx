"use client";

import React from "react";
import Image from "next/image";
import { useImageLazyLoading } from "@/hooks/useImageLazyLoading";
import { imageOptimizationConfig } from "@/config/imageOptimization";

const OptimizedImage = ({
    src,
    alt,
    width,
    height,
    className = "",
    priority = false,
    fallbackSrc = null,
    onLoad = null,
    onError = null,
    placeholder = imageOptimizationConfig.lazyLoading.placeholder,
    blurDataURL = imageOptimizationConfig.lazyLoading.blurDataURL,
    ...props
}) => {
    const {
        imgRef,
        isLoaded,
        isInView,
        error,
        handleLoad,
        handleError,
        shouldLoad,
    } = useImageLazyLoading(src, {
        fallbackSrc:
            fallbackSrc || imageOptimizationConfig.fallbacks.placeholder,
        onLoad,
        onError,
        threshold: imageOptimizationConfig.lazyLoading.threshold,
        rootMargin: imageOptimizationConfig.lazyLoading.rootMargin,
    });

    // If priority is true, load immediately
    if (priority) {
        return (
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                priority={priority}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        );
    }

    // If not in view, show placeholder
    if (!shouldLoad) {
        return (
            <div
                ref={imgRef}
                className={`${className} bg-gray-200 animate-pulse`}
                style={{
                    width: width,
                    height: height,
                    backgroundImage: `url(${blurDataURL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
        );
    }

    // If error, show error state
    if (error) {
        return (
            <div
                className={`${className} bg-red-100 flex items-center justify-center text-red-500 text-sm`}
                style={{ width: width, height: height }}>
                <span>Failed to load image</span>
            </div>
        );
    }

    // Load the actual image
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"}`}
            loading='lazy'
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            onLoad={handleLoad}
            onError={handleError}
            style={{
                transition: "opacity 0.3s ease-in-out",
            }}
            {...props}
        />
    );
};

export default OptimizedImage;
