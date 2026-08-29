export type FullListeningTask =
  | {
      kind: "completion";
      title: string;
      range: string;
      instruction: string;
      rows: Array<{ number: number; before: string; after?: string }>;
    }
  | {
      kind: "single-choice";
      title: string;
      range: string;
      instruction: string;
      questions: Array<{
        number: number;
        prompt: string;
        options: Array<{ key: string; label: string }>;
      }>;
    }
  | {
      kind: "matching";
      title: string;
      range: string;
      instruction: string;
      prompts: Array<{ number: number; label: string }>;
      options: Array<{ key: string; label: string }>;
    }
  | {
      kind: "map";
      title: string;
      range: string;
      instruction: string;
      places: Array<{ number: number; label: string }>;
      options: string[];
      mapTitle: string;
    };

export interface FullListeningPart {
  number: number;
  context: string;
  tasks: FullListeningTask[];
}

export interface ClientPreviewFullListeningMock {
  testNumber: number;
  title: string;
  narration: string;
  parts: FullListeningPart[];
  answers: Record<number, string>;
}

const options = (...labels: string[]) =>
  labels.map((label, index) => ({ key: String.fromCharCode(65 + index), label }));

const TEST_2: ClientPreviewFullListeningMock = {
  testNumber: 2,
  title: "Community Learning and Environmental Research",
  narration: `You will hear four different recordings. In Part One, a caller registers for an evening course at Northbridge Community Centre. The course is digital photography, it begins on the twelfth of September in Room fourteen, and the fee is eighty-five pounds. Learners should bring a camera, a notebook and proof of address. The tutor is Maya Patel. In Part Two, a guide introduces Riverside Botanical Garden. The glasshouse is at B, the cafe at D, the children's trail at F, the seed library at H and the quiet garden at J. The guide recommends the orchid house, says the lake path is temporarily closed, and explains that the roof garden has the best city view. In Part Three, three students plan a water-quality project. They choose the eastern stream because access is safer, decide to collect samples weekly, and agree that laboratory availability is their biggest constraint. Aisha will organise equipment, Ben will contact landowners, Chloe will prepare the risk assessment, and Daniel will manage the data. In Part Four, a lecturer discusses low-carbon concrete. Cement production creates a large share of emissions; recycled aggregate can reduce quarrying; fly ash improves durability; curing conditions affect strength; and new standards are needed before unfamiliar mixes are widely adopted.`,
  parts: [
    {
      number: 1,
      context: "A telephone conversation about registering for an evening course.",
      tasks: [
        {
          kind: "completion",
          title: "Course registration notes",
          range: "Questions 1–10",
          instruction: "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          rows: [
            { number: 1, before: "Course:", after: "" },
            { number: 2, before: "Start date:", after: "September" },
            { number: 3, before: "Room:", after: "" },
            { number: 4, before: "Fee: £", after: "" },
            { number: 5, before: "Bring a", after: "" },
            { number: 6, before: "Also bring a", after: "" },
            { number: 7, before: "Proof of", after: "" },
            { number: 8, before: "Tutor's first name:", after: "" },
            { number: 9, before: "Tutor's surname:", after: "" },
            { number: 10, before: "Venue:", after: "Community Centre" },
          ],
        },
      ],
    },
    {
      number: 2,
      context: "A guide describing facilities and current conditions at a botanical garden.",
      tasks: [
        {
          kind: "map",
          title: "Riverside Botanical Garden",
          range: "Questions 11–15",
          instruction: "Label the plan. Choose the correct letter, A–J.",
          places: [
            { number: 11, label: "Glasshouse" },
            { number: 12, label: "Cafe" },
            { number: 13, label: "Children's trail" },
            { number: 14, label: "Seed library" },
            { number: 15, label: "Quiet garden" },
          ],
          options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
          mapTitle: "Riverside Garden visitor plan",
        },
        {
          kind: "matching",
          title: "Guide recommendations",
          range: "Questions 16–20",
          instruction: "What does the guide say about each place? Choose the correct letter, A–E.",
          prompts: [
            { number: 16, label: "Orchid house" },
            { number: 17, label: "Lake path" },
            { number: 18, label: "Roof garden" },
            { number: 19, label: "Education room" },
            { number: 20, label: "Meadow gate" },
          ],
          options: options("recommended", "temporarily closed", "best city view", "school groups", "new entrance"),
        },
      ],
    },
    {
      number: 3,
      context: "University students planning a water-quality field project.",
      tasks: [
        {
          kind: "single-choice",
          title: "Project decisions",
          range: "Questions 21–25",
          instruction: "Choose the correct letter, A, B or C.",
          questions: [
            { number: 21, prompt: "Why do the students choose the eastern stream?", options: options("It is shorter", "Access is safer", "It has more fish") },
            { number: 22, prompt: "How often will samples be collected?", options: options("daily", "weekly", "monthly") },
            { number: 23, prompt: "What is their biggest constraint?", options: options("transport", "laboratory availability", "cost of bottles") },
            { number: 24, prompt: "What will they test first?", options: options("water temperature", "soil colour", "bird numbers") },
            { number: 25, prompt: "When will they review the method?", options: options("after the pilot", "after submission", "during the holiday") },
          ],
        },
        {
          kind: "matching",
          title: "Project responsibilities",
          range: "Questions 26–30",
          instruction: "Match each responsibility with the correct student, A–D. You may use a letter more than once.",
          prompts: [
            { number: 26, label: "organise equipment" },
            { number: 27, label: "contact landowners" },
            { number: 28, label: "prepare the risk assessment" },
            { number: 29, label: "manage the data" },
            { number: 30, label: "book the laboratory" },
          ],
          options: options("Aisha", "Ben", "Chloe", "Daniel"),
        },
      ],
    },
    {
      number: 4,
      context: "An academic lecture about lower-carbon concrete.",
      tasks: [
        {
          kind: "completion",
          title: "Low-carbon concrete",
          range: "Questions 31–40",
          instruction: "Complete the summary. Write ONE WORD ONLY for each answer.",
          rows: [
            { number: 31, before: "Cement production creates substantial", after: "" },
            { number: 32, before: "Recycled aggregate reduces", after: "" },
            { number: 33, before: "Fly ash can improve", after: "" },
            { number: 34, before: "Strength depends partly on", after: "conditions" },
            { number: 35, before: "Engineers test mixes in the", after: "" },
            { number: 36, before: "Some builders worry about higher", after: "" },
            { number: 37, before: "Local materials reduce transport", after: "" },
            { number: 38, before: "New mixes need updated", after: "" },
            { number: 39, before: "Long-term monitoring measures", after: "" },
            { number: 40, before: "Wider adoption requires professional", after: "" },
          ],
        },
      ],
    },
  ],
  answers: { 1:"digital photography",2:"12",3:"14",4:"85",5:"camera",6:"notebook",7:"address",8:"Maya",9:"Patel",10:"Northbridge",11:"B",12:"D",13:"F",14:"H",15:"J",16:"A",17:"B",18:"C",19:"D",20:"E",21:"B",22:"B",23:"B",24:"A",25:"A",26:"A",27:"B",28:"C",29:"D",30:"A",31:"emissions",32:"quarrying",33:"durability",34:"curing",35:"laboratory",36:"costs",37:"distance",38:"standards",39:"performance",40:"training" },
};

const TEST_3: ClientPreviewFullListeningMock = {
  testNumber: 3,
  title: "Cycle Hire, Museums and Human Memory",
  narration: `In Part One, a customer hires a touring bicycle from City Wheel. The booking is for three days, collection is at nine thirty on Friday, the frame size is medium, and a helmet and repair kit are included. The deposit is sixty pounds and the emergency number ends in seven four two. In Part Two, a curator introduces the reopened Harbour Museum. The ticket desk is at A, the maritime gallery at C, the cafe at E, the lecture room at G and lockers at I. The sculpture court is quiet in the morning, the archive room requires a booking, and the roof terrace closes in strong wind. In Part Three, students plan a coastal field trip. Liam will check transport, Sofia will create the interview questions, Noah will contact the council, and Priya will edit the presentation. The team prefers mixed methods and will run a pilot on Tuesday. In Part Four, a psychologist explains sleep and memory. Deep sleep supports factual memory, rapid eye movement sleep helps emotional processing, regular routines improve recall, light delays melatonin, and short naps can restore alertness.`,
  parts: [
    { number:1, context:"A customer arranging a bicycle hire.", tasks:[{ kind:"completion", title:"City Wheel booking", range:"Questions 1–10", instruction:"Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.", rows:[
      {number:1,before:"Type of bicycle:",after:""},{number:2,before:"Hire period:",after:"days"},{number:3,before:"Collection time:",after:"Friday"},{number:4,before:"Frame size:",after:""},{number:5,before:"Included item:",after:""},{number:6,before:"Also included:",after:"kit"},{number:7,before:"Deposit: £",after:""},{number:8,before:"Shop name:",after:""},{number:9,before:"Collection street:",after:""},{number:10,before:"Emergency number ending:",after:""},
    ]}]},
    { number:2, context:"A curator giving visitor information at a reopened museum.", tasks:[
      {kind:"map",title:"Harbour Museum plan",range:"Questions 11–15",instruction:"Label the plan. Choose A–J.",places:[{number:11,label:"Ticket desk"},{number:12,label:"Maritime gallery"},{number:13,label:"Cafe"},{number:14,label:"Lecture room"},{number:15,label:"Lockers"}],options:["A","B","C","D","E","F","G","H","I","J"],mapTitle:"Harbour Museum ground floor"},
      {kind:"matching",title:"Visitor advice",range:"Questions 16–20",instruction:"Match each place with the guide's advice, A–E.",prompts:[{number:16,label:"Sculpture court"},{number:17,label:"Archive room"},{number:18,label:"Roof terrace"},{number:19,label:"Family studio"},{number:20,label:"Boat hall"}],options:options("quiet in the morning","booking required","closes in strong wind","weekend activities","largest exhibit")},
    ]},
    { number:3, context:"Students organising a coastal field trip.", tasks:[
      {kind:"matching",title:"Team responsibilities",range:"Questions 21–25",instruction:"Match each task with the correct student, A–D.",prompts:[{number:21,label:"check transport"},{number:22,label:"create interview questions"},{number:23,label:"contact the council"},{number:24,label:"edit the presentation"},{number:25,label:"reserve equipment"}],options:options("Liam","Sofia","Noah","Priya")},
      {kind:"single-choice",title:"Fieldwork plan",range:"Questions 26–30",instruction:"Choose A, B or C.",questions:[{number:26,prompt:"Which approach will the team use?",options:options("surveys only","mixed methods","observation only")},{number:27,prompt:"When is the pilot?",options:options("Monday","Tuesday","Friday")},{number:28,prompt:"Where will interviews take place?",options:options("at the harbour","online","on campus")},{number:29,prompt:"What will be mapped?",options:options("visitor movement","bird nests","shop prices")},{number:30,prompt:"Who will approve the plan?",options:options("the tutor","the council","the museum")}]},
    ]},
    { number:4, context:"A lecture on sleep and memory.", tasks:[{kind:"completion",title:"Sleep and memory",range:"Questions 31–40",instruction:"Complete the notes. Write ONE WORD ONLY.",rows:[{number:31,before:"Deep sleep supports",after:"memory"},{number:32,before:"REM sleep helps",after:"processing"},{number:33,before:"Regular routines improve",after:""},{number:34,before:"Evening light delays",after:""},{number:35,before:"Short naps restore",after:""},{number:36,before:"Caffeine can reduce sleep",after:""},{number:37,before:"Stress increases night-time",after:""},{number:38,before:"A cool room supports",after:""},{number:39,before:"Morning light resets the body",after:""},{number:40,before:"Researchers use memory",after:""}]}]},
  ],
  answers:{1:"touring",2:"3",3:"9:30",4:"medium",5:"helmet",6:"repair",7:"60",8:"City Wheel",9:"Market Street",10:"742",11:"A",12:"C",13:"E",14:"G",15:"I",16:"A",17:"B",18:"C",19:"D",20:"E",21:"A",22:"B",23:"C",24:"D",25:"A",26:"B",27:"B",28:"A",29:"A",30:"A",31:"factual",32:"emotional",33:"recall",34:"melatonin",35:"alertness",36:"quality",37:"awakenings",38:"sleep",39:"clock",40:"tests"},
};

const TEST_4: ClientPreviewFullListeningMock = {
  testNumber: 4,
  title: "Volunteering, Coastal Parks and Urban Heat",
  narration: `In Part One, Elena Cruz registers to volunteer at the Greenway Festival. She chooses the morning shift on Saturday, will work at the information tent, and needs a medium T-shirt. Training is online on the fifth of May. Her emergency contact is Marco and she will travel by bus. In Part Two, a ranger describes Seabird Coastal Park. The visitor centre is at B, the bird hide at D, the picnic field at F, the kayak launch at H and the first-aid point at J. The cliff route is closed, the marsh boardwalk is wheelchair accessible, and the lighthouse talk starts at eleven. In Part Three, a tutor and students plan a public-space study. Erin will photograph signage, Farid will conduct interviews, Grace will count cyclists, and Hugo will analyse noise readings. They choose Thursday afternoon and will compare two neighbourhoods. In Part Four, a lecture explains urban heat. Dark roofs absorb solar energy, trees provide shade and evapotranspiration, permeable ground stores water, cool roofs reflect sunlight, and heat maps help cities target investment.`,
  parts:[
    {number:1,context:"A volunteer registering for a community festival.",tasks:[{kind:"completion",title:"Greenway Festival volunteer form",range:"Questions 1–10",instruction:"Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",rows:[{number:1,before:"First name:",after:""},{number:2,before:"Surname:",after:""},{number:3,before:"Preferred shift:",after:""},{number:4,before:"Day:",after:""},{number:5,before:"Work area:",after:"tent"},{number:6,before:"T-shirt size:",after:""},{number:7,before:"Training format:",after:""},{number:8,before:"Training date:",after:"May"},{number:9,before:"Emergency contact:",after:""},{number:10,before:"Travel by:",after:""}]}]},
    {number:2,context:"A park ranger giving directions and visitor advice.",tasks:[{kind:"map",title:"Seabird Coastal Park",range:"Questions 11–15",instruction:"Label the map. Choose A–J.",places:[{number:11,label:"Visitor centre"},{number:12,label:"Bird hide"},{number:13,label:"Picnic field"},{number:14,label:"Kayak launch"},{number:15,label:"First-aid point"}],options:["A","B","C","D","E","F","G","H","I","J"],mapTitle:"Seabird Coastal Park"},{kind:"matching",title:"Ranger's announcements",range:"Questions 16–20",instruction:"Match each feature with the correct announcement, A–E.",prompts:[{number:16,label:"Cliff route"},{number:17,label:"Marsh boardwalk"},{number:18,label:"Lighthouse talk"},{number:19,label:"Beach cafe"},{number:20,label:"Seal viewpoint"}],options:options("closed today","wheelchair accessible","starts at 11","cash only","best at low tide")}]},
    {number:3,context:"A university tutorial about a public-space study.",tasks:[{kind:"matching",title:"Research roles",range:"Questions 21–25",instruction:"Match each task with the correct student, A–D.",prompts:[{number:21,label:"photograph signage"},{number:22,label:"conduct interviews"},{number:23,label:"count cyclists"},{number:24,label:"analyse noise"},{number:25,label:"prepare consent forms"}],options:options("Erin","Farid","Grace","Hugo")},{kind:"single-choice",title:"Study plan",range:"Questions 26–30",instruction:"Choose A, B or C.",questions:[{number:26,prompt:"When will fieldwork happen?",options:options("Thursday morning","Thursday afternoon","Friday afternoon")},{number:27,prompt:"How many neighbourhoods are compared?",options:options("one","two","three")},{number:28,prompt:"What is the main observation period?",options:options("commuter peak","lunchtime","evening")},{number:29,prompt:"Where will interviews happen?",options:options("at bus stops","in shops","online")},{number:30,prompt:"What will the final output be?",options:options("a poster","a podcast","a report")}]}]},
    {number:4,context:"An academic lecture about reducing urban heat.",tasks:[{kind:"completion",title:"Reducing urban heat",range:"Questions 31–40",instruction:"Complete the summary. Write ONE WORD ONLY.",rows:[{number:31,before:"Dark roofs absorb solar",after:""},{number:32,before:"Trees provide shade and",after:""},{number:33,before:"Permeable ground stores",after:""},{number:34,before:"Cool roofs reflect",after:""},{number:35,before:"Heat maps guide",after:""},{number:36,before:"Parks can provide night-time",after:""},{number:37,before:"Bus shelters need effective",after:""},{number:38,before:"Residents report local heat",after:""},{number:39,before:"Measurements should cover several",after:""},{number:40,before:"Long-term plans protect public",after:""}]}]},
  ],
  answers:{1:"Elena",2:"Cruz",3:"morning",4:"Saturday",5:"information",6:"medium",7:"online",8:"5",9:"Marco",10:"bus",11:"B",12:"D",13:"F",14:"H",15:"J",16:"A",17:"B",18:"C",19:"D",20:"E",21:"A",22:"B",23:"C",24:"D",25:"B",26:"B",27:"B",28:"A",29:"A",30:"C",31:"energy",32:"evapotranspiration",33:"water",34:"sunlight",35:"investment",36:"cooling",37:"shade",38:"hotspots",39:"seasons",40:"health"},
};

const MOCKS: Record<number, ClientPreviewFullListeningMock> = { 2: TEST_2, 3: TEST_3, 4: TEST_4 };

export const getClientPreviewFullListeningMock = (testNumber: number) => MOCKS[testNumber] ?? null;

export function scoreClientPreviewFullListening(
  mock: ClientPreviewFullListeningMock,
  submitted: Record<number, string>,
  durationSeconds: number,
) {
  const correctAnswers = Array.from({ length: 40 }, (_, index) => index + 1).filter(
    (number) => normalize(submitted[number] ?? "") === normalize(mock.answers[number] ?? ""),
  ).length;
  return {
    testNumber: mock.testNumber,
    answers: submitted,
    correctAnswers,
    totalQuestions: 40,
    bandScore: listeningBand(correctAnswers),
    durationSeconds: Math.max(0, Math.floor(durationSeconds)),
    completedAt: new Date().toISOString(),
  };
}

const normalize = (value: string) => value.toLowerCase().replace(/[.,()£]/g, " ").replace(/\s+/g, " ").trim();

function listeningBand(score: number): number {
  if (score >= 39) return 9;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5;
  return score >= 10 ? 4 : 3;
}
