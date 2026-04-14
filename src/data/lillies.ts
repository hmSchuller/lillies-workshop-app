export interface LillyProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

export const LILLIES: LillyProduct[] = [
  {
    id: '1',
    title: 'Die Maus',
    description: 'Die Sendung mit der Maus – Lern- und Geschichtenzeit für kleine und große Hörer.',
    category: 'Lernen',
    imageUrl: 'https://picsum.photos/seed/maus/300/300',
  },
  {
    id: '2',
    title: 'Conni',
    description: 'Conni erlebt aufregende Abenteuer und zeigt Kindern, wie sie den Alltag meistern.',
    category: 'Geschichten',
    imageUrl: 'https://picsum.photos/seed/conni/300/300',
  },
  {
    id: '3',
    title: 'Benjamin Blümchen',
    description: 'Der freundliche Zirkuselefant und sein Freund Otto erleben lustige Abenteuer.',
    category: 'Geschichten',
    imageUrl: 'https://picsum.photos/seed/benjamin/300/300',
  },
  {
    id: '4',
    title: 'Schlaf-Entspannung',
    description: 'Traumreisen und Meditationen für Kinder – perfekt zum Einschlafen.',
    category: 'Entspannung',
    imageUrl: 'https://picsum.photos/seed/schlaf/300/300',
  },
  {
    id: '5',
    title: 'Bibi Blocksberg',
    description: 'Die junge Hexe Bibi und ihre Mutter Barbarina erleben magische Abenteuer.',
    category: 'Geschichten',
    imageUrl: 'https://picsum.photos/seed/bibi/300/300',
  },
];
