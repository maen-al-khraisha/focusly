export const imageOptimizationConfig = {
    // Lazy loading settings
    lazyLoading: {
        threshold: 0.1, // Intersection observer threshold
        rootMargin: "50px", // Root margin for intersection observer
        placeholder: "blur", // Placeholder type
        blurDataURL:
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
    },

    // Image quality settings
    quality: {
        webp: 85,
        png: 85,
        jpeg: 85,
    },

    // Responsive image sizes
    sizes: {
        thumbnail: {
            width: 150,
            height: 150,
        },
        small: {
            width: 300,
            height: 200,
        },
        medium: {
            width: 600,
            height: 400,
        },
        large: {
            width: 1200,
            height: 800,
        },
        hero: {
            width: 1920,
            height: 1080,
        },
    },

    // Performance monitoring
    monitoring: {
        enabled: process.env.NODE_ENV === "development",
        trackLoadTimes: true,
        trackErrors: true,
        logToConsole: false,
    },

    // Fallback images
    fallbacks: {
        avatar: "/img/optimized/default-avatar.png",
        logo: "/img/optimized/logo_1200x630.png",
        placeholder: "/img/optimized/placeholder.png",
    },

    // CDN settings (if using a CDN)
    cdn: {
        enabled: false,
        baseUrl: "https://cdn.focusmint.com",
        formats: ["webp", "png", "jpg"],
    },

    // Cache settings
    cache: {
        maxAge: 31536000, // 1 year
        staleWhileRevalidate: 86400, // 1 day
    },
};

export const getOptimizedImageUrl = (src, size = "medium", format = "webp") => {
    const { cdn } = imageOptimizationConfig;
    
    if (cdn.enabled) {
        return `${cdn.baseUrl}${src}?w=${size.width}&h=${size.height}&f=${format}`;
    }
    
    return src;
};

export const getImageSizes = (sizes = ["small", "medium", "large"]) => {
    return sizes
        .map((size) => imageOptimizationConfig.sizes[size])
        .filter(Boolean);
};
