import { QuestionType, DifficultyBand } from "../types/memory";
import { StructuredQuestion } from "./question-generator";

// Track question rotation to avoid repeats
const questionCounters: Record<string, number> = {};

export function generateMockQuestion(
  questionType: QuestionType,
  difficulty: DifficultyBand,
  topic: string
): string | StructuredQuestion {
  // Mock questions should not be used - throw error instead
  console.error("🚫 MOCK QUESTIONS SHOULD NOT BE CALLED!");
  console.error("Topic:", topic);
  console.error("Type:", questionType);
  console.error("Difficulty:", difficulty);
  throw new Error("Mock questions disabled. API must be used. Check API configuration.");
}

function generateHistoryMapQuestion(topic: string, difficulty: DifficultyBand, index: number): StructuredQuestion {
  // Sample map questions for various historical topics
  const mapQuestions = [
    {
      questionType: 'MCQ' as QuestionType,
      difficulty,
      question: `Identify the capital city of the Vijayanagara Empire on the map below.`,
      options: ['Hampi', 'Penukonda', 'Bijapur', 'Golconda'],
      expectsConfidence: true,
      mapData: {
        title: 'Vijayanagara Empire (14th-17th Century)',
        imageUrl: 'Map showing the Vijayanagara Empire in South India with major cities',
        markers: [
          { id: '1', name: 'Hampi', lat: 35, lng: 45, isCorrect: true },
          { id: '2', name: 'Penukonda', lat: 42, lng: 38 },
          { id: '3', name: 'Bijapur', lat: 28, lng: 42 },
          { id: '4', name: 'Golconda', lat: 48, lng: 52 },
        ],
        correctAnswer: 'Hampi'
      }
    },
    {
      questionType: 'MCQ' as QuestionType,
      difficulty,
      question: `Which location marked on the map was the site of the famous Indus Valley Civilization?`,
      options: ['Harappa', 'Delhi', 'Pataliputra', 'Ujjain'],
      expectsConfidence: true,
      mapData: {
        title: 'Ancient India - Major Civilizations',
        imageUrl: 'Map of ancient Indian subcontinent showing early civilizations',
        markers: [
          { id: '1', name: 'Harappa', lat: 25, lng: 35, isCorrect: true },
          { id: '2', name: 'Delhi', lat: 40, lng: 48 },
          { id: '3', name: 'Pataliputra', lat: 50, lng: 60 },
          { id: '4', name: 'Ujjain', lat: 55, lng: 42 },
        ],
        correctAnswer: 'Harappa'
      }
    },
    {
      questionType: 'MCQ' as QuestionType,
      difficulty,
      question: `Locate the capital of the Mauryan Empire founded by Chandragupta Maurya.`,
      options: ['Pataliputra', 'Taxila', 'Ujjain', 'Varanasi'],
      expectsConfidence: true,
      mapData: {
        title: 'Mauryan Empire (322-185 BCE)',
        imageUrl: 'Map of the Mauryan Empire at its peak under Ashoka',
        markers: [
          { id: '1', name: 'Pataliputra', lat: 45, lng: 55, isCorrect: true },
          { id: '2', name: 'Taxila', lat: 20, lng: 30 },
          { id: '3', name: 'Ujjain', lat: 55, lng: 40 },
          { id: '4', name: 'Varanasi', lat: 52, lng: 60 },
        ],
        correctAnswer: 'Pataliputra'
      }
    },
    {
      questionType: 'MCQ' as QuestionType,
      difficulty,
      question: `Which marked location was the center of the Chola Dynasty's maritime power?`,
      options: ['Thanjavur', 'Madurai', 'Kanchipuram', 'Tiruchirappalli'],
      expectsConfidence: true,
      mapData: {
        title: 'Chola Dynasty (9th-13th Century CE)',
        imageUrl: 'Map showing the extent of Chola Empire in South India',
        markers: [
          { id: '1', name: 'Thanjavur', lat: 70, lng: 50, isCorrect: true },
          { id: '2', name: 'Madurai', lat: 75, lng: 45 },
          { id: '3', name: 'Kanchipuram', lat: 62, lng: 55 },
          { id: '4', name: 'Tiruchirappalli', lat: 72, lng: 52 },
        ],
        correctAnswer: 'Thanjavur'
      }
    }
  ];

  return mapQuestions[index % mapQuestions.length];
}

function getQuestionTemplates(topic: string) {
  return {
    Clarification: {
      Beginner: [
        `What specific problem does ${topic} solve that simpler approaches cannot? Walk me through a concrete scenario.`,
        `If you had to explain ${topic} to someone who has never heard of it, what single analogy or metaphor would you choose, and why that one specifically?`,
        `What's the most common misconception about ${topic}? Why do you think people get confused about this?`,
        `Before ${topic} existed, how did people handle this challenge? What was fundamentally broken or inefficient?`,
      ],
      Intermediate: [
        `What are the hidden costs or trade-offs of using ${topic} that aren't immediately obvious? Think beyond the happy path.`,
        `Draw connections: How does ${topic} relate to 2-3 other concepts you know? What patterns do you see across them?`,
        `What assumptions is ${topic} built on? What happens if those assumptions don't hold in a real-world scenario?`,
        `If ${topic} disappeared tomorrow, what would we lose? What would we gain? Be specific about both.`,
      ],
      Advanced: [
        `Critique the fundamental architecture of ${topic}. If you were designing it from scratch today, what would you change and why?`,
        `What's the next evolution of ${topic}? Based on current trends and limitations, where is this heading in 3-5 years?`,
        `Defend the opposite view: Make the strongest case you can AGAINST using ${topic}. What are its fatal flaws?`,
        `What edge cases or boundary conditions does ${topic} struggle with? Why are these hard to solve?`,
      ],
    },
    MCQ: {
      Beginner: [
        `When would ${topic} provide the most value in a production system?\nA) When you need deterministic, reproducible outputs every time\nB) When answers require synthesizing information from multiple documents\nC) When all queries can be answered with keyword matching\nD) When response time is more important than answer accuracy`,
        `What is the primary purpose of the retrieval component in ${topic}?\nA) To cache frequently asked questions\nB) To provide grounding context that reduces hallucination\nC) To replace the need for a language model\nD) To store user conversation history`,
        `In ${topic}, the embedding model is used to:\nA) Generate the final answer text\nB) Convert documents and queries into comparable vector representations\nC) Store the knowledge base in a relational database\nD) Rank search results by keyword frequency`,
        `Which scenario indicates ${topic} may not be the right solution?\nA) You need to answer questions about proprietary company documents\nB) Your knowledge base changes frequently and needs real-time updates\nC) All required information fits in the model's context window\nD) You want to reduce fabricated information in responses`,
      ],
      Intermediate: [
        `In a ${topic} system, what happens when chunk size is too large?\nA) Vector similarity becomes more precise\nB) Irrelevant information dilutes the retrieved context\nC) Embedding quality improves automatically\nD) Query latency decreases significantly`,
        `Your ${topic} pipeline retrieves accurate documents but generates poor answers. What's the likely issue?\nA) The embedding model needs retraining\nB) The vector database index is corrupted\nC) The language model isn't effectively using the retrieved context\nD) The chunk overlap percentage is too high`,
        `What metric best evaluates ${topic} retrieval quality?\nA) Response time in milliseconds\nB) Vector database storage size\nC) Recall@k - whether relevant documents are in top-k results\nD) Number of embeddings generated per second`,
        `In ${topic}, why might semantic search return irrelevant results for domain-specific queries?\nA) The vector dimension is too low\nB) The embedding model wasn't trained on domain vocabulary\nC) The distance metric is incorrectly configured\nD) The knowledge base is too small`,
      ],
      Advanced: [
        `Your ${topic} system's answer quality degrades after 6 months in production. What's the most likely architectural flaw?\nA) No versioning strategy for document updates and deletions\nB) Insufficient vector dimensions in the embedding space\nC) Too few documents retrieved per query\nD) Suboptimal choice of similarity metric`,
        `How should you architect ${topic} for a multi-tenant SaaS with 1000+ customers?\nA) Single shared vector index with tenant_id metadata filtering\nB) Separate vector database instance per tenant\nC) Shared embedding service, isolated indexes, namespaced retrieval\nD) One index per tenant in the same database with row-level security`,
        `What factor MOST limits ${topic} effectiveness when knowledge base accuracy is already high?\nA) The embedding model's ability to capture semantic nuance\nB) The language model's instruction-following capability\nC) Network latency between retrieval and generation steps\nD) Vector database query performance at scale`,
        `An attacker wants to manipulate ${topic} outputs. Which attack vector is hardest to defend against?\nA) Injecting malicious content into the indexed knowledge base\nB) Crafting queries that exploit prompt injection vulnerabilities\nC) Overwhelming the system with high-volume requests\nD) Reverse-engineering the embedding model to poison similarity`,
      ],
    },
    FillInBlank: {
      Beginner: [
        `${topic} is fundamentally about bridging the gap between _____ and _____.`,
        `The biggest challenge when first implementing ${topic} is usually _____.`,
        `Without ${topic}, systems struggle most with _____.`,
        `The core innovation that makes ${topic} work is _____.`,
      ],
      Intermediate: [
        `In ${topic}, the trade-off between _____ and _____ requires careful consideration based on your use case.`,
        `${topic} fails spectacularly when _____ because _____.`,
        `To debug issues in ${topic}, you should first check _____, then validate _____.`,
        `The relationship between chunk size and retrieval quality in ${topic} is _____ because _____.`,
      ],
      Advanced: [
        `Scaling ${topic} to production requires solving the _____ problem, which is hard because _____.`,
        `The theoretical foundation of ${topic} comes from _____, but in practice, _____ dominates performance.`,
        `When ${topic} contradicts domain expertise, it's usually a signal that _____ or _____.`,
        `The next major breakthrough in ${topic} will likely come from advances in _____.`,
      ],
    },
    MultipleAnswers: {
      Beginner: [
        `Which factors critically impact ${topic} effectiveness? (Select ALL that apply)\nA) Quality and recency of source data\nB) Clarity and specificity of queries\nC) Proper chunking strategy\nD) Using the most expensive model`,
        `What must you have before deploying ${topic} to production? (Select ALL necessary)\nA) Comprehensive test suite\nB) Monitoring and observability\nC) Rollback strategy\nD) 100% confidence it will work`,
        `${topic} can help with which real-world challenges? (Select ALL valid)\nA) Reducing hallucinations in generated content\nB) Grounding responses in factual data\nC) Handling queries outside training data\nD) Making any model perfectly accurate`,
        `When learning ${topic}, focus on understanding: (Select ALL important)\nA) The problem it solves\nB) Where it fails\nC) Cost-benefit trade-offs\nD) Every possible implementation detail`,
      ],
      Intermediate: [
        `Production-grade ${topic} requires attention to: (Select ALL critical)\nA) Data versioning and updates\nB) Query latency budgets\nC) Relevance feedback loops\nD) Legal and privacy compliance`,
        `Common failure modes of ${topic} include: (Select ALL that happen)\nA) Retrieving irrelevant but semantically similar content\nB) Missing crucial context split across chunks\nC) Stale data contradicting current reality\nD) Perfect retrieval but poor utilization`,
        `To optimize ${topic}, you should measure: (Select ALL key metrics)\nA) Retrieval precision and recall\nB) End-to-end response quality\nC) User satisfaction signals\nD) Only the model's perplexity score`,
        `${topic} integrates with which components? (Select ALL typical)\nA) Vector databases\nB) Embedding models\nC) Language models\nD) Traditional SQL databases`,
      ],
      Advanced: [
        `Scaling ${topic} to millions of documents requires: (Select ALL applicable)\nA) Distributed retrieval infrastructure\nB) Hierarchical or approximate search\nC) Dynamic index updates\nD) Giving up on consistency guarantees`,
        `Advanced ${topic} patterns include: (Select ALL sophisticated approaches)\nA) Multi-hop reasoning chains\nB) Query rewriting and expansion\nC) Hybrid dense-sparse retrieval\nD) Ensemble of retrieval strategies`,
        `Research directions pushing ${topic} forward: (Select ALL promising)\nA) Better embedding models\nB) Learned retrieval strategies\nC) Multimodal retrieval\nD) Completely abandoning retrieval`,
        `Debugging production ${topic} issues requires: (Select ALL essential)\nA) Query and retrieval logging\nB) A/B testing infrastructure\nC) Human evaluation pipelines\nD) Perfect foresight of all problems`,
      ],
    },
    Puzzle: {
      Beginner: [
        `You have 1000 documents about ${topic}. A user asks a question that requires information from 3 different documents to answer correctly. How would you design your system to handle this? Walk through your reasoning.`,
        `Your ${topic} system returns technically correct but unhelpful results. Users are frustrated. What are 3 concrete things you'd investigate and why those specifically?`,
        `Imagine teaching ${topic} to a bright 10-year-old. What real-world metaphor would you use? Now explain why that metaphor works and where it breaks down.`,
        `You have limited budget: improve retrieval quality OR improve answer generation? Justify your choice with a specific scenario where your decision would clearly matter.`,
      ],
      Intermediate: [
        `Your ${topic} system works great in testing but poorly in production. Users report "irrelevant" results. You have one week to fix it. What's your debugging strategy? Be specific about what you'd measure and why.`,
        `Design a ${topic} system that needs to handle both factual lookup ("What is X?") and analytical queries ("Why does X happen?"). How would your architecture differ for these two cases?`,
        `Your competitor claims their ${topic} system is "10x better." What specific metrics would you demand to see, and what questions would you ask to evaluate if that's meaningful?`,
        `You need to explain to non-technical stakeholders why implementing ${topic} will take 3 months, not 3 days. What are the 3 hardest problems you'll face, in order of difficulty?`,
      ],
      Advanced: [
        `Design a ${topic} system for a highly regulated industry where you must explain every decision. How do you balance interpretability with performance? Propose a concrete architecture.`,
        `Your ${topic} system must handle adversarial users trying to game the system. What are 3 attack vectors and how would you defend against each without destroying usability?`,
        `You're scaling ${topic} to 100M daily users across 50 languages. What's your single biggest technical challenge and why? Propose a solution with specific trade-offs.`,
        `Argue this: "In 5 years, ${topic} will be completely obsolete." Make the strongest possible case, then refute it. Which argument is more convincing and why?`,
      ],
    },
    ConfidenceBased: {
      Beginner: [
        `Rate your understanding of ${topic} on a scale of 1-10. Now explain: What would you need to learn to move up 2 points on that scale? Be specific.`,
        `What aspect of ${topic} do you feel confident you could teach someone else? What part would you need to research first before teaching?`,
        `If you had to implement ${topic} tomorrow, what's the first thing you'd Google? What does that tell you about your current understanding?`,
        `Think of a time you were confident but wrong about something technical. How might that apply to your understanding of ${topic}? What biases might you have?`,
      ],
      Intermediate: [
        `You're in a technical interview about ${topic}. What question would you HOPE they don't ask, and why? What does that reveal about your knowledge gaps?`,
        `On which specific sub-topic of ${topic} could you confidently debate an expert? On which would you defer to their expertise? Why the difference?`,
        `If ${topic} appeared on your project tomorrow, what's your honest assessment: Could you architect it well? What would you need to ramp up on first?`,
        `Rate these: Your theoretical knowledge of ${topic} (1-10) vs. your practical experience (1-10). Explain the gap. Is that gap a problem?`,
      ],
      Advanced: [
        `You're reviewing a junior engineer's ${topic} implementation. What red flags would you look for that suggest deep misunderstanding vs. just inexperience?`,
        `In what scenario involving ${topic} would you say "I need to research this more before deciding"? What specific unknowns would trigger that humility?`,
        `You disagree with a published paper about ${topic}. How confident would you need to be before publicly critiquing it? What would you verify first?`,
        `Assess: Can you explain WHY ${topic} works (not just THAT it works)? If someone challenged the theoretical foundation, could you defend or critique it?`,
      ],
    },
    EvidenceBased: {
      Beginner: [
        `What concrete evidence would prove that ${topic} is working correctly in a system? Give 3 specific, measurable indicators.`,
        `How would you know if ${topic} is actually helping users vs. just adding complexity? Design a simple experiment to test this.`,
        `Someone claims ${topic} solved their problem. What questions would you ask to verify this isn't just correlation or placebo?`,
        `What data would you collect during the first week of running ${topic} in production? Why those metrics specifically?`,
      ],
      Intermediate: [
        `You need to justify the cost of implementing ${topic} to your CEO. What metrics would you track to prove ROI? How would you isolate ${topic}'s impact from other factors?`,
        `Design an A/B test to measure ${topic} effectiveness. What's your null hypothesis? What confounds might invalidate your results?`,
        `Your ${topic} system shows 95% accuracy in testing but users complain. What metrics were you measuring wrong? What should you measure instead?`,
        `How would you detect if ${topic} performance is degrading over time? What leading indicators would you monitor, and at what thresholds would you act?`,
      ],
      Advanced: [
        `Propose a rigorous evaluation framework for ${topic} that goes beyond toy benchmarks. What real-world scenarios would you test? Why would academia resist your approach?`,
        `Your ${topic} system needs to make high-stakes decisions. What evidence standards would you require before deploying? How would you quantify "good enough"?`,
        `Design a measurement system to detect when ${topic} is confidently wrong vs. uncertainly right. What signals differentiate these failure modes?`,
        `You suspect ${topic} works well for common cases but fails on edge cases that matter most. How would you gather evidence to prove or disprove this systematically?`,
      ],
    },
    CriticalThinking: {
      Beginner: [
        `Everyone says ${topic} is revolutionary. Steel-man the argument that it's just hype. What legitimate concerns would a skeptic raise?`,
        `${topic} solves problem X. But what new problems does it create? Think second-order effects that aren't obvious.`,
        `Who benefits from widespread adoption of ${topic}? Who loses? Be specific about stakeholders and their incentives.`,
        `What problems does ${topic} definitively NOT solve? Why do people mistakenly think it does?`,
      ],
      Intermediate: [
        `Compare ${topic} to a similar approach from 10 years ago that failed. What's actually different now vs. what's just better marketing?`,
        `Imagine ${topic} becomes dominant. What systemic risks or dependencies does this create? Think resilience and failure modes at scale.`,
        `Why isn't everyone using ${topic} yet? Give the most charitable interpretation of rational reasons to avoid it (beyond ignorance).`,
        `${topic} works in tech company demos. What breaks when you try to apply it in healthcare, finance, or government? Be specific about failure modes.`,
      ],
      Advanced: [
        `Predict: In what specific way will ${topic} fail catastrophically in the next 5 years? What will the post-mortem say, and why weren't we prepared?`,
        `Argue that current approaches to ${topic} are fundamentally flawed. What paradigm shift is needed? Propose a radically different architecture and defend it.`,
        `${topic} reflects certain assumptions about how knowledge and reasoning work. Critique those assumptions from first principles. What are we getting wrong?`,
        `Ten years from now, what will seem embarrassingly naive about how we think about ${topic} today? What blind spots do we have?`,
      ],
    },
  };
}
