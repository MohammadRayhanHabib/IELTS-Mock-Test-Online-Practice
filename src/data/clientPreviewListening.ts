export const CLIENT_LISTENING_STARTED_KEY =
  "lexora-client-listening-started-at-v1";
export const CLIENT_LISTENING_RESULT_KEY =
  "lexora-client-listening-result-v1";

export const CLIENT_LISTENING_NARRATION = `
You will hear information about the Preston Park Run. First, you have some time to look at questions one to ten.
The Preston Park Run takes place every Saturday. The run starts in front of the cafe at nine A M and covers a distance of five kilometres.
At the end of the run, a volunteer scans each runner's barcode. The best way to register is on the website. The cost of the run is five pounds.
For volunteering enquiries, contact Pete Walker. The phone number is zero one two seven three, five five five, zero one four.
Volunteer activities include guiding the runners and preparing notes for the weekly report.
Now listen to information about the Pacton-on-Sea bus tour. At bus stop two, visitors can see dolphins and seals at the aquarium.
Bus stop three is at the harbour, where visitors can see yachts and power boats. Bus stop four is at the shopping centre, close to a very old church.
Passengers need a discount card to buy the ten-pound ticket. The bus tour lasts two hours in total, and the ticket includes entrance to the aquarium.
The audio commentary was made by a local historian. If the weather is wet, visitors should bring an umbrella. Online bookings require a confirmation email.
Now listen to Dave Hadley and Randhir discussing the college computer system. Dave says the system has become outdated and its main problem is that it displays incorrect data.
Timetabling is difficult because courses are constantly changing. Randhir suggests specialist software, tested first by a small group of staff, followed by a practical workshop.
George is studying Mechanical Engineering. He finds maths the most difficult discipline. At the moment, the course is mainly theoretical. His next assignment involves a study of energy systems, and he thinks there are too many lectures.
The next steps are to get approval from the finance department, complete a request form, book a meeting with the systems analyst, and set up a workshop with the technologies team.
Finally, you will hear visitor information about the Sea Life Centre, previously called Ocean World. Its newest attraction is the glass tunnel, and the main feeding time is two P M. A VIP ticket lets visitors feed the sharks. The centre can arrange a birthday party. Its animal conservation petition will be sent to the local council, and visitors can use an online quiz to test what they have learnt.
The guide says the Aquarium is the attraction visitors must not miss, Crocodile Cave is temporarily closed, and Penguin Park often has large queues.
You now have a short time to check your answers.
`;

export const CLIENT_LISTENING_LIST_MATCHING_NARRATION = `
You will hear information for volunteers in Group A. First, you have some time to look at Questions eleven to fourteen.
Group A will be working in the riverside park. Their two main tasks are planting trees and putting up signs. Other teams will widen the pathways, collect rubbish and build the new fences.
Volunteers should bring boots because the ground may be wet, and gloves for handling plants and equipment. Food and water will be provided. Raincoats are available if needed, and all tools will be supplied by the organisers.
Passengers on the Pacton-on-Sea bus tour need a discount card to buy the ten-pound ticket. The tour lasts two hours, and the ticket includes entrance to the aquarium. The audio commentary was made by a local historian. In wet weather, visitors should bring an umbrella, and online bookings require a confirmation email.
You now have a short time to check your answers.
`;

export const CLIENT_LISTENING_MAP_LABELLING_NARRATION = `
You will hear a guide describing the Hadley Park Community Gardens Project. First, you have some time to look at Questions eleven to twenty.
Group A volunteers will plant trees and put up signs. They should bring boots and gloves.
Now look at the plan. The vegetable beds are in area E, beside the fruit bushes and the bamboo fence. The bee hives are at F, west of the circular seating area. The seating itself is at G, immediately beside the circle of seats. The adventure playground is in area H, close to the entrance path. The sand area is at I, on the other side of that entrance. Finally, the pond is in area A, near the upper footpath and below the bicycle track.
You now have a short time to check your answers.
`;

export const CLIENT_LIST_MATCHING_ANSWER_DEFINITIONS: ClientListeningAnswerDefinition[] = [
  {
    number: 11,
    prompt: "Which task will Group A volunteers be responsible for?",
    acceptedAnswers: ["B", "D"],
    displayAnswer: "B, D — planting trees; putting up signs",
  },
  {
    number: 12,
    prompt: "Which other task will Group A volunteers be responsible for?",
    acceptedAnswers: ["B", "D"],
    displayAnswer: "B, D — planting trees; putting up signs",
  },
  {
    number: 13,
    prompt: "Which item should Group A volunteers bring?",
    acceptedAnswers: ["B", "C"],
    displayAnswer: "B, C — boots; gloves",
  },
  {
    number: 14,
    prompt: "Which other item should Group A volunteers bring?",
    acceptedAnswers: ["B", "C"],
    displayAnswer: "B, C — boots; gloves",
  },
];

export const CLIENT_MAP_LABELLING_ANSWER_DEFINITIONS: ClientListeningAnswerDefinition[] = [
  {
    number: 15,
    prompt: "Where are the vegetable beds?",
    acceptedAnswers: ["E"],
    displayAnswer: "E — Vegetable beds",
  },
  {
    number: 16,
    prompt: "Where are the bee hives?",
    acceptedAnswers: ["F"],
    displayAnswer: "F — Bee hives",
  },
  {
    number: 17,
    prompt: "Where is the seating?",
    acceptedAnswers: ["G"],
    displayAnswer: "G — Seating",
  },
  {
    number: 18,
    prompt: "Where is the adventure playground?",
    acceptedAnswers: ["H"],
    displayAnswer: "H — Adventure playground",
  },
  {
    number: 19,
    prompt: "Where is the sand area?",
    acceptedAnswers: ["I"],
    displayAnswer: "I — Sand area",
  },
  {
    number: 20,
    prompt: "Where is the pond?",
    acceptedAnswers: ["A"],
    displayAnswer: "A — Pond",
  },
];

export interface ClientListeningAnswerDefinition {
  number: number;
  prompt: string;
  acceptedAnswers: string[];
  displayAnswer: string;
}

export interface ClientListeningStoredResult {
  testNumber?: number;
  answers: Record<number, string>;
  correctAnswers: number;
  totalQuestions: number;
  bandScore: number;
  durationSeconds: number;
  completedAt: string;
  partTwoPattern?: "table" | "list-matching" | "map-labelling";
}

export const CLIENT_LISTENING_ANSWER_DEFINITIONS: ClientListeningAnswerDefinition[] = [
  {
    number: 1,
    prompt: "Where does the run start?",
    acceptedAnswers: ["cafe", "the cafe"],
    displayAnswer: "cafe",
  },
  {
    number: 2,
    prompt: "What time does the run start?",
    acceptedAnswers: ["9", "9 am", "9:00", "9.00"],
    displayAnswer: "9.00 am",
  },
  {
    number: 3,
    prompt: "What is the length of the run?",
    acceptedAnswers: ["5 km", "5 kilometres", "five kilometres"],
    displayAnswer: "5 kilometres",
  },
  {
    number: 4,
    prompt: "What does the volunteer scan?",
    acceptedAnswers: ["barcode", "bar code"],
    displayAnswer: "barcode",
  },
  {
    number: 5,
    prompt: "What is the best way to register?",
    acceptedAnswers: ["website", "web site"],
    displayAnswer: "website",
  },
  {
    number: 6,
    prompt: "How much does the run cost?",
    acceptedAnswers: ["5", "five", "£5"],
    displayAnswer: "£5",
  },
  {
    number: 7,
    prompt: "What is Pete's surname?",
    acceptedAnswers: ["walker"],
    displayAnswer: "Walker",
  },
  {
    number: 8,
    prompt: "What is the volunteer phone number?",
    acceptedAnswers: ["01273 555014", "01273555014"],
    displayAnswer: "01273 555014",
  },
  {
    number: 9,
    prompt: "What activity involves the runners?",
    acceptedAnswers: ["guide", "guiding"],
    displayAnswer: "guiding",
  },
  {
    number: 10,
    prompt: "What is prepared for the weekly report?",
    acceptedAnswers: ["notes", "photos", "photographs"],
    displayAnswer: "notes",
  },
  {
    number: 11,
    prompt: "What can visitors see with the dolphins?",
    acceptedAnswers: ["seals"],
    displayAnswer: "seals",
  },
  {
    number: 12,
    prompt: "Where is bus stop 3?",
    acceptedAnswers: ["harbour", "the harbour"],
    displayAnswer: "harbour",
  },
  {
    number: 13,
    prompt: "Which centre is at bus stop 4?",
    acceptedAnswers: ["shopping", "shopping centre"],
    displayAnswer: "shopping",
  },
  {
    number: 14,
    prompt: "What very old building can visitors see?",
    acceptedAnswers: ["church", "a church"],
    displayAnswer: "church",
  },
  {
    number: 15,
    prompt: "What is needed to buy the £10 ticket?",
    acceptedAnswers: ["discount card", "a discount card"],
    displayAnswer: "discount card",
  },
  {
    number: 16,
    prompt: "How long does the bus tour last?",
    acceptedAnswers: ["2 hours", "two hours"],
    displayAnswer: "two hours",
  },
  {
    number: 17,
    prompt: "Entrance to which place is included?",
    acceptedAnswers: ["aquarium", "the aquarium"],
    displayAnswer: "aquarium",
  },
  {
    number: 18,
    prompt: "Who made the audio commentary?",
    acceptedAnswers: ["local historian", "a local historian"],
    displayAnswer: "local historian",
  },
  {
    number: 19,
    prompt: "What should visitors bring in wet weather?",
    acceptedAnswers: ["umbrella", "an umbrella"],
    displayAnswer: "umbrella",
  },
  {
    number: 20,
    prompt: "What should online customers bring?",
    acceptedAnswers: ["confirmation email", "a confirmation email"],
    displayAnswer: "confirmation email",
  },
  {
    number: 21,
    prompt: "Dave Hadley says that the computer system has",
    acceptedAnswers: ["C"],
    displayAnswer: "C — become outdated",
  },
  {
    number: 22,
    prompt: "The main problem with the computer system is that it",
    acceptedAnswers: ["C"],
    displayAnswer: "C — displays incorrect data",
  },
  {
    number: 23,
    prompt: "Which discipline does George find the most difficult?",
    acceptedAnswers: ["maths", "mathematics"],
    displayAnswer: "maths",
  },
  {
    number: 24,
    prompt: "What is George's course mainly at the moment?",
    acceptedAnswers: ["theoretical", "theory"],
    displayAnswer: "theoretical",
  },
  {
    number: 25,
    prompt: "What will George's assignment study?",
    acceptedAnswers: ["energy systems", "energy system"],
    displayAnswer: "energy systems",
  },
  {
    number: 26,
    prompt: "What does George think there are too many of?",
    acceptedAnswers: ["lectures"],
    displayAnswer: "lectures",
  },
  {
    number: 27,
    prompt: "Get approval from whom?",
    acceptedAnswers: ["finance", "finance department", "the finance department"],
    displayAnswer: "finance department",
  },
  {
    number: 28,
    prompt: "Complete which form?",
    acceptedAnswers: ["request", "request form", "a request form"],
    displayAnswer: "request form",
  },
  {
    number: 29,
    prompt: "Book what with the systems analyst?",
    acceptedAnswers: ["meeting", "a meeting"],
    displayAnswer: "meeting",
  },
  {
    number: 30,
    prompt: "Set up what with the technologies team?",
    acceptedAnswers: ["workshop", "a workshop"],
    displayAnswer: "workshop",
  },
  {
    number: 31,
    prompt: "What was the Sea Life Centre previously called?",
    acceptedAnswers: ["ocean world"],
    displayAnswer: "Ocean World",
  },
  {
    number: 32,
    prompt: "What is the newest attraction called?",
    acceptedAnswers: ["glass tunnel", "the glass tunnel"],
    displayAnswer: "glass tunnel",
  },
  {
    number: 33,
    prompt: "When is the main feeding time?",
    acceptedAnswers: ["2 pm", "2pm", "two pm", "2:00 pm", "2.00 pm"],
    displayAnswer: "2.00 pm",
  },
  {
    number: 34,
    prompt: "What can you do with a VIP ticket?",
    acceptedAnswers: ["feed sharks", "feed the sharks"],
    displayAnswer: "feed the sharks",
  },
  {
    number: 35,
    prompt: "What special event will the Sea Life Centre arrange for you?",
    acceptedAnswers: ["birthday party", "a birthday party"],
    displayAnswer: "birthday party",
  },
  {
    number: 36,
    prompt: "Where will the petition for animal conservation be sent to?",
    acceptedAnswers: ["local council", "the local council"],
    displayAnswer: "local council",
  },
  {
    number: 37,
    prompt: "What can you use to test what you have learnt?",
    acceptedAnswers: ["online quiz", "an online quiz"],
    displayAnswer: "online quiz",
  },
  {
    number: 38,
    prompt: "Which attraction must visitors not miss?",
    acceptedAnswers: ["A"],
    displayAnswer: "A — Aquarium",
  },
  {
    number: 39,
    prompt: "Which attraction is temporarily closed?",
    acceptedAnswers: ["B"],
    displayAnswer: "B — Crocodile Cave",
  },
  {
    number: 40,
    prompt: "Which attraction has large queues?",
    acceptedAnswers: ["C"],
    displayAnswer: "C — Penguin Park",
  },
];

export function scoreClientListeningAnswers(
  answers: Record<number, string>,
  durationSeconds: number,
  partTwoPattern: "table" | "list-matching" | "map-labelling" = "table",
): ClientListeningStoredResult {
  let correctAnswers = 0;

  const answerDefinitions = CLIENT_LISTENING_ANSWER_DEFINITIONS.map(
    (definition) => {
      if (
        (partTwoPattern === "list-matching" || partTwoPattern === "map-labelling") &&
        definition.number >= 11 &&
        definition.number <= 14
      ) {
        return (
          CLIENT_LIST_MATCHING_ANSWER_DEFINITIONS.find(
            (alternative) => alternative.number === definition.number,
          ) ?? definition
        );
      }
      if (
        partTwoPattern === "map-labelling" &&
        definition.number >= 15 &&
        definition.number <= 20
      ) {
        return (
          CLIENT_MAP_LABELLING_ANSWER_DEFINITIONS.find(
            (alternative) => alternative.number === definition.number,
          ) ?? definition
        );
      }
      return definition;
    },
  );

  for (const definition of answerDefinitions) {
    const studentAnswer = normalizeListeningAnswer(answers[definition.number] ?? "");
    if (
      studentAnswer &&
      definition.acceptedAnswers.some(
        (answer) => normalizeListeningAnswer(answer) === studentAnswer,
      )
    ) {
      correctAnswers += 1;
    }
  }

  return {
    answers,
    correctAnswers,
    totalQuestions: CLIENT_LISTENING_ANSWER_DEFINITIONS.length,
    bandScore: bandForListeningDemo(
      correctAnswers,
      CLIENT_LISTENING_ANSWER_DEFINITIONS.length,
    ),
    durationSeconds: Math.max(0, Math.round(durationSeconds)),
    completedAt: new Date().toISOString(),
    partTwoPattern,
  };
}

export function normalizeListeningAnswer(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ");
}

let activeNarrationUtterance: SpeechSynthesisUtterance | null = null;
let activeNarrationText = "";
let narrationVolume = 1;
let volumeRestartTimer: number | null = null;

function speakClientListeningNarration(narration: string): void {
  const utterance = new SpeechSynthesisUtterance(narration);
  utterance.lang = "en-GB";
  utterance.rate = 0.88;
  utterance.pitch = 1;
  utterance.volume = narrationVolume;
  activeNarrationUtterance = utterance;
  activeNarrationText = narration;
  utterance.onend = () => {
    if (activeNarrationUtterance !== utterance) return;
    activeNarrationUtterance = null;
    activeNarrationText = "";
  };
  utterance.onerror = () => {
    if (activeNarrationUtterance !== utterance) return;
    activeNarrationUtterance = null;
    activeNarrationText = "";
  };
  window.speechSynthesis.speak(utterance);
}

export function playClientListeningNarration(
  narration: string = CLIENT_LISTENING_NARRATION,
): boolean {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  speakClientListeningNarration(narration);
  return true;
}

export function setClientListeningNarrationVolume(volume: number): number {
  narrationVolume = Math.min(1, Math.max(0, volume));

  if (
    activeNarrationUtterance &&
    activeNarrationText &&
    "speechSynthesis" in window
  ) {
    const narrationToRestart = activeNarrationText;
    const shouldRemainPaused = window.speechSynthesis.paused;

    if (volumeRestartTimer !== null) {
      window.clearTimeout(volumeRestartTimer);
    }

    volumeRestartTimer = window.setTimeout(() => {
      volumeRestartTimer = null;
      window.speechSynthesis.cancel();
      speakClientListeningNarration(narrationToRestart);

      if (shouldRemainPaused) {
        window.setTimeout(() => window.speechSynthesis.pause(), 0);
      }
    }, 120);
  }

  return narrationVolume;
}

export function pauseClientListeningNarration(): void {
  if ("speechSynthesis" in window) window.speechSynthesis.pause();
}

export function resumeClientListeningNarration(): void {
  if ("speechSynthesis" in window) window.speechSynthesis.resume();
}

export function stopClientListeningNarration(): void {
  if (volumeRestartTimer !== null) {
    window.clearTimeout(volumeRestartTimer);
    volumeRestartTimer = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  activeNarrationUtterance = null;
  activeNarrationText = "";
}

function bandForListeningDemo(correctAnswers: number, totalQuestions: number): number {
  if (correctAnswers <= 0 || totalQuestions <= 0) return 0;
  const percentage = correctAnswers / totalQuestions;
  if (percentage >= 0.93) return 9;
  if (percentage >= 0.85) return 8;
  if (percentage >= 0.75) return 7;
  if (percentage >= 0.65) return 6.5;
  if (percentage >= 0.55) return 6;
  if (percentage >= 0.45) return 5.5;
  if (percentage >= 0.35) return 5;
  return 4;
}
