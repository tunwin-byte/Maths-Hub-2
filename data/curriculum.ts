// data/curriculum.ts

export type ManipulativeType =
  | 'five-frame'
  | 'ten-frame'
  | 'array-grid'
  | 'fraction-bar'
  | 'number-line'
  | 'order-of-ops'
  | 'bracket-placement'
  | 'expression-builder'
  | 'decimal-chart'
  | 'area-decomposition'
  | 'chance-frequency';
  export interface ChanceQuestion {
    id: string;
    category: 'terminology' | 'expected-calc' | 'observed-vs-expected' | 'fairness-randomness';
    title: string;
    scenario: string;
    experimentDetails: {
      device: 'coin' | 'dice' | 'spinner' | 'bag';
      trials: number;
      targetOutcome: string;
      probabilityStr: string;
      expectedFrequency: number;
      sampleObservedFrequency: number;
    };
    prompt: string;
    correctAnswer: number | string;
    answerType: 'number' | 'multiple-choice';
    options?: string[];
    explanation: string;
  } 
export interface DecimalChartQuestion {
  id: string;
  operation: '+' | '-';
  startVal: number; // e.g. 1.35
  changeVal: number; // e.g. 0.8
  correctAnswer: number; // e.g. 2.15
  context: string;
  hint: string;
}
export interface AreaQuestion {
  id: string;
  shapeType: 'l-shape' | 'parallelogram' | 'triangle';
  title: string;
  prompt: string;
  dimensions: {
    // For L-shape:
    totalWidth?: number;
    totalHeight?: number;
    cutWidth?: number;
    cutHeight?: number;
    // For Parallelogram & Triangle:
    base?: number;
    height?: number;
    slant?: number; // Distractor dimension
  };
  correctArea: number;
  decompositionStrategy: string;
  hint: string;
}
export interface FiveFrameQuestion {
  id: string;
  title: string;
  targetCount: number;
  flashMode?: boolean; // If true, flashes dots for 1.5 seconds for subitising
  correctAnswer: number;
  hint: string;
}

export interface TenFrameQuestion {
  id: string;
  title: string;
  initialBase: number;
  toAdd: number;
  correctAnswer: number;
  hintBridge: string;
}

export interface ArrayQuestion {
  id: string;
  title: string;
  rows: number;
  cols: number;
  correctAnswer: number;
  hint: string;
}

export interface FractionQuestion {
  id: string;
  title: string;
  targetFraction: string;
  targetNumerator: number;
  targetDenominator: number;
  percentageEquivalent: number;
  hint: string;
}

export interface NumberLineQuestion {
  id: string;
  title: string;
  startNumber: number;
  toAdd: number;
  correctAnswer: number;
  hint: string;
}

export interface OutcomeCurriculum {
  outcomeCode: string;
  stage: string;
  strand: string;
  focusArea: string;
  title: string;
  manipulativeType: ManipulativeType;
  questions: (FiveFrameQuestion | TenFrameQuestion | ArrayQuestion | FractionQuestion | NumberLineQuestion)[];
}
export interface OrderOfOpsQuestion {
  id: string;
  context: string; // Real-world context
  expression: string; // Displayed expression, e.g. "4 + 5 × 3"
  tokens: string[]; // ['4', '+', '5', '×', '3']
  correctFirstOpIndex: number; // Index in tokens of operator that must go first
  stepReduction: string; // What the expression becomes after step 1: e.g. "4 + 15"
  correctAnswer: number;
  explanation: string;
}
export interface ExpressionBuilderQuestion {
  id: string;
  scenario: string;
  availableTiles: string[]; // Scrambled tile bank
  targetExpression: string; // The canonical expression to display upon success, e.g. "( 15 + 5 ) × 4"
  validSequences: string[][]; // Array of acceptable token orders
  correctAnswer: number;
  explanation: string;
}
export interface BracketPlacementQuestion {
  id: string;
  title: string;
  context: string;
  // Tokens represented as alternating numbers and operators, e.g. ["2", "+", "6", "×", "4"]
  terms: {
    num1: number;
    op1: '+' | '-' | '×' | '÷';
    num2: number;
    op2: '+' | '-' | '×' | '÷';
    num3: number;
  };
  defaultResult: number; // What it equals with standard BODMAS and no brackets
  targetResult: number;  // The target number students must make it equal
  correctBracket: 'left' | 'right' | 'none'; // '(num1 op1 num2) op2 num3' OR 'num1 op1 (num2 op2 num3)'
  hint: string;
}
export const NSW_CURRICULUM: Record<string, OutcomeCurriculum> = {
  // EARLY STAGE 1: SUBITISING & FIVE-FRAME
  'MAE-RWN-01': {
    outcomeCode: 'MAE-RWN-01',
    stage: 'early-stage-1',
    strand: 'Number and algebra',
    focusArea: 'Representing whole numbers A (Subitising)',
    title: 'Five-Frames & Instant Subitising',
    manipulativeType: 'five-frame',
    questions: [
      {
        id: 'q-ff-1',
        title: 'Make 4 on the Five-Frame',
        targetCount: 4,
        flashMode: false,
        correctAnswer: 4,
        hint: 'Tap 4 empty spots in the five-frame so 4 counters appear!',
      },
      {
        id: 'q-ff-2',
        title: 'Quick Flash: How many dots?',
        targetCount: 3,
        flashMode: true,
        correctAnswer: 3,
        hint: '3 dots flashed! Notice there were 2 empty spaces: 5 take away 2 is 3.',
      },
      {
        id: 'q-ff-3',
        title: 'Make 5 (Full Frame)',
        targetCount: 5,
        flashMode: false,
        correctAnswer: 5,
        hint: 'Fill every single box in the five-frame to make 5!',
      },
    ],
  },

  // STAGE 1: ADDITIVE RELATIONS
  'MA1-AR-01': {
    outcomeCode: 'MA1-AR-01',
    stage: 'stage-1',
    strand: 'Number and algebra',
    focusArea: 'Additive relations',
    title: 'Bridging to 10 with Additive Relations',
    manipulativeType: 'ten-frame',
    questions: [
      {
        id: 'q1',
        title: 'Bridge to 10: 8 + 5',
        initialBase: 8,
        toAdd: 5,
        correctAnswer: 13,
        hintBridge: 'Top frame has 8. Move 2 counters to make 10 first!',
      },
      {
        id: 'q2',
        title: 'Bridge to 10: 9 + 4',
        initialBase: 9,
        toAdd: 4,
        correctAnswer: 13,
        hintBridge: 'Top frame has 9. You only need 1 counter to fill 10!',
      },
    ],
  },
  'MA1-AR-02': {
    outcomeCode: 'MA1-AR-02',
    stage: 'stage-1',
    strand: 'Number and algebra',
    focusArea: 'Additive relations',
    title: 'Doubles and Near-Doubles',
    manipulativeType: 'ten-frame',
    questions: [
      {
        id: 'q3',
        title: 'Doubles Challenge: 6 + 6',
        initialBase: 6,
        toAdd: 6,
        correctAnswer: 12,
        hintBridge: 'Make 10 first! Move 4 counters up, then check what remains.',
      },
      {
        id: 'q4',
        title: 'Near Doubles: 6 + 7',
        initialBase: 6,
        toAdd: 7,
        correctAnswer: 13,
        hintBridge: 'Think of 6 + 6 = 12. How much is 1 more?',
      },
    ],
  },
  'MA1-AR-03': {
    outcomeCode: 'MA1-AR-03',
    stage: 'stage-1',
    strand: 'Number and algebra',
    focusArea: 'Additive relations',
    title: 'Friends of 10 Combinations',
    manipulativeType: 'ten-frame',
    questions: [
      {
        id: 'q5',
        title: 'Make 10: 7 + ? = 10',
        initialBase: 7,
        toAdd: 3,
        correctAnswer: 10,
        hintBridge: 'How many counters fill the remaining empty slots in the top frame?',
      },
    ],
  },

  // STAGE 2: ADDITIVE RELATIONS
  'MA2-AR-01': {
    outcomeCode: 'MA2-AR-01',
    stage: 'stage-2',
    strand: 'Number and algebra',
    focusArea: 'Additive relations A (Jump Strategy)',
    title: 'Flexible Addition: The Jump Strategy on an Empty Number Line',
    manipulativeType: 'number-line',
    questions: [
      {
        id: 'q-nl-1',
        title: 'Use the Jump Strategy: 48 + 35',
        startNumber: 48,
        toAdd: 35,
        correctAnswer: 83,
        hint: 'Start at 48. Partition 35 into 30 and 5. Jump 3 tens (+30 to 78), then jump 5 ones to reach 83!',
      },
      {
        id: 'q-nl-2',
        title: 'Use the Jump Strategy: 67 + 26',
        startNumber: 67,
        toAdd: 26,
        correctAnswer: 93,
        hint: 'Start at 67. Jump 20 (+10, +10 to 87), then jump 6 ones (+3 to reach 90, +3 to 93).',
      },
      {
        id: 'q-nl-3',
        title: 'Bridge Across 100: 85 + 38',
        startNumber: 85,
        toAdd: 38,
        correctAnswer: 123,
        hint: 'Start at 85. Jump 3 tens (+30 to 115), then jump 8 ones (+5 to 120, +3 to 123)!',
      },
    ],
  },

  // STAGE 2: MULTIPLICATIVE RELATIONS
  'MA2-MR-01': {
    outcomeCode: 'MA2-MR-01',
    stage: 'stage-2',
    strand: 'Number and algebra',
    focusArea: 'Multiplicative relations A',
    title: 'Arrays, Factors and the Distributive Property',
    manipulativeType: 'array-grid',
    questions: [
      {
        id: 'q-arr-1',
        title: 'Explore the Array: 3 rows of 6',
        rows: 3,
        cols: 6,
        correctAnswer: 18,
        hint: 'Highlight 3 rows across 6 columns. Think: 3 × 5 = 15, plus 3 more!',
      },
      {
        id: 'q-arr-2',
        title: 'Explore the Array: 4 rows of 7',
        rows: 4,
        cols: 7,
        correctAnswer: 28,
        hint: 'Partition 7 into 5 and 2: (4 × 5) + (4 × 2) = 20 + 8 = 28.',
      },
      {
        id: 'q-arr-3',
        title: 'Explore the Array: 6 rows of 6 (Square Number)',
        rows: 6,
        cols: 6,
        correctAnswer: 36,
        hint: 'Equal rows and columns make a square array! 6 × 6 = ?',
      },
      {
        id: 'q-arr-4',
        title: 'Explore the Array: 8 rows of 4',
        rows: 8,
        cols: 4,
        correctAnswer: 32,
        hint: 'Double (4 × 4) = 16 + 16 = 32, or partition into (5 × 4) + (3 × 4) = 20 + 12 = 32.',
      },
    ],
  },
  // STAGE 3: DECIMALS PLACE VALUE ADDITION & SUBTRACTION
  'MA3-AR-01': {
    outcomeCode: 'MA3-AR-01',
    stage: 'stage-3',
    strand: 'Number and algebra',
    focusArea: 'Additive relations A (Decimals)',
    title: 'Decimal Place-Value Chart: Tenths and Hundredths',
    manipulativeType: 'decimal-chart',
    questions: [
      // 1. Basic addition with unequal decimal places
      {
        id: 'dec-1',
        operation: '+',
        startVal: 1.4,
        changeVal: 0.35,
        correctAnswer: 1.75,
        context: 'A runner sprints 1.4 km on grass and 0.35 km on track. Find the total distance.',
        hint: 'Align tenths with tenths! Think of 1.4 as 1.40. 4 tenths + 3 tenths = 7 tenths, and 0 + 5 hundredths = 5 hundredths. Total: 1.75.',
      },
      // 2. Addition requiring regrouping: 10 hundredths -> 1 tenth
      {
        id: 'dec-2',
        operation: '+',
        startVal: 0.65,
        changeVal: 0.48,
        correctAnswer: 1.13,
        context: 'A science beaker has 0.65 L of water. A student pours in another 0.48 L.',
        hint: '5 hundredths + 8 hundredths = 13 hundredths. Bundle 10 hundredths into 1 tenth, leaving 3 hundredths. 6 tenths + 4 tenths + 1 tenth = 11 tenths (1 whole and 1 tenth). Total: 1.13.',
      },
      // 3. Subtraction requiring unbundling: 1 tenth -> 10 hundredths
      {
        id: 'dec-3',
        operation: '-',
        startVal: 2.5,
        changeVal: 0.75,
        correctAnswer: 1.75,
        context: 'A ribbon is 2.5 m long. A dressmaker cuts off 0.75 m.',
        hint: 'Think of 2.5 as 2.50. You cannot take 5 hundredths from 0: unbundle 1 tenth into 10 hundredths, then subtract!',
      },
      // 4. Money context: Regrouping across both decimal places
      {
        id: 'dec-4',
        operation: '+',
        startVal: 1.85,
        changeVal: 1.25,
        correctAnswer: 3.1,
        context: 'Liam buys fruit for $1.85 and yogurt for $1.25. How much did he spend in total?',
        hint: '5 + 5 hundredths = 10 hundredths (1 tenth). 8 + 2 + 1 tenths = 11 tenths (1 whole and 1 tenth). 1 + 1 + 1 = 3 ones. Total: 3.10 (or 3.1).',
      },
      // 5. Subtraction across zero tenths
      {
        id: 'dec-5',
        operation: '-',
        startVal: 3.05,
        changeVal: 1.4,
        correctAnswer: 1.65,
        context: 'A container weighs 3.05 kg. When emptied, 1.4 kg of powder was removed.',
        hint: 'Think of 1.4 as 1.40. Unbundle 1 one into 10 tenths, then subtract 4 tenths from 10 tenths to leave 6 tenths. Total: 1.65.',
      },
      // 6. Addition: Simple hundredths addition with common tenths
      {
        id: 'dec-6',
        operation: '+',
        startVal: 0.42,
        changeVal: 0.36,
        correctAnswer: 0.78,
        context: 'A carpenter joins two thin wooden strips: 0.42 m and 0.36 m.',
        hint: 'Add columns directly: 2 + 6 hundredths = 8 hundredths; 4 + 3 tenths = 7 tenths. Total: 0.78.',
      },
      // 7. Subtraction: Hundredths subtraction without regrouping
      {
        id: 'dec-7',
        operation: '-',
        startVal: 1.89,
        changeVal: 0.54,
        correctAnswer: 1.35,
        context: 'A bottle holds 1.89 L of juice. 0.54 L is poured out for lunch.',
        hint: 'Subtract place by place: 9 - 4 hundredths = 5 hundredths; 8 - 5 tenths = 3 tenths; 1 - 0 ones = 1 one. Total: 1.35.',
      },
      // 8. Addition: Crossing whole number boundary
      {
        id: 'dec-8',
        operation: '+',
        startVal: 0.7,
        changeVal: 0.8,
        correctAnswer: 1.5,
        context: 'A recipe needs 0.7 cups of honey and 0.8 cups of milk.',
        hint: '7 tenths + 8 tenths = 15 tenths. Bundle 10 tenths into 1 whole, leaving 5 tenths. Total: 1.5.',
      },
      // 9. Subtraction: Subtracting from a whole number with decimals
      {
        id: 'dec-9',
        operation: '-',
        startVal: 2.0,
        changeVal: 0.65,
        correctAnswer: 1.35,
        context: 'A wire is exactly 2.0 m long. An electrician snips off 0.65 m.',
        hint: 'Think of 2.0 as 2.00. Unbundle 1 one into 10 tenths, then 1 tenth into 10 hundredths: 10 - 5 hundredths = 5; 9 - 6 tenths = 3. Total: 1.35.',
      },
      // 10. Addition: Adding a single-digit hundredth to tenths
      {
        id: 'dec-10',
        operation: '+',
        startVal: 2.6,
        changeVal: 0.08,
        correctAnswer: 2.68,
        context: 'A metal bar measures 2.6 cm. A protective coating adds 0.08 cm.',
        hint: 'Watch the place value! 0.08 is 8 hundredths, not 8 tenths. 2.6 + 0.08 = 2.68.',
      },
      // 11. Subtraction: Unbundling across 1 whole
      {
        id: 'dec-11',
        operation: '-',
        startVal: 1.25,
        changeVal: 0.45,
        correctAnswer: 0.8,
        context: 'A student had $1.25 in coins and spent $0.45 on a pencil.',
        hint: '5 - 5 hundredths = 0. To subtract 4 tenths from 2 tenths, unbundle the 1 one into 10 tenths (giving 12 tenths): 12 - 4 = 8 tenths. Total: 0.80 or 0.8.',
      },
      // 12. Addition: Regrouping hundredths into a clean tenth
      {
        id: 'dec-12',
        operation: '+',
        startVal: 1.34,
        changeVal: 0.26,
        correctAnswer: 1.6,
        context: 'A track athlete records two reaction times: 1.34 s and 0.26 s.',
        hint: '4 + 6 hundredths = 10 hundredths. Bundle 10 hundredths into 1 tenth: 3 + 2 + 1 tenths = 6 tenths. Total: 1.60 or 1.6.',
      },
      // 13. Subtraction: Decimal subtraction with trailing zero needed
      {
        id: 'dec-13',
        operation: '-',
        startVal: 3.2,
        changeVal: 1.15,
        correctAnswer: 2.05,
        context: 'A timber plank is 3.2 m long. A builder saws off 1.15 m.',
        hint: 'Write 3.2 as 3.20. Unbundle 1 tenth into 10 hundredths: 10 - 5 = 5 hundredths. 1 - 1 = 0 tenths. 3 - 1 = 2 ones. Total: 2.05.',
      },
      // 14. Addition: Double regrouping across whole number
      {
        id: 'dec-14',
        operation: '+',
        startVal: 2.78,
        changeVal: 1.45,
        correctAnswer: 4.23,
        context: 'A baker mixes 2.78 kg of plain flour with 1.45 kg of wholemeal flour.',
        hint: '8 + 5 = 13 hundredths (bundle 10 into 1 tenth). 7 + 4 + 1 = 12 tenths (bundle 10 into 1 one). 2 + 1 + 1 = 4 ones. Total: 4.23.',
      },
      // 15. Subtraction: Subtracting near a whole
      {
        id: 'dec-15',
        operation: '-',
        startVal: 4.12,
        changeVal: 1.95,
        correctAnswer: 2.17,
        context: 'A fuel tank holds 4.12 L. After a trip, 1.95 L was consumed.',
        hint: 'Unbundle tenths for hundredths (12 - 5 = 7). Unbundle ones for tenths (10 - 9 = 1). 3 - 1 = 2. Total: 2.17.',
      },
      // 16. Addition: Thousandth-free clean decimal addition
      {
        id: 'dec-16',
        operation: '+',
        startVal: 0.55,
        changeVal: 0.55,
        correctAnswer: 1.1,
        context: 'Two identical small packets each weigh 0.55 kg.',
        hint: '55 hundredths + 55 hundredths = 110 hundredths = 1 whole and 1 tenth. Total: 1.10 or 1.1.',
      },
      // 17. Subtraction: Tidy hundredth subtraction
      {
        id: 'dec-17',
        operation: '-',
        startVal: 5.0,
        changeVal: 2.35,
        correctAnswer: 2.65,
        context: 'A 5.0 kg bag of rice has 2.35 kg scooped out for a banquet.',
        hint: 'Think 5.00 - 2.35. Unbundle through the decimal point: 100 hundredths - 35 hundredths = 65 hundredths. 4 - 2 = 2 ones. Total: 2.65.',
      },
      // 18. Addition: Unequal lengths with multiple tenths
      {
        id: 'dec-18',
        operation: '+',
        startVal: 3.09,
        changeVal: 1.82,
        correctAnswer: 4.91,
        context: 'A garden bed receives 3.09 mm of rain on Friday and 1.82 mm on Saturday.',
        hint: '9 + 2 hundredths = 11 hundredths (1 tenth and 1 hundredth). 0 + 8 + 1 tenths = 9 tenths. 3 + 1 = 4 ones. Total: 4.91.',
      },
      // 19. Subtraction: Small decimal difference
      {
        id: 'dec-19',
        operation: '-',
        startVal: 1.1,
        changeVal: 0.95,
        correctAnswer: 0.15,
        context: 'A swimmer finishes in 1.10 minutes; second place finishes 0.95 minutes earlier in a handicap heat.',
        hint: 'Think 1.10 - 0.95. Unbundle 1 tenth into 10 hundredths: 10 - 5 = 5 hundredths. 10 - 9 tenths = 1 tenth. Total: 0.15.',
      },
      // 20. Addition: Multi-whole decimal challenge
      {
        id: 'dec-20',
        operation: '+',
        startVal: 3.65,
        changeVal: 2.85,
        correctAnswer: 6.5,
        context: 'Two ropes measure 3.65 m and 2.85 m. Find their combined length.',
        hint: '5 + 5 hundredths = 10 hundredths (1 tenth). 6 + 8 + 1 tenths = 15 tenths (1 one and 5 tenths). 3 + 2 + 1 = 6 ones. Total: 6.50 or 6.5.',
      },
    ],
  },
  // STAGE 3: EXPRESSION BUILDER (STORY TO NUMBER SENTENCE)
  'MA3-AR-04': {
    outcomeCode: 'MA3-AR-04',
    stage: 'stage-3',
    strand: 'Number and algebra',
    focusArea: 'Additive relations B (Contextual number sentences)',
    title: 'Word Problem to Number Sentence Builder',
    manipulativeType: 'expression-builder',
    questions: [
      {
        id: 'eb-1',
        scenario: '4 friends each buy an admission pass for $15 and a drink for $5.',
        availableTiles: ['4', '15', '5', '×', '+', '(', ')'],
        targetExpression: '( 15 + 5 ) × 4',
        validSequences: [
          ['(', '15', '+', '5', ')', '×', '4'],
          ['(', '5', '+', '15', ')', '×', '4'],
          ['4', '×', '(', '15', '+', '5', ')'],
          ['4', '×', '(', '5', '+', '15', ')'],
        ],
        correctAnswer: 80,
        explanation: 'Add the items for one person first inside brackets: (15 + 5) = 20, then multiply by 4 people: 20 × 4 = 80.',
      },
      {
        id: 'eb-2',
        scenario: 'Ben has $50. He buys 3 books at $8 each.',
        availableTiles: ['50', '3', '8', '-', '×'],
        targetExpression: '50 - 3 × 8',
        validSequences: [
          ['50', '-', '3', '×', '8'],
          ['50', '-', '8', '×', '3'],
          ['50', '-', '(', '3', '×', '8', ')'],
        ],
        correctAnswer: 26,
        explanation: 'Multiplication has priority! Total books cost 3 × 8 = 24. Subtract from $50: 50 - 24 = 26.',
      },
      {
        id: 'eb-3',
        scenario: 'A baker prepares 30 choc-chip and 18 blueberry muffins, then boxes them in sets of 6.',
        availableTiles: ['30', '18', '6', '+', '÷', '(', ')'],
        targetExpression: '( 30 + 18 ) ÷ 6',
        validSequences: [
          ['(', '30', '+', '18', ')', '÷', '6'],
          ['(', '18', '+', '30', ')', '÷', '6'],
        ],
        correctAnswer: 8,
        explanation: 'Combine all muffins first: (30 + 18) = 48. Then divide by 6: 48 ÷ 6 = 8 boxes.',
      },
      {
        id: 'eb-4',
        scenario: 'A movie ticket is $20 with a $4 student discount. Maya buys 5 tickets for her family.',
        availableTiles: ['5', '20', '4', '×', '-', '(', ')'],
        targetExpression: '5 × ( 20 - 4 )',
        validSequences: [
          ['5', '×', '(', '20', '-', '4', ')'],
          ['(', '20', '-', '4', ')', '×', '5'],
        ],
        correctAnswer: 80,
        explanation: 'Calculate the discounted ticket price first: (20 - 4) = 16. Then 5 × 16 = 80.',
      },
      {
        id: 'eb-5',
        scenario: 'A soccer team gets 10 points for qualifying, plus 4 match wins worth 3 points each.',
        availableTiles: ['10', '4', '3', '+', '×'],
        targetExpression: '10 + 4 × 3',
        validSequences: [
          ['10', '+', '4', '×', '3'],
          ['10', '+', '3', '×', '4'],
          ['4', '×', '3', '+', '10'],
        ],
        correctAnswer: 22,
        explanation: 'Calculate match win points first: 4 × 3 = 12. Add the base 10: 10 + 12 = 22.',
      },
      {
        id: 'eb-6',
        scenario: 'Two classrooms each have 12 boys and 14 girls.',
        availableTiles: ['2', '12', '14', '×', '+', '(', ')'],
        targetExpression: '2 × ( 12 + 14 )',
        validSequences: [
          ['2', '×', '(', '12', '+', '14', ')'],
          ['2', '×', '(', '14', '+', '12', ')'],
          ['(', '12', '+', '14', ')', '×', '2'],
        ],
        correctAnswer: 52,
        explanation: 'Find students per room first: (12 + 14) = 26. Then multiply by 2 rooms: 2 × 26 = 52.',
      },
      {
        id: 'eb-7',
        scenario: 'A carpenter starts with a 60 cm board. She cuts off 4 lengths of 9 cm each.',
        availableTiles: ['60', '4', '9', '-', '×'],
        targetExpression: '60 - 4 × 9',
        validSequences: [
          ['60', '-', '4', '×', '9'],
          ['60', '-', '9', '×', '4'],
          ['60', '-', '(', '4', '×', '9', ')'],
        ],
        correctAnswer: 24,
        explanation: 'Calculate total length cut: 4 × 9 = 36 cm. Subtract from 60: 60 - 36 = 24 cm.',
      },
      {
        id: 'eb-8',
        scenario: 'A fundraiser collects $90, subtracts $18 in costs, and shares the profit between 8 charities.',
        availableTiles: ['90', '18', '8', '-', '÷', '(', ')'],
        targetExpression: '( 90 - 18 ) ÷ 8',
        validSequences: [
          ['(', '90', '-', '18', ')', '÷', '8'],
        ],
        correctAnswer: 9,
        explanation: 'Deduct costs first: (90 - 18) = 72. Divide across 8 charities: 72 ÷ 8 = 9.',
      },
      {
        id: 'eb-9',
        scenario: '6 students each buy 3 notebooks and 2 gel pens.',
        availableTiles: ['6', '3', '2', '×', '+', '(', ')'],
        targetExpression: '6 × ( 3 + 2 )',
        validSequences: [
          ['6', '×', '(', '3', '+', '2', ')'],
          ['6', '×', '(', '2', '+', '3', ')'],
          ['(', '3', '+', '2', ')', '×', '6'],
        ],
        correctAnswer: 30,
        explanation: 'Find total items per student: (3 + 2) = 5. Multiply by 6 students: 6 × 5 = 30.',
      },
      {
        id: 'eb-10',
        scenario: 'A delivery driver starts with 80 packages, delivers 25 in the morning and 35 in the afternoon.',
        availableTiles: ['80', '25', '35', '-', '+', '(', ')'],
        targetExpression: '80 - ( 25 + 35 )',
        validSequences: [
          ['80', '-', '(', '25', '+', '35', ')'],
          ['80', '-', '(', '35', '+', '25', ')'],
        ],
        correctAnswer: 20,
        explanation: 'Add all delivered packages first: (25 + 35) = 60. Then subtract from 80: 80 - 60 = 20.',
      },
      {
        id: 'eb-11',
        scenario: '3 shelves each hold 8 large books, plus there are 15 small books on the table.',
        availableTiles: ['3', '8', '15', '×', '+'],
        targetExpression: '3 × 8 + 15',
        validSequences: [
          ['3', '×', '8', '+', '15'],
          ['8', '×', '3', '+', '15'],
          ['15', '+', '3', '×', '8'],
        ],
        correctAnswer: 39,
        explanation: 'Calculate shelf books first: 3 × 8 = 24. Then add the 15 table books: 24 + 15 = 39.',
      },
      {
        id: 'eb-12',
        scenario: 'A school orders 4 bus charters. Each bus carries 30 children and 5 teachers.',
        availableTiles: ['4', '30', '5', '×', '+', '(', ')'],
        targetExpression: '4 × ( 30 + 5 )',
        validSequences: [
          ['4', '×', '(', '30', '+', '5', ')'],
          ['4', '×', '(', '5', '+', '30', ')'],
          ['(', '30', '+', '5', ')', '×', '4'],
        ],
        correctAnswer: 140,
        explanation: 'Add passengers per bus: (30 + 5) = 35. Multiply by 4 buses: 4 × 35 = 140.',
      },
      {
        id: 'eb-13',
        scenario: 'A warehouse has 100 boxes. 6 trucks each pick up 12 boxes.',
        availableTiles: ['100', '6', '12', '-', '×'],
        targetExpression: '100 - 6 × 12',
        validSequences: [
          ['100', '-', '6', '×', '12'],
          ['100', '-', '12', '×', '6'],
          ['100', '-', '(', '6', '×', '12', ')'],
        ],
        correctAnswer: 28,
        explanation: 'Find total boxes loaded: 6 × 12 = 72. Subtract from 100: 100 - 72 = 28.',
      },
      {
        id: 'eb-14',
        scenario: '5 friends split an $80 dinner evenly, and each friend also gives $4 for parking.',
        availableTiles: ['80', '5', '4', '÷', '+', '(', ')'],
        targetExpression: '( 80 ÷ 5 ) + 4',
        validSequences: [
          ['(', '80', '÷', '5', ')', '+', '4'],
          ['80', '÷', '5', '+', '4'],
          ['4', '+', '(', '80', '÷', '5', ')'],
        ],
        correctAnswer: 20,
        explanation: 'Divide dinner bill first: 80 ÷ 5 = 16. Then add parking: 16 + 4 = 20.',
      },
      {
        id: 'eb-15',
        scenario: 'A party pack includes 8 treat bags. Each bag has 6 gummies and 4 chocolates.',
        availableTiles: ['8', '6', '4', '×', '+', '(', ')'],
        targetExpression: '8 × ( 6 + 4 )',
        validSequences: [
          ['8', '×', '(', '6', '+', '4', ')'],
          ['8', '×', '(', '4', '+', '6', ')'],
          ['(', '6', '+', '4', ')', '×', '8'],
        ],
        correctAnswer: 80,
        explanation: 'Combine treats per bag: (6 + 4) = 10. Multiply by 8 bags: 8 × 10 = 80.',
      },
      {
        id: 'eb-16',
        scenario: 'A swimmer does 50 laps on Monday, then swims 14 laps on Tuesday and 16 laps on Wednesday.',
        availableTiles: ['50', '14', '16', '+', '+'],
        targetExpression: '50 + 14 + 16',
        validSequences: [
          ['50', '+', '14', '+', '16'],
          ['50', '+', '16', '+', '14'],
          ['14', '+', '16', '+', '50'],
        ],
        correctAnswer: 80,
        explanation: 'All terms are additions: 50 + 14 + 16 = 80 laps in total.',
      },
      {
        id: 'eb-17',
        scenario: 'A gardener plants 7 rows of 8 tulips, and adds 6 daffodil bulbs at the end.',
        availableTiles: ['7', '8', '6', '×', '+'],
        targetExpression: '7 × 8 + 6',
        validSequences: [
          ['7', '×', '8', '+', '6'],
          ['8', '×', '7', '+', '6'],
          ['6', '+', '7', '×', '8'],
        ],
        correctAnswer: 62,
        explanation: 'Multiply rows first: 7 × 8 = 56. Add remaining bulbs: 56 + 6 = 62.',
      },
      {
        id: 'eb-18',
        scenario: '4 friends order 3 pizzas each, and an extra 2 pizzas are added for teachers.',
        availableTiles: ['4', '3', '2', '×', '+'],
        targetExpression: '4 × 3 + 2',
        validSequences: [
          ['4', '×', '3', '+', '2'],
          ['3', '×', '4', '+', '2'],
          ['2', '+', '4', '×', '3'],
        ],
        correctAnswer: 14,
        explanation: 'Calculate friends pizzas: 4 × 3 = 12. Add 2 for teachers: 12 + 2 = 14.',
      },
      {
        id: 'eb-19',
        scenario: 'A crate has 75 apples. 15 damaged apples are thrown out, and the rest are split into 6 bags.',
        availableTiles: ['75', '15', '6', '-', '÷', '(', ')'],
        targetExpression: '( 75 - 15 ) ÷ 6',
        validSequences: [
          ['(', '75', '-', '15', ')', '÷', '6'],
        ],
        correctAnswer: 10,
        explanation: 'Subtract bad apples first: (75 - 15) = 60. Divide into 6 bags: 60 ÷ 6 = 10.',
      },
      {
        id: 'eb-20',
        scenario: 'A student buys 3 pens for $4 each and 2 notebooks for $5 each.',
        availableTiles: ['3', '4', '2', '5', '×', '×', '+'],
        targetExpression: '3 × 4 + 2 × 5',
        validSequences: [
          ['3', '×', '4', '+', '2', '×', '5'],
          ['4', '×', '3', '+', '2', '×', '5'],
          ['2', '×', '5', '+', '3', '×', '4'],
        ],
        correctAnswer: 22,
        explanation: 'Both multiplications precede addition: (3 × 4 = 12) + (2 × 5 = 10) = 22.',
      },
    ],
  },
  // STAGE 3: BRACKET PLACEMENT ("MAKE IT TRUE")
  'MA3-AR-03': {
    outcomeCode: 'MA3-AR-03',
    stage: 'stage-3',
    strand: 'Number and algebra',
    focusArea: 'Additive relations B (Grouping symbols)',
    title: 'Make It True: Bracket Placement Challenge',
    manipulativeType: 'bracket-placement',
    questions: [
      {
        id: 'bp-1',
        title: 'Make it equal 32',
        context: 'Without brackets: 2 + 6 × 4 = 26. Where can you place brackets to make 32?',
        terms: { num1: 2, op1: '+', num2: 6, op2: '×', num3: 4 },
        defaultResult: 26,
        targetResult: 32,
        correctBracket: 'left', // (2 + 6) × 4 = 8 × 4 = 32
        hint: 'Try grouping the addition first so you multiply a larger sum by 4: (2 + 6) × 4.',
      },
      {
        id: 'bp-2',
        title: 'Make it equal 9',
        context: 'Without brackets: 30 - 12 ÷ 2 = 24. Where can you place brackets to make 9?',
        terms: { num1: 30, op1: '-', num2: 12, op2: '÷', num3: 2 },
        defaultResult: 24,
        targetResult: 9,
        correctBracket: 'left', // (30 - 12) ÷ 2 = 18 ÷ 2 = 9
        hint: 'Group the subtraction inside brackets first: (30 - 12) = 18, then divide by 2.',
      },
      {
        id: 'bp-3',
        title: 'Make it equal 40',
        context: 'Without brackets: 4 × 7 + 3 = 31. Where can you place brackets to reach 40?',
        terms: { num1: 4, op1: '×', num2: 7, op2: '+', num3: 3 },
        defaultResult: 31,
        targetResult: 40,
        correctBracket: 'right', // 4 × (7 + 3) = 4 × 10 = 40
        hint: 'Notice 7 + 3 makes a tidy 10! If you put brackets around 7 + 3, you get 4 × 10.',
      },
      {
        id: 'bp-4',
        title: 'Make it equal 5',
        context: 'Without brackets: 45 ÷ 5 + 4 = 13. Where can you place brackets to equal 5?',
        terms: { num1: 45, op1: '÷', num2: 5, op2: '+', num3: 4 },
        defaultResult: 13,
        targetResult: 5,
        correctBracket: 'right', // 45 ÷ (5 + 4) = 45 ÷ 9 = 5
        hint: 'Calculate 5 + 4 inside brackets first to create a divisor of 9: 45 ÷ 9.',
      },
      {
        id: 'bp-5',
        title: 'Make it equal 42',
        context: 'Without brackets: 3 + 4 × 6 = 27. Where can you place brackets to make 42?',
        terms: { num1: 3, op1: '+', num2: 4, op2: '×', num3: 6 },
        defaultResult: 27,
        targetResult: 42,
        correctBracket: 'left', // (3 + 4) × 6 = 7 × 6 = 42
        hint: 'Group (3 + 4) = 7, then 7 × 6 gives 42!',
      },

      // --- 15 NEW QUESTIONS ---

      // 6. Right bracket with subtraction
      {
        id: 'bp-6',
        title: 'Make it equal 24',
        context: 'Without brackets: 6 × 9 - 5 = 49. Where can you place brackets to equal 24?',
        terms: { num1: 6, op1: '×', num2: 9, op2: '-', num3: 5 },
        defaultResult: 49,
        targetResult: 24,
        correctBracket: 'right', // 6 × (9 - 5) = 6 × 4 = 24
        hint: 'Subtract 9 - 5 inside brackets first to get 4, then multiply by 6: 6 × 4.',
      },

      // 7. Left bracket with addition before division
      {
        id: 'bp-7',
        title: 'Make it equal 8',
        context: 'Without brackets: 28 + 12 ÷ 5 = 30.4. Where can you place brackets to make 8?',
        terms: { num1: 28, op1: '+', num2: 12, op2: '÷', num3: 5 },
        defaultResult: 30.4,
        targetResult: 8,
        correctBracket: 'left', // (28 + 12) ÷ 5 = 40 ÷ 5 = 8
        hint: 'Combine 28 and 12 first inside brackets to make 40: (28 + 12) ÷ 5 = 8.',
      },

      // 8. Right bracket with division divisor sum
      {
        id: 'bp-8',
        title: 'Make it equal 6',
        context: 'Without brackets: 48 ÷ 4 + 4 = 16. Where can you place brackets to make 6?',
        terms: { num1: 48, op1: '÷', num2: 4, op2: '+', num3: 4 },
        defaultResult: 16,
        targetResult: 6,
        correctBracket: 'right', // 48 ÷ (4 + 4) = 48 ÷ 8 = 6
        hint: 'Add 4 + 4 first so you divide 48 by 8: 48 ÷ (4 + 4).',
      },

      // 9. Left bracket subtraction before multiplication
      {
        id: 'bp-9',
        title: 'Make it equal 35',
        context: 'Without brackets: 15 - 8 × 5 = -25. Where can you place brackets to equal 35?',
        terms: { num1: 15, op1: '-', num2: 8, op2: '×', num3: 5 },
        defaultResult: -25,
        targetResult: 35,
        correctBracket: 'left', // (15 - 8) × 5 = 7 × 5 = 35
        hint: 'Do 15 - 8 first inside brackets to get 7: 7 × 5 = 35.',
      },

      // 10. Right bracket multiplication into tidy numbers
      {
        id: 'bp-10',
        title: 'Make it equal 70',
        context: 'Without brackets: 7 × 2 + 8 = 22. Where can you place brackets to reach 70?',
        terms: { num1: 7, op1: '×', num2: 2, op2: '+', num3: 8 },
        defaultResult: 22,
        targetResult: 70,
        correctBracket: 'right', // 7 × (2 + 8) = 7 × 10 = 70
        hint: 'Look for the tidy ten! (2 + 8) = 10, then 7 × 10 = 70.',
      },

      // 11. Left bracket addition before multiplication
      {
        id: 'bp-11',
        title: 'Make it equal 72',
        context: 'Without brackets: 5 + 4 × 8 = 37. Where can you place brackets to equal 72?',
        terms: { num1: 5, op1: '+', num2: 4, op2: '×', num3: 8 },
        defaultResult: 37,
        targetResult: 72,
        correctBracket: 'left', // (5 + 4) × 8 = 9 × 8 = 72
        hint: 'Group 5 + 4 inside brackets first: 9 × 8 = 72.',
      },

      // 12. Right bracket division divisor difference
      {
        id: 'bp-12',
        title: 'Make it equal 9',
        context: 'Without brackets: 54 ÷ 9 - 3 = 3. Where can you place brackets to make 9?',
        terms: { num1: 54, op1: '÷', num2: 9, op2: '-', num3: 3 },
        defaultResult: 3,
        targetResult: 9,
        correctBracket: 'right', // 54 ÷ (9 - 3) = 54 ÷ 6 = 9
        hint: 'Subtract 9 - 3 first to get 6, then 54 ÷ 6 = 9.',
      },

      // 13. Left bracket subtraction before division
      {
        id: 'bp-13',
        title: 'Make it equal 7',
        context: 'Without brackets: 50 - 15 ÷ 5 = 47. Where can you place brackets to reach 7?',
        terms: { num1: 50, op1: '-', num2: 15, op2: '÷', num3: 5 },
        defaultResult: 47,
        targetResult: 7,
        correctBracket: 'left', // (50 - 15) ÷ 5 = 35 ÷ 5 = 7
        hint: 'Calculate (50 - 15) = 35 first: 35 ÷ 5 = 7.',
      },

      // 14. Right bracket multiplication with subtraction
      {
        id: 'bp-14',
        title: 'Make it equal 16',
        context: 'Without brackets: 8 × 6 - 4 = 44. Where can you place brackets to make 16?',
        terms: { num1: 8, op1: '×', num2: 6, op2: '-', num3: 4 },
        defaultResult: 44,
        targetResult: 16,
        correctBracket: 'right', // 8 × (6 - 4) = 8 × 2 = 16
        hint: 'Calculate 6 - 4 inside brackets first to get 2: 8 × 2 = 16.',
      },

      // 15. Left bracket addition before multiplication
      {
        id: 'bp-15',
        title: 'Make it equal 54',
        context: 'Without brackets: 2 + 7 × 6 = 44. Where can you place brackets to reach 54?',
        terms: { num1: 2, op1: '+', num2: 7, op2: '×', num3: 6 },
        defaultResult: 44,
        targetResult: 54,
        correctBracket: 'left', // (2 + 7) × 6 = 9 × 6 = 54
        hint: 'Add 2 + 7 inside brackets first: 9 × 6 = 54.',
      },

      // 16. Right bracket with subtraction divisor
      {
        id: 'bp-16',
        title: 'Make it equal 8',
        context: 'Without brackets: 72 ÷ 12 - 3 = 3. Where can you place brackets to reach 8?',
        terms: { num1: 72, op1: '÷', num2: 12, op2: '-', num3: 3 },
        defaultResult: 3,
        targetResult: 8,
        correctBracket: 'right', // 72 ÷ (12 - 3) = 72 ÷ 9 = 8
        hint: 'Subtract 12 - 3 inside brackets first to get 9: 72 ÷ 9 = 8.',
      },

      // 17. Left bracket subtraction before multiplication
      {
        id: 'bp-17',
        title: 'Make it equal 48',
        context: 'Without brackets: 20 - 8 × 4 = -12. Where can you place brackets to equal 48?',
        terms: { num1: 20, op1: '-', num2: 8, op2: '×', num3: 4 },
        defaultResult: -12,
        targetResult: 48,
        correctBracket: 'left', // (20 - 8) × 4 = 12 × 4 = 48
        hint: 'Calculate 20 - 8 inside brackets first to get 12: 12 × 4 = 48.',
      },

      // 18. Right bracket multiplication with tidy sum
      {
        id: 'bp-18',
        title: 'Make it equal 90',
        context: 'Without brackets: 9 × 4 + 6 = 42. Where can you place brackets to make 90?',
        terms: { num1: 9, op1: '×', num2: 4, op2: '+', num3: 6 },
        defaultResult: 42,
        targetResult: 90,
        correctBracket: 'right', // 9 × (4 + 6) = 9 × 10 = 90
        hint: 'Group 4 + 6 inside brackets to create 10: 9 × 10 = 90.',
      },

      // 19. Left bracket addition before division
      {
        id: 'bp-19',
        title: 'Make it equal 11',
        context: 'Without brackets: 45 + 21 ÷ 6 = 48.5. Where can you place brackets to reach 11?',
        terms: { num1: 45, op1: '+', num2: 21, op2: '÷', num3: 6 },
        defaultResult: 48.5,
        targetResult: 11,
        correctBracket: 'left', // (45 + 21) ÷ 6 = 66 ÷ 6 = 11
        hint: 'Add 45 and 21 first to make 66: (45 + 21) ÷ 6 = 11.',
      },

      // 20. Right bracket with division divisor sum
      {
        id: 'bp-20',
        title: 'Make it equal 7',
        context: 'Without brackets: 56 ÷ 6 + 2 = 11.33. Where can you place brackets to equal 7?',
        terms: { num1: 56, op1: '÷', num2: 6, op2: '+', num3: 2 },
        defaultResult: 11.33,
        targetResult: 7,
        correctBracket: 'right', // 56 ÷ (6 + 2) = 56 ÷ 8 = 7
        hint: 'Add 6 + 2 inside brackets first to make 8: 56 ÷ (6 + 2) = 7.',
      },
    ],
  },
// STAGE 3: ORDER OF OPERATIONS & BRACKETS
'MA3-AR-02': {
  outcomeCode: 'MA3-AR-02',
  stage: 'stage-3',
  strand: 'Number and algebra',
  focusArea: 'Additive relations B (Order of operations)',
  title: 'Order of Operations & Brackets in Number Sentences',
  manipulativeType: 'order-of-ops',
  questions: [
    {
      id: 'q-ops-1',
      context: 'Sarah buys 1 large drink for $4 and 5 snack packs for $3 each.',
      expression: '4 + 5 × 3',
      tokens: ['4', '+', '5', '×', '3'],
      correctFirstOpIndex: 3,
      stepReduction: '4 + 15',
      correctAnswer: 19,
      explanation: 'Multiplication has priority over addition! Evaluate 5 × 3 = 15 first, then 4 + 15 = 19.',
    },
    {
      id: 'q-ops-2',
      context: 'A group of 3 friends each pay $4 for a cinema ticket and $5 for popcorn combo.',
      expression: '( 4 + 5 ) × 3',
      tokens: ['(', '4', '+', '5', ')', '×', '3'],
      correctFirstOpIndex: 2,
      stepReduction: '9 × 3',
      correctAnswer: 27,
      explanation: 'Brackets must always be evaluated first! (4 + 5) = 9, then 9 × 3 = 27.',
    },
    {
      id: 'q-ops-3',
      context: 'Jack starts with $50. He buys 4 packs of cards at $6 each.',
      expression: '50 - 4 × 6',
      tokens: ['50', '-', '4', '×', '6'],
      correctFirstOpIndex: 3,
      stepReduction: '50 - 24',
      correctAnswer: 26,
      explanation: 'Calculate the total cost of cards first: 4 × 6 = 24. Then subtract from $50: 50 - 24 = 26.',
    },
    {
      id: 'q-ops-4',
      context: 'Two boxes each hold 8 green marbles and 12 blue marbles, plus 5 loose marbles.',
      expression: '2 × ( 8 + 12 ) + 5',
      tokens: ['2', '×', '(', '8', '+', '12', ')', '+', '5'],
      correctFirstOpIndex: 4,
      stepReduction: '2 × 20 + 5',
      correctAnswer: 45,
      explanation: 'Evaluate grouping symbols first: (8 + 12) = 20. Next evaluate 2 × 20 = 40. Finally, 40 + 5 = 45.',
    },

    // --- 10 NEW QUESTIONS BELOW ---

    // 5. Division priority over addition
    {
      id: 'q-ops-5',
      context: 'A bakery has 12 display muffins, plus 36 fresh muffins shared equally across 4 trays.',
      expression: '12 + 36 ÷ 4',
      tokens: ['12', '+', '36', '÷', '4'],
      correctFirstOpIndex: 3, // '÷'
      stepReduction: '12 + 9',
      correctAnswer: 21,
      explanation: 'Division takes priority over addition! Calculate 36 ÷ 4 = 9 first, then 12 + 9 = 21.',
    },

    // 6. Brackets forcing addition before division
    {
      id: 'q-ops-6',
      context: 'A teacher collects 18 permission notes on Monday and 14 on Tuesday, then divides all notes into 4 equal piles.',
      expression: '( 18 + 14 ) ÷ 4',
      tokens: ['(', '18', '+', '14', ')', '÷', '4'],
      correctFirstOpIndex: 2, // '+'
      stepReduction: '32 ÷ 4',
      correctAnswer: 8,
      explanation: 'Brackets group the notes together first! Calculate (18 + 14) = 32 first, then 32 ÷ 4 = 8.',
    },

    // 7. Multiplication before subtraction
    {
      id: 'q-ops-7',
      context: 'Liam has $100. He buys 3 school shirts at $25 each.',
      expression: '100 - 3 × 25',
      tokens: ['100', '-', '3', '×', '25'],
      correctFirstOpIndex: 3, // '×'
      stepReduction: '100 - 75',
      correctAnswer: 25,
      explanation: 'Find the total shirt cost first: 3 × 25 = 75. Then subtract: 100 - 75 = 25.',
    },

    // 8. Brackets forcing subtraction first (discount pricing)
    {
      id: 'q-ops-8',
      context: 'A book originally costs $20 but has a $5 discount. A library buys 6 copies.',
      expression: '6 × ( 20 - 5 )',
      tokens: ['6', '×', '(', '20', '-', '5', ')'],
      correctFirstOpIndex: 4, // '-'
      stepReduction: '6 × 15',
      correctAnswer: 90,
      explanation: 'Calculate the discounted price inside brackets first: (20 - 5) = 15. Then 6 × 15 = 90.',
    },

    // 9. Two brackets or bracket with division
    {
      id: 'q-ops-9',
      context: 'A chef bakes 60 cookies, removes 12 broken ones, and packs the rest into boxes of 6.',
      expression: '( 60 - 12 ) ÷ 6',
      tokens: ['(', '60', '-', '12', ')', '÷', '6'],
      correctFirstOpIndex: 2, // '-'
      stepReduction: '48 ÷ 6',
      correctAnswer: 8,
      explanation: 'Brackets take precedence: (60 - 12) = 48 cookies left. Then 48 ÷ 6 = 8 boxes.',
    },

    // 10. Multi-term: Multiplication priority within addition chain
    {
      id: 'q-ops-10',
      context: 'A soccer team scores two 1-point goals, plus 3 penalty kicks worth 2 points each, and 1 bonus point.',
      expression: '2 + 3 × 2 + 1',
      tokens: ['2', '+', '3', '×', '2', '+', '1'],
      correctFirstOpIndex: 3, // '×'
      stepReduction: '2 + 6 + 1',
      correctAnswer: 9,
      explanation: 'Multiplication has precedence over addition! Evaluate 3 × 2 = 6 first, then 2 + 6 + 1 = 9.',
    },

    // 11. Division before subtraction
    {
      id: 'q-ops-11',
      context: 'A ribbon is 40 cm long. A seamstress cuts off a piece made by sharing 30 cm into 5 parts.',
      expression: '40 - 30 ÷ 5',
      tokens: ['40', '-', '30', '÷', '5'],
      correctFirstOpIndex: 3, // '÷'
      stepReduction: '40 - 6',
      correctAnswer: 34,
      explanation: 'Divide before subtracting! 30 ÷ 5 = 6. Then 40 - 6 = 34.',
    },

    // 12. Brackets followed by addition
    {
      id: 'q-ops-12',
      context: 'Four friends split a $40 bill equally, and each person adds $3 for tip.',
      expression: '( 40 ÷ 4 ) + 3',
      tokens: ['(', '40', '÷', '4', ')', '+', '3'],
      correctFirstOpIndex: 2, // '÷'
      stepReduction: '10 + 3',
      correctAnswer: 13,
      explanation: 'Evaluate the bracket first: (40 ÷ 4) = 10. Then add tip: 10 + 3 = 13.',
    },

    // 13. Mixed operations with a bracket multiplier
    {
      id: 'q-ops-13',
      context: 'A fundraiser sells 5 family packs. Each family pack contains 6 raffle tickets and 4 wristbands.',
      expression: '5 × ( 6 + 4 )',
      tokens: ['5', '×', '(', '6', '+', '4', ')'],
      correctFirstOpIndex: 4, // '+'
      stepReduction: '5 × 10',
      correctAnswer: 50,
      explanation: 'Add the items in each pack first: (6 + 4) = 10. Then 5 × 10 = 50 items in total.',
    },

    // 14. Nested calculation: brackets with external subtraction
    {
      id: 'q-ops-14',
      context: 'There are 80 seats on a bus. Two classes of 25 students each take their seats.',
      expression: '80 - ( 2 × 25 )',
      tokens: ['80', '-', '(', '2', '×', '25', ')'],
      correctFirstOpIndex: 4, // '×'
      stepReduction: '80 - 50',
      correctAnswer: 30,
      explanation: 'Group the total students inside brackets first: (2 × 25) = 50. Then subtract from 80 seats: 80 - 50 = 30.',
    },
  ],
},
// STAGE 3: AREA OF COMPOSITE FIGURES, PARALLELOGRAMS & TRIANGLES
'MA3-GM-02': {
  outcomeCode: 'MA3-GM-02',
  stage: 'stage-3',
  strand: 'Measurement and space',
  focusArea: 'Geometric measure B (Area)',
  title: 'Area: Composite L-Shapes, Parallelograms & Triangles',
  manipulativeType: 'area-decomposition',
  questions: [
    // ==========================================
    // SECTION 1: L-SHAPE COMPOSITE FIGURES (Q1 - Q10)
    // ==========================================
    {
      id: 'area-1',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: 8m by 6m block',
      prompt: 'Find the area of an L-shape with total width 8 m, total height 6 m, with an inner cutout of 4 m wide by 3 m high.',
      dimensions: { totalWidth: 8, totalHeight: 6, cutWidth: 4, cutHeight: 3 },
      correctArea: 36,
      decompositionStrategy: 'Vertical split: (4 × 6) + (4 × 3) = 24 + 12 = 36 m², or Subtraction: (8 × 6) - (4 × 3) = 48 - 12 = 36 m².',
      hint: 'Split the shape into two rectangles, or find the area of the full bounding rectangle (8 × 6 = 48) and subtract the empty cutout space (4 × 3 = 12).',
    },
    {
      id: 'area-2',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: 10cm by 7cm floor',
      prompt: 'An L-shaped tile has base 10 cm, height 7 cm, and a top-right corner cut out measuring 6 cm wide by 4 cm high.',
      dimensions: { totalWidth: 10, totalHeight: 7, cutWidth: 6, cutHeight: 4 },
      correctArea: 46,
      decompositionStrategy: 'Horizontal split: (10 × 3) + (4 × 4) = 30 + 16 = 46 cm², or (10 × 7) - (6 × 4) = 70 - 24 = 46 cm².',
      hint: 'Bounding rectangle: 10 × 7 = 70 cm². Empty cut-out corner: 6 × 4 = 24 cm². 70 - 24 = 46 cm².',
    },
    {
      id: 'area-3',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: Garden Bed',
      prompt: 'Find the area of an L-shaped patio with total width 12 m, total height 9 m, and a cutout corner of 7 m by 5 m.',
      dimensions: { totalWidth: 12, totalHeight: 9, cutWidth: 7, cutHeight: 5 },
      correctArea: 73,
      decompositionStrategy: 'Bounding rectangle subtraction: (12 × 9) - (7 × 5) = 108 - 35 = 73 m².',
      hint: 'Total area = Outer box (12 × 9 = 108) minus Missing corner (7 × 5 = 35).',
    },
    {
      id: 'area-4',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: Classroom Desk',
      prompt: 'An L-desk has length 90 cm, height 80 cm, and an inner corner cutout of 50 cm wide by 50 cm deep.',
      dimensions: { totalWidth: 90, totalHeight: 80, cutWidth: 50, cutHeight: 50 },
      correctArea: 4700,
      decompositionStrategy: 'Outer box (90 × 80 = 7200) - Cutout (50 × 50 = 2500) = 4700 cm².',
      hint: 'Subtract the cutout: 7200 cm² - 2500 cm² = 4700 cm².',
    },
    {
      id: 'area-5',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: Play Mat',
      prompt: 'Find the area of an L-shaped mat: 6 m wide, 5 m high, with a 3 m by 2 m corner section removed.',
      dimensions: { totalWidth: 6, totalHeight: 5, cutWidth: 3, cutHeight: 2 },
      correctArea: 24,
      decompositionStrategy: 'Vertical split: (3 × 5) + (3 × 3) = 15 + 9 = 24 m², or (6 × 5) - (3 × 2) = 30 - 6 = 24 m².',
      hint: 'Full rectangle = 6 × 5 = 30 m². Subtract the missing 3 × 2 = 6 m².',
    },
    {
      id: 'area-6',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: Decking',
      prompt: 'A timber deck is 11 m wide, 8 m deep, with a garden cutout of 6 m by 4 m.',
      dimensions: { totalWidth: 11, totalHeight: 8, cutWidth: 6, cutHeight: 4 },
      correctArea: 64,
      decompositionStrategy: '(11 × 8) - (6 × 4) = 88 - 24 = 64 m².',
      hint: 'Whole rectangle: 11 × 8 = 88 m². Cutout: 6 × 4 = 24 m². 88 - 24 = 64 m².',
    },
    {
      id: 'area-7',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: Steel Plate',
      prompt: 'An L-shaped steel bracket has total width 15 cm, height 12 cm, with an 8 cm by 7 cm corner removed.',
      dimensions: { totalWidth: 15, totalHeight: 12, cutWidth: 8, cutHeight: 7 },
      correctArea: 124,
      decompositionStrategy: '(15 × 12) - (8 × 7) = 180 - 56 = 124 cm².',
      hint: 'Outer area: 15 × 12 = 180 cm². Cutout: 8 × 7 = 56 cm². 180 - 56 = 124 cm².',
    },
    {
      id: 'area-8',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: School Courtyard',
      prompt: 'A courtyard has length 20 m, width 14 m, and a garden corner of 12 m by 8 m.',
      dimensions: { totalWidth: 20, totalHeight: 14, cutWidth: 12, cutHeight: 8 },
      correctArea: 184,
      decompositionStrategy: '(20 × 14) - (12 × 8) = 280 - 96 = 184 m².',
      hint: 'Bounding rectangle: 20 × 14 = 280 m². Cutout: 12 × 8 = 96 m². 280 - 96 = 184 m².',
    },
    {
      id: 'area-9',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: Kitchen Counter',
      prompt: 'An L-shaped kitchen stone bench is 7 m by 4 m with a 4 m by 2 m cutout.',
      dimensions: { totalWidth: 7, totalHeight: 4, cutWidth: 4, cutHeight: 2 },
      correctArea: 20,
      decompositionStrategy: '(7 × 4) - (4 × 2) = 28 - 8 = 20 m².',
      hint: 'Outer bounding box: 7 × 4 = 28 m². Cutout: 4 × 2 = 8 m². 28 - 8 = 20 m².',
    },
    {
      id: 'area-10',
      shapeType: 'l-shape',
      title: 'Composite L-Shape: Paving Stones',
      prompt: 'Find the area of an L-shape with total dimensions 16 m by 10 m and an 11 m by 6 m corner cutout.',
      dimensions: { totalWidth: 16, totalHeight: 10, cutWidth: 11, cutHeight: 6 },
      correctArea: 94,
      decompositionStrategy: '(16 × 10) - (11 × 6) = 160 - 66 = 94 m².',
      hint: '16 × 10 = 160 m². Cutout: 11 × 6 = 66 m². 160 - 66 = 94 m².',
    },

    // ==========================================
    // SECTION 2: PARALLELOGRAMS VIA DISSECTION (Q11 - Q20)
    // ==========================================
    {
      id: 'area-11',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: 8cm base',
      prompt: 'A parallelogram has base 8 cm, perpendicular height 5 cm, and slant side 6 cm. Find its area.',
      dimensions: { base: 8, height: 5, slant: 6 },
      correctArea: 40,
      decompositionStrategy: 'Dissect the end triangle and translate it to the other side to form a rectangle of 8 cm by 5 cm: Area = b × h = 8 × 5 = 40 cm².',
      hint: 'Always use perpendicular height (5 cm), NOT the slant height! Area = base × perpendicular height = 8 × 5.',
    },
    {
      id: 'area-12',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: 12m base',
      prompt: 'A parallelogram-shaped lawn has base 12 m and perpendicular height 7 m (slant side 9 m). Find its area.',
      dimensions: { base: 12, height: 7, slant: 9 },
      correctArea: 84,
      decompositionStrategy: 'Transform into a rectangle with dimensions 12 m by 7 m: Area = 12 × 7 = 84 m².',
      hint: 'Ignore the slant length! Area = base × perpendicular height = 12 × 7 = 84 m².',
    },
    {
      id: 'area-13',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: 6m base',
      prompt: 'A fabric design is a parallelogram with base 6 m and perpendicular height 9 m. What is its area?',
      dimensions: { base: 6, height: 9, slant: 10 },
      correctArea: 54,
      decompositionStrategy: 'Cut off the triangular end and shift to complete a 6 × 9 rectangle: 6 × 9 = 54 m².',
      hint: 'Area = base × perpendicular height = 6 × 9 = 54 m².',
    },
    {
      id: 'area-14',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: 15cm base',
      prompt: 'Find the area of a parallelogram with base 15 cm, perpendicular height 4 cm, and slant 5 cm.',
      dimensions: { base: 15, height: 4, slant: 5 },
      correctArea: 60,
      decompositionStrategy: 'Dissect and rearrange into a 15 cm by 4 cm rectangle: 15 × 4 = 60 cm².',
      hint: 'Perpendicular height is 4 cm. Area = 15 × 4 = 60 cm².',
    },
    {
      id: 'area-15',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: Solar Panel',
      prompt: 'A slanted solar panel is a parallelogram: base 10 m and perpendicular height 8 m. Find its area.',
      dimensions: { base: 10, height: 8, slant: 11 },
      correctArea: 80,
      decompositionStrategy: 'Base × perpendicular height = 10 × 8 = 80 m².',
      hint: 'Area = b × h = 10 × 8 = 80 m².',
    },
    {
      id: 'area-16',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: Paver',
      prompt: 'A driveway paver is shaped like a parallelogram: base 14 cm and perpendicular height 6 cm. Find the area.',
      dimensions: { base: 14, height: 6, slant: 8 },
      correctArea: 84,
      decompositionStrategy: 'Base × perpendicular height = 14 × 6 = 84 cm².',
      hint: 'Multiply the base by the perpendicular height: 14 × 6 = 84 cm².',
    },
    {
      id: 'area-17',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: Kite Tail Flag',
      prompt: 'A flag has base 20 cm, perpendicular height 11 cm, and slant 13 cm. What is its area?',
      dimensions: { base: 20, height: 11, slant: 13 },
      correctArea: 220,
      decompositionStrategy: 'Dissect triangle to form a 20 × 11 rectangle: 20 × 11 = 220 cm².',
      hint: 'Base × perpendicular height = 20 × 11 = 220 cm².',
    },
    {
      id: 'area-18',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: Bridge Span',
      prompt: 'A bridge support is a parallelogram with base 9 m and perpendicular height 12 m. What is its area?',
      dimensions: { base: 9, height: 12, slant: 14 },
      correctArea: 108,
      decompositionStrategy: 'Base × perpendicular height = 9 × 12 = 108 m².',
      hint: 'Area = 9 × 12 = 108 m².',
    },
    {
      id: 'area-19',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: Grazing Paddock',
      prompt: 'A grazing paddock has base 25 m and perpendicular height 8 m (slant 10 m). Calculate its area.',
      dimensions: { base: 25, height: 8, slant: 10 },
      correctArea: 200,
      decompositionStrategy: 'Base × perpendicular height = 25 × 8 = 200 m².',
      hint: 'Area = 25 × 8 = 200 m².',
    },
    {
      id: 'area-20',
      shapeType: 'parallelogram',
      title: 'Parallelogram Dissection: Concrete Slab',
      prompt: 'A concrete slab has base 18 m and perpendicular height 5 m. Find its area.',
      dimensions: { base: 18, height: 5, slant: 7 },
      correctArea: 90,
      decompositionStrategy: 'Base × perpendicular height = 18 × 5 = 90 m².',
      hint: 'Area = 18 × 5 = 90 m².',
    },

    // ==========================================
    // SECTION 3: TRIANGLES VIA DUPLICATION & ROTATION (Q21 - Q30)
    // ==========================================
    {
      id: 'area-21',
      shapeType: 'triangle',
      title: 'Triangle Area: 10cm base by 6cm height',
      prompt: 'A triangle has base 10 cm and perpendicular height 6 cm. Find its area by comparing to a duplicated parallelogram.',
      dimensions: { base: 10, height: 6, slant: 7 },
      correctArea: 30,
      decompositionStrategy: 'Duplicating and rotating the triangle forms a parallelogram of 10 × 6 = 60 cm². The triangle is half: 60 ÷ 2 = 30 cm².',
      hint: 'A triangle is exactly HALF of a parallelogram with the same base and height: (base × height) ÷ 2 = (10 × 6) ÷ 2 = 30 cm².',
    },
    {
      id: 'area-22',
      shapeType: 'triangle',
      title: 'Triangle Area: Sailboat Sail',
      prompt: 'A sail is a triangle with base 8 m, perpendicular height 12 m, and slant side 13 m. Find its area.',
      dimensions: { base: 8, height: 12, slant: 13 },
      correctArea: 48,
      decompositionStrategy: 'Full parallelogram: 8 × 12 = 96 m². Triangle: 96 ÷ 2 = 48 m².',
      hint: 'Area = (b × h) ÷ 2 = (8 × 12) ÷ 2 = 96 ÷ 2 = 48 m².',
    },
    {
      id: 'area-23',
      shapeType: 'triangle',
      title: 'Triangle Area: Roof Gable',
      prompt: 'A house gable is a triangle with base 14 m and height 5 m. Find its area.',
      dimensions: { base: 14, height: 5, slant: 8 },
      correctArea: 35,
      decompositionStrategy: '(14 × 5) ÷ 2 = 70 ÷ 2 = 35 m².',
      hint: 'Multiply base by perpendicular height, then divide by 2: (14 × 5) ÷ 2 = 35 m².',
    },
    {
      id: 'area-24',
      shapeType: 'triangle',
      title: 'Triangle Area: Warning Sign',
      prompt: 'A triangular road sign has base 60 cm and perpendicular height 50 cm. Find its area.',
      dimensions: { base: 60, height: 50, slant: 65 },
      correctArea: 1500,
      decompositionStrategy: '(60 × 50) ÷ 2 = 3000 ÷ 2 = 1500 cm².',
      hint: '(base × height) ÷ 2 = (60 × 50) ÷ 2 = 1500 cm².',
    },
    {
      id: 'area-25',
      shapeType: 'triangle',
      title: 'Triangle Area: Garden Bed',
      prompt: 'A corner flowerbed is a triangle with base 9 m and perpendicular height 4 m. What is its area?',
      dimensions: { base: 9, height: 4, slant: 6 },
      correctArea: 18,
      decompositionStrategy: '(9 × 4) ÷ 2 = 36 ÷ 2 = 18 m².',
      hint: '(9 × 4) ÷ 2 = 18 m².',
    },
    {
      id: 'area-26',
      shapeType: 'triangle',
      title: 'Triangle Area: Pennant Banner',
      prompt: 'A school sports pennant has base 16 cm and height 10 cm. Find its area.',
      dimensions: { base: 16, height: 10, slant: 12 },
      correctArea: 80,
      decompositionStrategy: '(16 × 10) ÷ 2 = 160 ÷ 2 = 80 cm².',
      hint: 'Area is half the bounding rectangle: (16 × 10) ÷ 2 = 80 cm².',
    },
    {
      id: 'area-27',
      shapeType: 'triangle',
      title: 'Triangle Area: Ramped Wedge',
      prompt: 'A ramp side profile is a triangle with base 12 m and height 7 m. Find its area.',
      dimensions: { base: 12, height: 7, slant: 14 },
      correctArea: 42,
      decompositionStrategy: '(12 × 7) ÷ 2 = 84 ÷ 2 = 42 m².',
      hint: 'Multiply base by height, then halve: (12 × 7) ÷ 2 = 84 ÷ 2 = 42 m².',
    },
    {
      id: 'area-28',
      shapeType: 'triangle',
      title: 'Triangle Area: Pizza Slice',
      prompt: 'A giant novelty pizza slice has base 22 cm and height 14 cm. What is its area?',
      dimensions: { base: 22, height: 14, slant: 18 },
      correctArea: 154,
      decompositionStrategy: '(22 × 14) ÷ 2 = 308 ÷ 2 = 154 cm².',
      hint: '(22 × 14) ÷ 2 = 154 cm².',
    },
    {
      id: 'area-29',
      shapeType: 'triangle',
      title: 'Triangle Area: Kite Wing',
      prompt: 'A kite wing triangle has base 15 m and height 8 m. Calculate its area.',
      dimensions: { base: 15, height: 8, slant: 10 },
      correctArea: 60,
      decompositionStrategy: '(15 × 8) ÷ 2 = 120 ÷ 2 = 60 m².',
      hint: '(15 × 8) ÷ 2 = 60 m².',
    },
    {
      id: 'area-30',
      shapeType: 'triangle',
      title: 'Triangle Area: Flag Ingot',
      prompt: 'A triangular metal badge has base 18 cm and perpendicular height 11 cm. Find its area.',
      dimensions: { base: 18, height: 11, slant: 14 },
      correctArea: 99,
      decompositionStrategy: '(18 × 11) ÷ 2 = 198 ÷ 2 = 99 cm².',
      hint: '(18 × 11) ÷ 2 = 99 cm².',
    },
  ],
},
// STAGE 3: CHANCE - OBSERVED VS EXPECTED FREQUENCIES
'MA3-CHAN-01': {
  outcomeCode: 'MA3-CHAN-01',
  stage: 'stage-3',
  strand: 'Statistics and probability',
  focusArea: 'Chance B (Frequencies and probabilities)',
  title: 'Chance: Observed vs Expected Frequencies & Fairness',
  manipulativeType: 'chance-frequency',
  questions: [
    // --- PART 1: TERMINOLOGY (FREQUENCY VS PROBABILITY) ---
    {
      id: 'cf-1',
      category: 'terminology',
      title: 'Frequency vs Probability',
      scenario: 'A student flips a standard 2-sided Australian coin 50 times and records 28 Heads.',
      experimentDetails: {
        device: 'coin',
        trials: 50,
        targetOutcome: 'Heads',
        probabilityStr: '1/2 (or 50%)',
        expectedFrequency: 25,
        sampleObservedFrequency: 28,
      },
      prompt: 'What is the OBSERVED FREQUENCY of Heads in this experiment?',
      correctAnswer: 28,
      answerType: 'number',
      explanation: 'Frequency refers to the actual count of times an outcome occurs in a trial. Heads occurred 28 times.',
    },
    {
      id: 'cf-2',
      category: 'terminology',
      title: 'Identifying Probability',
      scenario: 'A standard six-sided die is rolled 60 times. A student rolls a 4 twelve times.',
      experimentDetails: {
        device: 'dice',
        trials: 60,
        targetOutcome: 'Rolling a 4',
        probabilityStr: '1/6',
        expectedFrequency: 10,
        sampleObservedFrequency: 12,
      },
      prompt: 'What is the theoretical PROBABILITY of rolling a 4 on any single roll?',
      correctAnswer: '1/6',
      answerType: 'multiple-choice',
      options: ['12', '12/60', '1/6', '10'],
      explanation: 'Probability is the theoretical likelihood of an outcome before the experiment happens (1 out of 6 faces = 1/6), whereas 12 is the observed frequency.',
    },
    {
      id: 'cf-3',
      category: 'terminology',
      title: 'Frequency Definition',
      scenario: 'A bag contains 3 red marbles and 7 blue marbles. Jack draws a marble 20 times with replacement and gets blue 13 times.',
      experimentDetails: {
        device: 'bag',
        trials: 20,
        targetOutcome: 'Blue marble',
        probabilityStr: '7/10',
        expectedFrequency: 14,
        sampleObservedFrequency: 13,
      },
      prompt: 'Which statement correctly distinguishes the frequency from the probability?',
      correctAnswer: 'Frequency is 13; Probability is 7/10',
      answerType: 'multiple-choice',
      options: [
        'Frequency is 13; Probability is 7/10',
        'Frequency is 7/10; Probability is 13',
        'Frequency and Probability are both 13',
        'Frequency is 14; Probability is 13/20',
      ],
      explanation: 'The observed frequency is the count of occurrences (13). The theoretical probability is 7 in 10 or 7/10.',
    },

    // --- PART 2: CALCULATING EXPECTED FREQUENCY (EQUALLY LIKELY) ---
    {
      id: 'cf-4',
      category: 'expected-calc',
      title: 'Expected Tails in Coin Tosses',
      scenario: 'You flip a fair coin 80 times.',
      experimentDetails: {
        device: 'coin',
        trials: 80,
        targetOutcome: 'Tails',
        probabilityStr: '1/2',
        expectedFrequency: 40,
        sampleObservedFrequency: 43,
      },
      prompt: 'How many times would you EXPECT Tails to occur theoretically?',
      correctAnswer: 40,
      answerType: 'number',
      explanation: 'Expected frequency = Probability × Trials = 1/2 × 80 = 40 times.',
    },
    {
      id: 'cf-5',
      category: 'expected-calc',
      title: 'Expected Frequency on a Die',
      scenario: 'A fair standard 6-sided die is rolled 120 times.',
      experimentDetails: {
        device: 'dice',
        trials: 120,
        targetOutcome: 'Number 5',
        probabilityStr: '1/6',
        expectedFrequency: 20,
        sampleObservedFrequency: 19,
      },
      prompt: 'Calculate the expected frequency of rolling a 5 in 120 rolls.',
      correctAnswer: 20,
      answerType: 'number',
      explanation: 'Expected frequency = 1/6 × 120 = 20 times.',
    },
    {
      id: 'cf-6',
      category: 'expected-calc',
      title: 'Expected Even Numbers on a Die',
      scenario: 'A fair 6-sided die is rolled 90 times.',
      experimentDetails: {
        device: 'dice',
        trials: 90,
        targetOutcome: 'Even number (2, 4, 6)',
        probabilityStr: '3/6 = 1/2',
        expectedFrequency: 45,
        sampleObservedFrequency: 47,
      },
      prompt: 'What is the expected frequency of rolling an EVEN number in 90 rolls?',
      correctAnswer: 45,
      answerType: 'number',
      explanation: 'Even numbers make up 3 of the 6 faces (1/2). Expected frequency = 1/2 × 90 = 45.',
    },
    {
      id: 'cf-7',
      category: 'expected-calc',
      title: 'Equal 4-Colour Spinner',
      scenario: 'A spinner has 4 equal sections: Red, Blue, Green, and Yellow. It is spun 100 times.',
      experimentDetails: {
        device: 'spinner',
        trials: 100,
        targetOutcome: 'Yellow',
        probabilityStr: '1/4',
        expectedFrequency: 25,
        sampleObservedFrequency: 22,
      },
      prompt: 'What is the expected frequency of landing on Yellow?',
      correctAnswer: 25,
      answerType: 'number',
      explanation: 'With 4 equal sectors, P(Yellow) = 1/4. Expected frequency = 1/4 × 100 = 25.',
    },

    // --- PART 3: CALCULATING EXPECTED FREQUENCY (UNEQUALLY LIKELY) ---
    {
      id: 'cf-8',
      category: 'expected-calc',
      title: 'Unequal Spinner: Half Green',
      scenario: 'A spinner has 4 sections: Green takes up 1/2 of the circle, while Red, Blue, and Yellow each take up 1/6. It is spun 60 times.',
      experimentDetails: {
        device: 'spinner',
        trials: 60,
        targetOutcome: 'Green',
        probabilityStr: '1/2',
        expectedFrequency: 30,
        sampleObservedFrequency: 33,
      },
      prompt: 'How many times do you expect Green to appear in 60 spins?',
      correctAnswer: 30,
      answerType: 'number',
      explanation: 'Green takes up 1/2 of the spinner: 1/2 × 60 = 30 spins.',
    },
    {
      id: 'cf-9',
      category: 'expected-calc',
      title: 'Unequal Spinner: Small Sector',
      scenario: 'On the same spinner (Green 1/2, Red 1/6, Blue 1/6, Yellow 1/6), you spin 60 times.',
      experimentDetails: {
        device: 'spinner',
        trials: 60,
        targetOutcome: 'Red',
        probabilityStr: '1/6',
        expectedFrequency: 10,
        sampleObservedFrequency: 9,
      },
      prompt: 'How many times do you expect RED to appear in 60 spins?',
      correctAnswer: 10,
      answerType: 'number',
      explanation: 'Red occupies 1/6 of the area. Expected frequency = 1/6 × 60 = 10.',
    },
    {
      id: 'cf-10',
      category: 'expected-calc',
      title: 'Bag of Unequal Counters',
      scenario: 'A bag contains 1 gold counter and 4 silver counters (5 total). You draw and replace 50 times.',
      experimentDetails: {
        device: 'bag',
        trials: 50,
        targetOutcome: 'Gold counter',
        probabilityStr: '1/5',
        expectedFrequency: 10,
        sampleObservedFrequency: 8,
      },
      prompt: 'What is the expected frequency of drawing the Gold counter in 50 draws?',
      correctAnswer: 10,
      answerType: 'number',
      explanation: 'P(Gold) = 1/5. Expected frequency = 1/5 × 50 = 10.',
    },
    {
      id: 'cf-11',
      category: 'expected-calc',
      title: 'Majority Bag Outcome',
      scenario: 'In the same bag of 1 gold and 4 silver counters (5 total), you draw and replace 50 times.',
      experimentDetails: {
        device: 'bag',
        trials: 50,
        targetOutcome: 'Silver counter',
        probabilityStr: '4/5',
        expectedFrequency: 40,
        sampleObservedFrequency: 42,
      },
      prompt: 'What is the expected frequency of drawing a SILVER counter?',
      correctAnswer: 40,
      answerType: 'number',
      explanation: 'P(Silver) = 4/5. Expected frequency = 4/5 × 50 = 40.',
    },
    {
      id: 'cf-12',
      category: 'expected-calc',
      title: '3-in-10 Weather Chance',
      scenario: 'A forecaster states the chance of afternoon rain each day this spring is 3/10. Consider a 30-day month.',
      experimentDetails: {
        device: 'spinner',
        trials: 30,
        targetOutcome: 'Rainy days',
        probabilityStr: '3/10',
        expectedFrequency: 9,
        sampleObservedFrequency: 11,
      },
      prompt: 'What is the expected frequency of rainy days across the 30 days?',
      correctAnswer: 9,
      answerType: 'number',
      explanation: 'Expected frequency = 3/10 × 30 = 9 days.',
    },

    // --- PART 4: COMPARING OBSERVED VS EXPECTED & RANDOMNESS ---
    {
      id: 'cf-13',
      category: 'observed-vs-expected',
      title: 'Why Do Observed and Expected Differ?',
      scenario: 'Emma flips a fair coin 20 times. Expected Heads = 10. Actual observed Heads = 13.',
      experimentDetails: {
        device: 'coin',
        trials: 20,
        targetOutcome: 'Heads',
        probabilityStr: '1/2',
        expectedFrequency: 10,
        sampleObservedFrequency: 13,
      },
      prompt: 'Why does Emma have 13 Heads instead of the expected 10?',
      correctAnswer: 'Random variation means small samples rarely match theoretical expectations exactly',
      answerType: 'multiple-choice',
      options: [
        'Random variation means small samples rarely match theoretical expectations exactly',
        'The coin must be weighted and unfair',
        'Emma performed the calculation incorrectly',
        'Heads is naturally heavier than Tails',
      ],
      explanation: 'Chance experiments involve randomness. In short trials, natural fluctuation causes observed results to vary around the expected frequency without the coin being unfair.',
    },
    {
      id: 'cf-14',
      category: 'observed-vs-expected',
      title: 'Sample Size & The Law of Large Numbers',
      scenario: 'Class 5M rolled a die 30 times and got 25% sixes (expected: 16.7%). They then pooled results across the whole school for 3,000 rolls and got 16.9% sixes.',
      experimentDetails: {
        device: 'dice',
        trials: 3000,
        targetOutcome: 'Rolling a 6',
        probabilityStr: '1/6 (16.7%)',
        expectedFrequency: 500,
        sampleObservedFrequency: 507,
      },
      prompt: 'What happens to the observed frequency relative to expected results as the number of trials increases?',
      correctAnswer: 'The observed percentage gets closer and closer to the theoretical probability',
      answerType: 'multiple-choice',
      options: [
        'The observed percentage gets closer and closer to the theoretical probability',
        'The observed results become completely unpredictable',
        'The difference between observed and expected gets much further away',
        'The die stops landing on sixes to balance it out',
      ],
      explanation: 'As the number of trials increases, short-term random variations average out, and the relative frequency converges toward theoretical probability.',
    },
    {
      id: 'cf-15',
      category: 'observed-vs-expected',
      title: 'The Gambler\'s Fallacy: Memory in Randomness',
      scenario: 'Lucas flips a fair coin 5 times and gets Tails every single time (T, T, T, T, T).',
      experimentDetails: {
        device: 'coin',
        trials: 6,
        targetOutcome: 'Toss 6: Heads',
        probabilityStr: '1/2',
        expectedFrequency: 1,
        sampleObservedFrequency: 0,
      },
      prompt: 'What is the probability that the 6th flip lands on Heads?',
      correctAnswer: '1/2',
      answerType: 'multiple-choice',
      options: ['1/2', 'More than 1/2 because Heads is "due"', 'Less than 1/2 because Tails is on a roll', '100%'],
      explanation: 'Coins have no memory. Each flip is an independent random event with probability exactly 1/2, regardless of previous streaks.',
    },
    {
      id: 'cf-16',
      category: 'observed-vs-expected',
      title: 'Detecting an Unfair Die',
      scenario: 'A die is rolled 600 times. Expected frequency for each face is 100. The observed frequencies are: [1: 98, 2: 104, 3: 96, 4: 102, 5: 395, 6: 5].',
      experimentDetails: {
        device: 'dice',
        trials: 600,
        targetOutcome: 'Number 5',
        probabilityStr: '1/6',
        expectedFrequency: 100,
        sampleObservedFrequency: 395,
      },
      prompt: 'Based on these frequencies over 600 trials, is this die likely to be fair?',
      correctAnswer: 'No, 395 fives out of 600 is too extreme to be explained by chance',
      answerType: 'multiple-choice',
      options: [
        'No, 395 fives out of 600 is too extreme to be explained by chance',
        'Yes, any outcome can happen in a chance experiment',
        'Yes, because all numbers appeared at least once',
        'It is impossible to tell without 10,000 rolls',
      ],
      explanation: 'While minor variation is normal, rolling nearly 400 fives out of 600 (when only 100 are expected) is statistically near-impossible on a balanced die. The die is biased.',
    },

    // --- PART 5: FAIRNESS OF SIMPLE GAMES ---
    {
      id: 'cf-17',
      category: 'fairness-randomness',
      title: 'Fair Game: Dice Sum Rules',
      scenario: 'Player A scores a point if the sum of two standard dice is ODD. Player B scores a point if the sum is EVEN.',
      experimentDetails: {
        device: 'dice',
        trials: 36,
        targetOutcome: 'Odd sum',
        probabilityStr: '18/36 = 1/2',
        expectedFrequency: 18,
        sampleObservedFrequency: 18,
      },
      prompt: 'Is this game fair to both players?',
      correctAnswer: 'Yes, because both players have an equal 18/36 (50%) chance of scoring',
      answerType: 'multiple-choice',
      options: [
        'Yes, because both players have an equal 18/36 (50%) chance of scoring',
        'No, because there are more even sums than odd sums',
        'No, because rolling double six gives player B an unfair boost',
        'Only fair if Player A rolls first',
      ],
      explanation: 'There are 36 possible outcomes when rolling two dice: 18 result in an even sum and 18 result in an odd sum. Since both players have an equal chance of winning, the game is fair.',
    },
    {
      id: 'cf-18',
      category: 'fairness-randomness',
      title: 'Unfair Game: Two Coins Match vs Difference',
      scenario: 'Two coins are flipped. Player 1 wins if both coins land the same (HH or TT). Player 2 wins if one is Heads and one is Tails (HT or TH).',
      experimentDetails: {
        device: 'coin',
        trials: 40,
        targetOutcome: 'Same (HH or TT)',
        probabilityStr: '2/4 = 1/2',
        expectedFrequency: 20,
        sampleObservedFrequency: 19,
      },
      prompt: 'Is this game fair?',
      correctAnswer: 'Yes, because both winning conditions have a 2/4 (50%) chance',
      answerType: 'multiple-choice',
      options: [
        'Yes, because both winning conditions have a 2/4 (50%) chance',
        'No, Player 1 has an advantage because HH is easier to roll',
        'No, Player 2 has 2 combinations while Player 1 only has 1',
        'Only fair if they flip 100 times',
      ],
      explanation: 'Sample space = {HH, HT, TH, TT}. Player 1 wins on 2 outcomes (HH, TT); Player 2 wins on 2 outcomes (HT, TH). The chances are identical (2/4 each), so it is fair.',
    },
    {
      id: 'cf-19',
      category: 'fairness-randomness',
      title: 'Unfair Spinner Game',
      scenario: 'A spinner has 3 sections: Red (1/2), Blue (1/4), Green (1/4). Amy wins on Red. Ben wins on Blue. Chloe wins on Green.',
      experimentDetails: {
        device: 'spinner',
        trials: 40,
        targetOutcome: 'Red win',
        probabilityStr: '1/2',
        expectedFrequency: 20,
        sampleObservedFrequency: 21,
      },
      prompt: 'Why is this game UNFAIR?',
      correctAnswer: 'Amy has a 50% chance of winning while Ben and Chloe only have 25% each',
      answerType: 'multiple-choice',
      options: [
        'Amy has a 50% chance of winning while Ben and Chloe only have 25% each',
        'The spinner has too many colours',
        'Because 40 spins is not divisible by 3 players',
        'It is fair because all 3 players have colours',
      ],
      explanation: 'For a game to be fair, each player must have an equal chance of winning. Amy occupies half the spinner, giving her double the chance of the other two players.',
    },
    {
      id: 'cf-20',
      category: 'fairness-randomness',
      title: 'Difference in Observed Frequencies in 10 Spins',
      scenario: 'Mia spins the fair 4-colour spinner (Red, Blue, Green, Yellow) 10 times. The expected frequency for each is 2.5. She gets: Red 4, Blue 3, Green 3, Yellow 0.',
      experimentDetails: {
        device: 'spinner',
        trials: 10,
        targetOutcome: 'Yellow (0 observed)',
        probabilityStr: '1/4',
        expectedFrequency: 2.5,
        sampleObservedFrequency: 0,
      },
      prompt: 'What is the best scientific and mathematical explanation for Yellow appearing 0 times?',
      correctAnswer: 'In a small sample of 10 spins, random chance will naturally cause some outcomes to appear more or less than expected',
      answerType: 'multiple-choice',
      options: [
        'In a small sample of 10 spins, random chance will naturally cause some outcomes to appear more or less than expected',
        'The spinner is broken and unable to stop on Yellow',
        'Yellow will definitely appear on the 11th spin',
        'Expected frequency cannot be a decimal so the experiment is invalid',
      ],
      explanation: 'Expected frequency (2.5) is a theoretical average. With only 10 trials, randomness frequently leads to zero counts or multiple counts for any given sector.',
    },
  ],
},
// STAGE 3: FRACTION, DECIMAL & PERCENTAGE EQUIVALENCE
'MA3-RN-03': {
  outcomeCode: 'MA3-RN-03',
  stage: 'stage-3',
  strand: 'Number and algebra',
  focusArea: 'Represents numbers B (Fractions, decimals & percentages)',
  title: 'Equivalence Strips: Fractions, Decimals & Percentages',
  manipulativeType: 'fraction-bar',
  questions: [
    // 1. Benchmark Eighth: 1/8
    {
      id: 'eq-1',
      fraction: '1/8',
      decimal: 0.125,
      percentage: 12.5,
      targetRepresentation: 'decimal',
      context: 'A cake is cut into 8 equal slices. One slice represents 1/8 of the cake.',
      hint: '1/4 is 0.25 (or 250 thousandths). Halving 0.25 gives 0.125 (or 12.5%).',
    },
    // 2. Benchmark Eighth: 3/8
    {
      id: 'eq-2',
      fraction: '3/8',
      decimal: 0.375,
      percentage: 37.5,
      targetRepresentation: 'percentage',
      context: 'A survey found that 3 out of every 8 students walk to school.',
      hint: 'Each eighth is 12.5%. Multiply 12.5% × 3 = 37.5% (or 0.375).',
    },
    // 3. Benchmark Eighth: 5/8
    {
      id: 'eq-3',
      fraction: '5/8',
      decimal: 0.625,
      percentage: 62.5,
      targetRepresentation: 'decimal',
      context: 'A rainwater tank is filled to 5/8 of its total capacity.',
      hint: '4/8 is one half (0.500). Add one more eighth (0.125): 0.500 + 0.125 = 0.625.',
    },
    // 4. Benchmark Eighth: 7/8
    {
      id: 'eq-4',
      fraction: '7/8',
      decimal: 0.875,
      percentage: 87.5,
      targetRepresentation: 'percentage',
      context: 'A runner completes 7/8 of a marathon distance before taking an energy gel.',
      hint: 'Subtract 1/8 (12.5%) from a whole (100%): 100% - 12.5% = 87.5%.',
    },
    // 5. Benchmark Fifth: 2/5
    {
      id: 'eq-5',
      fraction: '2/5',
      decimal: 0.4,
      percentage: 40,
      targetRepresentation: 'percentage',
      context: 'Two out of five players on a basketball court are guards.',
      hint: 'Each fifth (1/5) is 20% or 0.2. Two fifths = 20% × 2 = 40% (0.4).',
    },
    // 6. Benchmark Fifth: 3/5
    {
      id: 'eq-6',
      fraction: '3/5',
      decimal: 0.6,
      percentage: 60,
      targetRepresentation: 'decimal',
      context: 'A bottle of cordial has 3/5 of its contents remaining.',
      hint: '3/5 is equivalent to 6/10. As a decimal, 6 tenths is written as 0.6.',
    },
    // 7. Benchmark Fifth: 4/5
    {
      id: 'eq-7',
      fraction: '4/5',
      decimal: 0.8,
      percentage: 80,
      targetRepresentation: 'percentage',
      context: 'A student scores 4 out of 5 on a rapid-fire maths quiz.',
      hint: 'Multiply the numerator and denominator by 20 to make a denominator of 100: 80/100 = 80%.',
    },
    // 8. Recurring Third: 1/3
    {
      id: 'eq-8',
      fraction: '1/3',
      decimal: 0.33,
      percentage: 33.3,
      targetRepresentation: 'percentage',
      context: 'One-third of a garden bed is dedicated to native plants.',
      hint: '100% divided equally by 3 is 33.333...% (commonly rounded to 33.3% or 1/3).',
    },
    // 9. Recurring Third: 2/3
    {
      id: 'eq-9',
      fraction: '2/3',
      decimal: 0.67,
      percentage: 66.7,
      targetRepresentation: 'decimal',
      context: 'Two-thirds of the registered voters supported the community hall upgrade.',
      hint: 'Double 1/3 (0.333...): 2 × 0.333... = 0.666..., rounded to two decimal places as 0.67.',
    },
    // 10. Sixth Benchmark: 1/6
    {
      id: 'eq-10',
      fraction: '1/6',
      decimal: 0.17,
      percentage: 16.7,
      targetRepresentation: 'percentage',
      context: 'A standard six-sided die has a 1/6 chance of landing on a six.',
      hint: '1/6 is half of 1/3 (33.3%). Halving 33.3% gives 16.7% (or approximately 0.17).',
    },
    // 11. Tenths: 7/10
    {
      id: 'eq-11',
      fraction: '7/10',
      decimal: 0.7,
      percentage: 70,
      targetRepresentation: 'percentage',
      context: 'A phone battery displays 7 out of 10 charge bars.',
      hint: '7 tenths is 70 hundredths: 70/100 = 70% = 0.7.',
    },
    // 12. Hundredths: 9/100
    {
      id: 'eq-12',
      fraction: '9/100',
      decimal: 0.09,
      percentage: 9,
      targetRepresentation: 'decimal',
      context: 'A sales tax discount applies 9 parts per 100 on marked purchases.',
      hint: '9 hundredths has a zero in the tenths place: 0.09 (9%), not 0.9 (which is 90%).',
    },
    // 13. Improper Fraction: 5/4
    {
      id: 'eq-13',
      fraction: '5/4',
      decimal: 1.25,
      percentage: 125,
      targetRepresentation: 'percentage',
      context: 'A bakery bakes 5 quarters of a giant celebration cake.',
      hint: '4/4 makes 1 whole (100%). One more quarter is 25%. Total: 100% + 25% = 125% (or 1.25).',
    },
    // 14. Improper Fraction: 3/2
    {
      id: 'eq-14',
      fraction: '3/2',
      decimal: 1.5,
      percentage: 150,
      targetRepresentation: 'decimal',
      context: 'A recipe calls for 1 and a half cups of milk (3/2 cups).',
      hint: '1 whole plus 1 half: 1 + 0.5 = 1.5 (or 150%).',
    },
    // 15. Quarter Multiples: 3/4
    {
      id: 'eq-15',
      fraction: '3/4',
      decimal: 0.75,
      percentage: 75,
      targetRepresentation: 'decimal',
      context: 'A game download reaches 3/4 completion on a tablet.',
      hint: '3 quarters of $1 is 75 cents: 3 × 0.25 = 0.75 (75%).',
    },
    // 16. Whole and Hundredths: 11/20
    {
      id: 'eq-16',
      fraction: '11/20',
      decimal: 0.55,
      percentage: 55,
      targetRepresentation: 'percentage',
      context: 'A soccer team wins 11 out of 20 regular season matches.',
      hint: 'Multiply numerator and denominator by 5: (11 × 5) / (20 × 5) = 55/100 = 55% = 0.55.',
    },
  ],
},
};