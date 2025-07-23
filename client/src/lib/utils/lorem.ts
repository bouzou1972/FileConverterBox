const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export interface LoremOptions {
  type: 'words' | 'sentences' | 'paragraphs';
  count: number;
  startWithLorem: boolean;
  includeHtml: boolean;
}

export interface LoremResult {
  text: string;
  stats: {
    words: number;
    sentences: number;
    paragraphs: number;
  };
}

export function generateLorem(options: LoremOptions): LoremResult {
  const { type, count, startWithLorem, includeHtml } = options;
  let result = '';
  let wordCount = 0;
  let sentenceCount = 0;
  let paragraphCount = 0;

  if (type === 'words') {
    const words: string[] = [];
    if (startWithLorem) {
      words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      wordCount += 5;
    }
    
    for (let i = words.length; i < count; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    
    result = words.join(' ') + '.';
    wordCount = words.length;
    sentenceCount = 1;
    paragraphCount = 1;
  } else if (type === 'sentences') {
    const sentences: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const sentenceLength = Math.floor(Math.random() * 15) + 5;
      const words: string[] = [];
      
      if (i === 0 && startWithLorem) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }
      
      for (let j = words.length; j < sentenceLength; j++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      sentences.push(words.join(' ') + '.');
      wordCount += words.length;
    }
    
    result = sentences.join(' ');
    sentenceCount = sentences.length;
    paragraphCount = 1;
  } else { // paragraphs
    const paragraphs: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const paragraphLength = Math.floor(Math.random() * 6) + 3;
      const sentences: string[] = [];
      
      for (let j = 0; j < paragraphLength; j++) {
        const sentenceLength = Math.floor(Math.random() * 15) + 5;
        const words: string[] = [];
        
        if (i === 0 && j === 0 && startWithLorem) {
          words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        }
        
        for (let k = words.length; k < sentenceLength; k++) {
          words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        sentences.push(words.join(' ') + '.');
        wordCount += words.length;
      }
      
      let paragraph = sentences.join(' ');
      if (includeHtml) {
        paragraph = `<p>${paragraph}</p>`;
      }
      paragraphs.push(paragraph);
      sentenceCount += sentences.length;
    }
    
    result = paragraphs.join(includeHtml ? '\n\n' : '\n\n');
    paragraphCount = paragraphs.length;
  }

  return {
    text: result,
    stats: {
      words: wordCount,
      sentences: sentenceCount,
      paragraphs: paragraphCount
    }
  };
}
