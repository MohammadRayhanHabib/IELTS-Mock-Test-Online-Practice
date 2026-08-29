import type { IMockExam, IMockExamAttempt } from "../api/mockExam";
import {
  FLOWCHART_GAP_TOKEN,
  ReadingQuestionType,
  type IReadingQuestionStudent,
  type IReadingTest,
} from "../api/reading";

const SHOWCASE_ID = "reading-part-1-client-showcase";
const SHOWCASE_PART_2_ID = "reading-part-2-client-showcase";
const SHOWCASE_PART_3_ID = "reading-part-3-client-showcase";
const CREATED_AT = "2026-07-24T00:00:00.000Z";

export const READING_SHOWCASE_EXAMPLES_PER_TYPE = 5;

const question = (
  orderNumber: number,
  questionType: ReadingQuestionType,
  data: Omit<
    IReadingQuestionStudent,
    "_id" | "questionType" | "orderNumber" | "pageNumber" | "marks"
  >,
): IReadingQuestionStudent => ({
  _id: `reading-showcase-r-${String(orderNumber).padStart(2, "0")}`,
  questionType,
  orderNumber,
  pageNumber: (orderNumber - 1) * READING_SHOWCASE_EXAMPLES_PER_TYPE + 1,
  marks: READING_SHOWCASE_EXAMPLES_PER_TYPE,
  ...data,
});

export const READING_PART_1_SHOWCASE_TEST: IReadingTest = {
  _id: SHOWCASE_ID,
  title: "IELTS Academic Reading — Part 1",
  passageTitle: "How Urban Trees Make Cities More Resilient",
  passageContent: `
    <section>
      <h3>A — More than decoration</h3>
      <p>For much of the twentieth century, city trees were treated mainly as decoration. Modern research presents a different picture: a connected urban forest can cool streets, slow rainwater, improve air quality and make neighbourhoods more comfortable for walking.</p>
    </section>
    <section>
      <h3>B — Cooling the street</h3>
      <p>Trees reduce heat in two ways. Their crowns provide shade, while water released through their leaves cools the surrounding air. The effect is strongest where mature trees form an almost continuous canopy above pavements and buildings.</p>
    </section>
    <section>
      <h3>C — Managing heavy rain</h3>
      <p>Leaves and branches intercept rainfall before it reaches the ground. Some water evaporates and some travels slowly down the trunk. Roots also create channels in the soil, allowing more water to soak in and reducing pressure on drainage systems.</p>
    </section>
    <section>
      <h3>D — Choosing the right species</h3>
      <p>No single species is suitable everywhere. Planners compare expected height, root spread, tolerance of pollution and demand for water. A diverse mix is safer than planting one species because disease is less likely to damage the whole urban forest.</p>
    </section>
    <section>
      <h3>E — Evidence from local residents</h3>
      <p>Residents often identify needs that maps miss. They may know which bus stops have no shade, which paths flood after storms and where poorly placed branches obstruct lighting. Successful planting programmes therefore combine technical surveys with community consultation.</p>
    </section>
    <section>
      <h3>F — Looking after young trees</h3>
      <p>Planting is only the beginning. During their first years, trees require regular watering, protection from accidental damage and inspections by trained staff. Without this maintenance, a large proportion may fail before producing significant benefits.</p>
    </section>
    <section>
      <h3>G — Measuring long-term value</h3>
      <p>The cost of a planting programme is immediate, but many benefits appear gradually. Cities increasingly measure canopy cover, summer surface temperature, intercepted rainfall and tree survival so that future investment can be based on evidence.</p>
    </section>
    <section>
      <h3>H — A shared urban resource</h3>
      <p>Urban trees work best as infrastructure rather than isolated objects. When planning, planting and maintenance are coordinated, they support public health, climate adaptation and biodiversity at the same time.</p>
    </section>
  `,
  duration: 20,
  totalQuestions: 13,
  isActive: true,
  showExplanations: false,
  createdBy: "client-preview",
  createdAt: CREATED_AT,
  updatedAt: CREATED_AT,
  partNumber: 1,
  partTypeLabel: "Questions 1–13",
};

export const READING_PART_1_SHOWCASE_QUESTIONS: IReadingQuestionStudent[] = [
  question(1, ReadingQuestionType.LIST_MATCHING, {
    groupLabel: "R-01 · List Matching",
    instructions: "",
    questionText:
      "Which TWO statements are true for the psychology experiment conducted by Merckelbach, Jelicic, and Pieters?",
    options: [
      "The participants had to select their two most common symptoms.",
      "The participants gave each symptom a 1-5 rating.",
      "Shyness proved to be the most highly rated symptom.",
      "The participants changed their minds about some of their ratings.",
      "The researchers focused on the strength and regularity of symptoms.",
    ],
    wordBank: [
      "A — The participants had to select their two most common symptoms.",
      "B — The participants gave each symptom a 1-5 rating.",
      "C — Shyness proved to be the most highly rated symptom.",
      "D — The participants changed their minds about some of their ratings.",
      "E — The researchers focused on the strength and regularity of symptoms.",
    ],
  }),
  question(2, ReadingQuestionType.MATCHING_HEADINGS, {
    groupLabel: "R-02 · Heading Matching",
    instructions: "",
    questionText: "Choose the correct heading.",
    options: [
      "Section A",
      "Section B",
      "Section C",
      "Section D",
      "Section E",
      "Section F",
    ],
    wordBank: [
      "Tackling the issue using a different approach",
      "A significant improvement on last time",
      "How robots can save human lives",
      "Examples of robots at work",
      "Not what it seemed to be",
      "Why timescales are impossible to predict",
      "The reason why robots rarely move",
      "Following the pattern of an earlier development",
      "The ethical issues of robotics",
    ],
  }),
  question(3, ReadingQuestionType.MATCHING_FEATURES, {
    groupLabel: "R-03 · Matching Features",
    instructions:
      "Match each statement with the correct feature, A–E.",
    questionText: "Urban tree features",
    options: [
      "Catches rain before it reaches the ground",
      "Releases water through leaves",
      "Identifies bus stops without shade",
      "Requires watering during its first years",
      "Supports evidence-based investment",
    ],
    wordBank: [
      "A — Street cooling",
      "B — Rainwater management",
      "C — Community knowledge",
      "D — Young-tree maintenance",
      "E — Long-term measurement",
    ],
  }),
  question(4, ReadingQuestionType.MATCHING_INFORMATION, {
    groupLabel: "R-04 · Information Matching",
    instructions: "",
    questionText: "",
    options: [
      "evidence that a significant number of airports provide meeting facilities",
      "a statement regarding the fact that no further developments are possible in some areas of airport trade",
      "reference to the low level of income that meeting facilities produce for airports",
      "mention of the impact of budget airlines on airport income",
      "examples of airport premises that might be used for business purposes",
    ],
    wordBank: ["A", "B", "C", "D", "E", "F", "G", "H"],
  }),
  question(5, ReadingQuestionType.MATCHING_SENTENCE_ENDINGS, {
    groupLabel: "R-05 · Sentence-Ending Matching",
    instructions: "",
    questionText: "",
    options: [
      "Young trees may die before delivering major benefits unless they",
      "A connected canopy is most effective when mature crowns",
      "Rainwater enters the ground more easily because roots",
      "A diverse mix protects the urban forest because disease",
      "Future investment can be evidence-based when cities",
    ],
    wordBank: [
      "receive regular care.",
      "extend above pavements and buildings.",
      "create channels in the soil.",
      "is less likely to affect every tree.",
      "measure survival and environmental results.",
      "remove all community consultation.",
      "replace public drainage completely.",
    ],
  }),
  question(6, ReadingQuestionType.NOTE_COMPLETION, {
    groupLabel: "R-06 · Note Completion",
    instructions: "",
    questionText: "The school system in Finland",
    options: [
      "# PISA tests",
      `In the most recent tests, Finland's top subject was ${FLOWCHART_GAP_TOKEN}.`,
      "# History",
      "@ 1963:",
      `A new school system was needed to improve Finland's ${FLOWCHART_GAP_TOKEN}.`,
      `Schools followed ${FLOWCHART_GAP_TOKEN} that were created partly by teachers.`,
      `Young pupils had to study an additional ${FLOWCHART_GAP_TOKEN}.`,
      `All teachers were given the same ${FLOWCHART_GAP_TOKEN} to use.`,
      "@ 1979:",
      `Teachers had to get a ${FLOWCHART_GAP_TOKEN}, but they did not have to pay for this.`,
      `!Applicants were attracted to the ${FLOWCHART_GAP_TOKEN} that teaching received.`,
    ],
  }),
  question(7, ReadingQuestionType.TABLE_COMPLETION, {
    groupLabel: "R-07 · Table Completion",
    instructions: "",
    questionText: "Experiments in change blindness",
    options: [
      "Researchers|||Purpose of experiment|||Situation for participants|||Focus of participants' attention|||Percentage unaware of identity change",
      `Simons &\nLevi, 1998|||to illustrate\nchange blindness caused by a\n${FLOWCHART_GAP_TOKEN}, such\nas an object|||giving\n${FLOWCHART_GAP_TOKEN}\nto a stranger|||the movement of\n${FLOWCHART_GAP_TOKEN}|||46.6%`,
      `Davies &\nHine, 2007|||to assess the impact of change\nblindness on\n${FLOWCHART_GAP_TOKEN} by\neyewitnesses|||watching a burglary|||the collection of\n${FLOWCHART_GAP_TOKEN}|||61%`,
    ],
  }),
  question(8, ReadingQuestionType.SENTENCE_COMPLETION, {
    groupLabel: "R-08 · Sentence Completion",
    instructions: "",
    questionText: "",
    options: [
      `The length of time passengers spend shopping at airports has been affected by updated ${FLOWCHART_GAP_TOKEN}.`,
      `Airports with a wide range of recreational facilities can become a ${FLOWCHART_GAP_TOKEN} for people rather than a means to travel.`,
      `Both passengers and ${FLOWCHART_GAP_TOKEN} may feel encouraged to use and develop a sense of loyalty towards airports that market their business services.`,
      `Airports that supply meeting facilities may need to develop a ${FLOWCHART_GAP_TOKEN} over other venues.`,
    ],
  }),
  question(9, ReadingQuestionType.FLOWCHART_COMPLETION, {
    groupLabel: "R-09 · Flow-chart Completion",
    instructions: "",
    questionText: "Key events",
    options: [
      `1992 - the boat was discovered during the construction of a ${FLOWCHART_GAP_TOKEN}`,
      `2002 - an international ${FLOWCHART_GAP_TOKEN} was held to gather information`,
      `2004 - ${FLOWCHART_GAP_TOKEN} for the reconstruction were produced`,
      `2007 - the ${FLOWCHART_GAP_TOKEN} of BOAT 1550BC took place`,
      `2012 - the Bronze-Age ${FLOWCHART_GAP_TOKEN} featured the boat and other objects`,
    ],
  }),
  question(10, ReadingQuestionType.DIAGRAM_LABEL_COMPLETION, {
    groupLabel: "R-10 · Diagram Label Completion",
    instructions: "Label the diagram below.",
    questionText: "Building structure",
    options: [
      "pipes and ducts installed while in",
      "chosen by customer",
      "diagonal bracing at top and bottom of",
      "section contains less than conventional buildings",
    ],
    wordBank: [
      "canopy",
      "trunk",
      "roots",
      "pavement",
      "soil",
      "branch guard",
      "street lamp",
    ],
  }),
  question(11, ReadingQuestionType.SUMMARY_COMPLETION, {
    groupLabel: "R-11 · Summary Completion (With Clues)",
    instructions: "Complete the summary below using words from the box.",
    questionText: "Camera art",
    options: [
      `In the early days of photography, opinions on its future were ${FLOWCHART_GAP_TOKEN},`,
      `but three clear views emerged. A large number of artists and ordinary people saw photographs as ${FLOWCHART_GAP_TOKEN} to paintings because of the way they were produced.`,
      `Another popular view was that photographs could have a role to play in the art world, despite the photographer being less ${FLOWCHART_GAP_TOKEN}.`,
      `Finally, a smaller number of people suspected that the impact of photography on art and society could be ${FLOWCHART_GAP_TOKEN}.`,
    ],
    wordBank: [
      "inventive",
      "similar",
      "beneficial",
      "next",
      "mixed",
      "justified",
      "inferior",
    ],
  }),
  question(12, ReadingQuestionType.SUMMARY_COMPLETION, {
    groupLabel: "R-12 · Summary Completion (Without Clues)",
    instructions:
      "Complete the summary below. Choose NO MORE THAN TWO WORDS from the text for each answer.",
    questionText: "Survey Findings",
    options: [
      `Despite financial constraints due to the ${FLOWCHART_GAP_TOKEN}, a significant percentage of airports provide and wish to further support business meeting facilities.`,
      `Also, just under 30% of the airports surveyed plan to provide these facilities within ${FLOWCHART_GAP_TOKEN}.`,
      `However, the main users of the facilities are ${FLOWCHART_GAP_TOKEN}, and as many as 16% of respondents to the survey stated that their users did not take any ${FLOWCHART_GAP_TOKEN} at the airport.`,
    ],
    wordBank: [],
  }),
  question(13, ReadingQuestionType.SHORT_ANSWER, {
    groupLabel: "R-13 · Short-Answer Questions",
    instructions:
      "Complete the questions below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER from the passage for each gap.",
    questionText: "",
    options: [
      "How far under the ground was the boat found?",
      "What natural material had been secured to the boat to prevent water entering?",
      "What aspect of the boat was the focus of the 2012 reconstruction?",
      "Which two factors influenced the decision not to make a full-scale reconstruction of the boat?",
    ],
  }),
  question(14, ReadingQuestionType.CLASSIFICATION, {
    groupLabel: "R-14 · Classification",
    instructions:
      "Write the correct letter, A, B or C, in boxes 8-11 on your answer sheet.",
    questionText:
      "Classify the following techniques according to whether the writer states they",
    options: [
      "cameras",
      "sensors",
      "protein tests",
      "altitude tents",
    ],
    wordBank: [
      "A: are currently exclusively used by Australians",
      "B: will be used in the future by Australians",
      "C: are currently used by both Australians and their rivals",
    ],
  }),
  question(15, ReadingQuestionType.YES_NO_NOT_GIVEN, {
    groupLabel: "R-15 · Yes / No / Not Given",
    instructions:
      "Do the following statements agree with the views of the writer?",
    questionText: "Choose YES, NO or NOT GIVEN.",
    options: [
      "Urban trees should be planned as infrastructure rather than decoration.",
      "Every city should plant only one tree species.",
      "Community observations can improve technical planning.",
      "All planting programmes become profitable within one year.",
      "Planting a tree is enough to guarantee its survival.",
    ],
  }),
  question(16, ReadingQuestionType.TRUE_FALSE_NOT_GIVEN, {
    groupLabel: "R-16 · True / False / Not Given",
    instructions:
      "Do the following statements agree with the information in the passage?",
    questionText: "Choose TRUE, FALSE or NOT GIVEN.",
    options: [
      "A diverse mix reduces the risk that disease damages the entire forest.",
      "Tree crowns and released water both contribute to cooling.",
      "Roots prevent any rainwater from entering the ground.",
      "Residents may know where paths flood after storms.",
      "The passage states that all young trees are inspected every month.",
    ],
  }),
  question(17, ReadingQuestionType.TITLE_SUBTITLE_FINDING, {
    groupLabel: "R-17 · Title or Subtitle Finding",
    instructions: "Choose the correct letter, A, B, C or D.",
    questionText: "",
    options: [
      "Which of the following is the most suitable title for Reading Passage 3?|||Understanding what drives our moments of inspiration|||Challenging traditional theories of human creativity|||Creative solutions for enhancing professional relationships|||How the future is shaped by innovative ideas and inspired people",
      "Which of the following is the most suitable subtitle for Section B?|||Cooling streets in two natural ways|||Replacing every pavement in the city|||The rising cost of street lighting|||Growing mature trees indoors",
      "Which of the following is the most suitable subtitle for Section C?|||How trees help manage heavy rain|||Why urban roots must be removed|||Building larger storm drains|||Measuring air pollution near airports",
      "Which of the following is the most suitable subtitle for Section E?|||Local knowledge improves planning|||Ending community consultation|||Choosing trees by colour|||The decline of urban bus travel",
      "Which of the following is the most suitable subtitle for Section F?|||Planting is only the beginning|||Why young trees need no care|||Removing trained staff|||Benefits that appear immediately",
    ],
  }),
  question(18, ReadingQuestionType.MCQ_SINGLE, {
    groupLabel: "R-18 · Multiple Choice Questions (MCQ)",
    instructions:
      "Choose the correct answer, A, B, C or D, for each question.",
    questionText: "Answer the questions below.",
    options: [
      "Why do cities measure tree survival?|||To support evidence-based investment|||To remove all mature trees|||To replace community consultation|||To calculate residents' ages",
      "How do leaves help during heavy rain?|||They intercept water before it reaches the ground|||They stop all evaporation|||They harden the pavement|||They increase pressure on drains",
      "Why is a diverse species mix safer?|||Disease is less likely to affect every tree|||Every tree grows to the same height|||It removes the need for maintenance|||It uses no water",
      "What can residents contribute?|||Knowledge of local shade and flooding problems|||Laboratory measurements of every leaf|||A replacement for all technical surveys|||Guaranteed funding",
      "What do young trees need?|||Watering, protection and inspections|||Only decorative lighting|||Immediate removal of branches|||No attention after planting",
    ],
  }),
];

const AIRPORTS_PASSAGE = `
  <section>
    <h3>A</h3>
    <p>Airports have traditionally earned money from aviation services, retail and parking. In recent years, however, online shopping, tighter security and pressure on airline costs have encouraged terminal operators to look for other sources of commercial income.</p>
  </section>
  <section>
    <h3>B</h3>
    <p>Many terminals now offer far more than shops. Leisure areas, restaurants, health services and flexible work spaces can make an airport a destination in its own right rather than simply a place that passengers pass through.</p>
  </section>
  <section>
    <h3>C</h3>
    <p>Business travellers are an important market. Some airports provide meeting rooms, conference facilities and support services inside the terminal, allowing visitors to work without making an additional journey into the city.</p>
  </section>
  <section>
    <h3>D</h3>
    <p>These facilities can also use areas that would otherwise remain underused. Their success depends on clear pricing, convenient access and a service advantage over hotels and city-centre venues.</p>
  </section>
  <section>
    <h3>E</h3>
    <p>Surveys suggest that demand varies widely. Operators therefore measure who uses the rooms, how much time visitors spend in the terminal and whether business services encourage passengers to return.</p>
  </section>
`;

const PHOTOGRAPHY_PASSAGE = `
  <section>
    <h3>A</h3>
    <p>Photography is now used for information, advertising, decoration and personal expression. When the medium first appeared, however, artists and critics disagreed sharply about whether a mechanically produced image could be considered art.</p>
  </section>
  <section>
    <h3>B</h3>
    <p>Some painters feared that cameras would replace skilled work. Others argued that photography could become a useful tool while remaining separate from painting, drawing and the established fine arts.</p>
  </section>
  <section>
    <h3>C</h3>
    <p>Three broad views emerged. One rejected camera images as mechanical products, another accepted their practical value, and a third believed that photographs could be as culturally important as handmade works.</p>
  </section>
  <section>
    <h3>D</h3>
    <p>As techniques improved, photographers made increasingly deliberate choices about light, timing and composition. These choices weakened the claim that the camera operated without imagination or judgement.</p>
  </section>
  <section>
    <h3>E</h3>
    <p>Today the old boundary between photography and art is difficult to maintain. The debate remains useful because it shows how new technology can challenge familiar definitions of creativity.</p>
  </section>
`;

const showcaseQuestion = (
  source: IReadingQuestionStudent,
  partNumber: number,
  pageNumber: number,
  marks: number,
  options?: string[],
): IReadingQuestionStudent => ({
  ...source,
  _id: `${source._id}-part-${partNumber}`,
  orderNumber: pageNumber,
  pageNumber,
  marks,
  options: options ?? source.options,
});

export const READING_PART_1_DEMO_QUESTIONS: IReadingQuestionStudent[] = [
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[0], 1, 1, 2),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[1], 1, 3, 3, READING_PART_1_SHOWCASE_QUESTIONS[1].options?.slice(0, 3)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[2], 1, 6, 3, READING_PART_1_SHOWCASE_QUESTIONS[2].options?.slice(0, 3)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[3], 1, 9, 3, READING_PART_1_SHOWCASE_QUESTIONS[3].options?.slice(0, 3)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[4], 1, 12, 2, READING_PART_1_SHOWCASE_QUESTIONS[4].options?.slice(0, 2)),
];

export const READING_PART_2_SHOWCASE_TEST: IReadingTest = {
  ...READING_PART_1_SHOWCASE_TEST,
  _id: SHOWCASE_PART_2_ID,
  title: "IELTS Academic Reading — Part 2",
  passageTitle: "The changing role of airports",
  passageContent: AIRPORTS_PASSAGE,
  totalQuestions: 13,
  partNumber: 2,
  partTypeLabel: "Questions 14–26",
};

export const READING_PART_2_DEMO_QUESTIONS: IReadingQuestionStudent[] = [
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[5], 2, 14, 2, READING_PART_1_SHOWCASE_QUESTIONS[5].options?.slice(0, 5)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[6], 2, 16, 3, READING_PART_1_SHOWCASE_QUESTIONS[6].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[7], 2, 19, 2, READING_PART_1_SHOWCASE_QUESTIONS[7].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[8], 2, 21, 2, READING_PART_1_SHOWCASE_QUESTIONS[8].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[9], 2, 23, 2, READING_PART_1_SHOWCASE_QUESTIONS[9].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[10], 2, 25, 2, READING_PART_1_SHOWCASE_QUESTIONS[10].options?.slice(0, 2)),
];

export const READING_PART_3_SHOWCASE_TEST: IReadingTest = {
  ...READING_PART_1_SHOWCASE_TEST,
  _id: SHOWCASE_PART_3_ID,
  title: "IELTS Academic Reading — Part 3",
  passageTitle: "IS PHOTOGRAPHY ART?",
  passageContent: PHOTOGRAPHY_PASSAGE,
  totalQuestions: 14,
  partNumber: 3,
  partTypeLabel: "Questions 27–40",
};

export const READING_PART_3_DEMO_QUESTIONS: IReadingQuestionStudent[] = [
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[11], 3, 27, 2, READING_PART_1_SHOWCASE_QUESTIONS[11].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[12], 3, 29, 2, READING_PART_1_SHOWCASE_QUESTIONS[12].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[13], 3, 31, 2, READING_PART_1_SHOWCASE_QUESTIONS[13].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[14], 3, 33, 2, READING_PART_1_SHOWCASE_QUESTIONS[14].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[15], 3, 35, 2, READING_PART_1_SHOWCASE_QUESTIONS[15].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[16], 3, 37, 2, READING_PART_1_SHOWCASE_QUESTIONS[16].options?.slice(0, 2)),
  showcaseQuestion(READING_PART_1_SHOWCASE_QUESTIONS[17], 3, 39, 2, READING_PART_1_SHOWCASE_QUESTIONS[17].options?.slice(0, 2)),
];

export const READING_PART_1_SHOWCASE_EXAM: IMockExam = {
  _id: "client-preview-reading-exam",
  title: "Client Approval — Reading UI",
  description:
    "Interactive three-part IELTS Academic Reading preview covering all 18 supported question patterns.",
  readingPart1Id: SHOWCASE_ID,
  readingPart2Id: SHOWCASE_PART_2_ID,
  readingPart3Id: SHOWCASE_PART_3_ID,
  listeningDuration: 40,
  readingDuration: 60,
  writingDuration: 60,
  speakingDuration: 15,
  isActive: true,
  examType: "practice",
  createdBy: "client-preview",
  createdAt: CREATED_AT,
  updatedAt: CREATED_AT,
};

export const READING_PART_1_SHOWCASE_ATTEMPT: IMockExamAttempt = {
  _id: "client-preview-candidate-001",
  userId: "client-preview",
  examId: READING_PART_1_SHOWCASE_EXAM._id,
  status: "in_progress",
  startedAt: CREATED_AT,
  createdAt: CREATED_AT,
};
