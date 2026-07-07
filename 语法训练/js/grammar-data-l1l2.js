const grammarLevels = {};

grammarLevels["1-1"] = {
  id: "1-1",
  level: 1,
  gate: 1,
  name: "I am ...",
  nameCn: "我是...",
  icon: "🧒",
  description: "学习用 I am 表达自己的身份和感受",
  referenceTable: null,
  unlockRequirement: null,
  questions: [
    {
      step: "see",
      image: "🧒",
      sentence: "I am a boy."
    },
    {
      step: "see",
      image: "😊",
      sentence: "I am happy."
    },
    {
      step: "color",
      image: "🧒",
      parts: [
        { text: "I", type: "subject" },
        { text: "am", type: "be" },
        { text: "a", type: "function" },
        { text: "boy.", type: "subject" }
      ]
    },
    {
      step: "color",
      image: "😊",
      parts: [
        { text: "I", type: "subject" },
        { text: "am", type: "be" },
        { text: "happy.", type: "subject" }
      ]
    },
    {
      step: "match",
      image: "🧒",
      promptBefore: "I",
      promptAfter: "a boy.",
      options: ["am", "is"],
      answer: "am",
      hintLevel: 4
    },
    {
      step: "match",
      image: "😊",
      promptBefore: "I",
      promptAfter: "happy.",
      options: ["am", "are"],
      answer: "am",
      hintLevel: 4
    },
    {
      step: "match",
      image: "😢",
      promptBefore: "I",
      promptAfter: "sad.",
      options: ["is", "am"],
      answer: "am",
      hintLevel: 3
    },
    {
      step: "match",
      image: "🧑",
      promptBefore: "I",
      promptAfter: "a student.",
      options: ["are", "am"],
      answer: "am",
      hintLevel: 3
    },
    {
      step: "build",
      image: "😊",
      blocks: ["am", "I", "happy"],
      answer: "I am happy.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "🧒",
      blocks: ["a", "am", "I", "boy"],
      answer: "I am a boy.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "📏",
      blocks: ["tall", "I", "am"],
      answer: "I am tall.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🍽️",
      blocks: ["hungry", "am", "I"],
      answer: "I am hungry.",
      hintLevel: 3
    },
    {
      step: "use",
      image: "🧒",
      answer: "I am a boy.",
      hints: ["I", "am", "a", "boy"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "😊",
      answer: "I am happy.",
      hints: ["I", "am", "happy"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "😢",
      answer: "I am sad.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "📏",
      answer: "I am tall.",
      hints: [],
      hintLevel: 1
    }
  ]
};

grammarLevels["1-2"] = {
  id: "1-2",
  level: 1,
  gate: 2,
  name: "He is / She is ...",
  nameCn: "他是 / 她是...",
  icon: "👦",
  description: "学习用 He is / She is 描述他人",
  referenceTable: null,
  unlockRequirement: "1-1",
  questions: [
    {
      step: "see",
      image: "👦",
      sentence: "He is a boy."
    },
    {
      step: "see",
      image: "👧",
      sentence: "She is a girl."
    },
    {
      step: "compare",
      leftImage: "🧒",
      leftSentence: "I am happy.",
      rightImage: "👦",
      rightSentence: "He is happy.",
      highlight: "am→is"
    },
    {
      step: "compare",
      leftImage: "🧒",
      leftSentence: "I am tall.",
      rightImage: "👧",
      rightSentence: "She is tall.",
      highlight: "am→is"
    },
    {
      step: "color",
      image: "👦",
      parts: [
        { text: "He", type: "subject" },
        { text: "is", type: "be" },
        { text: "tall.", type: "subject" }
      ]
    },
    {
      step: "color",
      image: "👧",
      parts: [
        { text: "She", type: "subject" },
        { text: "is", type: "be" },
        { text: "happy.", type: "subject" }
      ]
    },
    {
      step: "match",
      image: "👦",
      promptBefore: "He",
      promptAfter: "a boy.",
      options: ["am", "is"],
      answer: "is",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👧",
      promptBefore: "She",
      promptAfter: "a girl.",
      options: ["am", "is"],
      answer: "is",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👦",
      promptBefore: "He",
      promptAfter: "tall.",
      options: ["is", "am"],
      answer: "is",
      hintLevel: 3
    },
    {
      step: "match",
      image: "👧",
      promptBefore: "She",
      promptAfter: "happy.",
      options: ["is", "am"],
      answer: "is",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👦",
      blocks: ["is", "He", "tall"],
      answer: "He is tall.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👧",
      blocks: ["happy", "She", "is"],
      answer: "She is happy.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👦",
      blocks: ["a", "is", "He", "boy"],
      answer: "He is a boy.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👧",
      blocks: ["girl", "She", "is", "a"],
      answer: "She is a girl.",
      hintLevel: 3
    },
    {
      step: "use",
      image: "👦",
      answer: "He is a boy.",
      hints: ["He", "is", "a", "boy"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "👧",
      answer: "She is a girl.",
      hints: ["She", "is", "a", "girl"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "👦😊",
      answer: "He is happy.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "👧📏",
      answer: "She is tall.",
      hints: [],
      hintLevel: 1
    }
  ]
};

grammarLevels["1-3"] = {
  id: "1-3",
  level: 1,
  gate: 3,
  name: "You are / We are / They are",
  nameCn: "你是 / 我们是 / 他们是",
  icon: "👥",
  description: "学习 You are / We are / They are 的用法",
  referenceTable: [
    { subject: "I", verb: "am", highlight: false },
    { subject: "He", verb: "is", highlight: false },
    { subject: "She", verb: "is", highlight: false },
    { subject: "You", verb: "are", highlight: true },
    { subject: "We", verb: "are", highlight: true },
    { subject: "They", verb: "are", highlight: true }
  ],
  unlockRequirement: "1-2",
  questions: [
    {
      step: "see",
      image: "👥",
      sentence: "You are students."
    },
    {
      step: "see",
      image: "👥",
      sentence: "We are happy."
    },
    {
      step: "see",
      image: "👥",
      sentence: "They are tall."
    },
    {
      step: "color",
      image: "👥",
      parts: [
        { text: "You", type: "subject" },
        { text: "are", type: "be" },
        { text: "students.", type: "subject" }
      ]
    },
    {
      step: "color",
      image: "👥",
      parts: [
        { text: "We", type: "subject" },
        { text: "are", type: "be" },
        { text: "happy.", type: "subject" }
      ]
    },
    {
      step: "color",
      image: "👥",
      parts: [
        { text: "They", type: "subject" },
        { text: "are", type: "be" },
        { text: "tall.", type: "subject" }
      ]
    },
    {
      step: "match",
      image: "👥",
      promptBefore: "You",
      promptAfter: "students.",
      options: ["am", "is", "are"],
      answer: "are",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👥",
      promptBefore: "We",
      promptAfter: "happy.",
      options: ["am", "is", "are"],
      answer: "are",
      hintLevel: 4
    },
    {
      step: "match",
      image: "👥",
      promptBefore: "They",
      promptAfter: "tall.",
      options: ["am", "is", "are"],
      answer: "are",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🧒",
      promptBefore: "I",
      promptAfter: "a boy.",
      options: ["am", "is", "are"],
      answer: "am",
      hintLevel: 3
    },
    {
      step: "match",
      image: "👦",
      promptBefore: "He",
      promptAfter: "tall.",
      options: ["am", "is", "are"],
      answer: "is",
      hintLevel: 3
    },
    {
      step: "match",
      image: "👧",
      promptBefore: "She",
      promptAfter: "happy.",
      options: ["am", "is", "are"],
      answer: "is",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👥",
      blocks: ["are", "You", "students"],
      answer: "You are students.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👥",
      blocks: ["happy", "We", "are"],
      answer: "We are happy.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "👥",
      blocks: ["are", "They", "tall"],
      answer: "They are tall.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "👧",
      blocks: ["a", "She", "is", "girl"],
      answer: "She is a girl.",
      hintLevel: 3
    },
    {
      step: "use",
      image: "👥",
      answer: "You are students.",
      hints: ["You", "are", "students"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "👥",
      answer: "We are happy.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "👦",
      answer: "He is tall.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "🧒",
      answer: "I am a boy.",
      hints: [],
      hintLevel: 0
    }
  ]
};

grammarLevels["2-1"] = {
  id: "2-1",
  level: 2,
  gate: 1,
  name: "a vs an",
  nameCn: "a 和 an",
  icon: "🐱",
  description: "学习不定冠词 a 和 an 的用法区别",
  referenceTable: null,
  unlockRequirement: "1-3",
  questions: [
    {
      step: "see",
      image: "🐱",
      sentence: "a cat"
    },
    {
      step: "see",
      image: "🍎",
      sentence: "an apple"
    },
    {
      step: "color",
      image: "🐱",
      parts: [
        { text: "a", type: "function" },
        { text: "cat", type: "subject" }
      ]
    },
    {
      step: "color",
      image: "🍎",
      parts: [
        { text: "an", type: "function" },
        { text: "apple", type: "subject" }
      ]
    },
    {
      step: "match",
      image: "🐱",
      promptBefore: "",
      promptAfter: "cat",
      options: ["a", "an"],
      answer: "a",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🍎",
      promptBefore: "",
      promptAfter: "apple",
      options: ["a", "an"],
      answer: "an",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🐕",
      promptBefore: "",
      promptAfter: "dog",
      options: ["a", "an"],
      answer: "a",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🥚",
      promptBefore: "",
      promptAfter: "egg",
      options: ["a", "an"],
      answer: "an",
      hintLevel: 3
    },
    {
      step: "match",
      image: "☂️",
      promptBefore: "",
      promptAfter: "umbrella",
      options: ["a", "an"],
      answer: "an",
      hintLevel: 3
    },
    {
      step: "match",
      image: "📚",
      promptBefore: "",
      promptAfter: "book",
      options: ["a", "an"],
      answer: "a",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🐱",
      blocks: ["a", "cat"],
      answer: "a cat",
      hintLevel: 4
    },
    {
      step: "build",
      image: "🍎",
      blocks: ["an", "apple"],
      answer: "an apple",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🥚",
      blocks: ["egg", "an"],
      answer: "an egg",
      hintLevel: 3
    },
    {
      step: "use",
      image: "🐕",
      answer: "a dog",
      hints: ["a", "dog"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "☂️",
      answer: "an umbrella",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "📚",
      answer: "a book",
      hints: [],
      hintLevel: 1
    }
  ]
};

grammarLevels["2-2"] = {
  id: "2-2",
  level: 2,
  gate: 2,
  name: "a/an vs the",
  nameCn: "a/an 和 the",
  icon: "🐱👉",
  description: "学习不定冠词 a/an 与定冠词 the 的区别",
  referenceTable: null,
  unlockRequirement: "2-1",
  questions: [
    {
      step: "see",
      image: "🐱",
      sentence: "a cat"
    },
    {
      step: "see",
      image: "🐱👉",
      sentence: "the cat"
    },
    {
      step: "color",
      image: "🐱",
      parts: [
        { text: "a", type: "function" },
        { text: "cat", type: "subject" }
      ]
    },
    {
      step: "color",
      image: "🐱👉",
      parts: [
        { text: "the", type: "function" },
        { text: "cat", type: "subject" }
      ]
    },
    {
      step: "match",
      image: "🐱",
      promptBefore: "I see",
      promptAfter: "cat.",
      options: ["a", "an", "the"],
      answer: "a",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🍎",
      promptBefore: "I eat",
      promptAfter: "apple.",
      options: ["a", "an", "the"],
      answer: "an",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🐱👉",
      promptBefore: "I see",
      promptAfter: "cat.",
      options: ["a", "an", "the"],
      answer: "the",
      hintLevel: 4
    },
    {
      step: "match",
      image: "📚👉",
      promptBefore: "",
      promptAfter: "book is red.",
      options: ["A", "An", "The"],
      answer: "The",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🐱",
      blocks: ["a", "cat", "see", "I"],
      answer: "I see a cat.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "🐱👉",
      blocks: ["the", "cat", "see", "I"],
      answer: "I see the cat.",
      hintLevel: 4
    },
    {
      step: "build",
      image: "📚👉",
      blocks: ["book", "the", "red", "is"],
      answer: "The book is red.",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🍎",
      blocks: ["an", "apple", "eat", "I"],
      answer: "I eat an apple.",
      hintLevel: 3
    },
    {
      step: "use",
      image: "🐕",
      answer: "I see a dog.",
      hints: ["I", "see", "a", "dog"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "🐕👉",
      answer: "I see the dog.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "🍎👉",
      answer: "The apple is red.",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "🐱",
      answer: "I see a cat.",
      hints: [],
      hintLevel: 1
    }
  ]
};

grammarLevels["2-3"] = {
  id: "2-3",
  level: 2,
  gate: 3,
  name: "Plural Nouns -s/-es/-ies",
  nameCn: "名词复数 -s/-es/-ies",
  icon: "🐱🐱",
  description: "学习名词复数形式的构成规则",
  referenceTable: null,
  unlockRequirement: "2-2",
  questions: [
    {
      step: "see",
      image: "🐱",
      sentence: "one cat"
    },
    {
      step: "see",
      image: "📦",
      sentence: "one box"
    },
    {
      step: "color",
      image: "🐱🐱",
      parts: [
        { text: "two", type: "subject" },
        { text: "cat", type: "subject" },
        { text: "s", type: "inflection" }
      ]
    },
    {
      step: "color",
      image: "📦📦",
      parts: [
        { text: "two", type: "subject" },
        { text: "box", type: "subject" },
        { text: "es", type: "inflection" }
      ]
    },
    {
      step: "match",
      image: "🐱",
      promptBefore: "one",
      promptAfter: "",
      options: ["cat", "cats"],
      answer: "cat",
      hintLevel: 4
    },
    {
      step: "match",
      image: "🐱🐱",
      promptBefore: "two",
      promptAfter: "",
      options: ["cat", "cats"],
      answer: "cats",
      hintLevel: 4
    },
    {
      step: "match",
      image: "📦",
      promptBefore: "one",
      promptAfter: "",
      options: ["box", "boxes"],
      answer: "box",
      hintLevel: 4
    },
    {
      step: "match",
      image: "📦📦",
      promptBefore: "two",
      promptAfter: "",
      options: ["box", "boxes"],
      answer: "boxes",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🐱🐱",
      blocks: ["two", "cats"],
      answer: "two cats",
      hintLevel: 4
    },
    {
      step: "build",
      image: "📦📦",
      blocks: ["two", "boxes"],
      answer: "two boxes",
      hintLevel: 4
    },
    {
      step: "build",
      image: "🐕🐕",
      blocks: ["dogs", "two"],
      answer: "two dogs",
      hintLevel: 3
    },
    {
      step: "build",
      image: "🍎🍎🍎",
      blocks: ["apples", "three"],
      answer: "three apples",
      hintLevel: 3
    },
    {
      step: "use",
      image: "🐕🐕",
      answer: "two dogs",
      hints: ["two", "dogs"],
      hintLevel: 2
    },
    {
      step: "use",
      image: "📦📦📦",
      answer: "three boxes",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "🐱🐱🐱",
      answer: "three cats",
      hints: [],
      hintLevel: 1
    },
    {
      step: "use",
      image: "📚📚",
      answer: "two books",
      hints: [],
      hintLevel: 1
    }
  ]
};
