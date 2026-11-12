export interface ResourceArticle {
  slug: string;
  title: string;
  subtitle: string;
  category:
    | 'Mobility & Therapy'
    | 'Living & Adaptive Tech'
    | 'Caregiving & Wellness'
    | 'Documentation & Planning';
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  summary: string;
  keyTakeaways: string[];
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

export const RESOURCE_CATEGORIES: ResourceArticle['category'][] = [
  'Mobility & Therapy',
  'Living & Adaptive Tech',
  'Caregiving & Wellness',
  'Documentation & Planning',
];

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    slug: 'understanding-spg11-family-and-patient-organization-guide',
    title: 'Understanding SPG11: A Practical Organization & Documentation Guide for Individuals and Families',
    subtitle: 'How structured milestone tracking and daily documentation help families coordinate care, therapy, and daily routines.',
    category: 'Documentation & Planning',
    readTime: '7 min read',
    publishedAt: '2026-10-12',
    updatedAt: '2026-11-10',
    author: 'SPG11 Journey Editorial Team',
    summary:
      'Hereditary Spastic Paraplegia Type 11 (SPG11) involves complex, evolving daily routines across physical therapy, neurology, and adaptive living. Learn how structured documentation empowers individuals and families.',
    keyTakeaways: [
      'Centralize appointment dates, therapy goals, and daily observations in one chronological record.',
      'Break long-term rehabilitation or adaptive goals into smaller, measurable milestones.',
      'Maintain a clear distinction between personal progress tracking and clinical consultations.',
      'Use exportable records (CSV and JSON) to share accurate timelines with your care circle.',
    ],
    sections: [
      {
        heading: 'Why Structured Documentation Matters on an SPG11 Journey',
        paragraphs: [
          'Living with or supporting a loved one with Hereditary Spastic Paraplegia Type 11 (SPG11) often means coordinating multiple moving pieces at once: physical therapy schedules, assistive equipment adjustments, neurology check-ins, and personal wellness goals. When notes are scattered across paper notebooks, phone photos, and text messages, it becomes difficult to see the bigger picture over months or years.',
          'A dedicated personal tracking system brings calm and clarity to daily life. By organizing your experience into thematic journeys—such as Mobility & Physical Therapy, Adaptive Technology, or Speech & Communication—you create a living archive that reflects real day-to-day progress.',
        ],
      },
      {
        heading: 'Turning Broad Goals into Measurable Milestones',
        paragraphs: [
          'Broad goals like "improve balance" or "adapt the home workspace" can feel overwhelming without intermediate checkpoints. Breaking each journey into specific, dated milestones transforms abstract intentions into achievable steps.',
          'For example, a hydrotherapy journey might include milestones for an initial aquatic assessment, completing four weeks of twice-weekly pool sessions, and reviewing stamina notes after six weeks. Each completed milestone reinforces momentum and provides an accurate record of what worked best.',
        ],
      },
      {
        heading: 'Combining Quantitative Progress with Qualitative Reflections',
        paragraphs: [
          'Numbers and percentages tell only part of the story. Pairing milestone checklists with private journal entries and dated photographs captures the human context behind every step—how energy levels felt on a given morning, which stretching sequence felt most comfortable, or a proud moment shared with family.',
          'Over time, this combination of structured milestones and personal reflections becomes an invaluable personal timeline that you own and control completely.',
        ],
      },
    ],
  },
  {
    slug: 'daily-mobility-physical-therapy-and-hydrotherapy-routines',
    title: 'Daily Mobility, Stretching & Hydrotherapy Routines: Tracking Meaningful Milestones',
    subtitle: 'Practical ways to organize physical therapy habits, aquatic exercise logs, and stretching consistency.',
    category: 'Mobility & Therapy',
    readTime: '8 min read',
    publishedAt: '2026-10-15',
    updatedAt: '2026-11-10',
    author: 'SPG11 Journey Editorial Team',
    summary:
      'Consistent movement, stretching, and aquatic therapy play a central role in daily comfort and mobility. Discover how to structure and review your physical therapy routines effectively.',
    keyTakeaways: [
      'Log session frequency, duration, and post-session comfort levels to spot helpful patterns.',
      'Track hydrotherapy and low-impact movement separately from high-effort strength sessions.',
      'Record environmental factors such as time of day, rest quality, and room temperature.',
      'Celebrate consistency milestones rather than focusing solely on intensity.',
    ],
    sections: [
      {
        heading: 'Building Sustainable Movement Habits',
        paragraphs: [
          'For many individuals navigating spasticity and lower-limb stiffness, consistency matters far more than occasional high-intensity sessions. Gentle daily stretching, range-of-motion exercises, and guided physical therapy help maintain comfort and flexibility when practiced regularly.',
          'When documenting a mobility journey, start by recording your baseline schedule—such as fifteen minutes of morning stretching and two afternoon standing or gait sessions per week. Setting clear start dates and realistic milestone targets helps maintain steady rhythm without burnout.',
        ],
      },
      {
        heading: 'The Value of Aquatic & Hydrotherapy Logs',
        paragraphs: [
          'Warm-water hydrotherapy is widely appreciated for reducing gravitational load on joints and easing muscle tightness during movement. Because buoyancy allows movements that may feel more challenging on land, tracking aquatic sessions in a dedicated journey helps highlight progress.',
          'In your journal notes after each session, consider noting water temperature comfort, specific pool exercises practiced, and how fatigue or relaxation felt two hours afterward. These details make it easy to adjust session length for optimal energy.',
        ],
      },
      {
        heading: 'Reviewing Progress Over 30, 60, and 90 Days',
        paragraphs: [
          'Day-to-day changes can feel subtle, which is why a chronological timeline is so encouraging. Looking back over a 60-day or 90-day window often reveals dozens of completed sessions, steadier routines, and refined techniques that might otherwise go unnoticed in the moment.',
        ],
      },
    ],
  },
  {
    slug: 'adaptive-equipment-and-home-accessibility-planning',
    title: 'Adaptive Equipment, Home Accessibility & Assistive Technology Planning',
    subtitle: 'A step-by-step framework for researching, trialing, and documenting home modifications and mobility aids.',
    category: 'Living & Adaptive Tech',
    readTime: '6 min read',
    publishedAt: '2026-10-19',
    updatedAt: '2026-11-10',
    author: 'SPG11 Journey Editorial Team',
    summary:
      'From ergonomic seating and grab bars to smart-home voice controls and mobility aids, organizing equipment trials as structured journeys simplifies decision-making.',
    keyTakeaways: [
      'Document measurements, vendor quotes, and occupational therapy recommendations in one place.',
      'Use the Photo Gallery to save reference images of room layouts, serial numbers, and seating adjustments.',
      'Track trial periods as milestones so warranty and adjustment windows are never missed.',
      'Tag journeys with equipment categories for instant searchability later.',
    ],
    sections: [
      {
        heading: 'Approaching Home Accessibility One Room at a Time',
        paragraphs: [
          'Thoughtful home modifications—such as threshold ramps, non-slip bathroom surfaces, estrategically placed grab bars, and adjustable desk heights—can dramatically reduce daily fatigue and increase independence. Rather than tackling an entire home at once, treating each room or assistive device as its own tracked journey keeps projects manageable.',
          'Start by listing the friction points in your daily routine, then create milestones for initial measurements, specialist consultation, installation, and a two-week comfort review.',
        ],
      },
      {
        heading: 'Using Visual Documentation for Seating & Mobility Fittings',
        paragraphs: [
          'When trialing orthotics, walkers, wheelchairs, or ergonomic seating, small posture and cushion adjustments make a big difference. Uploading photographs with clear captions—such as footrest height settings, armrest angles, or serial number labels—creates an instant visual reference.',
          'If an adjustment needs fine-tuning months later, you can open your photo gallery and compare the exact setup from your initial fitting.',
        ],
      },
      {
        heading: 'Smart Home & Digital Accessibility Tools',
        paragraphs: [
          'Modern voice assistants, smart lighting, automated door openers, and customizable keyboard or eye-tracking interfaces offer tremendous convenience. Documenting which shortcuts, routines, and device configurations work best ensures the whole household can support and maintain the setup effortlessly.',
        ],
      },
    ],
  },
  {
    slug: 'preparing-for-specialist-and-neurology-appointments',
    title: 'Preparing for Specialist & Neurology Appointments: Organizing Timelines and Observations',
    subtitle: 'How to turn months of daily notes and milestones into a concise, stress-free appointment summary.',
    category: 'Documentation & Planning',
    readTime: '7 min read',
    publishedAt: '2026-10-23',
    updatedAt: '2026-11-10',
    author: 'SPG11 Journey Editorial Team',
    summary:
      'Appointments with neurologists, physiatrists, and physical therapists are often brief. Arriving with an organized chronological timeline helps you make the most of every visit.',
    keyTakeaways: [
      'Filter your timeline by date range to review everything that happened since your last visit.',
      'Write a dedicated pre-appointment journal entry listing your top three questions and priorities.',
      'Record post-appointment takeaways immediately while details are fresh.',
      'Export your journey and milestone summary to CSV or JSON for easy offline reference.',
    ],
    sections: [
      {
        heading: 'Overcoming Recall Bias Between Visits',
        paragraphs: [
          'When specialist visits are spaced three, six, or twelve months apart, it is completely natural to forget when a specific routine started or how long a particular adjustment took. Relying on memory alone during a 20-minute appointment often leaves important questions unasked.',
          'By logging milestones and brief journal reflections as they happen, you build an accurate, date-stamped history. Before your appointment, simply filter your Interactive Timeline to the date of your previous visit to review every milestone and note in chronological order.',
        ],
      },
      {
        heading: 'Structuring Your Pre-Appointment Checklist',
        paragraphs: [
          'Two days before a scheduled visit, create a milestone or journal entry titled "Appointment Preparation." List any changes in daily mobility, sleep quality, speech or swallowing comfort, and assistive equipment needs, followed by your top three questions.',
          'Having these points written down in advance reduces appointment-day stress and ensures every priority is addressed.',
        ],
      },
      {
        heading: 'Capturing Action Items After the Visit',
        paragraphs: [
          'Right after the appointment, update your journey notes with any new recommendations, therapy adjustments, or follow-up target dates. Turning those follow-ups into upcoming milestones ensures nothing slips through the cracks.',
        ],
      },
    ],
  },
  {
    slug: 'speech-communication-and-daily-interaction-support',
    title: 'Speech, Voice Pacing & Communication Support Strategies',
    subtitle: 'Documenting vocal exercises, pacing techniques, and assistive communication tools for confident daily expression.',
    category: 'Mobility & Therapy',
    readTime: '6 min read',
    publishedAt: '2026-10-27',
    updatedAt: '2026-11-10',
    author: 'SPG11 Journey Editorial Team',
    summary:
      'Clear, unhurried communication is essential for connection and autonomy. Learn how to organize speech therapy exercises, breath-support habits, and communication aids.',
    keyTakeaways: [
      'Track daily vocal warm-ups, breath-support exercises, and articulation practice.',
      'Note how time of day and fatigue affect vocal clarity so important conversations can be scheduled optimally.',
      'Document favorite phrase banks and AAC (Augmentative and Alternative Communication) settings.',
      'Involve family members and communication partners in supportive pacing habits.',
    ],
    sections: [
      {
        heading: 'Supporting Vocal Clarity Through Pacing and Breath',
        paragraphs: [
          'Working with a speech-language pathologist often involves exercises focused on breath support, deliberate pacing, and clear articulation. Just like physical therapy for the legs and core, short, regular practice sessions yield the best results.',
          'Creating a dedicated "Speech & Communication" journey lets you track weekly practice milestones, record favorite reading passages or vocal warm-ups, and celebrate steady consistency.',
        ],
      },
      {
        heading: 'Optimizing the Communication Environment',
        paragraphs: [
          'Communication is a two-way partnership. Reducing background noise, speaking face-to-face in well-lit rooms, and scheduling longer conversations during high-energy hours of the day make interactions much more comfortable.',
          'Use your journal to note which environments and times of day feel most effortless for phone calls, video chats, or social gatherings.',
        ],
      },
      {
        heading: 'Exploring Modern Communication Technology',
        paragraphs: [
          'From predictive text apps and tablet-based speech generators to custom voice banking, modern technology offers flexible ways to supplement natural speech when tired. Documenting app configurations and preferred vocabulary lists keeps your tools ready whenever needed.',
        ],
      },
    ],
  },
  {
    slug: 'caregiver-and-family-wellness-sustainable-routines',
    title: 'Caregiver & Family Wellness: Building Sustainable Routines and Shared Support',
    subtitle: 'Practical strategies for family caregivers to protect their own rest, organize shared responsibilities, and prevent burnout.',
    category: 'Caregiving & Wellness',
    readTime: '7 min read',
    publishedAt: '2026-11-01',
    updatedAt: '2026-11-10',
    author: 'SPG11 Journey Editorial Team',
    summary:
      'Supporting a loved one on a long-term journey requires sustainable pacing for the entire family. Explore ways to structure respite, share tasks, and honor personal well-being.',
    keyTakeaways: [
      'Treat caregiver rest, exercise, and personal hobbies as essential milestones—not optional extras.',
      'Maintain clear, written routines so secondary family members or respite helpers can step in smoothly.',
      'Use private journaling to process emotions and celebrate small family victories.',
      'Build a repeatable weekly rhythm that balances care tasks with restorative downtime.',
    ],
    sections: [
      {
        heading: 'Why Caregiver Well-Being Is Foundational',
        paragraphs: [
          'Family members and care partners often pour immense dedication into organizing appointments, assisting with daily mobility, and managing household logistics. Over time, neglecting personal sleep, social connection, and recreation leads to exhaustion.',
          'Recognizing that caregiver wellness is an essential pillar of the journey changes how families plan their weeks. Scheduling dedicated respite hours and personal wellness goals protects long-term energy and warmth at home.',
        ],
      },
      {
        heading: 'Creating Shareable Routine Guides',
        paragraphs: [
          'One of the biggest barriers to taking a break is the worry that no one else knows the exact daily routine. When daily schedules, preferred equipment settings, and current milestones are clearly documented, another family member or trusted helper can step in with confidence.',
          'Exporting a current summary of active journeys and upcoming milestones provides an instant, up-to-date briefing whenever support is shared.',
        ],
      },
      {
        heading: 'Honoring Wins Big and Small',
        paragraphs: [
          'Long-term journeys are measured in seasons, not sprints. Taking five minutes each week to look back at completed milestones and family photos reminds everyone of their resilience, adaptability, and shared moments of joy.',
        ],
      },
    ],
  },
  {
    slug: 'journaling-for-rare-and-chronic-journeys-emotional-resilience',
    title: 'Reflective Journaling on a Rare Condition Journey: Cultivating Emotional Resilience',
    subtitle: 'How private chronological writing helps process change, reduce mental clutter, and preserve meaningful memories.',
    category: 'Caregiving & Wellness',
    readTime: '6 min read',
    publishedAt: '2026-11-04',
    updatedAt: '2026-11-10',
    author: 'SPG11 Journey Editorial Team',
    summary:
      'A private journal offers a judgment-free space to express thoughts, document daily adaptations, and preserve personal stories alongside structured milestones.',
    keyTakeaways: [
      'Write without pressure—even three sentences a day captures valuable context over time.',
      'Link journal entries to specific journeys when reflecting on a particular therapy or goal.',
      'Pair written reflections with photographs to create rich, lasting personal memories.',
      'Use search and chronological sorting to revisit moments of strength and adaptation.',
    ],
    sections: [
      {
        heading: 'The Power of a Private, Judgment-Free Space',
        paragraphs: [
          'Navigating a rare neurological condition brings a wide spectrum of emotions—determination, frustration, gratitude, curiosity, and hope. Having a completely private space to put those thoughts into words helps clear mental clutter and reduces stress.',
          'Unlike public social media feeds, a private personal journal allows total honesty. You write solely for yourself, knowing your entries are protected by strict account isolation.',
        ],
      },
      {
        heading: 'Simple Prompts to Get Started',
        paragraphs: [
          'If a blank page feels intimidating, start with three simple questions: What went well today? What felt challenging or tiring? What is one small adjustment or moment I want to remember from this week?',
          'Over months, these short entries weave together an authentic narrative of adaptation and personal growth.',
        ],
      },
      {
        heading: 'Preserving Everyday Joy Alongside Practical Notes',
        paragraphs: [
          'A journey tracker should never be only about tasks and checklists. Documenting family outings, favorite music, accessible travel experiences, and hobbies ensures your archive celebrates the fullness of life.',
        ],
      },
    ],
  },
  {
    slug: 'ergonomic-workspaces-and-daily-energy-conservation',
    title: 'Ergonomic Workspaces, Pacing & Daily Energy Conservation Techniques',
    subtitle: 'Designing comfortable study, work, and leisure environments that minimize physical strain and preserve energy.',
    category: 'Living & Adaptive Tech',
    readTime: '6 min read',
    publishedAt: '2026-11-07',
    updatedAt: '2026-11-10',
    author: 'SPG11 Journey Editorial Team',
    summary:
      'Small adjustments to desk height, monitor positioning, lighting, and daily task pacing can significantly reduce fatigue and improve comfort throughout the day.',
    keyTakeaways: [
      'Arrange frequently used items within comfortable arm reach to minimize unnecessary strain.',
      'Alternate physical tasks with seated cognitive or creative activities throughout the day.',
      'Use high-contrast themes (White Mode during bright daylight, Dark Mode in low light) to reduce eye fatigue.',
      'Track workspace adjustments as a dedicated journey to refine ergonomics over time.',
    ],
    sections: [
      {
        heading: 'Principles of Energy Conservation in Daily Routines',
        paragraphs: [
          'Energy conservation is not about doing less—it is about spending energy intentionally on the activities that matter most to you. By pacing demanding physical tasks, scheduling rest breaks before exhaustion sets in, and simplifying repetitive chores, you preserve stamina for hobbies, therapy, and social time.',
          'Tracking your daily rhythm for two weeks in your journal can quickly reveal which hours of the day offer peak energy and which tasks benefit from ergonomic adjustments.',
        ],
      },
      {
        heading: 'Setting Up an Accessible Desk and Screen Environment',
        paragraphs: [
          'Whether working, studying, or browsing from a chair or wheelchair, screen height and input placement are critical. Position monitors at eye level to prevent neck strain, use cushioned forearm supports, and consider mechanical or low-force keyboards and trackballs.',
          'Visual comfort matters too: switching between a high-contrast White Mode in bright rooms and a calm Dark Mode in the evening helps prevent visual fatigue during extended screen use.',
        ],
      },
      {
        heading: 'Iterating and Refining Your Setup',
        paragraphs: [
          'Ergonomics is an ongoing process rather than a one-time purchase. Document each change you make—along with a quick photo and comfort note—so you can continually refine your space for maximum ease and independence.',
        ],
      },
    ],
  },
];
