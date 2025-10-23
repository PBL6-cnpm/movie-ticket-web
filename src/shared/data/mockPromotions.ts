export interface Promotion {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    fullDetails: string[];
}

export const mockPromotions: Promotion[] = [
    {
        id: 'promo-1',
        title: 'HAPPY DAY | WEDNESDAY - 45K FOR MEMBERS',
        description: 'Every Wednesday, 2D tickets are only 45K for all Cinestar members.',
        imageUrl: 'https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/MONDAY_1.jpg',
        fullDetails: [
            '2D Ticket: 45,000 VND',
            '3D Ticket: 55,000 VND',
            'C\'MÊ Bed: 95,000 VND',
            'Members still accumulate points and receive discounts on concessions: 15% off for C\'VIP and 10% off for C\'FRIEND.',
            'Note: Members must present their card or registered phone number. Not applicable on holidays, special screenings, or early releases.'
        ]
    },
    {
        id: 'promo-2',
        title: 'HAPPY HOUR | BEFORE 10AM & AFTER 10PM',
        description: 'Get special ticket prices for shows before 10:00 AM and after 10:00 PM.',
        imageUrl: 'https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/HSSV-2.jpg',
        fullDetails: [
            '2D tickets before 10:00 AM: 45,000 VND',
            '2D tickets after 10:00 PM: 49,000 VND',
            '3D tickets (before 10am & after 10pm): 55,000 VND',
            'C\'MÊ Bed (before 10am, Tue-Thu): 95,000 VND',
            'C\'MÊ Bed (after 10pm, Tue-Thu): 99,000 VND',
            'Note: Available for purchase at the cinema, on the app/web, or other online platforms. Not applicable on holidays.'
        ]
    },
    {
        id: 'promo-3',
        title: 'HAPPY DAY | MONDAY - 45K FOR ALL',
        description: 'Every Monday, 2D tickets are just 45K for everyone, all day long!',
        imageUrl: 'https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/CTEN.jpg',
        fullDetails: [
            '2D Ticket: 45,000 VND',
            '3D Ticket: 55,000 VND',
            'C\'MÊ Bed: 95,000 VND',
            'Note: Available for purchase at the cinema, on the app/web, or other online platforms. Not applicable on holidays or for special screenings.'
        ]
    }
];