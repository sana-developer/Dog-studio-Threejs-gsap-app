import { useGSAP } from '@gsap/react';
import * as React from 'react';
import { useState } from 'react';
import gsap from 'gsap';

export default function Projects({ onSelectMatcap }) {
    const projects = [
        { key: 'Tomorrowland', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, omnis?', bg: '#8f0c27', matcap: 'mat-1' },
        { key: 'Navy Pier', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, omnis?', bg: '#365435', matcap: 'mat-2' },   // pink-500
        { key: 'MSI Chicago', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, omnis?', bg: '#7A1F1F', matcap: 'mat-3' }, // blue-500
        { key: 'This Was Louises Phone', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, omnis?', bg: '#9E1190', matcap: 'mat-4' }, // green-500
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

        gsap.from(".projectDesc", {
            opacity: 0,
            y: 20,
            duration: 0.9,
            ease: "back.out"
        })


    }, [hoveredKey]);

    return (
        <div className='flex flex-col pl-10 text-gray-400 py-20 relative'>
            <span>Featured Projects</span>
            {projects.map((item) => (
                <div
                    key={item.key}
                    onMouseEnter={() => {
                        setHoveredKey(item.key);
                        onSelectMatcap(item.matcap)
                    }}
                    onMouseLeave={() => {
                        setHoveredKey(null);
                        onSelectMatcap("mat-5");
                    }
                    }
                    className='project'
                >
                    <h1 className='projectTitle text-8xl my-3 cursor-pointer hover:text-gray-300'>{item.key}</h1>
                    {hoveredKey === item.key && (
                        <p className='projectDesc mt-4 absolute bottom-44 right-10 w-70 h-30 border-2 border-black-400 p-3'>{item.value}</p>
                    )}
                </div>
            ))}
        </div>
    );
}