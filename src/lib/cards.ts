import { NeighborhoodTile } from "~/utils";

// Card neighborhood types
export type Neighborhood = "redlined" | "gentrified" | "middle-income" | "rich";
export type CommercialArea = "store" | "hotel" | "tutor";

export type Location = Neighborhood | CommercialArea;
// Card effect types
export type EffectType = "gems" | "gpa" | "choice" | "probability";

// Effect magnitude (-3 to +3, where negative is bad, positive is good)
export type EffectMagnitude = number;

// Card interface
export interface Card {
  id: string;
  title: string;
  description: string;
  location: Location;
  effects: CardEffect[];
  finalOutcome?: BaseCardEffect[];
}

// Effect structure for gems and gpa
export interface BaseCardEffect {
  type: "gems" | "gpa";
  magnitude: EffectMagnitude;
}

// Effect structure for probability-based effects
export interface ProbabilityEffect {
  type: "probability";
  description?: string;
  // Function that takes a roll value (1-6) and returns effects to apply
  getOutcome: (roll: number) => BaseCardEffect[];
}

// Effect structure for choice-based effects
export interface ChoiceEffect {
  type: "choice";
  // Options the player can choose between
  options: {
    label: string;
    effects: BaseCardEffect[];
  }[];
}

// Union type for all card effects
export type CardEffect = BaseCardEffect | ProbabilityEffect | ChoiceEffect;

// New Type for Starting Profiles
export interface SpawnConfig {
  id: string; // e.g., 'smogshire', 'maplecrest'
  name: string; // e.g., 'Smogshire Student'
  neighborhood: Neighborhood;
  building: NeighborhoodTile;
  initialGems: number;
  description: string; // Short description / backstory
}

// Define the four starting profiles
export const spawnConfigs: SpawnConfig[] = [
  {
    id: "smogshire",
    name: "Smogshire",
    neighborhood: "redlined",
    building: "cottage",
    initialGems: 80,
    description:
      "Grew up facing systemic hurdles in an underfunded neighborhood. Helps care for younger siblings as single mother works two jobs. Motivated despite struggles.",
  },
  {
    id: "maplecrest",
    name: "Maplecrest",
    neighborhood: "middle-income",
    building: "house",
    initialGems: 120,
    description:
      "Child of immigrant parents in a stable, working-class neighborhood. Family emphasizes education but lacks connections or funds for extras. Helps family navigate.",
  },
  {
    id: "goldcrest",
    name: "Goldcrest",
    neighborhood: "rich",
    building: "skyscraper",
    initialGems: 150,
    description:
      "From an affluent family in a high-resource neighborhood. Attends top schools, has access to tutors, internships, and family connections. Unaware of systemic advantages.",
  },
  {
    id: "oldbrick",
    name: "Oldbrick",
    neighborhood: "gentrified",
    building: "mansion",
    initialGems: 100,
    description:
      "Lives in a rapidly gentrifying neighborhood. Family struggles with rising rent in a shared apartment. Navigates cultural tensions and displacement.",
  },
];

// Create a deck of cards
export function createDeck(): Card[] {
  return [
    // redlined Neighborhood - Negative Cards
    {
      id: "red-n-1",
      title: "Food Desert",
      description:
        "Your neighborhood is classified as a food desert. You spend extra time and gems traveling for groceries.",
      location: "redlined",
      effects: [{ type: "gems", magnitude: -1 }],
    },
    {
      id: "red-n-2",
      title: "Limited Library Hours",
      description:
        "The nearest library branch in your neighborhood has limited hours due to budget cuts. You can't always study there anymore.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -0.5 }],
    },
    {
      id: "red-n-3",
      title: "Parent Works Two Jobs",
      description:
        "Your parent works two jobs, leaving little time to help with school.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -0.5 }],
    },
    {
      id: "red-n-4",
      title: "Wildfire Health Impact",
      description:
        "A wildfire in California leads to poor air quality, hitting low-income neighborhoods hardest. You have to pay for healthcare.",
      location: "redlined",
      effects: [
        {
          type: "probability",
          description: ">= 4 get better healthcare coverage",
          getOutcome: (roll) => {
            // Roll 4 or higher for better outcome
            return roll >= 4
              ? [{ type: "gems", magnitude: -10 }]
              : [{ type: "gems", magnitude: -20 }];
          },
        },
      ],
    },
    {
      id: "red-n-5",
      title: "Unreliable Public Transit",
      description:
        "Your neighborhood's public transit is unreliable. You're late to school.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-6",
      title: "Limited School Resources",
      description:
        "Your school lacks advanced courses. You struggle with preparing for the SAT.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-7",
      title: "Family Healthcare Crisis",
      description:
        "Your younger sibling got sick, and your parents can't take time off work. You must stay home to take care of them.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-8",
      title: "Utility Bills Crisis",
      description:
        "Your family can't afford the rising utility bills, and your electricity is cut off. Lose 1 Study Session.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-9",
      title: "ICE Raids",
      description:
        "ICE raids in your community have caused panic. Your family avoids legal trouble but lives in fear.",
      location: "redlined",
      effects: [
        {
          type: "probability",
          description: "Roll a die. Roll a 3 or higher to be safe.",
          getOutcome: (roll) => {
            // Roll 3 or higher for positive outcome
            return roll >= 3
              ? []
              : [
                  {
                    type: "gems",
                    magnitude: -2,
                    description:
                      "Your grandmother got detained by ICE. Pay for an immigration lawyer.",
                  },
                ];
          },
        },
      ],
    },
    {
      id: "red-n-10",
      title: "Medical Emergency",
      description:
        "Your uninsured family member needs urgent medical care, and you have to help.",
      location: "redlined",
      effects: [{ type: "gems", magnitude: -20 }],
    },
    {
      id: "red-n-11",
      title: "Household Responsibilities.",
      description:
        "Your parent picks up extra shifts, leaving you to manage household responsibilities.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-12",
      title: "Sibling Suspension",
      description:
        "Your sibling gets suspended from school, and your parents expect you to help them keep up.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -0.5 }],
    },
    {
      id: "red-n-13",
      title: "Move in with Relatives",
      description:
        "Your family can’t afford rent anymore, so you move into a relative’s small apartment.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -0.5 }],
    },
    {
      id: "red-n-14",
      title: "Expensive Internet",
      description:
        "Your family can’t afford the internet, making homework difficult.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },

    // redlined Neighborhood - Positive Cards
    {
      id: "red-p-1",
      title: "Massive Scholarship",
      description: "You just received a massive scholarship!",
      location: "redlined",
      effects: [{ type: "gems", magnitude: 2 }],
    },
    {
      id: "red-p-2",
      title: "Sibling Support",
      description: "Your older sibling helps you study for a test.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "red-p-3",
      title: "Library Grant",
      description:
        "Your underfunded library finally gets a grant for STEM workshops, and you learn coding for free.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "red-p-4",
      title: "Urban Farm Project",
      description:
        "A new urban farm project in your area gives families access to free, healthy produce. You eat better and feel more energized.",
      location: "redlined",
      effects: [
        { type: "gems", magnitude: 1 },
        { type: "gpa", magnitude: 1 },
      ],
    },

    {
      id: "red-p-5",
      title: "Small Scholarship",
      description: "You received a small scholarship!",
      location: "redlined",
      effects: [{ type: "gems", magnitude: 8 }],
    },
    {
      id: "red-p-6",
      title: "Study Group",
      description:
        "You and your friends start a study group that meets weekly at the library.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: 0.5 }],
    },
    {
      id: "red-p-7",
      title: "STEM Camp",
      description:
        "You’re selected for a free STEM camp hosted by a nearby university.",
      location: "redlined",
      effects: [{ type: "gpa", magnitude: 0.5 }],
    },

    // Special Location Cards - Hotel and Cornershop
    {
      id: "loc-hotel-1",
      title: "Part-time Job Opportunity",
      description:
        "Your family is struggling financially, so you consider taking on a part-time job at the hotel.",
      location: "hotel",
      effects: [
        {
          type: "choice",
          options: [
            {
              label: "Decline",
              effects: [],
            },
            {
              label: "Accept job - Valet",
              effects: [
                { type: "gems", magnitude: 20 },
                { type: "gpa", magnitude: -2 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "loc-store-1",
      title: "Corner Store Job",
      description: "The local corner store is hiring part-time help.",
      location: "store",
      effects: [
        {
          type: "choice",
          options: [
            {
              label: "Decline",
              effects: [],
            },
            {
              label: "Accept job - Cashier",
              effects: [
                { type: "gems", magnitude: 10 },
                { type: "gpa", magnitude: -1 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "loc-tutor-1",
      title: "Tutor",
      description: "Private tutor offers you one tutoring session.",
      location: "tutor",
      effects: [
        {
          type: "choice",
          options: [
            {
              label: "Decline",
              effects: [],
            },
            {
              label: "Accept tutoring",
              effects: [
                { type: "gems", magnitude: -10 },
                { type: "gpa", magnitude: 1 },
              ],
            },
          ],
        },
      ],
    },

    // gentrified Neighborhood Cards
    {
      id: "gen-n-1",
      title: "Community Center Closure",
      description:
        "Gentrification forces your favorite community center to shut down. You can't study there anymore.",
      location: "gentrified",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "gen-n-2",
      title: "Rent Control Rollback",
      description:
        "The city introduces a rent control rollback. Your family's rent spikes.",
      location: "gentrified",
      effects: [{ type: "gems", magnitude: -10 }],
    },
    {
      id: "gen-n-3",
      title: "Tech Company Move-In",
      description:
        "A new tech company moves in, driving up housing prices. Now, your family has to put off any plans to buy a house.",
      location: "gentrified",
      effects: [{ type: "gems", magnitude: -10 }],
    },
    {
      id: "gen-n-4",
      title: "Grocery store price increased",
      description:
        "Your local grocery store carries healthy food now, but prices have increased. You have to budget carefully.",
      location: "gentrified",
      effects: [{ type: "gems", magnitude: -1 }],
    },
    {
      id: "gen-n-5",
      title: "Parents stressed due to eviction",
      description:
        "Your parent lost a longtime neighbor to eviction. The stress affects their mood and availability.",
      location: "gentrified",
      effects: [{ type: "gpa", magnitude: -2 }],
    },

    // gentrified Positive Cards
    {
      id: "gen-p-1",
      title: "Private Tutoring",
      description:
        "Your neighbor gets a private tutor and offers you one free tutoring session.",
      location: "gentrified",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "gen-p-2",
      title: "Summer Internship",
      description:
        "Your affluent neighbor's parent pulls strings to get you a summer internship. But you have to pay for it",
      location: "gentrified",
      effects: [
        { type: "gpa", magnitude: 1 },
        { type: "gems", magnitude: -5 },
      ],
    },
    {
      id: "gen-p-3",
      title: "Writing Competition",
      description:
        "You win a creative writing competition and get some prize gems.",
      location: "gentrified",
      effects: [{ type: "gems", magnitude: 5 }],
    },
    {
      id: "gen-p-4",
      title: "Affordable Housing",
      description:
        "Your family secures one of the new rent-controlled apartments in the neighborhood.",
      location: "gentrified",
      effects: [{ type: "gems", magnitude: 10 }],
    },

    {
      id: "gen-p-5",
      title: "AP Class Enrollment",
      description:
        "Your public school receives a funding boost, but demand for advanced classes still outpaces supply. Competition is fierce.",
      location: "gentrified",
      effects: [
        {
          type: "probability",
          description:
            "Roll a die. Roll a 4 or higher to enroll in the AP class.",
          getOutcome: (roll) => {
            if (roll >= 4) {
              return [
                {
                  type: "gpa",
                  magnitude: +2,
                  description:
                    "You made it into the AP class! Your transcript stands out.",
                },
              ];
            }

            return [
              {
                type: "gpa",
                magnitude: -1,
                description:
                  "You didn't make it into the AP class. You can try again next year.",
              },
            ];
          },
        },
      ],
    },
    {
      id: "gen-p-6",
      title: "New laptop",
      description:
        "Your school now partners with a tech company. You get a refurbished laptop. ",
      location: "gentrified",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    // Middle Income Cards
    {
      id: "mid-n-1",
      title: "Scholarship Competition",
      description:
        "A scholarship opportunity is available, but preference is given to students from wealthier schools.",
      location: "middle-income",
      effects: [
        {
          type: "probability",
          description: "Roll a die to see if you qualify.",
          getOutcome: (roll) => {
            // Roll 4 or higher to get scholarship
            return roll >= 4 ? [{ type: "gems", magnitude: 10 }] : [];
          },
        },
      ],
    },
    {
      id: "mid-n-2",
      title: "AI Layoffs",
      description:
        "One of your parents gets laid off due to an AI boom. The tech company is doing mass layoffs.",
      location: "middle-income",
      effects: [{ type: "gems", magnitude: -20 }],
    },

    // Middle Income Positive
    {
      id: "mid-p-1",
      title: "PTA Funding",
      description:
        "Local PTA Funds New AP Classes – Your school receives additional funding from the parent association, expanding AP course offerings.",
      location: "middle-income",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "mid-p-2",
      title: "Public Park Upgrade",
      description:
        "There are lots of city investments into public park upgrades, you have lots of free recreation options to keep you healthy and happy. This allows you to perform better in school",
      location: "middle-income",
      effects: [{ type: "gpa", magnitude: 0.25 }],
    },
    {
      id: "mid-p-3",
      title: "Stay at home parent",
      description:
        "You have a stay-at-home parent who is able to help you with homework and school activities. ",
      location: "middle-income",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "mid-p-4",
      title: "SAT Prep course middle",
      description:
        "Your school offers SAT prep courses after school. You attend regularly.",
      location: "middle-income",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "mid-n-3",
      title: "Internet maintenance",
      description:
        "You lose internet for a day due to service maintenance. Your assignment is submitted late and you incur a penalty",
      location: "middle-income",
      effects: [{ type: "gpa", magnitude: -0.25 }],
    },
    {
      id: "mid-n-4",
      title: "Birthday",
      description:
        "Your younger sibling's birthday is coming up! You pitch in to get him an action figure he's wanted for a long time.",
      location: "middle-income",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "mid-n-5",
      title: "Foreign Exchange Program",
      description:
        "Your school is organising a foreign exchange program for one week. You earn credit but it is expensive!",
      location: "middle-income",
      effects: [
        { type: "gpa", magnitude: 1 },
        { type: "gems", magnitude: -10 },
      ],
    },

    // rich Neighborhood Cards
    {
      id: "rich-p-1",
      title: "Connected Parents",
      description:
        "Your affluent neighbor's parent pulls strings to get them a summer internship. The internship will help you attain more information and receive a better grade.",
      location: "rich",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "rich-p-2",
      title: "SAT Prep Course",
      description: "Your family enrolls you in an expensive SAT prep course.",
      location: "rich",
      effects: [{ type: "gpa", magnitude: 2 }],
    },
    {
      id: "rich-p-3",
      title: "Alumni Connections",
      description:
        "Your parent is an alumnus of a prestigious university. They write you a college recommendation letter.",
      location: "rich",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "rich-p-4",
      title: "Focus on School",
      description:
        "Your parents handle all chores, so you can focus entirely on school.",
      location: "rich",
      effects: [{ type: "gpa", magnitude: 0.5 }],
    },
    {
      id: "rich-p-5",
      title: "Private School",
      description:
        "You attend a private or well-funded public school with good support services. Your teachers have PhDs and can give you individual attention",
      location: "rich",
      effects: [
        { type: "gems", magnitude: -20 },
        { type: "gpa", magnitude: 3 },
      ],
    },
    {
      id: "rich-p-6",
      title: "Trust Fund",
      description:
        "You inherit a trust fund milestone payout when you turn 18.",
      location: "rich",
      effects: [{ type: "gems", magnitude: 20 }],
    },
    {
      id: "rich-p-7",
      title: "Internet",
      description:
        "Your family has high-speed internet and bought you your own laptop, which allows you to easily study",
      location: "rich",
      effects: [
        { type: "gems", magnitude: -10 },
        { type: "gpa", magnitude: 0.5 },
      ],
    },
    {
      id: "rich-p-8",
      title: "Study Room",
      description:
        "Your house has a study room specifically designed for you. This allows you a quiet space to lock in and concentrate.",
      location: "rich",
      effects: [{ type: "gpa", magnitude: 0.5 }],
    },
    {
      id: "rich-n-1",
      title: "Sick",
      description:
        "You fall sick before a major exam, and have to take a day off to recover.",
      location: "rich",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "rich-n-2",
      title: "Parent Pressure",
      description:
        "Your parents have extremely high expectations for you. This leads to high academic stress and you have a panic attack before an important test.",
      location: "rich",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "rich-n-3",
      title: "Stock market crashes",
      description:
        "The stock market crashed and your parents lost a lot of money in investments.",
      location: "rich",
      effects: [{ type: "gems", magnitude: -40 }],
    },
  ];
}

// Get a subset of cards by neighborhood
export function getCardsByLocation(deck: Card[], location: Location): Card[] {
  return deck.filter((card) => card.location === location);
}

// Apply base card effects (gems, gpa) directly to game state
export function applyBaseEffect(effect: BaseCardEffect): {
  gems?: number;
  gpa?: number;
} {
  const result: {
    gems?: number;
    gpa?: number;
  } = {};

  switch (effect.type) {
    case "gems":
      result.gems = effect.magnitude;
      break;
    case "gpa":
      // Convert magnitude to appropriate GPA scale change
      // Adjust the divisor as needed based on your game balancing
      result.gpa = effect.magnitude;
      break;
  }

  return result;
}

// Function to process probability/roll outcome
export function processRoll(
  effect: ProbabilityEffect,
  roll: number
): BaseCardEffect[] {
  return effect.getOutcome(roll);
}

// Function to handle player choice selection
export function processChoice(
  effect: ChoiceEffect,
  choiceIndex: number
): BaseCardEffect[] {
  if (choiceIndex >= 0 && choiceIndex < effect.options.length) {
    return effect.options[choiceIndex].effects;
  }
  return [];
}

// Draw a random card from the deck based on neighborhood
export function drawCard(
  deck: Card[],
  location: Location
): { card: Card | null; remainingDeck: Card[] } {
  if (deck.length === 0) {
    return { card: null, remainingDeck: [] };
  }

  // Filter cards by neighborhood neighborhood
  const locationCards = getCardsByLocation(deck, location);

  // If no cards for this neighborhood, reset the deck
  deck = !locationCards.length
    ? deck.concat(getCardsByLocation(createDeck(), location))
    : deck;

  // Draw a random card from the neighborhood-specific cards
  const randomIndex = Math.floor(Math.random() * locationCards.length);
  const card = locationCards[randomIndex];

  // Remove the selected card from the deck
  const remainingDeck = deck.filter((c) => c.id !== card.id);

  return {
    card,
    remainingDeck: isCommercial(card.location) ? deck : remainingDeck,
  };
}

/**
 * Selects a random starting profile.
 * @returns A randomly chosen StartingProfile.
 */
export function spawn(): SpawnConfig {
  // Simple vanilla JS random selection
  const randomIndex = Math.floor(Math.random() * spawnConfigs.length);
  return spawnConfigs[randomIndex];
}

export function getSpawnConfig(neighborhood: Neighborhood) {
  return spawnConfigs.find(
    (s) => s.neighborhood === neighborhood
  ) as SpawnConfig;
}

export function isCommercial(location: Location): boolean {
  return location === "store" || location === "hotel" || location === "tutor";
}
