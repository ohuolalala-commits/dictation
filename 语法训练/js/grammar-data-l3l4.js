const grammarLevels = window.grammarLevels || {};

grammarLevels["3-1"] = {
  title: "I/You/We/They + 动词原形（一般现在时，无三单）",
  questions: [
    { step: "see", image: "🍳", sentence: "I eat breakfast." },
    { step: "see", image: "🏫", sentence: "You go to school." },
    { step: "color", image: "🍳", parts: [{text:"I",type:"subject"}, {text:"eat",type:"action"}, {text:"breakfast.",type:"noun"}] },
    { step: "color", image: "🏫", parts: [{text:"You",type:"subject"}, {text:"go",type:"action"}, {text:"to",type:"function"}, {text:"school.",type:"noun"}] },
    { step: "match", image: "🍳", promptBefore: "I", promptAfter: "breakfast.", options: ["eat","eats"], answer: "eat", hintLevel: 4 },
    { step: "match", image: "⚽", promptBefore: "We", promptAfter: "soccer.", options: ["play","plays"], answer: "play", hintLevel: 4 },
    { step: "match", image: "💧", promptBefore: "They", promptAfter: "water.", options: ["drink","drinks"], answer: "drink", hintLevel: 3 },
    { step: "match", image: "🏃", promptBefore: "I", promptAfter: "fast.", options: ["run","runs"], answer: "run", hintLevel: 3 },
    { step: "build", image: "📚", blocks: ["read","They","books"], answer: "They read books.", hintLevel: 4 },
    { step: "build", image: "😴", blocks: ["sleep","I","night","at"], answer: "I sleep at night.", hintLevel: 4 },
    { step: "build", image: "🎤", blocks: ["sing","We","songs"], answer: "We sing songs.", hintLevel: 3 },
    { step: "build", image: "⚽", blocks: ["play","You","soccer"], answer: "You play soccer.", hintLevel: 3 },
    { step: "use", image: "🍳", answer: "I eat breakfast.", hints: ["I","eat","breakfast"], hintLevel: 2 },
    { step: "use", image: "🏫", answer: "You go to school.", hints: [], hintLevel: 1 },
    { step: "use", image: "💧", answer: "They drink water.", hints: [], hintLevel: 1 },
    { step: "use", image: "🏃", answer: "I run fast.", hints: [], hintLevel: 0 }
  ]
};

grammarLevels["3-2"] = {
  title: "否定句 — don't + 动词原形",
  questions: [
    { step: "see", image: "🐟😊", sentence: "I like fish." },
    { step: "see", image: "🐟😐", sentence: "I don't like fish." },
    { step: "color", image: "🐟😐", parts: [{text:"I",type:"subject"}, {text:"don't",type:"negative"}, {text:"like",type:"action"}, {text:"fish.",type:"noun"}] },
    { step: "color", image: "🏫😐", parts: [{text:"They",type:"subject"}, {text:"don't",type:"negative"}, {text:"go",type:"action"}, {text:"to",type:"function"}, {text:"school.",type:"noun"}] },
    { step: "match", image: "🐟😊", promptBefore: "I", promptAfter: "fish.", options: ["like","don't like"], answer: "like", hintLevel: 4 },
    { step: "match", image: "🐟😐", promptBefore: "I", promptAfter: "fish.", options: ["like","don't like"], answer: "don't like", hintLevel: 4 },
    { step: "match", image: "🏫😐", promptBefore: "They", promptAfter: "to school.", options: ["go","don't go"], answer: "don't go", hintLevel: 3 },
    { step: "match", image: "⚽😐", promptBefore: "We", promptAfter: "soccer.", options: ["play","don't play"], answer: "don't play", hintLevel: 3 },
    { step: "build", image: "🐟😐", blocks: ["don't","I","like","fish"], answer: "I don't like fish.", hintLevel: 4 },
    { step: "build", image: "🏫😐", blocks: ["don't","They","go","to","school"], answer: "They don't go to school.", hintLevel: 4 },
    { step: "build", image: "⚽😐", blocks: ["play","We","don't","soccer"], answer: "We don't play soccer.", hintLevel: 3 },
    { step: "build", image: "🏃😐", blocks: ["run","I","don't","fast"], answer: "I don't run fast.", hintLevel: 3 },
    { step: "use", image: "🐟😐", answer: "I don't like fish.", hints: ["I","don't","like","fish"], hintLevel: 2 },
    { step: "use", image: "🏫😐", answer: "They don't go to school.", hints: [], hintLevel: 1 },
    { step: "use", image: "⚽😐", answer: "We don't play soccer.", hints: [], hintLevel: 1 },
    { step: "use", image: "📚😐", answer: "I don't read books.", hints: [], hintLevel: 0 }
  ]
};

grammarLevels["3-3"] = {
  title: "疑问句 — Do you...?",
  questions: [
    { step: "see", image: "🐕", sentence: "You like dogs." },
    { step: "see", image: "🐕❓", sentence: "Do you like dogs?" },
    { step: "color", image: "🐕❓", parts: [{text:"Do",type:"question"}, {text:"you",type:"subject"}, {text:"like",type:"action"}, {text:"dogs?",type:"noun"}] },
    { step: "color", image: "⚽❓", parts: [{text:"Do",type:"question"}, {text:"they",type:"subject"}, {text:"play",type:"action"}, {text:"soccer?",type:"noun"}] },
    { step: "match", image: "🐕❓", promptBefore: "", promptAfter: "you like dogs?", options: ["Do","Does","Are"], answer: "Do", hintLevel: 4 },
    { step: "match", image: "⚽❓", promptBefore: "", promptAfter: "they play soccer?", options: ["Do","Does","Are"], answer: "Do", hintLevel: 4 },
    { step: "match", image: "🍳❓", promptBefore: "", promptAfter: "you eat breakfast?", options: ["Do","Does"], answer: "Do", hintLevel: 3 },
    { step: "match", image: "📚❓", promptBefore: "", promptAfter: "we read books?", options: ["Do","Does"], answer: "Do", hintLevel: 3 },
    { step: "build", image: "🐕❓", blocks: ["Do","you","like","dogs"], answer: "Do you like dogs?", hintLevel: 4 },
    { step: "build", image: "⚽❓", blocks: ["Do","they","play","soccer"], answer: "Do they play soccer?", hintLevel: 4 },
    { step: "build", image: "🍳❓", blocks: ["you","Do","eat","breakfast"], answer: "Do you eat breakfast?", hintLevel: 3 },
    { step: "build", image: "🏃❓", blocks: ["run","Do","you","fast"], answer: "Do you run fast?", hintLevel: 3 },
    { step: "use", image: "🐕❓", answer: "Do you like dogs?", hints: ["Do","you","like","dogs"], hintLevel: 2 },
    { step: "use", image: "⚽❓", answer: "Do they play soccer?", hints: [], hintLevel: 1 },
    { step: "use", image: "🍳❓", answer: "Do you eat breakfast?", hints: [], hintLevel: 1 },
    { step: "use", image: "💧❓", answer: "Do you drink water?", hints: [], hintLevel: 0 }
  ]
};

grammarLevels["4-1"] = {
  title: "He/She/It + 动词+s（三单肯定句）",
  questions: [
    { step: "see", image: "👦🍳", sentence: "He eats breakfast." },
    { step: "see", image: "👧🏫", sentence: "She goes to school." },
    { step: "compare", leftImage: "🍳🧒", leftSentence: "I eat breakfast.", rightImage: "🍳👦", rightSentence: "He eats breakfast.", highlight: "eat→eats" },
    { step: "compare", leftImage: "🏫🧒", leftSentence: "I go to school.", rightImage: "🏫👧", rightSentence: "She goes to school.", highlight: "go→goes" },
    { step: "color", image: "👦🍳", parts: [{text:"He",type:"subject"}, {text:"eat",type:"action"}, {text:"s",type:"inflection"}, {text:"breakfast.",type:"noun"}] },
    { step: "color", image: "👧🏫", parts: [{text:"She",type:"subject"}, {text:"go",type:"action"}, {text:"es",type:"inflection"}, {text:"to",type:"function"}, {text:"school.",type:"noun"}] },
    { step: "match", image: "👦🍳", promptBefore: "He", promptAfter: "breakfast.", options: ["eat","eats"], answer: "eats", hintLevel: 4 },
    { step: "match", image: "👧🏫", promptBefore: "She", promptAfter: "to school.", options: ["go","goes"], answer: "goes", hintLevel: 4 },
    { step: "match", image: "🐕💧", promptBefore: "It", promptAfter: "water.", options: ["drink","drinks"], answer: "drinks", hintLevel: 3 },
    { step: "match", image: "👦⚽", promptBefore: "He", promptAfter: "soccer.", options: ["play","plays"], answer: "plays", hintLevel: 3 },
    { step: "build", image: "👦🍳", blocks: ["He","eats","breakfast"], answer: "He eats breakfast.", hintLevel: 4 },
    { step: "build", image: "👧🏫", blocks: ["goes","She","to","school"], answer: "She goes to school.", hintLevel: 4 },
    { step: "build", image: "🐕💧", blocks: ["drinks","It","water"], answer: "It drinks water.", hintLevel: 3 },
    { step: "build", image: "👦⚽", blocks: ["plays","He","soccer"], answer: "He plays soccer.", hintLevel: 3 },
    { step: "use", image: "👦🍳", answer: "He eats breakfast.", hints: ["He","eats","breakfast"], hintLevel: 2 },
    { step: "use", image: "👧🏫", answer: "She goes to school.", hints: [], hintLevel: 1 },
    { step: "use", image: "👦⚽", answer: "He plays soccer.", hints: [], hintLevel: 1 },
    { step: "use", image: "🐕💧", answer: "It drinks water.", hints: [], hintLevel: 0 }
  ]
};

grammarLevels["4-2"] = {
  title: "doesn't 否定（三单否定句）",
  questions: [
    { step: "see", image: "👦🐟😊", sentence: "He likes fish." },
    { step: "see", image: "👦🐟😐", sentence: "He doesn't like fish." },
    { step: "color", image: "👦🐟😐", parts: [{text:"He",type:"subject"}, {text:"doesn't",type:"negative"}, {text:"like",type:"action"}, {text:"fish.",type:"noun"}] },
    { step: "color", image: "👧🏫😐", parts: [{text:"She",type:"subject"}, {text:"doesn't",type:"negative"}, {text:"go",type:"action"}, {text:"to",type:"function"}, {text:"school.",type:"noun"}] },
    { step: "match", image: "👦🐟😊", promptBefore: "He", promptAfter: "fish.", options: ["likes","doesn't like"], answer: "likes", hintLevel: 4 },
    { step: "match", image: "👦🐟😐", promptBefore: "He", promptAfter: "fish.", options: ["likes","doesn't like"], answer: "doesn't like", hintLevel: 4 },
    { step: "match", image: "👧⚽😐", promptBefore: "She", promptAfter: "soccer.", options: ["doesn't play","doesn't plays"], answer: "doesn't play", hintLevel: 4 },
    { step: "match", image: "👦💧😐", promptBefore: "He", promptAfter: "water.", options: ["doesn't drink","doesn't drinks"], answer: "doesn't drink", hintLevel: 3 },
    { step: "build", image: "👦🐟😐", blocks: ["doesn't","He","like","fish"], answer: "He doesn't like fish.", hintLevel: 4 },
    { step: "build", image: "👧🏫😐", blocks: ["doesn't","She","go","to","school"], answer: "She doesn't go to school.", hintLevel: 4 },
    { step: "build", image: "👦⚽😐", blocks: ["play","He","doesn't","soccer"], answer: "He doesn't play soccer.", hintLevel: 3 },
    { step: "build", image: "🐕🐟😐", blocks: ["doesn't","It","like","fish"], answer: "It doesn't like fish.", hintLevel: 3 },
    { step: "use", image: "👦🐟😐", answer: "He doesn't like fish.", hints: ["He","doesn't","like","fish"], hintLevel: 2 },
    { step: "use", image: "👧⚽😐", answer: "She doesn't play soccer.", hints: [], hintLevel: 1 },
    { step: "use", image: "👦💧😐", answer: "He doesn't drink water.", hints: [], hintLevel: 1 },
    { step: "use", image: "🐕🐟😐", answer: "It doesn't like fish.", hints: [], hintLevel: 0 }
  ]
};

grammarLevels["4-3"] = {
  title: "Does...? 疑问（三单疑问句）",
  questions: [
    { step: "see", image: "👦🐕", sentence: "He likes dogs." },
    { step: "see", image: "👦🐕❓", sentence: "Does he like dogs?" },
    { step: "color", image: "👦🐕❓", parts: [{text:"Does",type:"question"}, {text:"he",type:"subject"}, {text:"like",type:"action"}, {text:"dogs?",type:"noun"}] },
    { step: "color", image: "👧⚽❓", parts: [{text:"Does",type:"question"}, {text:"she",type:"subject"}, {text:"play",type:"action"}, {text:"soccer?",type:"noun"}] },
    { step: "match", image: "👦🐕❓", promptBefore: "", promptAfter: "he like dogs?", options: ["Do","Does","Is"], answer: "Does", hintLevel: 4 },
    { step: "match", image: "👧⚽❓", promptBefore: "", promptAfter: "she play soccer?", options: ["Do","Does","Is"], answer: "Does", hintLevel: 4 },
    { step: "match", image: "👦🍳❓", promptBefore: "", promptAfter: "he eat breakfast?", options: ["Do","Does"], answer: "Does", hintLevel: 3 },
    { step: "match", image: "🐕💧❓", promptBefore: "", promptAfter: "it drink water?", options: ["Do","Does"], answer: "Does", hintLevel: 3 },
    { step: "build", image: "👦🐕❓", blocks: ["Does","he","like","dogs"], answer: "Does he like dogs?", hintLevel: 4 },
    { step: "build", image: "👧⚽❓", blocks: ["Does","she","play","soccer"], answer: "Does she play soccer?", hintLevel: 4 },
    { step: "build", image: "👦🍳❓", blocks: ["he","Does","eat","breakfast"], answer: "Does he eat breakfast?", hintLevel: 3 },
    { step: "build", image: "🐕💧❓", blocks: ["drink","Does","it","water"], answer: "Does it drink water?", hintLevel: 3 },
    { step: "use", image: "👦🐕❓", answer: "Does he like dogs?", hints: ["Does","he","like","dogs"], hintLevel: 2 },
    { step: "use", image: "👧⚽❓", answer: "Does she play soccer?", hints: [], hintLevel: 1 },
    { step: "use", image: "👦🍳❓", answer: "Does he eat breakfast?", hints: [], hintLevel: 1 },
    { step: "use", image: "🐕💧❓", answer: "Does it drink water?", hints: [], hintLevel: 0 }
  ]
};
