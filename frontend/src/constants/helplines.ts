import type { HelplineEntry } from '../types';

/**
 * Official helpline contacts for election-related queries and complaints.
 */
export const HELPLINES: HelplineEntry[] = [
  {
    id: 1,
    name: 'National Voter Helpline',
    type: 'phone',
    value: '1950',
    description: 'Toll-free, available 8 AM – 8 PM daily',
    icon: 'phone',
  },
  {
    id: 2,
    name: 'Election Commission of India',
    type: 'email',
    value: 'complaints@eci.gov.in',
    description: 'For election-related complaints and grievances',
    icon: 'email',
  },
  {
    id: 3,
    name: 'NVSP Portal',
    type: 'url',
    value: 'https://voters.eci.gov.in',
    description: 'Register, update, or check your voter ID online',
    icon: 'globe',
  },
  {
    id: 4,
    name: 'Systematic Voters\' Education',
    type: 'url',
    value: 'https://sveep.eci.gov.in',
    description: 'Voter awareness and education programs by ECI',
    icon: 'info',
  },
];
