export type ItemKind = 'animal' | 'border' | 'banner' | 'freeze'

export interface ShopItem {
  id: string
  kind: ItemKind
  name: string
  price: number
  blurb?: string
  days?: number // freeze items only
  insect?: boolean // animal items shown under Insects
}

export const SHOP: ShopItem[] = [
  // streak freezes: stackable, cover missed days
  { id: 'freeze-1', kind: 'freeze', name: '1-day freeze', price: 110, days: 1, blurb: 'Covers one missed day' },
  { id: 'freeze-3', kind: 'freeze', name: '3-day freeze', price: 300, days: 3, blurb: 'Covers up to three missed days' },
  { id: 'freeze-7', kind: 'freeze', name: '1-week freeze', price: 650, days: 7, blurb: 'Covers a whole week away' },

  { id: 'animal-lion', kind: 'animal', name: 'Lion', price: 60 },
  { id: 'animal-koala', kind: 'animal', name: 'Koala', price: 60 },
  { id: 'animal-dog', kind: 'animal', name: 'Dog', price: 60 },
  { id: 'animal-pig', kind: 'animal', name: 'Pig', price: 60 },
  { id: 'animal-duck', kind: 'animal', name: 'Duck', price: 60 },
  { id: 'animal-tiger', kind: 'animal', name: 'Tiger', price: 80 },
  { id: 'animal-elephant', kind: 'animal', name: 'Elephant', price: 80 },
  { id: 'animal-giraffe', kind: 'animal', name: 'Giraffe', price: 80 },
  { id: 'animal-zebra', kind: 'animal', name: 'Zebra', price: 80 },
  { id: 'animal-hedgehog', kind: 'animal', name: 'Hedgehog', price: 90 },
  { id: 'animal-hippo', kind: 'animal', name: 'Hippo', price: 90 },
  { id: 'animal-turtle', kind: 'animal', name: 'Turtle', price: 100 },
  { id: 'animal-monkey', kind: 'animal', name: 'Monkey', price: 100 },
  { id: 'animal-wolf', kind: 'animal', name: 'Wolf', price: 120 },

  { id: 'animal-bee', kind: 'animal', insect: true, name: 'Bee', price: 70 },
  { id: 'animal-ladybug', kind: 'animal', insect: true, name: 'Ladybug', price: 70 },
  { id: 'animal-caterpillar', kind: 'animal', insect: true, name: 'Caterpillar', price: 70 },
  { id: 'animal-ant', kind: 'animal', insect: true, name: 'Ant', price: 80 },
  { id: 'animal-grasshopper', kind: 'animal', insect: true, name: 'Grasshopper', price: 90 },
  { id: 'animal-butterfly', kind: 'animal', insect: true, name: 'Butterfly', price: 110 },

  { id: 'border-gold', kind: 'border', name: 'Gold ring', price: 40 },
  { id: 'border-sand', kind: 'border', name: 'Sandstone', price: 40 },
  { id: 'border-leaf', kind: 'border', name: 'Leafy', price: 50 },
  { id: 'border-ocean', kind: 'border', name: 'Ocean', price: 50 },
  { id: 'border-dash', kind: 'border', name: 'Dotted', price: 50 },
  { id: 'border-ice', kind: 'border', name: 'Ice', price: 60 },
  { id: 'border-candy', kind: 'border', name: 'Candy stripe', price: 70 },
  { id: 'border-bee', kind: 'border', name: 'Buzz', price: 70 },
  { id: 'border-royal', kind: 'border', name: 'Royal', price: 90 },
  { id: 'border-glow', kind: 'border', name: 'Violet glow', price: 80 },
  { id: 'border-neon', kind: 'border', name: 'Neon', price: 100 },
  { id: 'border-flame', kind: 'border', name: 'Flame', price: 100 },
  { id: 'border-galaxy', kind: 'border', name: 'Galaxy', price: 130 },
  { id: 'border-rainbow', kind: 'border', name: 'Rainbow', price: 120 },

  { id: 'banner-desert', kind: 'banner', name: 'Desert dunes', price: 60 },
  { id: 'banner-forest', kind: 'banner', name: 'Pine forest', price: 60 },
  { id: 'banner-snow', kind: 'banner', name: 'Snowfall', price: 70 },
  { id: 'banner-ocean', kind: 'banner', name: 'Ocean', price: 70 },
  { id: 'banner-candy', kind: 'banner', name: 'Candy', price: 60 },
  { id: 'banner-sunset', kind: 'banner', name: 'Sunset', price: 80 },
  { id: 'banner-night', kind: 'banner', name: 'Starry night', price: 90 },
  { id: 'banner-gold', kind: 'banner', name: 'Golden hour', price: 120 },
]

export const ITEM_BY_ID = new Map(SHOP.map((i) => [i.id, i]))

/** Items everyone has from the start. */
export const FREE_BORDER = 'none'
export const FREE_BANNER = 'cream'
export const BORDER_IDS = ['none', ...SHOP.filter((i) => i.kind === 'border').map((i) => i.id.replace('border-', ''))]
