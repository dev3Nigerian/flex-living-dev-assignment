export interface GoogleReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  profilePhotoUrl?: string;
}

export const mockGoogleReviews: GoogleReview[] = [
  {
    id: 'g-1',
    authorName: 'Charlotte Rivera',
    rating: 5,
    text: 'Loved the designer touches at The Flex Shoreditch. Lobby staff were welcoming and the coffee corner was my morning ritual.',
    relativeTimeDescription: '2 weeks ago',
    profilePhotoUrl: 'https://i.pravatar.cc/64?img=12',
  },
  {
    id: 'g-2',
    authorName: 'Tommaso Ricci',
    rating: 4,
    text: 'Great location to explore East London. Slight street noise at night but nothing ear plugs can’t fix.',
    relativeTimeDescription: '1 month ago',
    profilePhotoUrl: 'https://i.pravatar.cc/64?img=32',
  },
  {
    id: 'g-3',
    authorName: 'Dana Stone',
    rating: 3,
    text: 'Beautiful building though booking the rooftop workspace required extra emails. Would appreciate a smoother process.',
    relativeTimeDescription: '3 months ago',
    profilePhotoUrl: 'https://i.pravatar.cc/64?img=52',
  },
];

