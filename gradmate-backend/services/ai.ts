import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { supabase } from '../lib/supabase';
import logger from './logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone with the correct environment
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: 'us-east-1', // Your AWS region
});

// Use your specific index
const index = pinecone.Index('gradmate');

export class AIService {
  // Essay Analysis
  static async analyzeEssay(essay: string, userId: string) {
    try {
      const prompt = `Analyze this essay for a research lab application. Focus on:
        1. Structure and organization
        2. Clarity and coherence
        3. Technical accuracy
        4. Personal connection to research
        5. Areas for improvement

        Essay: ${essay}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: "You are an expert academic advisor specializing in research lab applications." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      });

      const analysis = completion.choices[0].message.content;

      // Store analysis in Pinecone with metadata
      const embedding = await this.getEmbedding(essay);
      await index.upsert([{
        id: `essay_${userId}_${Date.now()}`,
        values: embedding,
        metadata: {
          type: 'essay_analysis',
          userId,
          timestamp: new Date().toISOString(),
          model: 'text-embedding-3-small',
          dimensions: 3072
        }
      }]);

      logger.info('Essay analysis stored in Pinecone', {
        userId,
        timestamp: new Date().toISOString()
      });

      return JSON.parse(analysis || '{}');
    } catch (error) {
      logger.error('Error analyzing essay:', error);
      throw error;
    }
  }

  // Email Generation
  static async generateEmail(userId: string, labId: string, professorId: string) {
    try {
      // Get student profile
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get lab and professor info
      const { data: lab } = await supabase
        .from('labs')
        .select('*')
        .eq('id', labId)
        .single();

      const { data: professor } = await supabase
        .from('professors')
        .select('*')
        .eq('id', professorId)
        .single();

      const prompt = `Generate a professional email for a research lab application with the following details:
        Student: ${student.first_name} ${student.last_name}, ${student.major} at ${student.university}
        Lab: ${lab.name} at ${lab.university}
        Professor: Dr. ${professor.last_name}
        Research Areas: ${lab.research_areas}
        Student's Research Interests: ${student.research_interests}
        Student's Skills: ${student.skills}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: "You are an expert in academic communication and research lab applications." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      });

      return {
        subject: completion.choices[0].message.content?.split('\n')[0] || '',
        body: completion.choices[0].message.content || '',
      };
    } catch (error) {
      console.error('Error generating email:', error);
      throw error;
    }
  }

  // Essay Ideas Generation
  static async generateEssayIdeas(userId: string, labId: string, professorId: string) {
    try {
      // Get student profile and lab info
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: lab } = await supabase
        .from('labs')
        .select('*')
        .eq('id', labId)
        .single();

      const prompt = `Generate 3 unique essay ideas for a research lab application with the following details:
        Student: ${student.first_name} ${student.last_name}, ${student.major} at ${student.university}
        Lab: ${lab.name}
        Research Areas: ${lab.research_areas}
        Student's Research Interests: ${student.research_interests}
        Student's Skills: ${student.skills}

        For each idea, provide:
        1. A compelling title
        2. A brief description
        3. Key points to cover
        4. How it connects to the lab's research`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: "You are an expert in academic writing and research lab applications." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
      });

      return JSON.parse(completion.choices[0].message.content || '[]');
    } catch (error) {
      console.error('Error generating essay ideas:', error);
      throw error;
    }
  }

  // Helper function to get embeddings
  private static async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      logger.error('Error generating embedding:', error);
      throw error;
    }
  }
} 