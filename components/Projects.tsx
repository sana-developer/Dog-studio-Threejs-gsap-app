import { useGSAP } from '@gsap/react';
import * as React from 'react';
import { useState } from 'react';
import gsap from 'gsap';

export default function Projects() {
    const projects = [
        { key: 'Tomorrowland', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, omnis?', bg: '#8f0c27' },
        { key: 'Navy Pier', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, omnis?', bg: '#ec4899' },   // pink-500
        { key: 'MSI Chicago', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, omnis?', bg: '#3b82f6' }, // blue-500
        { key: 'This Was Louises Phone', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, omnis?', bg: '#22c55e' }, // green-500
    ];

    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    useGSAP(() => {
        gsap.from(".projectTitle", {
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: "power.out",
            duration: 1,
        })
    })

    useGSAP(() => {
        const currentItem = projects.find(p => p.key === hoveredKey);

        gsap.to("#mainpage", {
            backgroundColor: currentItem ? currentItem.bg : "#1e2438",
            duration: 0.5,
            ease: "power2.out",
        });

    }, [hoveredKey]);

    return (
        <div className='flex flex-col pl-10 text-gray-400 py-20 relative'>
            <span>Featured Projects</span>
            {projects.map((item) => (
                <div
                    key={item.key}
                    onMouseEnter={() => setHoveredKey(item.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                >
                    <h1 className='projectTitle text-8xl my-3 cursor-pointer hover:text-gray-300'>{item.key}</h1>
                    {hoveredKey === item.key && (
                        <p className='mt-4 absolute bottom-0 right-10 w-50 h-20'>{item.value}</p>
                    )}
                </div>
            ))}
        </div>
    );
}