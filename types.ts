
export interface Character {
  id: string;
  name: string;
  img1: string;
  subImages: string[];
  vids: string[];
  story?: string;
  personality?: string;
  occupation?: string;
  alignment?: string;
  tags?: string[];
  
  // Biometrics & Biomathematics
  gender: 'Male' | 'Female' | 'Non-binary';
  age: number;
  heightFeet: number;
  heightInches: number;
  weight: number; 
  bust: number;
  waist: number;
  hips: number;

  // Visual Matrix (Granular)
  ethnicity: string;
  skinTone: string;
  bodyType: string;
  breastSize: string;
  buttSize: string;
  
  // Clothing
  upperDressType: string;
  upperDressColor: string;

  // Cranial
  hairColor: string;
  hairStyle: string;
  hairType: string;
  eyeColor: string;
  expression: string;

  // Scene Context
  background: string;
  pose: string;

  // Accessories
  earAccessory?: string;
  noseAccessory?: string;

  // System
  condition: 'Stable' | 'Critical' | 'Enhanced' | 'Unknown';
  dnaHash: string;
  createdAt: number;
}

export interface AppConfig {
  password: string;
  isLocked: boolean;
  headerBanner: string;
  themeColor: string;
  backgroundColor: string;
}

export type ViewType = 'grid' | 'profile' | 'settings';
