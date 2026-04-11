'use client';

import React, { useState, useEffect } from 'react';

interface AppImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    fill?: boolean;
    sizes?: string;
    onClick?: () => void;
    fallbackSrc?: string;
    [key: string]: any;
}

function AppImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    fill = false,
    onClick,
    fallbackSrc = '/assets/images/no_image.webp',
    ...props
}: AppImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    // Sync internal state when src prop changes
    useEffect(() => {
        setImageSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError && imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
            setHasError(true);
        }
    };

    const clickClass = onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : '';
    const combinedClassName = `${className} ${clickClass}`.trim();

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={fill ? `${combinedClassName} absolute inset-0 w-full h-full object-cover` : combinedClassName}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            onError={handleError}
            onClick={onClick}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
        />
    );
}

export default AppImage;
