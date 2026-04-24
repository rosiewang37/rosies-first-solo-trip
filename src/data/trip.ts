export type Tag = { type: 'cost' | 'transit' | 'tip'; text: string };

export type Location = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type Restaurant = Location & { why: string };

export type Block = {
  id: string;
  duration: number;
  title: string;
  details: string;
  type: 'normal' | 'travel' | 'free';
  tags: Tag[];
  // Legacy single-string location. Being phased out in favour of `locations`.
  // Still read by ScheduleBlock when `locations` is absent.
  location?: string;
  // New discriminator. When omitted, block is treated as legacy `type`.
  kind?: 'activity' | 'eat' | 'travel' | 'free';
  // For activity / travel blocks: each place gets its own Google Maps link.
  locations?: Location[];
  // For eating blocks: area label + curated restaurant picks.
  eating?: {
    area: string;
    areaCenter: { lat: number; lng: number };
    picks: Restaurant[];
  };
};

export type Recommendation = {
  id: string;
  title: string;
  location?: string;
  details: string;
  defaultDuration: number;
  tags: Tag[];
};

export type Day = {
  id: string;
  label: string;
  title: string;
  date: string;
  dateISO: string;
  city: string;
  startTime: string;
  blocks: Block[];
  recommendations: Recommendation[];
  optionalVisits?: Location[];
};

export type TodoItem = { id: string; title: string; desc: string };
export type TodoSection = { id: string; title: string; className: string; items: TodoItem[] };

export const days: Day[] = [
  {
    id: 'day1',
    label: 'Sat 4/25',
    title: 'Day 1 — Arrival',
    date: 'Saturday, April 25',
    dateISO: '2026-04-25',
    city: 'Boston',
    startTime: '8:00 AM',
    blocks: [
      {
        id: 'day1-drive',
        duration: 660,
        title: 'Drive to Boston',
        location: 'Sault Ste. Marie → Boston',
        details: '8-hour drive with your friend. Pack snacks, download offline maps, podcasts.',
        type: 'travel',
        tags: [{ type: 'transit', text: '8 hrs by car' }],
      },
      {
        id: 'day1-arrive',
        duration: 60,
        title: 'Arrive at couch surfing spot',
        location: 'Downtown 02109 (Financial District / Waterfront)',
        details: "Drop bags, meet your host, settle in. You're right in the heart of old Boston.",
        type: 'normal',
        tags: [],
      },
      {
        id: 'day1-dinner',
        duration: 120,
        title: 'Dinner in the North End',
        location: '5 min walk from 02109',
        details: "You're steps from Little Italy. Pick one: Regina Pizzeria (brick-oven, $20), Giacomo's (cash-only red-sauce legend, $25), or grab a cannoli at Modern Pastry.",
        type: 'normal',
        tags: [
          { type: 'cost', text: '$20-30' },
          { type: 'tip', text: 'Modern > Mike\'s for cannoli' },
        ],
      },
      {
        id: 'day1-sleep',
        duration: 60,
        title: 'Early sleep',
        location: '',
        details: 'Tomorrow is a big walking day. Rest up.',
        type: 'free',
        tags: [],
      },
    ],
    recommendations: [],
  },
  {
    id: 'day2',
    label: 'Sun 4/26',
    title: 'Day 2 — Freedom Trail',
    date: 'Sunday, April 26',
    dateISO: '2026-04-26',
    city: 'Boston',
    startTime: '9:00 AM',
    blocks: [
      {
        id: 'day2-visitor-center',
        duration: 30,
        title: 'Freedom Trail Visitor Center',
        location: '139 Tremont St, Boston Common',
        details: 'Walk 10 min from 02109 to the start. Grab the $3 map booklet — the red brick line guides the whole 2.5 miles.',
        type: 'normal',
        tags: [
          { type: 'cost', text: '$3 map' },
          { type: 'transit', text: '10 min walk' },
        ],
      },
      {
        id: 'day2-trail-first',
        duration: 180,
        title: 'Trail: Common → Old State House',
        location: 'Freedom Trail, first half',
        details: "MA State House (gold dome) → Park Street Church → Granary Burying Ground (Paul Revere's grave) → King's Chapel → Old South Meeting House ($15) → Old State House ($15, Boston Massacre site).",
        type: 'normal',
        tags: [{ type: 'cost', text: '$15-30 museums' }],
      },
      {
        id: 'day2-lunch-quincy',
        duration: 60,
        title: 'Lunch at Quincy Market',
        location: 'Faneuil Hall Marketplace',
        details: 'Mid-trail pit stop. Chowder in a bread bowl, lobster roll, whatever calls you. Food hall, tons of options.',
        type: 'normal',
        tags: [{ type: 'cost', text: '$15-25' }],
      },
      {
        id: 'day2-trail-second',
        duration: 150,
        title: 'Trail: North End → Charlestown',
        location: 'Freedom Trail, second half',
        details: "Paul Revere House ($6, quick 15 min) → Old North Church (free, 'one if by land...') → Copp's Hill Burying Ground → over the bridge to Charlestown.",
        type: 'normal',
        tags: [{ type: 'cost', text: '$6' }],
      },
      {
        id: 'day2-bunker-hill',
        duration: 180,
        title: 'Bunker Hill + USS Constitution',
        location: 'Charlestown, Boston',
        details: 'Bunker Hill Monument — climb the 294 stairs for the view (FREE). USS Constitution — oldest commissioned warship in the world (FREE, bring photo ID).',
        type: 'normal',
        tags: [
          { type: 'cost', text: 'Free' },
          { type: 'tip', text: 'Bring ID for USS Constitution' },
        ],
      },
      {
        id: 'day2-neptune',
        duration: 150,
        title: 'Dinner — Neptune Oyster',
        location: '63 Salem St, North End, Boston',
        details: 'Famous lobster roll ($35). No reservations, expect a wait — or skip to Regina Pizzeria / Giacomo\'s if the line is too long.',
        type: 'normal',
        tags: [
          { type: 'cost', text: '$35-50' },
          { type: 'tip', text: 'Show up right at open or expect 1hr+ wait' },
        ],
      },
      {
        id: 'day2-walk-home',
        duration: 30,
        title: 'Walk back to 02109',
        location: '',
        details: "5 minute walk. You're staying right here. Perfect location for tonight.",
        type: 'normal',
        tags: [{ type: 'transit', text: '5 min walk' }],
      },
    ],
    recommendations: [],
  },
  {
    id: 'day3',
    label: 'Mon 4/27',
    title: 'Day 3 — Cambridge + MFA',
    date: 'Monday, April 27',
    dateISO: '2026-04-27',
    city: 'Boston',
    startTime: '9:30 AM',
    blocks: [
      {
        id: 'day3-subway-harvard',
        duration: 30,
        title: 'Subway to Harvard',
        location: 'State St → Park St → Harvard',
        details: 'Blue Line from State Street → transfer at Park Street to Red Line → Harvard Square. About 25 min.',
        type: 'normal',
        tags: [{ type: 'transit', text: 'Blue + Red Line, $2.40' }],
      },
      {
        id: 'day3-harvard',
        duration: 150,
        title: 'Harvard Yard + Harvard Art Museums',
        location: 'Cambridge, MA',
        details: "Walk Harvard Yard (free), rub John Harvard's shoe. Harvard Art Museums are FREE for everyone — Monet, Van Gogh, Rothko. Allow 1-1.5 hrs.",
        type: 'normal',
        tags: [{ type: 'cost', text: 'Free' }],
      },
      {
        id: 'day3-lunch-harvard',
        duration: 90,
        title: 'Lunch in Harvard Square',
        location: 'Harvard Square, Cambridge',
        details: "Felipe's Taqueria ($12), Bartley's Burger Cottage ($18, legendary), or Tatte Bakery for something lighter.",
        type: 'normal',
        tags: [{ type: 'cost', text: '$12-18' }],
      },
      {
        id: 'day3-mit',
        duration: 150,
        title: 'MIT',
        location: 'Kendall/MIT station',
        details: "Red Line: Harvard → Kendall/MIT (10 min). Walk the Infinite Corridor, see the Great Dome, poke into the Stata Center (Frank Gehry's wild building). MIT Museum $18 ($12 student) — worth it for AI/robotics.",
        type: 'normal',
        tags: [
          { type: 'cost', text: '$12 student' },
          { type: 'transit', text: 'Red Line, 10 min' },
        ],
      },
      {
        id: 'day3-public-garden',
        duration: 120,
        title: 'Public Garden + Swan Boats',
        location: 'Arlington Station, Boston',
        details: 'Red Line → Park Street → walk into Public Garden. Swan Boats ($4.75, 15 min, pay cash), Make Way for Ducklings statues, cherry trees (possibly still blooming!). Walk through Boston Common next door.',
        type: 'normal',
        tags: [
          { type: 'cost', text: '$4.75' },
          { type: 'tip', text: 'Garden free, boats cash only' },
        ],
      },
      {
        id: 'day3-mfa-climbing',
        duration: 120,
        title: 'MFA OR climbing — pick one',
        location: 'Boston',
        details: 'Option A: Museum of Fine Arts until close (~$26 student, great Egyptian + Sargent collections). Option B: Rock Spot Climbing South Boston ($25 day pass, 15 min T ride). Both are solid — climbing gym is 10 min Red Line from Back Bay.',
        type: 'normal',
        tags: [
          { type: 'cost', text: '$25-26' },
          { type: 'tip', text: 'MFA closes 5pm Mon. Go to climbing.' },
        ],
      },
      {
        id: 'day3-dinner',
        duration: 120,
        title: 'Dinner in the South End or Back Bay',
        location: 'Back Bay, Boston',
        details: "Yvonne's (trendy, Back Bay, $$$), Atlantic Fish Co. (seafood, $$-$$$), or Tasty Burger (casual, South End).",
        type: 'normal',
        tags: [{ type: 'cost', text: '$20-40' }],
      },
    ],
    recommendations: [],
  },
  {
    id: 'day4',
    label: 'Tue 4/28',
    title: 'Day 4 — Boston → NYC',
    date: 'Tuesday, April 28',
    dateISO: '2026-04-28',
    city: 'Travel',
    startTime: '9:30 AM',
    blocks: [
      {
        id: 'day4-breakfast',
        duration: 90,
        title: 'Breakfast + pack',
        location: '02109',
        details: "Coffee at Tatte or a local cafe. Pack up, check out. You've got time.",
        type: 'normal',
        tags: [],
      },
      {
        id: 'day4-last-boston',
        duration: 90,
        title: 'One last Boston thing',
        location: 'Boston',
        details: 'Options: Boston Public Library (Bates Reading Room, free, stunning), Beacon Hill / Acorn Street walk, or any spot you missed.',
        type: 'normal',
        tags: [{ type: 'cost', text: 'Free' }],
      },
      {
        id: 'day4-walk-south-station',
        duration: 60,
        title: 'Walk to South Station',
        location: 'Atlantic Ave, Boston',
        details: '10-15 min walk from 02109. Or Uber ($8). Arrive 30 min before bus.',
        type: 'normal',
        tags: [{ type: 'transit', text: '15 min walk' }],
      },
      {
        id: 'day4-bus',
        duration: 300,
        title: 'Bus: Boston → NYC',
        location: 'South Station → Port Authority',
        details: 'FlixBus / Peter Pan / Megabus, ~$25-40, ~4.5 hours. Book on Wanderu or Busbud 2-3 days ahead. Wifi + power outlets.',
        type: 'travel',
        tags: [
          { type: 'cost', text: '$25-40' },
          { type: 'transit', text: '4.5 hrs' },
        ],
      },
      {
        id: 'day4-arrive-lic',
        duration: 90,
        title: 'Arrive NYC → LIC',
        location: 'Port Authority → Vernon Blvd',
        details: '7 train (Flushing-bound) from Times Square-42nd St → Vernon Blvd-Jackson Ave (2 stops, 10 min). Walk 5 min to 42 24th St.',
        type: 'travel',
        tags: [{ type: 'transit', text: '7 train, $2.90' }],
      },
      {
        id: 'day4-dinner-lic',
        duration: 180,
        title: 'Dinner in LIC + skyline view',
        location: 'Gantry Plaza State Park',
        details: 'LIC is underrated. John Brown Smokehouse (BBQ, cheap), Casa Enrique (Michelin Mexican, pricey), or grab cheap eats and walk to Gantry Plaza State Park for the BEST Manhattan skyline view in the entire city. Free. Iconic.',
        type: 'normal',
        tags: [
          { type: 'cost', text: '$12-40' },
          { type: 'tip', text: 'Gantry Plaza at sunset = best NYC view' },
        ],
      },
    ],
    recommendations: [],
  },
  {
    id: 'day5',
    label: 'Wed 4/29',
    title: 'Day 5 — Midtown + Broadway',
    date: 'Wednesday, April 29',
    dateISO: '2026-04-29',
    city: 'NYC',
    startTime: '8:30 AM',
    blocks: [
      {
        id: 'day5-lottery',
        duration: 30,
        title: 'ENTER BROADWAY LOTTERIES',
        location: 'TodayTix app',
        details: "CRITICAL: Submit digital lotteries for tonight's shows. Free to enter. Best picks for your budget: Hamilton ($10, Fri only), & Juliet ($47 rush), Book of Mormon ($49), Every Brilliant Thing ($45). Winners notified mid-morning.",
        type: 'normal',
        tags: [
          { type: 'cost', text: '$10-49' },
          { type: 'tip', text: 'Enter multiple shows to maximize odds' },
        ],
      },
      {
        id: 'day5-subway-midtown',
        duration: 30,
        title: 'Subway to Midtown',
        location: 'Vernon Blvd → Grand Central',
        details: '7 train to Grand Central-42nd St. 10 min ride.',
        type: 'normal',
        tags: [{ type: 'transit', text: '7 train, $2.90' }],
      },
      {
        id: 'day5-grand-central',
        duration: 120,
        title: 'Grand Central + Bryant Park + NYPL',
        location: 'Midtown East, NYC',
        details: 'Grand Central: free, see the celestial ceiling. Try the Whispering Gallery (stand diagonally across the arch near the Oyster Bar). Walk to Bryant Park (5 min) + New York Public Library (free, Rose Reading Room is stunning, lions out front).',
        type: 'normal',
        tags: [{ type: 'cost', text: 'Free' }],
      },
      {
        id: 'day5-rockefeller',
        duration: 120,
        title: 'Rockefeller Center + lunch',
        location: '30 Rockefeller Plaza',
        details: "See Atlas statue, skating rink area. Grab a slice from Joe's Pizza ($4) or bagel from Ess-a-Bagel ($10) for lunch.",
        type: 'normal',
        tags: [{ type: 'cost', text: '$4-15' }],
      },
      {
        id: 'day5-central-park',
        duration: 180,
        title: 'Central Park — walk through',
        location: 'Central Park, NYC',
        details: 'Enter at Columbus Circle. Walk: Pond → Wollman Rink → Sheep Meadow → The Mall → Bethesda Terrace + Fountain (iconic) → Bow Bridge → Strawberry Fields. Exit 72nd St W. ~2.5 miles, relaxed pace.',
        type: 'normal',
        tags: [
          { type: 'cost', text: 'Free' },
          { type: 'transit', text: 'On foot' },
        ],
      },
      {
        id: 'day5-rest',
        duration: 90,
        title: 'Rest / coffee',
        location: 'Anywhere Midtown',
        details: "You've been walking a lot. Grab a coffee, sit down.",
        type: 'free',
        tags: [],
      },
      {
        id: 'day5-top-of-rock',
        duration: 60,
        title: 'Top of the Rock — SUNSET SLOT',
        location: '30 Rockefeller Plaza',
        details: 'BOOK IN ADVANCE. The only observation deck that has the Empire State Building IN the view. Go at sunset — you see daylight → golden hour → city lights. Best 30 min of the trip.',
        type: 'normal',
        tags: [
          { type: 'cost', text: '~$40' },
          { type: 'tip', text: 'Book online before trip' },
        ],
      },
      {
        id: 'day5-dinner-theater',
        duration: 60,
        title: 'Quick dinner near theater',
        location: 'Midtown, NYC',
        details: 'Los Tacos No. 1 ($15), The Halal Guys cart at 53rd & 6th ($12, NYC icon), or any quick slice.',
        type: 'normal',
        tags: [{ type: 'cost', text: '$12-20' }],
      },
      {
        id: 'day5-broadway',
        duration: 165,
        title: 'Broadway show!',
        location: 'Theater District, NYC',
        details: 'Go directly to your theater by 7:30 PM. Print your ticket confirmation if required.',
        type: 'normal',
        tags: [{ type: 'cost', text: 'Lottery/rush price' }],
      },
      {
        id: 'day5-times-square',
        duration: 60,
        title: 'Times Square at night + subway home',
        location: 'Times Square, NYC',
        details: "Wander Times Square briefly (it's an experience). 7 train back to Vernon Blvd-Jackson Ave.",
        type: 'normal',
        tags: [{ type: 'transit', text: '7 train' }],
      },
    ],
    recommendations: [],
  },
  {
    id: 'day6',
    label: 'Thu 4/30',
    title: 'Day 6 — Downtown + Brooklyn',
    date: 'Thursday, April 30',
    dateISO: '2026-04-30',
    city: 'NYC',
    startTime: '9:00 AM',
    blocks: [
      {
        id: 'day6-subway-battery',
        duration: 60,
        title: 'Subway to Battery Park',
        location: 'Vernon Blvd → Bowling Green',
        details: '7 → Grand Central → 4/5 Express → Bowling Green. ~30 min. Walk to Statue Cruises entrance.',
        type: 'normal',
        tags: [
          { type: 'transit', text: '7 + 4/5 Express' },
          { type: 'tip', text: 'Book ferry online in advance!' },
        ],
      },
      {
        id: 'day6-statue-ellis',
        duration: 240,
        title: 'Statue of Liberty + Ellis Island',
        location: 'Liberty + Ellis Islands',
        details: 'Ferry to Liberty Island (~20 min), walk around Lady Liberty, short museum. Ferry to Ellis Island (~10 min) — Immigration Museum is genuinely moving, the more powerful of the two. Ferry back to Battery Park.',
        type: 'normal',
        tags: [
          { type: 'cost', text: '~$25' },
          { type: 'tip', text: 'Airport-style security, come early' },
        ],
      },
      {
        id: 'day6-lunch-fidi',
        duration: 60,
        title: 'Lunch near Financial District',
        location: 'Stone Street or Eataly, NYC',
        details: 'Stone Street — historic pedestrian strip with pubs. Or Eataly Financial District (Italian market/food hall).',
        type: 'normal',
        tags: [{ type: 'cost', text: '$15-25' }],
      },
      {
        id: 'day6-911',
        duration: 120,
        title: '9/11 Memorial + Oculus',
        location: '180 Greenwich St',
        details: "Outdoor memorial pools are free and powerful. Museum is $29 (students) — 2+ hours, emotional, skip if you're overwhelmed. The Oculus (Santiago Calatrava's white transit hub) is free to walk through, wild architecture.",
        type: 'normal',
        tags: [{ type: 'cost', text: 'Free - $29' }],
      },
      {
        id: 'day6-brooklyn-bridge',
        duration: 60,
        title: 'Walk the Brooklyn Bridge',
        location: 'Brooklyn Bridge',
        details: '1.1 mi, ~30 min, stunning views. FREE. Stay on the pedestrian path (not bike lane). End in DUMBO.',
        type: 'normal',
        tags: [
          { type: 'cost', text: 'Free' },
          { type: 'transit', text: 'On foot' },
        ],
      },
      {
        id: 'day6-dumbo',
        duration: 120,
        title: 'DUMBO photo op + pizza',
        location: 'Washington St, Brooklyn',
        details: "Iconic photo: Washington Street with Empire State Building framed inside the Manhattan Bridge arch. Then Juliana's Pizza (best pizza in NYC — fight me). Margherita $25, feeds 2-3.",
        type: 'normal',
        tags: [{ type: 'cost', text: '$25' }],
      },
      {
        id: 'day6-brooklyn-park',
        duration: 90,
        title: "Brooklyn Bridge Park + Jane's Carousel",
        location: 'Brooklyn Bridge Park, NYC',
        details: "Waterfront park with the best Manhattan skyline view from below. Jane's Carousel ($2 if open).",
        type: 'normal',
        tags: [{ type: 'cost', text: 'Free-$2' }],
      },
      {
        id: 'day6-cliffs',
        duration: 90,
        title: 'ICONIC CLIMB — The Cliffs at LIC',
        location: '11-11 44th Dr, LIC',
        details: "Also called Movement LIC. 9 min walk from your accommodation. Open until 11 PM. 45-ft walls, 2 floors of bouldering, lead cave — one of NYC's premier gyms. Day pass ~$38.",
        type: 'normal',
        tags: [
          { type: 'cost', text: '~$38' },
          { type: 'tip', text: "9 min from home, iconic, can't miss" },
        ],
      },
    ],
    recommendations: [],
  },
  {
    id: 'day7',
    label: 'Fri 5/1',
    title: 'Day 7 — West Side + Village',
    date: 'Friday, May 1',
    dateISO: '2026-05-01',
    city: 'NYC',
    startTime: '10:00 AM',
    blocks: [
      {
        id: 'day7-subway-highline',
        duration: 30,
        title: 'Subway to The High Line',
        location: 'Vernon Blvd → 14th St',
        details: '7 train → Times Sq → 1 downtown to 14th St. Enter High Line at Gansevoort Street (south end, Meatpacking District).',
        type: 'normal',
        tags: [{ type: 'transit', text: '7 + 1 train' }],
      },
      {
        id: 'day7-highline',
        duration: 120,
        title: 'Walk The High Line',
        location: 'Gansevoort → Hudson Yards',
        details: 'Elevated park on old rail line. 1.5 miles. Stop into Chelsea Market (connected halfway) for lunch.',
        type: 'normal',
        tags: [{ type: 'cost', text: 'Free' }],
      },
      {
        id: 'day7-chelsea',
        duration: 90,
        title: 'Lunch at Chelsea Market',
        location: '75 9th Ave, New York, NY',
        details: 'Los Tacos No. 1 (iconic, always worth the line, $15), Cull & Pistol lobster roll, or The Bagel Store.',
        type: 'normal',
        tags: [{ type: 'cost', text: '$15-25' }],
      },
      {
        id: 'day7-village',
        duration: 120,
        title: 'Greenwich Village wander',
        location: 'West Village, NYC',
        details: 'Subway to W 4th St. Wander: MacDougal St, Bleecker St, Washington Square Park (NYU arch, chess players, buskers). Coffee at Caffe Reggio (1927) or Joe Coffee.',
        type: 'normal',
        tags: [{ type: 'cost', text: '$5-10 coffee' }],
      },
      {
        id: 'day7-strand',
        duration: 90,
        title: 'The Strand Bookstore',
        location: '828 Broadway, Union Sq',
        details: '18 miles of books. Easy to lose 90 min here. Iconic.',
        type: 'normal',
        tags: [{ type: 'cost', text: 'Free to browse' }],
      },
      {
        id: 'day7-subway-les',
        duration: 30,
        title: 'Subway → Lower East Side',
        location: 'Union Sq → Delancey-Essex',
        details: 'F or M train to Delancey-Essex St. Easy transfer.',
        type: 'normal',
        tags: [{ type: 'transit', text: 'F/M train' }],
      },
      {
        id: 'day7-katz',
        duration: 90,
        title: "Katz's Delicatessen",
        location: '205 E Houston St, NYC',
        details: "Pastrami on rye ($28, huge portion). NYC icon. When Harry Met Sally table is marked. Go early to avoid lines.",
        type: 'normal',
        tags: [
          { type: 'cost', text: '$28' },
          { type: 'tip', text: "Don't lose your ticket — big fine" },
        ],
      },
      {
        id: 'day7-east-village',
        duration: 90,
        title: 'East Village stroll + Economy Candy',
        location: 'East Village, NYC',
        details: 'Walk Tompkins Square Park. Stop at Economy Candy (Rivington St, iconic since 1937).',
        type: 'normal',
        tags: [{ type: 'cost', text: '$5-15' }],
      },
      {
        id: 'day7-mcsorleys',
        duration: 60,
        title: "Optional: McSorley's Old Ale House",
        location: '15 E 7th St, NYC',
        details: "NYC's oldest Irish bar (1854). Cash only, $5 beers. Living piece of history. Or just head home early to pack.",
        type: 'normal',
        tags: [
          { type: 'cost', text: '$5-15' },
          { type: 'tip', text: '21+, bring passport' },
        ],
      },
    ],
    recommendations: [],
  },
  {
    id: 'day8',
    label: 'Sat 5/2',
    title: 'Day 8 — Departure',
    date: 'Saturday, May 2',
    dateISO: '2026-05-02',
    city: 'NYC → Home',
    startTime: '9:30 AM',
    blocks: [
      {
        id: 'day8-breakfast',
        duration: 90,
        title: 'Slow breakfast in LIC',
        location: 'Sweetleaf Coffee, Long Island City',
        details: 'Nothing rushed. Pack up gradually. Your flight is 7 PM — you have all day.',
        type: 'normal',
        tags: [{ type: 'cost', text: '$10-15' }],
      },
      {
        id: 'day8-last-nyc',
        duration: 180,
        title: 'One last NYC thing (pick one)',
        location: 'NYC',
        details: 'Options: MoMA ($17 student — Starry Night, Water Lilies, Picasso, Warhol), one more climb at The Cliffs at LIC (it\'s right there), or just relax at Gantry Plaza Park.',
        type: 'normal',
        tags: [{ type: 'cost', text: '$0-17' }],
      },
      {
        id: 'day8-pack',
        duration: 30,
        title: 'Final pack + check out',
        location: '42 24th St, LIC',
        details: 'Back to accommodation. Pack fully. Say goodbye to your host.',
        type: 'normal',
        tags: [],
      },
      {
        id: 'day8-lunch',
        duration: 90,
        title: 'Lunch — grab and go',
        location: 'LIC',
        details: "Anything easy. Don't start a big meal — you've got a flight.",
        type: 'normal',
        tags: [{ type: 'cost', text: '$10-15' }],
      },
      {
        id: 'day8-to-lga',
        duration: 60,
        title: 'LIC → LaGuardia',
        location: 'LaGuardia Airport (LGA)',
        details: 'Q70 SBS bus from Roosevelt Ave ($2.90, ~20 min) OR Uber/Lyft ($20-30, 15-20 min). Uber is the stress-free call.',
        type: 'travel',
        tags: [
          { type: 'cost', text: '$3-30' },
          { type: 'transit', text: '15-20 min' },
        ],
      },
      {
        id: 'day8-airport',
        duration: 120,
        title: 'Airport + security',
        location: 'LaGuardia Airport (LGA)',
        details: "2 hours before a domestic flight at LGA is fine. For int'l to Canada, treat like 2.5 hrs (US-CA pre-clearance can be slow).",
        type: 'normal',
        tags: [{ type: 'tip', text: 'Bring passport + reservation' }],
      },
      {
        id: 'day8-flight',
        duration: 60,
        title: 'Flight home',
        location: 'LGA → Home',
        details: 'You did it. 8 days, 2 cities, countless memories. Well done!',
        type: 'travel',
        tags: [],
      },
    ],
    recommendations: [],
  },
];

export const todoSections: TodoSection[] = [
  {
    id: 'before',
    title: 'Before you leave Canada',
    className: 'before',
    items: [
      { id: 'insurance', title: 'Book travel insurance', desc: '$25-40 for 8 days (RBC, Manulife, SquareMouth). A single US ER visit can be $5k+. Non-negotiable.' },
      { id: 'esim', title: 'Buy US eSIM', desc: 'Airalo, Holafly, or Ubigi. ~$15-25 for 5-10GB over the trip. Install at home over wifi. Keeps your Canadian SIM active for calls/texts.' },
      { id: 'offline-maps', title: 'Download Google Maps offline for Boston + NYC', desc: 'Settings → Offline maps → select each city. Works without data.' },
      { id: 'apps', title: 'Download all apps', desc: 'TodayTix, Transit (or Citymapper for NYC), MBTA, Uber, Lyft, Wanderu, Google Maps' },
      { id: 'bank', title: 'Notify your bank about US travel', desc: 'Prevents frozen cards. Do it online in your banking app.' },
      { id: 'statue', title: 'Book Statue of Liberty ferry online', desc: 'statuecruises.com, April 30 10 AM slot, ~$25. Gets pedestal access. Sells out.' },
      { id: 'topofrock', title: 'Book Top of the Rock sunset slot', desc: 'April 29, ~$40. Book a slot ~60 min before sunset for best experience.' },
      { id: 'bus', title: 'Book Boston→NYC bus', desc: 'Wanderu or Busbud, April 28 early afternoon. $25-40. Book 3-5 days ahead for best price.' },
      { id: 'photocopy', title: 'Photo of passport + ID', desc: 'Keep in your phone + email to yourself. For if anything gets lost.' },
      { id: 'student-id', title: "Verify your Queen's student ID is current", desc: 'Gets you MFA student price ($26), MoMA ($17), Broadway student rush ($25).' },
    ],
  },
  {
    id: 'boston',
    title: 'Boston day-of',
    className: 'boston',
    items: [
      { id: 'freedomtrail-map', title: 'Buy the Freedom Trail map booklet ($3)', desc: 'At the Visitor Center, 139 Tremont St. Worth it — the self-guided booklet is genuinely informative.' },
      { id: 'neptune', title: 'Plan Neptune Oyster timing', desc: 'No reservations. Either be there 30 min before open OR go 2-3 PM weekday. Dinner prime time = 1hr+ wait.' },
      { id: 'mfa-exhibitions', title: 'Check what\'s on at the MFA before going', desc: 'Framing Nature (through June 28), Unbraid: Hair Clay Craft (through July 26). General admission ~$26 student.' },
      { id: 'climbing-gear', title: 'Plan climbing shoe rental or bring your own', desc: 'Rock Spot rentals are ~$5. If you already own shoes, pack them.' },
    ],
  },
  {
    id: 'nyc',
    title: 'NYC day-of',
    className: 'nyc',
    items: [
      { id: 'lottery-daily', title: 'Enter Broadway lotteries daily by 9 AM', desc: 'TodayTix app. Enter multiple shows to maximize odds. Winners notified 11 AM - 1 PM.' },
      { id: 'metro-card', title: 'Use Apple Pay / Google Pay at subway turnstiles', desc: 'OMNY system — just tap your phone/card. No need to buy a MetroCard. $2.90 per ride, caps at $34/week.' },
      { id: 'cliffs-waiver', title: 'Fill Cliffs at LIC waiver online beforehand', desc: 'Saves 15 min at check-in. movementgyms.com/lic' },
      { id: 'broadway-backup', title: 'Backup Broadway plan: TKTS booth', desc: 'Times Sq booth, opens 3 PM (11 AM Wed/Thu/Sat). Same-day tix 20-50% off if lottery fails.' },
      { id: 'airport-plan', title: 'Day 8 - set 4 PM alarm to leave for airport', desc: 'Q70 bus or Uber. LGA is 15-20 min from LIC. Be there by 5 PM for 7 PM flight.' },
    ],
  },
  {
    id: 'packing',
    title: 'Packing',
    className: 'packing',
    items: [
      { id: 'passport', title: 'Passport', desc: "Check expiry date is 6+ months out. Put it somewhere you won't forget." },
      { id: 'walking-shoes', title: 'Broken-in walking shoes', desc: "You're doing 15-20k steps daily. DO NOT bring brand new shoes — your feet will hate you." },
      { id: 'backpack', title: 'Small day backpack', desc: 'For your daily essentials (water, jacket, snacks, charger).' },
      { id: 'water-bottle', title: 'Refillable water bottle', desc: 'US water fountains are everywhere.' },
      { id: 'rain-jacket', title: 'Light rain jacket + one warm layer', desc: 'April-May in NE US: highs 55-65°F, lows 45°F, chance of rain. Layers are key.' },
      { id: 'phone-charger', title: 'Phone charger + portable power bank', desc: "You'll drain your battery using Maps + TodayTix all day." },
      { id: 'credit-card', title: 'Credit card(s) with no foreign transaction fee', desc: 'Rogers World Elite, Scotia Passport Visa, or similar. Bring a backup card too.' },
      { id: 'cash', title: '$40-60 USD cash', desc: "Emergency buffer. Most places are card-only but Swan Boats, McSorley's, buskers are cash." },
      { id: 'climbing-shoes', title: 'Climbing shoes (if you own them)', desc: 'Saves $5-10 in rentals at each gym.' },
      { id: 'meds', title: 'Any prescription meds + basics', desc: "Tylenol, bandaids, anything specific you use. Pharmacies exist in the US but it's easier to bring." },
    ],
  },
];
