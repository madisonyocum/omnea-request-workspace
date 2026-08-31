import type { Person } from './types';

/** Avatar colours are taken directly from the Figma accent + timeline palette. */
export const PEOPLE: Record<string, Person> = {
  me: { id: 'me', name: 'Alex Green', initials: 'AG', colour: '#6e56f8', jobTitle: 'Admin' },
  joe: { id: 'joe', name: 'Joe Willson', initials: 'JW', colour: '#3373d9', jobTitle: 'Marketing manager' },
  devon: { id: 'devon', name: 'Devon Lane', initials: 'DL', colour: '#218c66', jobTitle: 'Procurement lead' },
  martha: { id: 'martha', name: 'Martha Nelson', initials: 'MN', colour: '#6b5ce5', jobTitle: 'VP Marketing' },
  jaslyn: { id: 'jaslyn', name: 'Jaslyn Moore', initials: 'JM', colour: '#d94d3d', jobTitle: 'Finance business partner' },
  sadie: { id: 'sadie', name: 'Sadie Bernard', initials: 'SB', colour: '#3373d9', jobTitle: 'Security engineer' },
  angelina: { id: 'angelina', name: 'Angelina Ware', initials: 'AW', colour: '#c7801a', jobTitle: 'Legal counsel' },
  curtis: { id: 'curtis', name: 'Curtis Henson', initials: 'CH', colour: '#596680', jobTitle: 'Financial controller' },
  procurement: { id: 'procurement', name: 'Procurement', initials: 'PR', colour: '#596680', jobTitle: 'Team' },
  netsuite: { id: 'netsuite', name: 'Netsuite', initials: 'N', colour: '#292e38', jobTitle: 'Integration' },
  anna: { id: 'anna', name: 'Anna Smith', initials: 'AS', colour: '#7a5af8', jobTitle: 'Procurement analyst' },
  robert: { id: 'robert', name: 'Robert Fox', initials: 'RF', colour: '#2e90fa', jobTitle: 'Legal counsel' },
  sam: { id: 'sam', name: 'Sam Roberts', initials: 'SR', colour: '#f04438', jobTitle: 'Security lead' },
  lena: { id: 'lena', name: 'Lena Marsh', initials: 'LM', colour: '#12b76a', jobTitle: 'Legal ops' },
  john: { id: 'john', name: 'John Smith', initials: 'JS', colour: '#7a5af8', jobTitle: 'Procurement' },
  ben: { id: 'ben', name: 'Ben Williams', initials: 'BW', colour: '#12b76a', jobTitle: 'Marketing' },
  peter: { id: 'peter', name: 'Peter Kaminsky', initials: 'PK', colour: '#2e90fa', jobTitle: 'Account manager, Mailchimp' },
  amir: { id: 'amir', name: 'Amir Latif', initials: 'AL', colour: '#f04438', jobTitle: 'Data protection officer' },
  jk: { id: 'jk', name: 'Jia Kwan', initials: 'JK', colour: '#2e90fa', jobTitle: 'IT operations' },
};

export function person(id: string): Person {
  const found = PEOPLE[id];
  if (!found) throw new Error(`Unknown person: ${id}`);
  return found;
}

/** Watchers shown as the overlapping avatar stack in the request header. */
export const WATCHER_IDS = ['sam', 'jk', 'amir', 'ben'];
