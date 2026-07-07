const grammarLevels = window.grammarLevels || {};

grammarLevels["7-1"] = {
  title: "in / on / under",
  subtitle: "基础方位介词",
  items: [
    { step: "see", image: "🐱📦", sentence: "The cat is in the box." },
    { step: "see", image: "🐱📦", sentence: "The cat is on the box." },
    { step: "see", image: "🐱📦", sentence: "The cat is under the box." },
    { step: "color", image: "🐱📦", parts: [{text:"The",type:"function"}, {text:"cat",type:"subject"}, {text:"is",type:"be"}, {text:"in",type:"function"}, {text:"the",type:"function"}, {text:"box.",type:"noun"}] },
    { step: "color", image: "🐱📦", parts: [{text:"The",type:"function"}, {text:"cat",type:"subject"}, {text:"is",type:"be"}, {text:"on",type:"function"}, {text:"the",type:"function"}, {text:"box.",type:"noun"}] },
    { step: "match", image: "🐱📦", promptBefore: "The cat is", promptAfter: "the box.", options: ["in","on","under"], answer: "in", hintLevel: 4 },
    { step: "match", image: "🐱📦", promptBefore: "The cat is", promptAfter: "the box.", options: ["in","on","under"], answer: "on", hintLevel: 4 },
    { step: "match", image: "🐱📦", promptBefore: "The cat is", promptAfter: "the box.", options: ["in","on","under"], answer: "under", hintLevel: 4 },
    { step: "match", image: "📚🪑", promptBefore: "The book is", promptAfter: "the chair.", options: ["in","on","under"], answer: "on", hintLevel: 3 },
    { step: "match", image: "🐕🪑", promptBefore: "The dog is", promptAfter: "the chair.", options: ["in","on","under"], answer: "under", hintLevel: 3 },
    { step: "build", image: "🐱📦", blocks: ["The","cat","is","in","the","box"], answer: "The cat is in the box.", hintLevel: 4 },
    { step: "build", image: "🐱📦", blocks: ["on","The","cat","is","the","box"], answer: "The cat is on the box.", hintLevel: 3 },
    { step: "build", image: "📚🪑", blocks: ["The","book","is","on","the","chair"], answer: "The book is on the chair.", hintLevel: 3 },
    { step: "use", image: "🐱📦", answer: "The cat is in the box.", hints: ["The","cat","is","in","the","box"], hintLevel: 2 },
    { step: "use", image: "🐱📦", answer: "The cat is under the box.", hints: [], hintLevel: 1 },
    { step: "use", image: "🐕🪑", answer: "The dog is under the chair.", hints: [], hintLevel: 1 }
  ]
};

grammarLevels["7-2"] = {
  title: "next to / behind / in front of",
  subtitle: "进阶方位介词",
  items: [
    { step: "see", image: "🐱📦", sentence: "The cat is next to the box." },
    { step: "see", image: "🐱📦", sentence: "The cat is behind the box." },
    { step: "see", image: "🐱📦", sentence: "The cat is in front of the box." },
    { step: "color", image: "🐱📦", parts: [{text:"The",type:"function"}, {text:"cat",type:"subject"}, {text:"is",type:"be"}, {text:"next",type:"function"}, {text:"to",type:"function"}, {text:"the",type:"function"}, {text:"box.",type:"noun"}] },
    { step: "color", image: "🐱📦", parts: [{text:"The",type:"function"}, {text:"cat",type:"subject"}, {text:"is",type:"be"}, {text:"behind",type:"function"}, {text:"the",type:"function"}, {text:"box.",type:"noun"}] },
    { step: "match", image: "🐱📦", promptBefore: "The cat is", promptAfter: "the box.", options: ["next to","behind","in front of"], answer: "next to", hintLevel: 4 },
    { step: "match", image: "🐱📦", promptBefore: "The cat is", promptAfter: "the box.", options: ["next to","behind","in front of"], answer: "behind", hintLevel: 4 },
    { step: "match", image: "🐱📦", promptBefore: "The cat is", promptAfter: "the box.", options: ["next to","behind","in front of"], answer: "in front of", hintLevel: 4 },
    { step: "match", image: "👦🚗", promptBefore: "The boy is", promptAfter: "the car.", options: ["next to","behind","in front of"], answer: "behind", hintLevel: 3 },
    { step: "match", image: "🐕🏠", promptBefore: "The dog is", promptAfter: "the house.", options: ["next to","behind","in front of"], answer: "in front of", hintLevel: 3 },
    { step: "build", image: "🐱📦", blocks: ["The","cat","is","next","to","the","box"], answer: "The cat is next to the box.", hintLevel: 4 },
    { step: "build", image: "🐱📦", blocks: ["behind","The","cat","is","the","box"], answer: "The cat is behind the box.", hintLevel: 3 },
    { step: "build", image: "👦🚗", blocks: ["The","boy","is","behind","the","car"], answer: "The boy is behind the car.", hintLevel: 3 },
    { step: "use", image: "🐱📦", answer: "The cat is next to the box.", hints: ["The","cat","is","next","to","the","box"], hintLevel: 2 },
    { step: "use", image: "🐱📦", answer: "The cat is behind the box.", hints: [], hintLevel: 1 },
    { step: "use", image: "🐕🏠", answer: "The dog is in front of the house.", hints: [], hintLevel: 1 }
  ]
};

grammarLevels["7-3"] = {
  title: "There is / There are",
  subtitle: "存在句 + 方位介词",
  items: [
    { step: "see", image: "📚🪑", sentence: "There is a book on the desk." },
    { step: "see", image: "📚📚🪑", sentence: "There are two books on the desk." },
    { step: "color", image: "📚🪑", parts: [{text:"There",type:"there"}, {text:"is",type:"be"}, {text:"a",type:"function"}, {text:"book",type:"subject"}, {text:"on",type:"function"}, {text:"the",type:"function"}, {text:"desk.",type:"noun"}] },
    { step: "color", image: "📚📚🪑", parts: [{text:"There",type:"there"}, {text:"are",type:"be"}, {text:"two",type:"subject"}, {text:"books",type:"subject"}, {text:"on",type:"function"}, {text:"the",type:"function"}, {text:"desk.",type:"noun"}] },
    { step: "match", image: "📚🪑", promptBefore: "", promptAfter: "a book on the desk.", options: ["There is","There are"], answer: "There is", hintLevel: 4 },
    { step: "match", image: "📚📚🪑", promptBefore: "", promptAfter: "two books on the desk.", options: ["There is","There are"], answer: "There are", hintLevel: 4 },
    { step: "match", image: "🐱📦", promptBefore: "", promptAfter: "a cat in the box.", options: ["There is","There are"], answer: "There is", hintLevel: 3 },
    { step: "match", image: "🐱🐱📦", promptBefore: "", promptAfter: "two cats under the box.", options: ["There is","There are"], answer: "There are", hintLevel: 3 },
    { step: "build", image: "📚🪑", blocks: ["There","is","a","book","on","the","desk"], answer: "There is a book on the desk.", hintLevel: 4 },
    { step: "build", image: "📚📚🪑", blocks: ["There","are","two","books","on","the","desk"], answer: "There are two books on the desk.", hintLevel: 4 },
    { step: "build", image: "🐱📦", blocks: ["There","is","a","cat","in","the","box"], answer: "There is a cat in the box.", hintLevel: 3 },
    { step: "build", image: "🐱🐱📦", blocks: ["are","There","two","cats","under","the","box"], answer: "There are two cats under the box.", hintLevel: 3 },
    { step: "use", image: "📚🪑", answer: "There is a book on the desk.", hints: ["There","is","a","book","on","the","desk"], hintLevel: 2 },
    { step: "use", image: "📚📚🪑", answer: "There are two books on the desk.", hints: [], hintLevel: 1 },
    { step: "use", image: "🐱📦", answer: "There is a cat in the box.", hints: [], hintLevel: 1 },
    { step: "use", image: "🐱🐱📦", answer: "There are two cats under the box.", hints: [], hintLevel: 0 }
  ]
};

grammarLevels["8-1"] = {
  title: "I / You / We / They have",
  subtitle: "have 基本用法",
  items: [
    { step: "see", image: "🐕", sentence: "I have a dog." },
    { step: "see", image: "📚", sentence: "You have a book." },
    { step: "color", image: "🐕", parts: [{text:"I",type:"subject"}, {text:"have",type:"be"}, {text:"a",type:"function"}, {text:"dog.",type:"noun"}] },
    { step: "color", image: "📚", parts: [{text:"You",type:"subject"}, {text:"have",type:"be"}, {text:"a",type:"function"}, {text:"book.",type:"noun"}] },
    { step: "match", image: "🐕", promptBefore: "I", promptAfter: "a dog.", options: ["have","has"], answer: "have", hintLevel: 4 },
    { step: "match", image: "📚", promptBefore: "You", promptAfter: "a book.", options: ["have","has"], answer: "have", hintLevel: 4 },
    { step: "match", image: "👥🎒", promptBefore: "We", promptAfter: "bags.", options: ["have","has"], answer: "have", hintLevel: 3 },
    { step: "match", image: "👥⚽", promptBefore: "They", promptAfter: "a ball.", options: ["have","has"], answer: "have", hintLevel: 3 },
    { step: "build", image: "🐕", blocks: ["have","I","a","dog"], answer: "I have a dog.", hintLevel: 4 },
    { step: "build", image: "📚", blocks: ["You","have","a","book"], answer: "You have a book.", hintLevel: 4 },
    { step: "build", image: "👥🎒", blocks: ["have","We","bags"], answer: "We have bags.", hintLevel: 3 },
    { step: "build", image: "👥⚽", blocks: ["They","a","have","ball"], answer: "They have a ball.", hintLevel: 3 },
    { step: "use", image: "🐕", answer: "I have a dog.", hints: ["I","have","a","dog"], hintLevel: 2 },
    { step: "use", image: "📚", answer: "You have a book.", hints: [], hintLevel: 1 },
    { step: "use", image: "👥🎒", answer: "We have bags.", hints: [], hintLevel: 1 },
    { step: "use", image: "👥👫", answer: "They have a friend.", hints: [], hintLevel: 0 }
  ]
};

grammarLevels["8-2"] = {
  title: "He / She / It has",
  subtitle: "has 第三人称单数",
  items: [
    { step: "see", image: "👦🐕", sentence: "He has a dog." },
    { step: "see", image: "👧🐱", sentence: "She has a cat." },
    { step: "color", image: "👦🐕", parts: [{text:"He",type:"subject"}, {text:"has",type:"be"}, {text:"a",type:"function"}, {text:"dog.",type:"noun"}] },
    { step: "color", image: "👧🐱", parts: [{text:"She",type:"subject"}, {text:"has",type:"be"}, {text:"a",type:"function"}, {text:"cat.",type:"noun"}] },
    { step: "match", image: "👦🐕", promptBefore: "He", promptAfter: "a dog.", options: ["have","has"], answer: "has", hintLevel: 4 },
    { step: "match", image: "👧🐱", promptBefore: "She", promptAfter: "a cat.", options: ["have","has"], answer: "has", hintLevel: 4 },
    { step: "match", image: "🐕🦴", promptBefore: "It", promptAfter: "a bone.", options: ["have","has"], answer: "has", hintLevel: 3 },
    { step: "match", image: "👦🎒", promptBefore: "He", promptAfter: "a bag.", options: ["have","has"], answer: "has", hintLevel: 3 },
    { step: "build", image: "👦🐕", blocks: ["He","has","a","dog"], answer: "He has a dog.", hintLevel: 4 },
    { step: "build", image: "👧🐱", blocks: ["She","has","a","cat"], answer: "She has a cat.", hintLevel: 4 },
    { step: "build", image: "🐕🦴", blocks: ["has","It","a","bone"], answer: "It has a bone.", hintLevel: 3 },
    { step: "build", image: "👦🎒", blocks: ["He","a","has","bag"], answer: "He has a bag.", hintLevel: 3 },
    { step: "use", image: "👦🐕", answer: "He has a dog.", hints: ["He","has","a","dog"], hintLevel: 2 },
    { step: "use", image: "👧🐱", answer: "She has a cat.", hints: [], hintLevel: 1 },
    { step: "use", image: "🐕🦴", answer: "It has a bone.", hints: [], hintLevel: 1 },
    { step: "use", image: "👦👀💙", answer: "He has blue eyes.", hints: [], hintLevel: 0 }
  ]
};

grammarLevels["8-3"] = {
  title: "综合复习",
  subtitle: "L1-L8 混合语法",
  items: [
    { step: "match", image: "🧒", promptBefore: "I", promptAfter: "a student.", options: ["am","is","are"], answer: "am", hintLevel: 3 },
    { step: "match", image: "👦", promptBefore: "He", promptAfter: "a dog.", options: ["have","has"], answer: "has", hintLevel: 3 },
    { step: "match", image: "👥⚽", promptBefore: "They", promptAfter: "playing soccer.", options: ["am","is","are"], answer: "are", hintLevel: 3 },
    { step: "match", image: "👧", promptBefore: "She", promptAfter: "sing.", options: ["can","cans","is"], answer: "can", hintLevel: 3 },
    { step: "match", image: "🐱📦", promptBefore: "The cat is", promptAfter: "the box.", options: ["in","on","under"], answer: "in", hintLevel: 3 },
    { step: "match", image: "👦🍳", promptBefore: "He", promptAfter: "breakfast.", options: ["eat","eats"], answer: "eats", hintLevel: 3 },
    { step: "match", image: "👧🐟😐", promptBefore: "She", promptAfter: "like fish.", options: ["don't","doesn't"], answer: "doesn't", hintLevel: 3 },
    { step: "match", image: "🐕❓", promptBefore: "", promptAfter: "it drink water?", options: ["Do","Does"], answer: "Does", hintLevel: 3 },
    { step: "build", image: "👦📖", blocks: ["He","is","reading"], answer: "He is reading.", hintLevel: 2 },
    { step: "build", image: "👥🐕", blocks: ["have","They","a","dog"], answer: "They have a dog.", hintLevel: 2 },
    { step: "build", image: "👧🏊❌", blocks: ["can't","She","swim"], answer: "She can't swim.", hintLevel: 2 },
    { step: "build", image: "📚🪑", blocks: ["There","is","a","book","on","the","desk"], answer: "There is a book on the desk.", hintLevel: 2 },
    { step: "use", image: "👦🐕", answer: "He has a dog.", hints: [], hintLevel: 1 },
    { step: "use", image: "👥⚽", answer: "They are playing soccer.", hints: [], hintLevel: 1 },
    { step: "use", image: "🐱📦", answer: "The cat is in the box.", hints: [], hintLevel: 0 },
    { step: "use", image: "👧", answer: "She is a girl.", hints: [], hintLevel: 0 }
  ]
};
