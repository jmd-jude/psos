// Knowledge Base Loader for AI Prompt Context

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface FieldGuideSection {
  slug: string;
  title: string;
  content: string;
  category: 'product' | 'market' | 'methodology' | 'competitive';
  lastUpdated: Date;
  author?: string;
}

// Cache the loaded guide to avoid reading from disk on every request
let cachedGuide: Record<string, FieldGuideSection> | null = null;

/**
 * Load all knowledge base articles from markdown files
 * Files are organized in /knowledge-base/{category}/{slug}.md
 * 
 * @returns Record of slug => FieldGuideSection
 */
export function loadFieldGuide(): Record<string, FieldGuideSection> {
  // Return cached version if already loaded
  if (cachedGuide) {
    return cachedGuide;
  }
  
  const kbDir = path.join(process.cwd(), 'knowledge-base');
  const guide: Record<string, FieldGuideSection> = {};
  
  // Check if knowledge base directory exists
  if (!fs.existsSync(kbDir)) {
    console.warn('Knowledge base directory not found at:', kbDir);
    return {};
  }
  
  const categories: Array<'product' | 'market' | 'methodology' | 'competitive'> = 
    ['product', 'market', 'methodology', 'competitive'];
  
  categories.forEach(category => {
    const categoryPath = path.join(kbDir, category);
    
    if (!fs.existsSync(categoryPath)) {
      console.warn(`Category directory not found: ${categoryPath}`);
      return;
    }
    
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'));
    
    files.forEach(file => {
      try {
        const filePath = path.join(categoryPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        const slug = file.replace('.md', '');
        guide[slug] = {
          slug,
          title: data.title || slug.replace(/-/g, ' '),
          content: content.trim(),
          category: (data.category as any) || category,
          lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
          author: data.author,
        };
      } catch (error) {
        console.error(`Error loading knowledge base file ${file}:`, error);
      }
    });
  });
  
  // Cache for future requests
  cachedGuide = guide;
  
  console.log(`Loaded ${Object.keys(guide).length} knowledge base articles`);
  return guide;
}

/**
 * Get a specific knowledge base section by slug
 * 
 * @param slug - The filename without .md extension (e.g., 'identity-graph-overview')
 * @returns The content of the section, or empty string if not found
 */
export function getFieldGuideSection(slug: string): string {
  const guide = loadFieldGuide();
  return guide[slug]?.content || '';
}

/**
 * Get all sections in a specific category
 * 
 * @param category - The category to filter by
 * @returns Formatted markdown with all sections in that category
 */
export function getFieldGuideSectionsByCategory(
  category: 'product' | 'market' | 'methodology' | 'competitive'
): string {
  const guide = loadFieldGuide();
  const sections = Object.values(guide).filter(s => s.category === category);
  
  if (sections.length === 0) {
    return `No knowledge base articles found in category: ${category}`;
  }
  
  return sections
    .map(section => `## ${section.title}\n\n${section.content}`)
    .join('\n\n---\n\n');
}

/**
 * Get all knowledge base sections (entire knowledge base)
 * Useful for comprehensive AI context
 * 
 * @returns Array of all loaded sections
 */
export function getAllFieldGuideSections(): FieldGuideSection[] {
  const guide = loadFieldGuide();
  return Object.values(guide);
}

/**
 * Get multiple specific sections by slug
 * 
 * @param slugs - Array of slugs to retrieve
 * @returns Formatted markdown with requested sections
 */
export function getFieldGuideSections(slugs: string[]): string {
  const guide = loadFieldGuide();
  const sections = slugs
    .map(slug => guide[slug])
    .filter(Boolean); // Remove undefined entries
  
  if (sections.length === 0) {
    return 'No matching knowledge base articles found.';
  }
  
  return sections
    .map(section => `## ${section.title}\n\n${section.content}`)
    .join('\n\n---\n\n');
}

/**
 * Search knowledge base content
 * Simple text search across all content
 * 
 * @param query - Search term
 * @returns Array of matching sections
 */
export function searchFieldGuide(query: string): FieldGuideSection[] {
  const guide = loadFieldGuide();
  const lowerQuery = query.toLowerCase();
  
  return Object.values(guide).filter(section => {
    const titleMatch = section.title.toLowerCase().includes(lowerQuery);
    const contentMatch = section.content.toLowerCase().includes(lowerQuery);
    return titleMatch || contentMatch;
  });
}

/**
 * Reload the knowledge base (clear cache)
 * Useful in development when updating markdown files
 */
export function reloadFieldGuide(): void {
  cachedGuide = null;
  loadFieldGuide();
}

/**
 * Get knowledge base metadata (for admin/debugging)
 * 
 * @returns Summary of knowledge base contents
 */
export function getFieldGuideMetadata(): {
  totalArticles: number;
  byCategory: Record<string, number>;
  articles: Array<{ slug: string; title: string; category: string; lastUpdated: string }>;
} {
  const guide = loadFieldGuide();
  const articles = Object.values(guide);
  
  const byCategory = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalArticles: articles.length,
    byCategory,
    articles: articles.map(a => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      lastUpdated: a.lastUpdated.toISOString(),
    })),
  };
}

// ============================================================
// HELPER FUNCTIONS FOR AI PROMPT CONSTRUCTION
// ============================================================

/**
 * Get comprehensive context for use case analysis
 * Includes product, methodology, and relevant market sections
 */
export function getUseCaseAnalysisContext(): string {
  return getFieldGuideSections([
    'identity-graph-overview',
    'match-rate-benchmarks',
    'quadrant-playbooks',
    'maturity-rubric',
  ]);
}

/**
 * Get competitive intelligence context
 */
export function getCompetitiveContext(): string {
  return getFieldGuideSectionsByCategory('competitive');
}

/**
 * Get vertical market intelligence context
 */
export function getVerticalContext(): string {
  return getFieldGuideSections([
    'vertical-maturity',
    'buyer-personas',
  ]);
}

/**
 * Get product capabilities context
 */
export function getProductContext(): string {
  return getFieldGuideSectionsByCategory('product');
}

/**
 * Get full strategic context (all categories)
 * Warning: This can be very long - use sparingly
 */
export function getFullStrategicContext(): string {
  const categories: Array<'product' | 'market' | 'methodology' | 'competitive'> = 
    ['product', 'market', 'methodology', 'competitive'];
  
  return categories
    .map(category => {
      const content = getFieldGuideSectionsByCategory(category);
      return `# ${category.toUpperCase()}\n\n${content}`;
    })
    .join('\n\n==========\n\n');
}