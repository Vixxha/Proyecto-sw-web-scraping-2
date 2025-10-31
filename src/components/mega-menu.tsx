
"use client";

import Link from 'next/link';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const menuData = [
    {
        title: 'Tarjetas de Video',
        items: [
            { name: 'NVIDIA GeForce', href: '/components?category=GPU&brand=NVIDIA' },
            { name: 'AMD Radeon', href: '/components?category=GPU&brand=AMD' },
        ],
        viewAll: '/components?category=GPU'
    },
    {
        title: 'Procesadores',
        items: [
            { name: 'Intel', href: '/components?category=CPU&brand=Intel' },
            { name: 'AMD', href: '/components?category=CPU&brand=AMD' },
        ],
        viewAll: '/components?category=CPU'
    },
    {
        title: 'Placas Madre',
        items: [
            { name: 'Socket Intel', href: '/components?category=Motherboard&search=Intel' },
            { name: 'Socket AMD', href: '/components?category=Motherboard&search=AMD' },
        ],
        viewAll: '/components?category=Motherboard'
    },
    {
        title: 'Memoria RAM',
        items: [
            { name: 'DDR5 Desktop', href: '/components?category=RAM&search=DDR5' },
            { name: 'DDR4 Desktop', href: '/components?category=RAM&search=DDR4' },
        ],
        viewAll: '/components?category=RAM'
    },
    {
        title: 'Almacenamiento',
        items: [
            { name: 'SSD M.2 PCIe NVMe', href: '/components?category=Storage&search=NVMe' },
            { name: 'SSD 2.5" SATA', href: '/components?category=Storage&search=SATA' },
        ],
        viewAll: '/components?category=Storage'
    },
    {
        title: 'Gabinetes',
        items: [
            { name: 'ATX', href: '/components?category=Case&search=ATX' },
            { name: 'Micro-ATX', href: '/components?category=Case&search=Micro-ATX' },
            { name: 'Mini-ITX', href: '/components?category=Case&search=Mini-ITX' },
        ],
        viewAll: '/components?category=Case'
    },
    {
        title: 'Fuentes de Poder',
        items: [
             { name: 'Modulares', href: '/components?category=Power+Supply&search=Modular' },
             { name: '80+ Gold', href: '/components?category=Power+Supply&search=Gold' },
        ],
        viewAll: '/components?category=Power+Supply'
    },
];

export function MegaMenu() {
    return (
        <div className="p-8 bg-background">
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-10">
                {menuData.map((section) => (
                    <div key={section.title}>
                        <h3 className="font-bold text-sm mb-3 text-foreground tracking-wider uppercase">{section.title}</h3>
                        <ul className="space-y-2">
                            {section.items.map((item) => (
                                <li key={item.name}>
                                    <DropdownMenuItem asChild className="p-0 cursor-pointer">
                                        <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors duration-200 text-base w-full block py-1 px-2">
                                            {item.name}
                                        </Link>
                                    </DropdownMenuItem>
                                </li>
                            ))}
                             <li>
                                <DropdownMenuItem asChild className="p-0 cursor-pointer">
                                    <Link href={section.viewAll} className="text-primary hover:underline text-base font-medium w-full block py-1 px-2 mt-2">
                                        Ver todos
                                    </Link>
                                </DropdownMenuItem>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
