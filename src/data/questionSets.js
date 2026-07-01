/**
 * Adds stable IDs to an array of questions.
 * @param {Array}  questions - Raw question objects (text + type).
 * @param {string} prefix    - Prefix used to namespace the IDs.
 */
function withIds(questions, prefix) {
  return questions.map((q, i) => ({ ...q, id: `${prefix}-${i}` }));
}

// ---------------------------------------------------------------------------
// Classic Mix
// ---------------------------------------------------------------------------
const classicTruths = [
  { text: "What is the most embarrassing thing you've ever done in public?",    type: 'truth' },
  { text: "Have you ever lied to get out of trouble? What was the lie?",        type: 'truth' },
  { text: "What is the weirdest dream you've ever had?",                        type: 'truth' },
  { text: "Who was your first crush and do they know?",                         type: 'truth' },
  { text: "What is one thing you've done that you hope your parents never find out about?", type: 'truth' },
  { text: "What is your biggest irrational fear?",                              type: 'truth' },
  { text: "Have you ever cheated on a test or exam?",                           type: 'truth' },
  { text: "What is the most childish thing you still do?",                      type: 'truth' },
  { text: "What is the worst gift you've ever received?",                       type: 'truth' },
  { text: "Have you ever pretended to be sick to avoid something?",             type: 'truth' },
  { text: "What is your most-used emoji and what does it say about you?",       type: 'truth' },
  { text: "What is the longest you've gone without showering?",                 type: 'truth' },
  { text: "What is a secret talent you have that surprises people?",            type: 'truth' },
  { text: "Have you ever ghosted someone? What happened?",                      type: 'truth' },
  { text: "What is the most embarrassing song on your playlist?",               type: 'truth' },
];

const classicDares = [
  { text: "Do your best impression of someone in the room.",                               type: 'dare' },
  { text: "Let someone else post a status on your social media.",                          type: 'dare' },
  { text: "Call a random contact and sing them Happy Birthday.",                           type: 'dare' },
  { text: "Do 20 jumping jacks while reciting the alphabet backwards.",                    type: 'dare' },
  { text: "Eat a spoonful of the most disgusting condiment combination you can make.",      type: 'dare' },
  { text: "Talk in an accent for the next 3 rounds.",                                      type: 'dare' },
  { text: "Let someone draw on your face with a marker.",                                  type: 'dare' },
  { text: "Wear your clothes inside out for the next 3 rounds.",                           type: 'dare' },
  { text: "Do your best robot dance for 30 seconds.",                                      type: 'dare' },
  { text: 'Say "banana" after every sentence for the next 2 rounds.',                      type: 'dare' },
  { text: "Let the group pick a new nickname for you that you must use tonight.",          type: 'dare' },
  { text: "Text your most recent contact a random GIF without explanation.",               type: 'dare' },
  { text: "Speak only in questions for the next round.",                                   type: 'dare' },
  { text: "Do your best catwalk across the room.",                                         type: 'dare' },
  { text: "Hold a plank for 30 seconds.",                                                  type: 'dare' },
];

// ---------------------------------------------------------------------------
// Spicy Edition
// ---------------------------------------------------------------------------
const spicyTruths = [
  { text: "What is the most scandalous rumor you've ever heard about yourself?",          type: 'truth' },
  { text: "Have you ever had feelings for a friend's partner?",                           type: 'truth' },
  { text: "What is the most desperate thing you've done for attention?",                  type: 'truth' },
  { text: "What is something you've done that you're actually a little proud of, but probably shouldn't be?", type: 'truth' },
  { text: "Who in this room would you trade lives with for a week?",                      type: 'truth' },
  { text: "What is the biggest lie you've told on a date?",                               type: 'truth' },
  { text: "Have you ever sent a message to the wrong person? What was it?",               type: 'truth' },
  { text: "What would you do with $1M if no one could ever find out?",                   type: 'truth' },
  { text: "What is something you pretend to like but secretly can't stand?",             type: 'truth' },
  { text: "What is the most awkward date you've ever been on?",                          type: 'truth' },
];

const spicyDares = [
  { text: 'Go outside and yell "I believe in myself!" as loud as you can.',               type: 'dare' },
  { text: "Let someone look through your photos for 30 seconds.",                         type: 'dare' },
  { text: "Confess a small lie you've told to someone in this room.",                     type: 'dare' },
  { text: "Send a voice memo to a family member saying you miss them.",                   type: 'dare' },
  { text: "Do your best impression of your own boss or teacher.",                         type: 'dare' },
  { text: "Read the last text you sent out loud.",                                        type: 'dare' },
  { text: "Let someone go through your search history for 15 seconds.",                  type: 'dare' },
  { text: "Describe your ideal date using only emojis — let the group guess.",            type: 'dare' },
  { text: "Let the group pick a profile picture for you to use for the rest of the night.", type: 'dare' },
  { text: "Share the most recent photo in your camera roll (no deleting first).",         type: 'dare' },
];

// ---------------------------------------------------------------------------
// Exported question sets
// ---------------------------------------------------------------------------
export const DEFAULT_QUESTION_SETS = [
  {
    id: 'classic',
    name: 'Classic Mix',
    questions: withIds([...classicTruths, ...classicDares], 'classic'),
  },
  {
    id: 'spicy',
    name: 'Spicy Edition',
    questions: withIds([...spicyTruths, ...spicyDares], 'spicy'),
  },
];
