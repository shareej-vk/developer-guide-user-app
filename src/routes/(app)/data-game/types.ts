export interface Pet {
  type: string;
  name: string;
  color: string;
}

export interface Character {
  name?: string;
  age?: number;
  isHappy?: boolean;
  isTalkEnabled?: boolean;
  accessories?: string[];
  hairColor?: string;
  eyeColor?: string;
  skinColor?: string;
  eyeBrowRaised?: boolean;
  lookDirection?: 'left' | 'right' | 'center';
  pets?: Pet[];
  pet?: Pet;  // Changed from pet to pets as an array
  talk?: () => void;
}

export interface Level {
  id: number;
  target: Character;
  initialCode: string;
  instructions: string;
  hints: string[];
}
