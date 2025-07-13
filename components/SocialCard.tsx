"use client";

import React from "react";

interface SocialCardProps {
    author: string;
    username: string;
    avatar: string;
    time: string;
    content: string;
    tags?: string[];
    stats?: {
        likes?: number;
        comments?: number;
        shares?: number;
    };
}

export const SocialCard: React.FC<SocialCardProps> = ({
    author,
    username,
    avatar,
    time,
    content,
    tags = [],
    stats = {},
}) => {
    return (
        <div
            className='rounded-xl border border-[#2e2e3e] bg-[#161622] p-6 transition-all duration-300
                 hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(0,255,255,0.2)]'>
            {/* Header */}
            <div className='flex items-center space-x-3'>
                <img
                    src={avatar}
                    className='h-10 w-10 rounded-full object-cover'
                    alt='avatar'
                />
                <div>
                    <p className='font-semibold text-white leading-none'>
                        {author}
                    </p>
                    <p className='text-sm text-gray-400 leading-none'>
                        @{username} • {time}
                    </p>
                </div>
            </div>

            {/* Content */}
            <p className='text-gray-200 mt-4 leading-relaxed'>{content}</p>

            {/* Tags */}
            {tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-3'>
                    {tags.map((tag, i) => (
                        <span
                            key={i}
                            className='bg-[#2a2a3d] text-xs text-gray-300 px-3 py-1 rounded-full'>
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className='flex justify-between mt-5 text-gray-400 text-sm'>
                <span>❤️ {stats.likes ?? 0}</span>
                <span>💬 {stats.comments ?? 0}</span>
                <span>🔁 {stats.shares ?? 0}</span>
                <span>🔖</span>
            </div>
        </div>
    );
};
