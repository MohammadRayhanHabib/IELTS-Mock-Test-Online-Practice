import type { IMockExam, IMockExamAttempt } from "../api/mockExam";
import {
  FLOWCHART_GAP_TOKEN,
  ReadingQuestionType,
  type IReadingQuestionStudent,
  type IReadingTest,
} from "../api/reading";

export interface ClientPreviewReadingMock {
  exam: IMockExam;
  attempt: IMockExamAttempt;
  parts: Array<{
    test: IReadingTest;
    questions: IReadingQuestionStudent[];
    offset: number;
  }>;
  answers: Record<number, string>;
}

const CREATED_AT = "2026-08-26T00:00:00.000Z";

const question = (
  testNumber: number,
  partNumber: number,
  start: number,
  marks: number,
  questionType: ReadingQuestionType,
  groupLabel: string,
  data: Pick<IReadingQuestionStudent, "instructions" | "questionText" | "options" | "wordBank">,
): IReadingQuestionStudent => ({
  _id: `client-reading-t${testNumber}-p${partNumber}-q${start}`,
  questionType,
  orderNumber: start,
  pageNumber: start,
  marks,
  groupLabel,
  ...data,
});

const passage = (
  testNumber: number,
  partNumber: number,
  title: string,
  content: string,
): IReadingTest => {
  const first = partNumber === 1 ? 1 : partNumber === 2 ? 14 : 27;
  const last = partNumber === 1 ? 13 : partNumber === 2 ? 26 : 40;
  return {
    _id: `client-reading-test-${testNumber}-part-${partNumber}`,
    title: `IELTS Academic Reading — Test ${testNumber}, Part ${partNumber}`,
    passageTitle: title,
    passageContent: content,
    duration: 20,
    totalQuestions: last - first + 1,
    isActive: true,
    showExplanations: false,
    createdBy: "client-preview",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    testNumber,
    partNumber,
    partTypeLabel: `Questions ${first}–${last}`,
  };
};

const buildMock = (
  testNumber: number,
  parts: Array<{ test: IReadingTest; questions: IReadingQuestionStudent[] }>,
  answers: Record<number, string>,
): ClientPreviewReadingMock => {
  const examId = `client-preview-full-mock-${testNumber}`;
  const exam: IMockExam = {
    _id: examId,
    title: `Lexora Academic Mock Test ${testNumber}`,
    description: "Original client-preview content arranged in the official IELTS Academic module structure.",
    readingPart1Id: parts[0].test._id,
    readingPart2Id: parts[1].test._id,
    readingPart3Id: parts[2].test._id,
    listeningDuration: 30,
    readingDuration: 60,
    writingDuration: 60,
    speakingDuration: 14,
    isActive: true,
    examType: "mock",
    academicNumber: 20,
    testNumber,
    createdBy: "client-preview",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
  return {
    exam,
    attempt: {
      _id: `${examId}-attempt`,
      userId: "client-preview",
      examId,
      status: "in_progress",
      startedAt: CREATED_AT,
      createdAt: CREATED_AT,
    },
    parts: parts.map((part, index) => ({ ...part, offset: index === 0 ? 0 : index === 1 ? 13 : 26 })),
    answers,
  };
};

const T2_P1 = passage(2, 1, "Restoring the Living Coast", `
  <section><h3>A — A natural barrier</h3><p>Salt marshes, mangroves and seagrass meadows soften waves before they reach roads and homes. Engineers once treated these habitats as obstacles to development, but coastal authorities now include them in flood-defence plans.</p></section>
  <section><h3>B — How marshes grow</h3><p>Marsh plants slow moving water and trap fine sediment. As roots spread, the ground surface rises. A healthy marsh can therefore adjust gradually to modest sea-level change, although it cannot keep pace everywhere.</p></section>
  <section><h3>C — Space to move</h3><p>Sea walls prevent a wetland from migrating inland. Several projects have moved embankments away from the shore, creating a wider zone that can flood safely during storms while protecting settlements farther inland.</p></section>
  <section><h3>D — Measuring more than height</h3><p>Researchers monitor plant cover, sediment depth, bird populations and water quality. A restored site is not considered successful merely because it looks green; it must also perform ecological and protective functions.</p></section>
  <section><h3>E — Working with residents</h3><p>Fishing groups and local residents often identify seasonal channels that short surveys miss. Their observations help planners choose where paths, drainage gates and nursery areas should be placed.</p></section>
  <section><h3>F — Limits and maintenance</h3><p>Living shorelines are not suitable for every exposed coast. Young plants may need temporary fences, and invasive species must be controlled. The approach works best as one layer in a broader coastal strategy.</p></section>
`);

const T2_P2 = passage(2, 2, "The Last Kilometre of Urban Freight", `
  <section><h3>A</h3><p>Online shopping has increased the number of small deliveries entering city centres. Vans often carry only part of their capacity because customers expect narrow delivery windows and rapid service.</p></section>
  <section><h3>B</h3><p>Some cities use consolidation hubs at the edge of busy districts. Parcels from several operators are combined and transferred to electric vans or cargo bicycles for the final journey.</p></section>
  <section><h3>C</h3><p>Cargo bicycles are quiet and can use streets closed to large vehicles. Their limited volume, however, makes them most effective for compact parcels and dense neighbourhoods.</p></section>
  <section><h3>D</h3><p>Smart kerb systems allow delivery spaces to be booked for short periods. Sensors report whether a bay is occupied, reducing the time drivers spend circling or blocking traffic.</p></section>
  <section><h3>E</h3><p>Retailers can also reduce failed deliveries by sharing accurate arrival times and offering neighbourhood collection points. Convenience for the recipient remains essential: a system that is efficient for operators but ignored by customers saves little traffic.</p></section>
  <section><h3>F</h3><p>No single measure solves the problem. Successful programmes combine clean vehicles, realistic delivery windows, shared data and enforcement that keeps loading bays available.</p></section>
`);

const T2_P3 = passage(2, 3, "When Citizens Measure the Night Sky", `
  <section><h3>A</h3><p>Professional observatories measure artificial light precisely, but they cannot watch every town each night. Citizen-science projects ask volunteers to compare visible stars with reference charts, creating broad maps of sky brightness.</p></section>
  <section><h3>B</h3><p>The method is deliberately simple. Participants record time, location, cloud cover and the faintest stars they can see. Training examples help them distinguish haze from genuine light pollution.</p></section>
  <section><h3>C</h3><p>Individual observations vary because eyesight and local conditions differ. Large datasets remain useful when researchers remove incomplete records and compare repeated measurements from the same region.</p></section>
  <section><h3>D</h3><p>The data have revealed that brightening often occurs fastest at the edges of expanding towns. Satellite instruments can miss some blue-rich light, so observations from the ground provide an important second view.</p></section>
  <section><h3>E</h3><p>Several councils have responded by shielding street lamps and lowering brightness late at night. These changes can reduce wasted energy without leaving streets unlit.</p></section>
  <section><h3>F</h3><p>Researchers caution that participation is uneven. Wealthier districts may submit more records, while rural areas cover greater distances. Future projects are lending simple meters to schools to improve geographical balance.</p></section>
`);

const TEST_2 = buildMock(2, [
  { test: T2_P1, questions: [
    question(2,1,1,5,ReadingQuestionType.TRUE_FALSE_NOT_GIVEN,"R-16 · True / False / Not Given",{instructions:"Do the following statements agree with the information in the passage?",questionText:"Choose TRUE, FALSE or NOT GIVEN.",options:["Living coastal habitats are now included in some flood-defence plans.","Marsh roots prevent all sea-level change.","Moving embankments inland can create space that floods safely.","A green appearance alone proves that restoration is successful.","The passage states that every exposed coast should use a living shoreline."],wordBank:[]}),
    question(2,1,6,4,ReadingQuestionType.NOTE_COMPLETION,"R-06 · Note Completion",{instructions:"Complete the notes. Write NO MORE THAN TWO WORDS.",questionText:"Living shoreline projects",options:[`Marsh plants trap fine ${FLOWCHART_GAP_TOKEN}.`,`Some projects move ${FLOWCHART_GAP_TOKEN} away from the shore.`,`Scientists monitor water quality and ${FLOWCHART_GAP_TOKEN}.`,`Young plants may need temporary ${FLOWCHART_GAP_TOKEN}.`],wordBank:[]}),
    question(2,1,10,4,ReadingQuestionType.SHORT_ANSWER,"R-13 · Short-Answer Questions",{instructions:"Answer the questions below. Write NO MORE THAN THREE WORDS.",questionText:"",options:["Which habitat softens waves before they reach homes?","Who may identify seasonal channels missed by short surveys?","What must be controlled during maintenance?","What kind of coastal strategy should include living shorelines?"],wordBank:[]}),
  ]},
  { test: T2_P2, questions: [
    question(2,2,14,5,ReadingQuestionType.MATCHING_HEADINGS,"R-02 · Heading Matching",{instructions:"Choose the correct heading for Sections B–F.",questionText:"Match each section with a heading.",options:["Section B","Section C","Section D","Section E","Section F"],wordBank:["A — Combining deliveries at the district edge","B — Where small vehicles work best","C — Reserving scarce street space","D — Making collection convenient","E — A package of coordinated measures","F — Returning all deliveries to large trucks","G — Removing delivery-time information"]}),
    question(2,2,19,4,ReadingQuestionType.MATCHING_INFORMATION,"R-04 · Information Matching",{instructions:"Which section contains the following information? Write A–F.",questionText:"",options:["a reason delivery vans may be partly empty","a vehicle limited by the size of its load","technology that reports whether a space is occupied","the importance of customer acceptance"],wordBank:["A","B","C","D","E","F"]}),
    question(2,2,23,4,ReadingQuestionType.SENTENCE_COMPLETION,"R-08 · Sentence Completion",{instructions:"Complete the sentences. Write NO MORE THAN TWO WORDS.",questionText:"",options:[`At consolidation hubs, parcels are transferred to clean vans or ${FLOWCHART_GAP_TOKEN}.`,`Drivers circle less when loading bays can be ${FLOWCHART_GAP_TOKEN}.`,`Collection points help reduce ${FLOWCHART_GAP_TOKEN}.`,`Loading-bay enforcement is part of a ${FLOWCHART_GAP_TOKEN}.`],wordBank:[]}),
  ]},
  { test: T2_P3, questions: [
    question(2,3,27,4,ReadingQuestionType.MCQ_SINGLE,"R-18 · Multiple Choice Questions (MCQ)",{instructions:"Choose the correct answer, A, B, C or D.",questionText:"",options:["Why do projects use volunteers?|||Observatories cannot monitor every town nightly|||Satellites no longer operate|||Professional instruments see no stars|||Volunteers replace all scientists","What is recorded besides visible stars?|||Cloud cover and location|||Household income|||Street width|||Bird populations","Why are repeated observations valuable?|||They help researchers manage variation|||They eliminate all training|||They measure road noise|||They are always identical","What can councils do?|||Shield lamps and reduce late-night brightness|||Remove every lamp|||Ban satellite research|||Increase glare"],wordBank:[]}),
    question(2,3,31,5,ReadingQuestionType.YES_NO_NOT_GIVEN,"R-15 · Yes / No / Not Given",{instructions:"Do the following statements agree with the views of the writer?",questionText:"Choose YES, NO or NOT GIVEN.",options:["Ground observations can complement satellite data.","Every volunteer has identical eyesight.","Street-light changes can save energy without total darkness.","Rural areas always submit more observations than cities.","Schools may help improve the geographical balance of data."],wordBank:[]}),
    question(2,3,36,5,ReadingQuestionType.SUMMARY_COMPLETION,"R-12 · Summary Completion (Without Clues)",{instructions:"Complete the summary. Write NO MORE THAN TWO WORDS.",questionText:"Citizen measurements",options:[`Volunteers compare stars with ${FLOWCHART_GAP_TOKEN}.`,`Researchers remove ${FLOWCHART_GAP_TOKEN} records.`,`Town edges may show the fastest ${FLOWCHART_GAP_TOKEN}.`,`Some satellites miss ${FLOWCHART_GAP_TOKEN} light.`,`Schools may borrow simple ${FLOWCHART_GAP_TOKEN}.`],wordBank:[]}),
  ]},
], {1:"TRUE",2:"FALSE",3:"TRUE",4:"FALSE",5:"NOT GIVEN",6:"sediment",7:"embankments",8:"bird populations",9:"fences",10:"salt marshes",11:"local residents",12:"invasive species",13:"broader strategy",14:"A",15:"B",16:"C",17:"D",18:"E",19:"A",20:"C",21:"D",22:"E",23:"cargo bicycles",24:"booked",25:"failed deliveries",26:"coordinated programme",27:"A",28:"A",29:"A",30:"A",31:"YES",32:"NO",33:"YES",34:"NO",35:"YES",36:"reference charts",37:"incomplete",38:"brightening",39:"blue-rich",40:"meters"});

const T3_P1 = passage(3, 1, "Repair Cafés and the Return of Practical Knowledge", `
  <section><h3>A</h3><p>Repair cafés bring volunteers with technical skills together with residents carrying broken household items. The aim is not a free commercial service but a shared learning session.</p></section>
  <section><h3>B</h3><p>Visitors sit beside the repairer, describe the fault and help open the object. This slows the process but makes the knowledge visible and gives owners confidence to attempt simple repairs later.</p></section>
  <section><h3>C</h3><p>Organisers record which objects arrive and why some cannot be fixed. Missing spare parts and sealed plastic cases are more common barriers than a lack of volunteer skill.</p></section>
  <section><h3>D</h3><p>Libraries and community centres are suitable hosts because they are familiar public places. Safety rules still matter: volunteers refuse work involving damaged gas systems or dangerous batteries.</p></section>
  <section><h3>E</h3><p>The strongest environmental claim is waste prevention, but the social effect may be just as important. Participants exchange stories, tools and local contacts while waiting.</p></section>
  <section><h3>F</h3><p>Several groups now publish anonymised repair records. Manufacturers can use these data to identify recurring failures, although campaigners argue that durable design should be required by regulation.</p></section>
`);
const T3_P2 = passage(3, 2, "Farming Upwards", `
  <section><h3>A</h3><p>Vertical farms grow crops on stacked shelves inside controlled buildings. LEDs provide light while pumps circulate water and nutrients through closed channels.</p></section>
  <section><h3>B</h3><p>Leafy vegetables suit the system because they grow quickly and remain compact. Wheat and fruit trees require too much space or energy for most commercial sites.</p></section>
  <section><h3>C</h3><p>Water use can be far lower than in open fields because unused solution is captured and returned to a storage tank. Electricity demand, however, is substantial.</p></section>
  <section><h3>D</h3><p>Some farms are built near city markets, reducing transport distance. Others occupy regions with cheap renewable energy and send produce farther by rail.</p></section>
  <section><h3>E</h3><p>Engineers are testing sensors that adjust light and nutrients for each shelf. The goal is not to replace all outdoor farming but to supply reliable quantities of selected crops.</p></section>
`);
const T3_P3 = passage(3, 3, "Why Sleep Changes What We Remember", `
  <section><h3>A</h3><p>Experiments consistently show that sleep supports memory, but researchers disagree about the precise mechanism. Some focus on strengthening useful connections; others emphasise the removal of competing information.</p></section>
  <section><h3>B</h3><p>Professor Lena Ortiz asks participants to learn pairs of unrelated words before sleep. Her team finds the greatest improvement when slow-wave sleep is uninterrupted.</p></section>
  <section><h3>C</h3><p>Dr Marcus Wei studies procedural skills such as tapping sequences. Performance often improves after sleep even when participants do not report remembering the sequence consciously.</p></section>
  <section><h3>D</h3><p>Neuroscientist Amira Cole uses quiet sound cues associated with earlier learning. Played gently during sleep, the cues can bias which memories are strengthened without waking the sleeper.</p></section>
  <section><h3>E</h3><p>Critics warn that laboratory nights are unusual and that a single score cannot represent daily memory. New wearable sensors allow longer studies at home, though their signals are less detailed.</p></section>
  <section><h3>F</h3><p>The practical message is modest: regular, sufficient sleep helps learning, but it cannot substitute for attention and practice. Sleep works on information that the brain has already encountered.</p></section>
`);

const TEST_3 = buildMock(3, [
  {test:T3_P1,questions:[
    question(3,1,1,5,ReadingQuestionType.MATCHING_HEADINGS,"R-02 · Heading Matching",{instructions:"Choose the correct heading for Sections B–F.",questionText:"",options:["Section B","Section C","Section D","Section E","Section F"],wordBank:["A — Learning by taking part","B — The obstacles revealed by records","C — A familiar venue with firm limits","D — Benefits beyond waste reduction","E — Evidence that can influence design","F — A faster commercial service","G — Repair without safety rules"]}),
    question(3,1,6,4,ReadingQuestionType.TRUE_FALSE_NOT_GIVEN,"R-16 · True / False / Not Given",{instructions:"Choose TRUE, FALSE or NOT GIVEN.",questionText:"",options:["Visitors are expected to participate in the repair.","Volunteer skill is the most common reason repairs fail.","All battery repairs are accepted.","Some groups share anonymised repair data."],wordBank:[]}),
    question(3,1,10,4,ReadingQuestionType.MATCHING_SENTENCE_ENDINGS,"R-05 · Sentence-Ending Matching",{instructions:"Complete each sentence with the correct ending, A–F.",questionText:"",options:["The shared process gives owners","Repair records show that sealed cases","Public venues are useful because they","Campaigners believe durable design"],wordBank:["confidence to try simple work later.","can prevent otherwise possible repairs.","are already familiar to residents.","should be supported by regulation.","eliminates the need for spare parts.","makes all dangerous work acceptable."]}),
  ]},
  {test:T3_P2,questions:[
    question(3,2,14,4,ReadingQuestionType.DIAGRAM_LABEL_COMPLETION,"R-10 · Diagram Label Completion",{instructions:"Label the vertical-farm diagram. Write ONE WORD ONLY.",questionText:"Vertical farm system",options:["light source above each shelf","water returned through closed channels","unused solution collected in","produce sent to nearby"],wordBank:["LEDs","pumps","tank","markets","soil","tractor"]}),
    question(3,2,18,5,ReadingQuestionType.CLASSIFICATION,"R-14 · Classification",{instructions:"Classify each feature: A current strength, B current limitation, C future development.",questionText:"Vertical farming features",options:["low water use","high electricity demand","shelf-specific control","short city delivery routes","suitability for wheat"],wordBank:["A: current strength","B: current limitation","C: future development"]}),
    question(3,2,23,4,ReadingQuestionType.SHORT_ANSWER,"R-13 · Short-Answer Questions",{instructions:"Answer using NO MORE THAN THREE WORDS.",questionText:"",options:["Which crops commonly suit vertical farms?","What carries water and nutrients?","What kind of energy can attract farms to remote regions?","What does the system aim to supply reliably?"],wordBank:[]}),
  ]},
  {test:T3_P3,questions:[
    question(3,3,27,5,ReadingQuestionType.MATCHING_FEATURES,"R-03 · Classification Type 2",{instructions:"Match each statement with the correct researcher, A–C.",questionText:"Sleep researchers",options:["studies unrelated word pairs","investigates skills without conscious recall","uses sounds linked to earlier learning","finds uninterrupted slow-wave sleep important","can influence selected memories"],wordBank:["A — Lena Ortiz","B — Marcus Wei","C — Amira Cole"]}),
    question(3,3,32,5,ReadingQuestionType.SUMMARY_COMPLETION,"R-11 · Summary Completion (With Clues)",{instructions:"Complete the summary using words from the box.",questionText:"Sleep and memory",options:[`Sleep may strengthen useful ${FLOWCHART_GAP_TOKEN}.`,`Procedural performance can improve without ${FLOWCHART_GAP_TOKEN} recall.`,`Laboratory nights may be ${FLOWCHART_GAP_TOKEN}.`,`Wearables support longer studies at ${FLOWCHART_GAP_TOKEN}.`,`Sleep cannot replace attention and ${FLOWCHART_GAP_TOKEN}.`],wordBank:["connections","conscious","unusual","home","practice","electricity","distance"]}),
    question(3,3,37,4,ReadingQuestionType.MCQ_SINGLE,"R-18 · Multiple Choice Questions (MCQ)",{instructions:"Choose A, B, C or D.",questionText:"",options:["What do researchers disagree about?|||The exact memory mechanism|||Whether people sleep|||The existence of words|||How to build farms","What is a limitation of wearables?|||Less detailed signals|||They cannot be worn|||They only work in laboratories|||They erase memory","What is the writer's practical message?|||Regular sleep supports learning|||Sleep replaces practice|||One test score explains memory|||Sound must wake sleepers","What information can sleep work on?|||Material already encountered|||Completely unknown material|||Only movement skills|||Only spoken words"],wordBank:[]}),
  ]},
], {1:"A",2:"B",3:"C",4:"D",5:"E",6:"TRUE",7:"FALSE",8:"FALSE",9:"TRUE",10:"confidence to try simple work later",11:"can prevent otherwise possible repairs",12:"are already familiar to residents",13:"should be supported by regulation",14:"LEDs",15:"channels",16:"tank",17:"markets",18:"A",19:"B",20:"C",21:"A",22:"B",23:"leafy vegetables",24:"pumps",25:"renewable energy",26:"selected crops",27:"A",28:"B",29:"C",30:"A",31:"C",32:"connections",33:"conscious",34:"unusual",35:"home",36:"practice",37:"A",38:"A",39:"A",40:"A"});

const T4_P1 = passage(4,1,"Designing Museums for Listening",`
  <section><h3>A</h3><p>Museums are usually designed for looking, yet sound strongly affects how long visitors stay. Hard galleries can amplify footsteps and conversation until quiet exhibits become tiring.</p></section>
  <section><h3>B</h3><p>Acoustic designers use absorbent ceilings, fabric panels and irregular surfaces to reduce echoes. Materials must also satisfy conservation rules and remain easy to clean.</p></section>
  <section><h3>C</h3><p>Directional speakers create small listening zones around an exhibit. Visitors a few metres away hear much less, allowing several audio displays to share one room.</p></section>
  <section><h3>D</h3><p>Sound walks offer another approach. Headphones trigger recordings according to location, so the visitor carries the audio zone rather than the building containing it.</p></section>
  <section><h3>E</h3><p>Inclusive design matters. Transcripts support deaf visitors, while tactile signals and clear volume controls help people with different sensory needs.</p></section>
  <section><h3>F</h3><p>Evaluation combines decibel readings with observation and interviews. A technically quiet room may still feel confusing if signs, routes or narration compete for attention.</p></section>
`);
const T4_P2 = passage(4,2,"Giving a River Room Again",`
  <section><h3>A</h3><p>Many urban rivers were straightened and confined between concrete walls. Water moved quickly through the city, but downstream flood peaks became higher and habitats disappeared.</p></section>
  <section><h3>B</h3><p>River restoration may remove sections of concrete and rebuild bends. A longer channel slows water and creates shallow edges where plants and insects return.</p></section>
  <section><h3>C</h3><p>Where space is limited, engineers create temporary flood parks. Sports fields and paths remain dry most of the year but safely store water after intense rain.</p></section>
  <section><h3>D</h3><p>Fish passages are added beside old weirs. Their slope and flow must suit local species; a decorative channel with water moving too fast achieves little.</p></section>
  <section><h3>E</h3><p>Projects are monitored over several seasons. Teams count fish, map vegetation and compare water levels before and after storms.</p></section>
  <section><h3>F</h3><p>Public access can build support, but paths must avoid sensitive nesting areas. Successful designs balance recreation, flood management and ecological recovery.</p></section>
`);
const T4_P3 = passage(4,3,"Can a Workplace Be Designed for Better Ideas?",`
  <section><h3>A</h3><p>Companies often copy creative offices filled with bright furniture, but evidence suggests that appearance alone has little effect on the quality of ideas.</p></section>
  <section><h3>B</h3><p>Psychologist Noor Rahman finds that short periods of focused individual work should precede group discussion. This reduces the tendency for the first speaker's idea to dominate.</p></section>
  <section><h3>C</h3><p>Architect Jules Meyer studies movement. Teams exposed to several connected settings—quiet rooms, shared tables and outdoor paths—generate more varied proposals than teams kept in one open room.</p></section>
  <section><h3>D</h3><p>Management researcher Imani Cole emphasises psychological safety. People contribute unusual suggestions only when criticism addresses the proposal rather than the person.</p></section>
  <section><h3>E</h3><p>Digital tools can broaden participation by allowing anonymous contributions, though too many simultaneous messages may overwhelm the group.</p></section>
  <section><h3>F</h3><p>The best environment is therefore adjustable. It provides choice, clear stages and respectful rules instead of assuming that a distinctive interior will produce creativity automatically.</p></section>
`);

const TEST_4 = buildMock(4,[
  {test:T4_P1,questions:[
    question(4,1,1,5,ReadingQuestionType.MATCHING_FEATURES,"R-03 · Classification Type 2",{instructions:"Match each description with the correct feature, A–E.",questionText:"Museum sound features",options:["reduces reflected sound","creates a small audio area","moves audio with the visitor","provides text alternatives","combines measurements with visitor evidence"],wordBank:["A — absorbent materials","B — directional speakers","C — sound walk","D — inclusive access","E — evaluation"]}),
    question(4,1,6,4,ReadingQuestionType.NOTE_COMPLETION,"R-06 · Note Completion",{instructions:"Complete the notes. Write NO MORE THAN TWO WORDS.",questionText:"Acoustic museum design",options:[`Hard galleries can amplify footsteps and ${FLOWCHART_GAP_TOKEN}.`,`Directional speakers create listening ${FLOWCHART_GAP_TOKEN}.`,`Headphones may trigger audio according to ${FLOWCHART_GAP_TOKEN}.`,`A quiet room may still have competing ${FLOWCHART_GAP_TOKEN}.`],wordBank:[]}),
    question(4,1,10,4,ReadingQuestionType.TABLE_COMPLETION,"R-07 · Table Completion",{instructions:"Complete the table. Write ONE WORD ONLY.",questionText:"Museum audio methods",options:["Method|||Main benefit","Absorbent panels|||reduce [[GAP]]","Directional speakers|||limit the listening [[GAP]]","Transcripts|||support [[GAP]] visitors","Interviews|||record visitor [[GAP]]"],wordBank:[]}),
  ]},
  {test:T4_P2,questions:[
    question(4,2,14,5,ReadingQuestionType.MATCHING_INFORMATION,"R-04 · Information Matching",{instructions:"Which section contains the following information? Write A–F.",questionText:"",options:["a former solution that increased downstream flood peaks","a longer route that slows water","land used for sport in normal weather","a structure designed around local fish","monitoring over more than one season"],wordBank:["A","B","C","D","E","F"]}),
    question(4,2,19,4,ReadingQuestionType.FLOWCHART_COMPLETION,"R-09 · Flow-chart Completion",{instructions:"Complete the flow chart. Write NO MORE THAN TWO WORDS.",questionText:"Restoration sequence",options:[`Remove concrete and rebuild river ${FLOWCHART_GAP_TOKEN}.`,`Create shallow edges for plants and ${FLOWCHART_GAP_TOKEN}.`,`Provide flood parks that store water after ${FLOWCHART_GAP_TOKEN}.`,`Monitor fish, vegetation and ${FLOWCHART_GAP_TOKEN}.`],wordBank:[]}),
    question(4,2,23,4,ReadingQuestionType.TRUE_FALSE_NOT_GIVEN,"R-16 · True / False / Not Given",{instructions:"Choose TRUE, FALSE or NOT GIVEN.",questionText:"",options:["Straight channels can increase downstream flood peaks.","Flood parks remain underwater throughout the year.","Fish passages must suit local species.","Every restored river bans public access."],wordBank:[]}),
  ]},
  {test:T4_P3,questions:[
    question(4,3,27,5,ReadingQuestionType.YES_NO_NOT_GIVEN,"R-15 · Yes / No / Not Given",{instructions:"Choose YES, NO or NOT GIVEN.",questionText:"",options:["Decorative offices alone guarantee better ideas.","Individual thinking before discussion can reduce early dominance.","Using several settings may increase proposal variety.","Anonymous digital input is always easy to manage.","An adjustable workplace is preferable to one fixed formula."],wordBank:[]}),
    question(4,3,32,4,ReadingQuestionType.TITLE_SUBTITLE_FINDING,"R-17 · Title or Subtitle Finding",{instructions:"Choose A, B, C or D.",questionText:"",options:["Best title for the passage?|||Designing conditions for better ideas|||The history of office furniture|||Why all meetings should be anonymous|||How to remove outdoor paths","Best subtitle for Section B?|||Think alone before sharing|||Let the first voice lead|||Choose brighter furniture|||Avoid all discussion","Best subtitle for Section C?|||Movement between varied settings|||One open room for every task|||The end of outdoor work|||Fixed desks improve variety","Best subtitle for Section D?|||Safety for unusual suggestions|||Criticise the person|||Avoid respectful rules|||Remove managers"],wordBank:[]}),
    question(4,3,36,5,ReadingQuestionType.MCQ_SINGLE,"R-18 · Multiple Choice Questions (MCQ)",{instructions:"Choose A, B, C or D.",questionText:"",options:["What does Rahman recommend first?|||Focused individual work|||A large public meeting|||Anonymous voting|||Furniture shopping","What did Meyer's teams use?|||Connected work settings|||Only one open room|||No shared tables|||Recorded lectures","What does Cole emphasise?|||Psychological safety|||Expensive technology|||Strict silence|||Competition between people","What risk comes with digital tools?|||Message overload|||No participation|||Lack of electricity|||Permanent anonymity","What is the writer's conclusion?|||Choice and clear stages matter|||Decoration automatically creates ideas|||Every team needs the same room|||Outdoor paths are essential"],wordBank:[]}),
  ]},
],{1:"A",2:"B",3:"C",4:"D",5:"E",6:"conversation",7:"zones",8:"location",9:"narration",10:"echoes",11:"zone",12:"deaf",13:"feedback",14:"A",15:"B",16:"C",17:"D",18:"E",19:"bends",20:"insects",21:"intense rain",22:"water levels",23:"TRUE",24:"FALSE",25:"TRUE",26:"NOT GIVEN",27:"NO",28:"YES",29:"YES",30:"NO",31:"YES",32:"A",33:"A",34:"A",35:"A",36:"A",37:"A",38:"A",39:"A",40:"A"});

const MOCKS: Record<number, ClientPreviewReadingMock> = { 2: TEST_2, 3: TEST_3, 4: TEST_4 };

export const getClientPreviewFullReadingMock = (testNumber: number) => MOCKS[testNumber] ?? null;
