// Card neighborhood types
export type Neighborhood = "redlined" | "gentrified" | "middle-income" | "rich";

// Card effect types
export type EffectType = "gems" | "gpa" | "choice" | "probability";

// Effect magnitude (-3 to +3, where negative is bad, positive is good)
export type EffectMagnitude = -3 | -2 | -1 | 0 | 1 | 2 | 3;

// Card interface
export interface Card {
  id: string;
  title: string;
  description: string;
  neighborhood: Neighborhood;
  effects: CardEffect[];
  finalOutcome?: BaseCardEffect[];
}

// Effect structure for gems and gpa
export interface BaseCardEffect {
  type: "gems" | "gpa";
  magnitude: EffectMagnitude;
  description?: string;
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
  description?: string;
  // Options the player can choose between
  options: {
    label: string;
    effects: BaseCardEffect[];
  }[];
}

// Union type for all card effects
export type CardEffect = BaseCardEffect | ProbabilityEffect | ChoiceEffect;

// Create a deck of cards
export function createDeck(): Card[] {
  return [
    // redlined Neighborhood - Negative Cards
    {
      id: "red-n-1",
      title: "Food Desert",
      description:
        "Your neighborhood is classified as a food desert. You spend extra time and gems traveling for groceries.",
      neighborhood: "redlined",
      effects: [{ type: "gems", magnitude: -1 }],
    },
    {
      id: "red-n-2",
      title: "Limited Library Hours",
      description:
        "The nearest library branch in your neighborhood has limited hours due to budget cuts. You can't always study there anymore.",
      neighborhood: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-3",
      title: "Parent Works Two Jobs",
      description:
        "Your parent works two jobs, leaving little time to help with school.",
      neighborhood: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-4",
      title: "Wildfire Health Impact",
      description:
        "A wildfire in California leads to poor air quality, hitting low-income neighborhoods hardest. You have to pay for healthcare.",
      neighborhood: "redlined",
      effects: [
        {
          type: "probability",
          description:
            "Roll a die. Roll a 4 or higher for better healthcare coverage.",
          getOutcome: (roll) => {
            // Roll 4 or higher for better outcome
            return roll >= 4
              ? [{ type: "gems", magnitude: -1 }]
              : [{ type: "gems", magnitude: -2 }];
          },
        },
      ],
    },
    {
      id: "red-n-5",
      title: "Unreliable Public Transit",
      description:
        "Your neighborhood's public transit is unreliable. You're late to school.",
      neighborhood: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-6",
      title: "Limited School Resources",
      description:
        "Your school lacks advanced courses. You struggle with preparing for the SAT.",
      neighborhood: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-7",
      title: "Family Healthcare Crisis",
      description:
        "Your younger sibling got sick, and your parents can't take time off work. You must stay home to take care of them.",
      neighborhood: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-8",
      title: "Utility Bills Crisis",
      description:
        "Your family can't afford the rising utility bills, and your electricity is cut off. Lose 1 Study Session.",
      neighborhood: "redlined",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "red-n-9",
      title: "ICE Raids",
      description:
        "ICE raids in your community have caused panic. Your family avoids legal trouble but lives in fear.",
      neighborhood: "redlined",
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
      neighborhood: "redlined",
      effects: [
        { type: "gems", magnitude: -3 },
        { type: "gpa", magnitude: -1 },
      ],
    },

    // redlined Neighborhood - Positive Cards
    {
      id: "red-p-1",
      title: "Massive Scholarship",
      description: "You just received a massive scholarship!",
      neighborhood: "redlined",
      effects: [{ type: "gems", magnitude: 2 }],
    },
    {
      id: "red-p-2",
      title: "Sibling Support",
      description: "Your older sibling helps you study for a test.",
      neighborhood: "redlined",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "red-p-3",
      title: "Library Grant",
      description:
        "Your underfunded library finally gets a grant for STEM workshops, and you learn coding for free.",
      neighborhood: "redlined",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "red-p-4",
      title: "Urban Farm Project",
      description:
        "A new urban farm project in your area gives families access to free, healthy produce. You eat better and feel more energized.",
      neighborhood: "redlined",
      effects: [
        { type: "gems", magnitude: 1 },
        { type: "gpa", magnitude: 1 },
      ],
    },

    // Special Location Cards - Hotel and Cornershop
    {
      id: "loc-hotel-1",
      title: "Part-time Job Opportunity",
      description:
        "Your family is struggling financially, so you consider taking on a part-time job at the hotel.",
      neighborhood: "redlined",
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
                { type: "gems", magnitude: 2 },
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
      neighborhood: "redlined",
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
                { type: "gems", magnitude: 1 },
                { type: "gpa", magnitude: -1 },
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
      neighborhood: "gentrified",
      effects: [{ type: "gpa", magnitude: -1 }],
    },
    {
      id: "gen-n-2",
      title: "Rent Control Rollback",
      description:
        "The city introduces a rent control rollback. Your family's rent spikes.",
      neighborhood: "gentrified",
      effects: [{ type: "gems", magnitude: -1 }],
    },
    {
      id: "gen-n-3",
      title: "Tech Company Move-In",
      description:
        "A new tech company moves in, driving up housing prices. Now, your family has to put off any plans to buy a house.",
      neighborhood: "gentrified",
      effects: [{ type: "gems", magnitude: -1 }],
    },

    // gentrified Positive Cards
    {
      id: "gen-p-1",
      title: "Private Tutoring",
      description:
        "Your neighbor gets a private tutor and offers you one free tutoring session.",
      neighborhood: "gentrified",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "gen-p-2",
      title: "Summer Internship",
      description:
        "Your affluent neighbor's parent pulls strings to get you a summer internship.",
      neighborhood: "gentrified",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "gen-p-3",
      title: "Writing Competition",
      description:
        "You win a creative writing competition and get some prize gems.",
      neighborhood: "gentrified",
      effects: [{ type: "gems", magnitude: 1 }],
    },
    {
      id: "gen-p-4",
      title: "Affordable Housing",
      description:
        "Your family secures one of the new rent-controlled apartments in the neighborhood.",
      neighborhood: "gentrified",
      effects: [{ type: "gems", magnitude: 2 }],
    },

    // Middle Income Cards
    {
      id: "mid-n-1",
      title: "Scholarship Competition",
      description:
        "A scholarship opportunity is available, but preference is given to students from wealthier schools.",
      neighborhood: "middle-income",
      effects: [
        {
          type: "probability",
          description: "Roll a die to see if you qualify.",
          getOutcome: (roll) => {
            // Roll 4 or higher to get scholarship
            return roll >= 4 ? [{ type: "gems", magnitude: 2 }] : [];
          },
        },
      ],
    },
    {
      id: "mid-n-2",
      title: "AI Layoffs",
      description:
        "One of your parents gets laid off due to an AI boom. The tech company is doing mass layoffs.",
      neighborhood: "middle-income",
      effects: [{ type: "gems", magnitude: -2 }],
    },

    // Middle Income Positive
    {
      id: "mid-p-1",
      title: "PTA Funding",
      description:
        "Local PTA Funds New AP Classes – Your school receives additional funding from the parent association, expanding AP course offerings.",
      neighborhood: "middle-income",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "mid-p-2",
      title: "Public Park Upgpa",
      description:
        "There are lots of city investments into public park upgpa, you have lots of free recreation options to keep you healthy and happy.",
      neighborhood: "middle-income",
      effects: [{ type: "gpa", magnitude: 1 }],
    },

    // rich Neighborhood Cards
    {
      id: "rich-p-1",
      title: "Connected Parents",
      description:
        "Your affluent neighbor's parent pulls strings to get them a summer internship. The internship will help you attain more information and receive a better grade.",
      neighborhood: "rich",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "rich-p-2",
      title: "Private Tutoring",
      description:
        "Your parents can afford a private tutor to help you with difficult subjects.",
      neighborhood: "rich",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "rich-p-3",
      title: "SAT Prep Course",
      description: "Your family enrolls you in an expensive SAT prep course.",
      neighborhood: "rich",
      effects: [{ type: "gpa", magnitude: 2 }],
    },
    {
      id: "rich-p-4",
      title: "Alumni Connections",
      description: "Your parent is an alumnus of a prestigious university.",
      neighborhood: "rich",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
    {
      id: "rich-p-5",
      title: "Family Connections",
      description:
        "Your parents' connections help you land a prestigious internship.",
      neighborhood: "rich",
      effects: [{ type: "gpa", magnitude: 2 }],
    },
    {
      id: "rich-p-6",
      title: "Focus on School",
      description:
        "Your parents handle all chores, so you can focus entirely on school.",
      neighborhood: "rich",
      effects: [{ type: "gpa", magnitude: 1 }],
    },
  ];
}

// Get a subset of cards by neighborhood
export function getCardsByNeighborhood(
  deck: Card[],
  neighborhood: Neighborhood
): Card[] {
  return deck.filter((card) => card.neighborhood === neighborhood);
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
      result.gpa = effect.magnitude * 0.1;
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
  neighborhood: Neighborhood
): { card: Card | null; remainingDeck: Card[] } {
  if (deck.length === 0) {
    return { card: null, remainingDeck: [] };
  }

  // Filter cards by neighborhood neighborhood
  const neighborhoodCards = deck.filter(
    (card) => card.neighborhood === neighborhood
  );

  if (neighborhoodCards.length === 0) {
    // If no cards for this neighborhood, draw any random card
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];
    const remainingDeck = [
      ...deck.slice(0, randomIndex),
      ...deck.slice(randomIndex + 1),
    ];
    return { card, remainingDeck };
  }

  // Draw a random card from the neighborhood-specific cards
  const randomIndex = Math.floor(Math.random() * neighborhoodCards.length);
  const card = neighborhoodCards[randomIndex];

  // Remove the selected card from the deck
  const remainingDeck = deck.filter((c) => c.id !== card.id);

  return { card, remainingDeck };
}
