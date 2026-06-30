/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'ml' | 'mr' | 'bn' | 'gu';

export interface TranslationDict {
  appName: string;
  tagline: string;
  navHome: string;
  navLedger: string;
  navBusiness: string;
  navEvents: string;
  navAchievements: string;
  navNews: string;
  navVoting: string;
  navProfile: string;
  navPlanner?: string;
  
  // Home / Map
  activeIssues: string;
  reportAnIssue: string;
  categoryPothole: string;
  categoryStreetlight: string;
  categoryGarbage: string;
  categoryWaterLeak: string;
  categoryOther: string;
  allCategories: string;
  statusAll: string;
  statusReported: string;
  statusAuthorityContacted: string;
  statusInProgress: string;
  statusResolved: string;
  severityLow: string;
  severityMedium: string;
  severityHigh: string;
  
  // Issue report form
  title: string;
  description: string;
  category: string;
  severity: string;
  location: string;
  attachProof: string;
  submitReport: string;
  voiceInputLabel: string;
  voiceInputListening: string;
  
  // Details
  authorityNotified: string;
  assignedTo: string;
  proofAttached: string;
  noProofAttached: string;
  resolutionDispute: string;
  disputeAction: string;
  confirmAction: string;
  comments: string;
  addComment: string;
  commentPlaceholder: string;
  
  // Ledger
  ledgerTitle: string;
  ledgerSubtitle: string;
  totalFundsAllocated: string;
  totalFundsSpent: string;
  auditTransparency: string;
  transactionDetails: string;
  questionTransaction: string;
  flaggedForAuthority: string;
  vendor: string;
  receipt: string;
  
  // Business
  businessTitle: string;
  businessSubtitle: string;
  messageOwner: string;
  callOwner: string;
  searchPlaceholder: string;
  ownerName: string;
  
  // Events
  eventsTitle: string;
  eventsSubtitle: string;
  rsvpGoing: string;
  rsvpInterested: string;
  rsvpNotGoing: string;
  attendees: string;
  organizer: string;
  
  // Newspaper
  newspaperTitle: string;
  newspaperSubtitle: string;
  weeklyDigest: string;
  resolvedThisWeek: string;
  ledgerHighlights: string;
  featuredEntrepreneur: string;
  
  // Achievements
  achievementsTitle: string;
  achievementsSubtitle: string;
  shareAchievement: string;
  userPoints: string;
  userLevel: string;
  likes: string;
  
  // Voting
  votingTitle: string;
  votingSubtitle: string;
  deadline: string;
  castVote: string;
  yourVoteCast: string;
  activePolls: string;
  pastPolls: string;
  
  // Accessibility
  readAloud: string;
  stopReadAloud: string;
}

export type IssueStatus = 'reported' | 'authority_contacted' | 'in_progress' | 'resolved';
export type IssueSeverity = 'low' | 'medium' | 'high';
export type IssueCategory = 'pothole' | 'streetlight' | 'garbage' | 'water_leak' | 'other';

export interface Comment {
  id: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  text: string;
  timestamp: string;
  isFlagged?: boolean;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  reportedBy: string;
  reportedDate: string;
  authorityDepartment: string;
  authorityContactPerson: string;
  proofs: {
    reported?: string; // image or file url/name
    contacted?: string;
    progress?: string;
    resolved?: string;
  };
  comments: Comment[];
  isDisputed?: boolean;
  isResolvedConfirmedByCommunity?: boolean;
  votesToConfirm?: number;
  votesToDispute?: number;
}

export interface LedgerTransaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  vendor: string;
  description: string;
  relatedIssueId?: string;
  receiptUrl?: string;
  comments: Comment[];
  isQuestioned?: boolean;
}

export interface BusinessProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  addedBy?: string;
}

export interface BusinessReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface LocalBusiness {
  id: string;
  name: string;
  ownerName: string;
  category: string;
  description: string;
  photoUrl: string;
  phoneNumber: string;
  whatsappNumber?: string;
  location: string;
  rating: number;
  products?: BusinessProduct[];
  reviews?: BusinessReview[];
  addedBy?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendeesCount: number;
  userRsvpStatus?: 'going' | 'interested' | 'not_going' | null;
  comments: Comment[];
}

export interface AchievementPost {
  id: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  badgeId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string; // lucide icon identifier
  color: string;
}

export interface VotingPoll {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  deadline: string; // Date string
  isActive: boolean;
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'owner';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  points: number;
  level: number;
  language: Language;
  voiceAccessEnabled: boolean;
  badges: string[]; // Badge IDs
  avatarUrl?: string;
}
