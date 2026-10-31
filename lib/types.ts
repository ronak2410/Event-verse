export type EventType = 
  | 'wedding' 
  | 'birthday' 
  | 'corporate' 
  | 'community' 
  | 'anniversary';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export type BudgetCategoryKey = 
  | 'venue' 
  | 'catering' 
  | 'decor' 
  | 'entertainment' 
  | 'photography' 
  | 'contingency';

export interface CategoryAllocation {
  id: BudgetCategoryKey;
  name: string;
  percentage: number;
  allocatedAmount: number;
  spentAmount: number;
  iconName: string;
  color: string;
  lightBg: string;
  aiSuggestedPercentage?: number;
  rationale?: string;
}

export interface EventDetails {
  id: string;
  title: string;
  type: EventType;
  totalBudget: number;
  currency: Currency;
  guestCount: number;
  date: string;
  location: string;
  vibe: string;
  culturalDietary: string;
  priorityFocus: 'balanced' | 'food_first' | 'atmosphere' | 'entertainment' | 'memories';
}

export interface MilestoneTask {
  id: string;
  title: string;
  completed: boolean;
  category: BudgetCategoryKey | 'general';
  deadlineDate?: string;
}

export interface TimelineMilestone {
  id: string;
  phase: string;
  timeframe: string;
  tasks: MilestoneTask[];
}

export interface DayOfScheduleItem {
  id: string;
  time: string;
  durationMinutes: number;
  title: string;
  category: string;
  leadPerson: string;
  notes: string;
  completed: boolean;
}

export type VendorStatus = 'Researching' | 'Contacted' | 'Booked' | 'Paid';

export interface Vendor {
  id: string;
  name: string;
  category: BudgetCategoryKey | 'attire' | 'transport' | 'other';
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  estimatedCost: number;
  actualCost: number;
  status: VendorStatus;
  notes: string;
  contractSigned: boolean;
  depositPaid: boolean;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface ActivityIdea {
  id: string;
  title: string;
  description: string;
  targetGroup: string;
  timeframe: string;
  tags: string[];
}

export interface InvitationCopy {
  style: 'Formal & Royal' | 'Modern & Chic' | 'Warm & Whimsical' | 'Short & Punchy';
  subject: string;
  body: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface MusicTrackIdea {
  id: string;
  moment: string; // e.g. "Grand Entrance", "Dinner Ambience", "Peak Dancefloor"
  songRecommendation: string;
  artist: string;
  bpm: number;
  energyLevel: 'Calm & Elegant' | 'Groovy & Upbeat' | 'High Voltage Peak';
}

export interface AIIdeaLabData {
  themeConcept: string;
  themeDescription: string;
  keyAtmosphereWords: string[];
  colorPalette: ColorSwatch[];
  activities: ActivityIdea[];
  invitationCopies: InvitationCopy[];
  customChatHistory: ChatMessage[];
  playlistSoundtrack?: MusicTrackIdea[];
}

export interface EventVerseState {
  version: string;
  lastUpdated: string;
  isAiGenerating: boolean;
  aiMode: 'gemini' | 'mock';
  event: EventDetails;
  budgetAllocations: Record<BudgetCategoryKey, CategoryAllocation>;
  milestones: TimelineMilestone[];
  dayOfSchedule: DayOfScheduleItem[];
  vendors: Vendor[];
  ideaLab: AIIdeaLabData;
}
