const aiClient = require('../utils/aiClient');

/**
 * Agent 6: Video Recommendations Generator
 * Uses curated list of verified public educational videos
 */
class VideoRecommendations {
    constructor() {
        // Curated list of verified public educational videos by topic
        this.videoDatabase = {
            // AI & Machine Learning
            ai: [
                { id: "aircAruvnKk", title: "But what is a neural network?", level: "Beginner", duration: "19:13", channel: "3Blue1Brown" },
                { id: "IHZwWFHWa-w", title: "Machine Learning & Artificial Intelligence", level: "Beginner", duration: "11:50", channel: "CrashCourse" },
                { id: "R9OHn5ZF4Uo", title: "MarI/O - Machine Learning for Video Games", level: "Intermediate", duration: "5:58", channel: "SethBling" }
            ],
            // Science
            science: [
                { id: "yaqe1qesQ8c", title: "The Immune System Explained", level: "Beginner", duration: "7:38", channel: "Kurzgesagt" },
                { id: "wvJAgrUBF4w", title: "What Is Light?", level: "Beginner", duration: "5:23", channel: "MinutePhysics" },
                { id: "Xmq_FJd1oUQ", title: "How Evolution Works", level: "Intermediate", duration: "12:15", channel: "Kurzgesagt" }
            ],
            // Math
            math: [
                { id: "WUvTyaaNkzM", title: "The Essence of Calculus", level: "Beginner", duration: "17:04", channel: "3Blue1Brown" },
                { id: "spUNpyF58BY", title: "But what is a Fourier series?", level: "Intermediate", duration: "20:45", channel: "3Blue1Brown" },
                { id: "fNk_zzaMoSs", title: "Dimensions", level: "Advanced", duration: "13:00", channel: "Numberphile" }
            ],
            // Physics
            physics: [
                { id: "1yaqUI4b974", title: "What is Gravity?", level: "Beginner", duration: "6:22", channel: "Veritasium" },
                { id: "MO_Q_f1WgQI", title: "Quantum Mechanics", level: "Intermediate", duration: "9:45", channel: "MinutePhysics" },
                { id: "p_o4aY7xkXg", title: "Special Relativity", level: "Advanced", duration: "18:30", channel: "SciShow" }
            ],
            // Biology
            biology: [
                { id: "QImCld9YubE", title: "DNA Structure and Replication", level: "Beginner", duration: "7:22", channel: "CrashCourse" },
                { id: "ydqReeTV_vk", title: "Photosynthesis", level: "Beginner", duration: "13:37", channel: "CrashCourse" },
                { id: "dFCbJmgeHmA", title: "Evolution: It's a Thing", level: "Intermediate", duration: "11:52", channel: "CrashCourse" }
            ],
            // Chemistry
            chemistry: [
                { id: "FSyAehMdpyI", title: "The Periodic Table", level: "Beginner", duration: "11:23", channel: "CrashCourse" },
                { id: "yQP4UJhNn0I", title: "Chemical Reactions", level: "Beginner", duration: "10:15", channel: "CrashCourse" },
                { id: "dqTTojTija8", title: "Organic Chemistry", level: "Advanced", duration: "12:45", channel: "Khan Academy" }
            ],
            // General/Default
            general: [
                { id: "aircAruvnKk", title: "Introduction to Neural Networks", level: "Beginner", duration: "19:13", channel: "3Blue1Brown" },
                { id: "yaqe1qesQ8c", title: "The Immune System Explained", level: "Beginner", duration: "7:38", channel: "Kurzgesagt" },
                { id: "WUvTyaaNkzM", title: "The Essence of Calculus", level: "Intermediate", duration: "17:04", channel: "3Blue1Brown" },
                { id: "1yaqUI4b974", title: "What is Gravity?", level: "Intermediate", duration: "6:22", channel: "Veritasium" },
                { id: "QImCld9YubE", title: "DNA Structure and Replication", level: "Advanced", duration: "7:22", channel: "CrashCourse" }
            ]
        };
    }

    async generate(knowledgeGraph) {
        console.log('[Agent 6: Video Recommendations] Selecting curated videos...');

        try {
            const topic = (knowledgeGraph.metadata.mainTopic || '').toLowerCase();

            // Determine category based on topic keywords
            let category = 'general';
            if (topic.includes('ai') || topic.includes('machine learning') || topic.includes('neural')) {
                category = 'ai';
            } else if (topic.includes('math') || topic.includes('calculus') || topic.includes('algebra')) {
                category = 'math';
            } else if (topic.includes('physics') || topic.includes('quantum') || topic.includes('gravity')) {
                category = 'physics';
            } else if (topic.includes('biology') || topic.includes('cell') || topic.includes('dna')) {
                category = 'biology';
            } else if (topic.includes('chemistry') || topic.includes('chemical') || topic.includes('molecule')) {
                category = 'chemistry';
            } else if (topic.includes('science')) {
                category = 'science';
            }

            const videos = this.videoDatabase[category] || this.videoDatabase.general;

            console.log(`[Agent 6: Video Recommendations] Selected ${videos.length} videos from category: ${category}`);

            return videos;
        } catch (error) {
            console.error('[Agent 6: Video Recommendations] Error:', error);
            return this.videoDatabase.general;
        }
    }
}

module.exports = new VideoRecommendations();
