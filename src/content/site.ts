/*
  Every word and media file on the site is set here. Edit this file to update
  the site; you should rarely need to open the pages themselves.

  Nothing in here is invented. Figures come from the research paper and carry
  their citation. Anything not known yet is left empty, and empty things are
  hidden on the site until you fill them in.
*/

export const meta = {
  brand: 'Scalable AI Memory',
  author: 'Viraj Das',
  title: 'Scalable AI Memory | Viraj Das',
  description:
    'Research portfolio for an AP Research project: an outcome-based bias layer for a classifier-driven AI memory system.',
  lastUpdated: 'November 2026',
};

export const nav = [
  { href: '/#how', label: 'How it works' },
  { href: '/research', label: 'Research' },
  { href: '/process', label: 'Process' },
  { href: '/about', label: 'About' },
];

/* ---------- The film ----------
   One continuous video sits behind the whole home page and plays forward and
   backward as you scroll. It tells the same story as the page:
     0 a pane lifts from the row      1 it floats alone         2 it becomes a window
     3 inside: a galaxy of memories   4 too many light up       5 they are sorted
     6 the layer beneath appears      7 three are retrieved     8 back outside the pane
   Each number is a "beat". The page lines the beats up with its sections (see
   `filmBeats` in src/scripts/main.ts), so the video can be any length.

   To replace it: put a new .mp4 in public/media and change `src`. Encode with a
   keyframe every few frames so scrubbing is smooth (see README).
   The stills are single frames used behind the other pages and while the video loads. */
export const film = {
  src: '/media/film.mp4',
  poster: '/media/hero-poster.jpg',
  stills: {
    research: '/media/still-galaxy.jpg',
    process: '/media/still-order.jpg',
    about: '/media/still-pane.jpg',
  },
};

/* ---------- Home: hero ---------- */
export const hero = {
  headline: 'Scalable AI memory',
  lede: 'An outcome-based bias layer for a classifier-driven memory system, built and tested for AP Research.',
  byline: 'Viraj Das, FCS Innovation Academy',
  primary: { label: 'See how it works', href: '/#how' },
  secondary: { label: 'Read the research', href: '/research' },
};

/* ---------- Home: the problem ---------- */
export const problem = {
  heading: 'More memories can make the answer worse',
  body: 'A language model forgets everything once a conversation ends, so agents store what they learn outside the model and pull it back when it seems relevant. When several stored events match the same question, answers get worse.',
  // Huet et al. (2025), GPT-4o. These are the two points reported in the paper.
  before: { value: '0.81', caption: 'Answer F1 with one matching event' },
  after: { value: '0.53', caption: 'Answer F1 with six or more matching events' },
  steps: 6,
  source: {
    text: 'Huet, Ben Houidi and Rossi (2025), tested on GPT-4o',
    href: 'https://proceedings.iclr.cc/paper_files/paper/2025/file/7ff013b7e372ba5b790352ccd6908f03-Paper-Conference.pdf',
  },
};

/* ---------- Home: research question ---------- */
export const question = {
  formal:
    'To what extent can an outcome-based bias layer improve a non-autoregressive classifier memory system’s performance on stored episodic memory files while also optimizing the resource consumption and quality of AI responses?',
};

/* ---------- Home: how it works ----------
   The diagram beside these steps is abstract (plain bars, no text, no numbers). */
export const how = {
  heading: 'How it works',
  steps: [
    {
      title: 'Classify',
      body: 'Jev-Mem uses Jev, a non-autoregressive classifier, to sort through stored memories and find the most relevant ones for the situation.',
    },
    {
      title: 'Bias',
      body: 'My layer sits below that classifier. It carries an outcome-based bias, learned in the context of each scenario, from how earlier retrievals turned out.',
    },
    {
      title: 'Retrieve',
      body: 'The hypothesis: with that bias, the classifier feeds the model more important memories more often, and answers get more accurate.',
    },
  ],
};

/* ---------- Sources (home teaser + Research page) ----------
   `featured: true` puts a source on the home page as well. */
export const sources = [
  {
    group: 'Can a computer learn?',
    items: [
      { year: '1950', name: 'Computing Machinery and Intelligence', by: 'Alan Turing', note: 'Known for the Turing Test. The part that matters here is his suggestion to build a simple, child-like program and let it learn its way up.', href: 'https://doi.org/10.1093/mind/LIX.236.433' },
      { year: '2017', name: 'Attention Is All You Need', by: 'Vaswani et al.', note: 'Replaced recurrent layers with attention. The transformer became the base architecture of modern large language models.', href: 'https://arxiv.org/pdf/1706.03762' },
      { year: '2025', name: 'A survey on the memory mechanism of LLM-based agents', by: 'Z. Zhang et al.', note: 'After training, a model has no long-term memory, which limits how it can use past experience on future tasks.', href: 'https://doi.org/10.1145/3748302' },
    ],
  },
  {
    group: 'Where memory breaks',
    items: [
      { year: '2025', name: 'Context Rot', by: 'Hong, Troynikov and Huber', note: 'Tested eighteen models on inputs of different lengths and focus. Focused information produced more accurate responses overall.', href: 'https://www.trychroma.com/research/context-rot' },
      { year: '2024', name: 'LongMemEval', by: 'Wu et al.', note: 'Extracting relevant facts into the index improved retrieval accuracy by 6.2% with five memories retrieved and 9.2% with ten.', href: 'https://arxiv.org/abs/2410.10813' },
      { year: '2025', name: 'Episodic memories generation and evaluation', by: 'Huet, Ben Houidi and Rossi', note: 'GPT-4o response F1 dropped from 0.81 with one matching event to 0.53 with six or more.', href: 'https://proceedings.iclr.cc/paper_files/paper/2025/file/7ff013b7e372ba5b790352ccd6908f03-Paper-Conference.pdf' },
      { year: '2026', name: 'Why retrieval is not enough', by: 'Yao et al.', note: 'Compiling retrieved memories into one context loses the relationships between them. On MuSiQue with GPT-4o-mini, standard retrieval scored 4.35 F1 points below their structured system.', href: 'https://doi.org/10.1007/s41019-026-00361-x' },
    ],
  },
  {
    group: 'How people have tried to fix it',
    items: [
      { year: '2026', name: 'ARTEM', by: 'C. H.-M. Tan, Subagdja and A.-H. Tan', note: 'Organizes episodic memories by temporal, spatial, content and subject information. F1 of 0.585 on chronological tasks, roughly 0.3 above AIs without it.', href: 'https://doi.org/10.1609/aaai.v40i30.39773' },
      { year: '2025', name: 'HippoRAG 2', by: 'Gutiérrez et al.', note: 'Preserves the relationships between ideas and filters with another LLM. Overtook the NV-Embed-v2 baseline by 4.8% in average passage recall.', href: 'https://proceedings.mlr.press/v267/gutierrez25a.html' },
      { year: '2025', name: 'Reflective Memory Management', by: 'Z. Tan et al.', note: 'A reinforcement-learning reranker that reflects on whether a memory selection was the right call. A 10% accuracy improvement on LongMemEval.', href: 'https://aclanthology.org/2025.acl-long.413.pdf', featured: true },
      { year: '2026', name: 'MemRL', by: 'S. Zhang et al.', note: 'Rates the usefulness of a source in the situation it was pulled for, and leans future selections toward or away from it. Increases of 11.2 to 41.9 percentage points over models without memory.', href: 'https://arxiv.org/abs/2601.03192v1', featured: true },
    ],
  },
  {
    group: 'The gap',
    items: [
      { year: '2026', name: 'Jev-Mem', by: 'Jiang, Li and Li', note: 'A system-one memory architecture that uses Jev, a non-autoregressive classification model, to find the most relevant memories to retrieve.', href: 'https://arxiv.org/abs/2609.23986v1', featured: true },
    ],
  },
];

export const gap =
  'Jev-Mem brings together many of the best ideas above, but it has no outcome-based bias like MemRL’s. Putting one below the Jev classifier is what this project tests.';

/* ---------- Process page ---------- */
export const method = {
  heading: 'Methodology',
  intro: 'The plan as written in the paper. It will be updated as the build goes on.',
  steps: [
    { title: 'Program the bias layer', body: 'An outcome-based bias, learned in the context of scenarios, inserted as a classification layer within the established Jev-Mem architecture, below the Jev classifier.' },
    { title: 'Program the experimental environment', body: 'An environment in which I can collect my data and compare it.' },
    { title: 'Collect data on established benchmarks', body: 'Scores come from established benchmarks, not from tests of my own making.' },
    { title: 'Compare with baseline control scores', body: 'The goal is a system that optimizes memory recollection more effectively, quickly and cheaply than other popular memory solutions.' },
  ],
};

/* status: 'done' | 'now' | 'next'. Only entries confirmed by the paper and the
   assignment sheet are here. Add your own as they happen:
   { when: 'January 2027', title: '...', note: '...', status: 'next' }, */
export const timeline = {
  heading: 'Timeline',
  entries: [
    { when: 'So far', title: 'Introduction and literature review', note: 'Written, with the gap around Jev-Mem identified.', status: 'done' },
    { when: 'December 2026', title: 'Portfolio draft', note: 'The first version of this site.', status: 'now' },
    { when: 'Still to come', title: 'Build and experiment', note: 'The bias layer, the experimental environment and the benchmark comparison.', status: 'next' },
    { when: 'April 30, 2027', title: 'Research paper', note: 'The date on the paper.', status: 'next' },
  ],
};

export const results = {
  heading: 'Results',
  empty: 'Nothing to show yet. The experiment has not run.',
  detail: 'When it has, the data and the comparison against the baseline will go here.',
  measures: ['Accuracy of responses', 'Relevance of retrieved memories', 'Resource consumption'],
};

/* ---------- About page ----------
   Filled in from the paper's title page only. Everything empty is hidden.
   photo:    a cutout of you with the background removed (a .webp or .png with
             transparency). To make one from a normal photo, see "Portrait" in the README.
   exposure: the second image that shows through your silhouette.
   bio:      add paragraphs in your own words.
   pastWork: { title: 'Project name', note: 'One line on what it was', year: '2025', href: 'https://...' }
   contact:  { label: 'Email', value: 'you@example.com', href: 'mailto:you@example.com' } */
export const about = {
  name: 'Viraj Das',
  photo: '/media/portrait-cut.webp',
  exposure: '/media/still-galaxy.jpg',
  photoAlt: 'Viraj Das in profile, looking to the left',
  bio: [
    'I’m a student in the Research Department at FCS Innovation Academy. This project is my AP Research work with Mr. Scott Robinson.',
  ],
  /* The personal part of the page. Each entry is a short heading and one or more
     paragraphs in your own words. Nothing is written here for you: an entry only
     appears once you add it. Example:
     { heading: 'Why memory', paragraphs: ['First paragraph.', 'Second paragraph.'] }, */
  story: [] as { heading: string; paragraphs: string[] }[],
  facts: [
    { label: 'School', value: 'FCS Innovation Academy' },
    { label: 'Course', value: 'AP Research' },
    { label: 'Project', value: 'The Development and Optimization of a Scalable AI Memory Solution' },
  ],
  pastWork: [] as { title: string; note: string; year: string; href?: string }[],
  contact: [] as { label: string; value: string; href: string }[],
};

/* ---------- Home: closing links ---------- */
export const more = [
  { href: '/research', label: 'Research', note: 'Twelve sources and the full literature review' },
  { href: '/process', label: 'Process', note: 'Methodology, timeline and results' },
  { href: '/about', label: 'About', note: 'Who is behind this' },
];

/* ---------- References (APA, from the paper) ---------- */
export const references = [
  { text: 'Arnon, A. (2025, September 8). The projected impact of generative AI on future productivity growth. PWBM.', href: 'https://budgetmodel.wharton.upenn.edu/p/2025-09-08-the-projected-impact-of-generative-ai-on-future-productivity-growth/' },
  { text: 'Artificial intelligence and the future of entry-level work: A framework for safeguarding and reinventing early career pathways. (2026, June 22). World Economic Forum.', href: 'https://www.weforum.org/publications/artificial-intelligence-and-the-future-of-entry-level-work-a-framework-for-safeguarding-and-reinventing-early-career-pathways/' },
  { text: 'Gutiérrez, B. J., Shu, Y., Qi, W., Zhou, S., & Su, Y. (2025). From RAG to memory: Non-parametric continual learning for large language models. PMLR, 267, 21497–21515.', href: 'https://proceedings.mlr.press/v267/gutierrez25a.html' },
  { text: 'Hong, K., Troynikov, A., & Huber, J. (2025). Context rot: How increasing input tokens impacts LLM performance. Trychroma.com.', href: 'https://www.trychroma.com/research/context-rot#conclusion' },
  { text: 'Huet, A., Ben Houidi, Z., & Rossi, D. (2025). Episodic memories generation and evaluation: Benchmark for large language models. International Conference on Learning Representations Proceedings.', href: 'https://proceedings.iclr.cc/paper_files/paper/2025/file/7ff013b7e372ba5b790352ccd6908f03-Paper-Conference.pdf' },
  { text: 'Jiang, D., Li, Y., & Li, B. (2026). Jev-mem: System-one-controlled agentic memory for efficient AI agents (2609.23986v1). arXiv.', href: 'https://arxiv.org/abs/2609.23986v1' },
  { text: 'Tan, C. H.-M., Subagdja, B., & Tan, A.-H. (2026). ARTEM: Enhancing large language model agents with spatial-temporal episodic memory. Proceedings of the AAAI Conference on Artificial Intelligence, 40(30), 25753–25760.', href: 'https://doi.org/10.1609/aaai.v40i30.39773' },
  { text: 'Tan, Z., Yan, J., Hsu, I.-H., Han, R., Wang, Z., Le, L., Song, Y., Chen, Y., Palangi, H., Lee, G., Iyer, A., Chen, T., Liu, H., Lee, C.-Y., & Pfister, T. (2025). In prospect and retrospect: Reflective memory management for long-term personalized dialogue agents. 1, 8416–8439.', href: 'https://aclanthology.org/2025.acl-long.413.pdf' },
  { text: 'Turing, A. (1950). Computing machinery and intelligence. Mind, 59(236), 433–460.', href: 'https://doi.org/10.1093/mind/LIX.236.433' },
  { text: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need.', href: 'https://arxiv.org/pdf/1706.03762' },
  { text: 'Wu, D., Wang, H., Yu, W., Zhang, Y., Chang, K.-W., & Yu, D. (2024). LongMemEval: Benchmarking chat assistants on long-term interactive memory. arXiv.org.', href: 'https://arxiv.org/abs/2410.10813' },
  { text: 'Yao, X., Zhao, X., Zhou, D., Bi, X., Sun, Y., & He, B. (2026). Why retrieval is not enough: Structured memory scheduling for large language model reasoning. Data Science and Engineering.', href: 'https://doi.org/10.1007/s41019-026-00361-x' },
  { text: 'Zhang, S., Wang, J., Zhou, R., Liao, J., Feng, Y., Zhang, W., Wen, Y., Li, Z., Xiong, F., Qi, Y., Tang, B., & Wen, M. (2026). MemRL: Self-evolving agents via runtime reinforcement learning on episodic memory (2601.03192v1). arXiv.', href: 'https://arxiv.org/abs/2601.03192v1' },
  { text: 'Zhang, Z., Dai, Q., Bo, X., Ma, C., Li, R., Chen, X., Zhu, J., Dong, Z., & Wen, J.-R. (2025). A survey on the memory mechanism of large language model-based agents. ACM Transactions on Information Systems, 43(6), 1–47.', href: 'https://doi.org/10.1145/3748302' },
];
