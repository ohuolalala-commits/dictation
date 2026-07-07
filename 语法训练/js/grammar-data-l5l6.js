const grammarLevels = window.grammarLevels || {};

grammarLevels["5-1"] = {
  id: "5-1",
  title: "I can / I can't",
  topics: ["can", "can't", "abilities"],
  items: [
    {
      step: "see",
      image: "🏊",
      sentence: "I can swim."
    },
    {
      step: "see",
      image: "🏊❌",
      sentence: "I can't swim."
    },
    {
      step: "color",
      image: "🏊",
      parts: [
        { text: "I", type: "subject" },
        { text: "can", type: "function" },
        { text: "swim.", type: "action" }
      ]
    },
    {
      step: "color",
      image: "🏊❌",
      parts: [
        { text: "I", type: "subject" },
        { text: "can't", type: "negative" },
        { text: "swim.", type: "action" }
      ]
    },
    {
      step: "match",
      image: "🏊",
      promptBefore: "I",
      promptAfter: "swim.",
      options: ["can", "can't"],
      answer: "can",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🏊❌",
      promptBefore: "I",
      promptAfter: "swim.",
      options: ["can", "can't"],
      answer: "can't",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🕊️",
      promptBefore: "Birds",
      promptAfter: "fly.",
      options: ["can", "can't"],
      answer: "can",
      hintLevel: 3
    },
    {
      step: "match",
      image: "🐕🕊️",
      promptBefore: "Dogs",
      promptAfter: "fly.",
      options: ["can", "can't"],
      answer: "can't",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🏊",
      blocks: ["can", "I", "swim"],
      answer: "I can swim.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "🏊❌",
      blocks: ["can't", "I", "swim"],
      answer: "I can't swim.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "🎤",
      blocks: ["sing", "She", "can"],
      answer: "She can sing.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🚗❌",
      blocks: ["can't", "He", "drive"],
      answer: "He can't drive.",
      hintLevel: 3
    },
    {
      step: "use",
      image: "🏊",
      answer: "I can swim.",
      hints: ["I", "can", "swim"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "🕊️",
      answer: "Birds can fly.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "🐕🕊️",
      answer: "Dogs can't fly.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "🤾",
      answer: "I can jump high.",
      hints: [],
      hintLevel: 0
    }
  ]
};

grammarLevels["5-2"] = {
  id: "5-2",
  title: "Can you...? Q&A",
  topics: ["can", "question", "yes/no answer"],
  items: [
    {
      step: "see",
      image: "🏊❓",
      sentence: "Can you swim?"
    },
    {
      step: "see",
      image: "🏊✅",
      sentence: "Yes, I can."
    },
    {
      step: "color",
      image: "🏊❓",
      parts: [
        { text: "Can", type: "question" },
        { text: "you", type: "subject" },
        { text: "swim?", type: "action" }
      ]
    },
    {
      step: "color",
      image: "🏊✅",
      parts: [
        { text: "Yes,", type: "function" },
        { text: "I", type: "subject" },
        { text: "can.", type: "function" }
      ]
    },
    {
      step: "match",
      image: "🏊❓",
      promptBefore: "",
      promptAfter: "you swim?",
      options: ["Can", "Do", "Are"],
      answer: "Can",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🏊✅",
      promptBefore: "Yes,",
      promptAfter: "",
      options: ["can", "do", "am"],
      answer: "can",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🎤❌",
      promptBefore: "No,",
      promptAfter: "",
      options: ["can't", "don't", "am not"],
      answer: "can't",
      hintLevel: 3
    },
    {
      step: "match",
      image: "🏃❓",
      promptBefore: "",
      promptAfter: "you run fast?",
      options: ["Can", "Do"],
      answer: "Can",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🏊❓",
      blocks: ["Can", "you", "swim"],
      answer: "Can you swim?",
      hintLevel: 4
    },
    {
      step: "build",
      image: "🏊✅",
      blocks: ["Yes", "I", "can"],
      answer: "Yes, I can.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "🎤❌",
      blocks: ["No", "I", "can't"],
      answer: "No, I can't.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🏃❓",
      blocks: ["you", "Can", "run", "fast"],
      answer: "Can you run fast?",
      hintLevel: 3
    },
    {
      step: "use",
      image: "🏊❓",
      answer: "Can you swim?",
      hints: ["Can", "you", "swim"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "🏊✅",
      answer: "Yes, I can.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "🎤❌",
      answer: "No, I can't.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "🏃❓",
      answer: "Can you run fast?",
      hints: [],
      hintLevel: 0
    }
  ]
};

grammarLevels["5-3"] = {
  id: "5-3",
  title: "He can / She can",
  topics: ["can", "he", "she", "third person"],
  items: [
    {
      step: "see",
      image: "👦🏊",
      sentence: "He can swim."
    },
    {
      step: "see",
      image: "👧🎤",
      sentence: "She can sing."
    },
    {
      step: "color",
      image: "👦🏊",
      parts: [
        { text: "He", type: "subject" },
        { text: "can", type: "function" },
        { text: "swim.", type: "action" }
      ]
    },
    {
      step: "color",
      image: "👧🎤",
      parts: [
        { text: "She", type: "subject" },
        { text: "can", type: "function" },
        { text: "sing.", type: "action" }
      ]
    },
    {
      step: "match",
      image: "👦🏊",
      promptBefore: "He",
      promptAfter: "swim.",
      options: ["can", "cans"],
      answer: "can",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👧🎤",
      promptBefore: "She",
      promptAfter: "sing.",
      options: ["can", "cans"],
      answer: "can",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👦🚗❌",
      promptBefore: "He",
      promptAfter: "drive.",
      options: ["can't", "doesn't can"],
      answer: "can't",
      hintLevel: 3
    },
    {
      step: "match",
      image: "👧💃",
      promptBefore: "She",
      promptAfter: "dance.",
      options: ["can", "is"],
      answer: "can",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👦🏊",
      blocks: ["He", "can", "swim"],
      answer: "He can swim.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👧🎤",
      blocks: ["She", "can", "sing"],
      answer: "She can sing.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👦🚗❌",
      blocks: ["can't", "He", "drive"],
      answer: "He can't drive.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👧💃",
      blocks: ["dance", "She", "can"],
      answer: "She can dance.",
      hintLevel: 3
    },
    {
      step: "use",
      image: "👦🏊",
      answer: "He can swim.",
      hints: ["He", "can", "swim"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "👧🎤",
      answer: "She can sing.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "👦🚗❌",
      answer: "He can't drive.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "👧💃",
      answer: "She can dance.",
      hints: [],
      hintLevel: 0
    }
  ]
};

grammarLevels["6-1"] = {
  id: "6-1",
  title: "I am + verb-ing",
  topics: ["present continuous", "am", "I", "verb-ing"],
  items: [
    {
      step: "see",
      image: "📖",
      sentence: "I am reading."
    },
    {
      step: "see",
      image: "😴",
      sentence: "I am sleeping."
    },
    {
      step: "color",
      image: "📖",
      parts: [
        { text: "I", type: "subject" },
        { text: "am", type: "be" },
        { text: "read", type: "action" },
        { text: "ing", type: "inflection" }
      ]
    },
    {
      step: "color",
      image: "😴",
      parts: [
        { text: "I", type: "subject" },
        { text: "am", type: "be" },
        { text: "sleep", type: "action" },
        { text: "ing", type: "inflection" }
      ]
    },
    {
      step: "match",
      image: "📖",
      promptBefore: "I",
      promptAfter: "reading.",
      options: ["am", "is", "are"],
      answer: "am",
      hintLevel: 4
    },
    {
      step: "match",
      image: "😴",
      promptBefore: "I am",
      promptAfter: "",
      options: ["sleep", "sleeping"],
      answer: "sleeping",
      hintLevel: 4
    },
    {
      step: "match",
      image: "⚽",
      promptBefore: "I am",
      promptAfter: "soccer.",
      options: ["play", "playing"],
      answer: "playing",
      hintLevel: 3
    },
    {
      step: "match",
      image: "🍳",
      promptBefore: "I",
      promptAfter: "eating.",
      options: ["am", "is"],
      answer: "am",
      hintLevel: 3
    },
    {
      step: "build",
      image: "📖",
      blocks: ["am", "I", "reading"],
      answer: "I am reading.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "⚽",
      blocks: ["playing", "I", "am", "soccer"],
      answer: "I am playing soccer.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "😴",
      blocks: ["sleeping", "I", "am"],
      answer: "I am sleeping.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "💃",
      blocks: ["I", "dancing", "am"],
      answer: "I am dancing.",
      hintLevel: 3
    },
    {
      step: "use",
      image: "📖",
      answer: "I am reading.",
      hints: ["I", "am", "reading"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "⚽",
      answer: "I am playing soccer.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "😴",
      answer: "I am sleeping.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "🍳",
      answer: "I am eating.",
      hints: [],
      hintLevel: 0
    }
  ]
};

grammarLevels["6-2"] = {
  id: "6-2",
  title: "He/She is + verb-ing",
  topics: ["present continuous", "is", "he", "she", "verb-ing"],
  items: [
    {
      step: "see",
      image: "👦📖",
      sentence: "He is reading."
    },
    {
      step: "see",
      image: "👧😴",
      sentence: "She is sleeping."
    },
    {
      step: "color",
      image: "👦📖",
      parts: [
        { text: "He", type: "subject" },
        { text: "is", type: "be" },
        { text: "read", type: "action" },
        { text: "ing", type: "inflection" }
      ]
    },
    {
      step: "color",
      image: "👧😴",
      parts: [
        { text: "She", type: "subject" },
        { text: "is", type: "be" },
        { text: "sleep", type: "action" },
        { text: "ing", type: "inflection" }
      ]
    },
    {
      step: "match",
      image: "👦📖",
      promptBefore: "He",
      promptAfter: "reading.",
      options: ["am", "is", "are"],
      answer: "is",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👧😴",
      promptBefore: "She is",
      promptAfter: "",
      options: ["sleep", "sleeping"],
      answer: "sleeping",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👦🏊",
      promptBefore: "He is",
      promptAfter: "",
      options: ["swim", "swimming"],
      answer: "swimming",
      hintLevel: 3
    },
    {
      step: "match",
      image: "👧✍️",
      promptBefore: "She",
      promptAfter: "writing.",
      options: ["is", "are"],
      answer: "is",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👦📖",
      blocks: ["is", "He", "reading"],
      answer: "He is reading.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👧😴",
      blocks: ["sleeping", "She", "is"],
      answer: "She is sleeping.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👦🏊",
      blocks: ["He", "swimming", "is"],
      answer: "He is swimming.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👧💃",
      blocks: ["is", "She", "dancing"],
      answer: "She is dancing.",
      hintLevel: 3
    },
    {
      step: "use",
      image: "👦📖",
      answer: "He is reading.",
      hints: ["He", "is", "reading"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "👧😴",
      answer: "She is sleeping.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "👦🏊",
      answer: "He is swimming.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "👧✍️",
      answer: "She is writing.",
      hints: [],
      hintLevel: 0
    }
  ]
};

grammarLevels["6-3"] = {
  id: "6-3",
  title: "They are + verb-ing",
  topics: ["present continuous", "are", "they", "verb-ing"],
  items: [
    {
      step: "see",
      image: "👥⚽",
      sentence: "They are playing soccer."
    },
    {
      step: "see",
      image: "👥🏃",
      sentence: "They are running."
    },
    {
      step: "color",
      image: "👥⚽",
      parts: [
        { text: "They", type: "subject" },
        { text: "are", type: "be" },
        { text: "play", type: "action" },
        { text: "ing", type: "inflection" },
        { text: "soccer.", type: "noun" }
      ]
    },
    {
      step: "color",
      image: "👥🏃",
      parts: [
        { text: "They", type: "subject" },
        { text: "are", type: "be" },
        { text: "run", type: "action" },
        { text: "ning", type: "inflection" }
      ]
    },
    {
      step: "match",
      image: "👥⚽",
      promptBefore: "They",
      promptAfter: "playing.",
      options: ["am", "is", "are"],
      answer: "are",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👥🏃",
      promptBefore: "They are",
      promptAfter: "",
      options: ["run", "running"],
      answer: "running",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👥📖",
      promptBefore: "They are",
      promptAfter: "",
      options: ["read", "reading"],
      answer: "reading",
      hintLevel: 3
    },
    {
      step: "match",
      image: "👥",
      promptBefore: "",
      promptAfter: "are sleeping.",
      options: ["I", "They", "He"],
      answer: "They",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👥⚽",
      blocks: ["are", "They", "playing", "soccer"],
      answer: "They are playing soccer.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👥🏃",
      blocks: ["running", "They", "are"],
      answer: "They are running.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👥📖",
      blocks: ["are", "They", "reading"],
      answer: "They are reading.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👥😴",
      blocks: ["They", "sleeping", "are"],
      answer: "They are sleeping.",
      hintLevel: 3
    },
    {
      step: "use",
      image: "👥⚽",
      answer: "They are playing soccer.",
      hints: ["They", "are", "playing", "soccer"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "👥🏃",
      answer: "They are running.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "👥📖",
      answer: "They are reading.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "👥😴",
      answer: "They are sleeping.",
      hints: [],
      hintLevel: 0
    }
  ]
};

window.grammarLevels = grammarLevels;
