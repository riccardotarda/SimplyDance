import type { LessonModule } from "@/types/lesson";

export const hipHopBasics: LessonModule = {
  id: "hip-hop-basics",
  title: "Hip Hop Basics",
  steps: [
    {
      id: "bounce",
      number: 1,
      title: "Il Bounce (Il Ritmo)",
      description: "Un video di 30 secondi per trovare il tempo con le ginocchia.",
      type: "video",
      duration: "30 sec",
      youtubeId: "OnKsMC6H29M",
    },
    {
      id: "basic-step",
      number: 2,
      title: "Il Basic Step (Gambe)",
      description: "Solo il movimento dei piedi: side-to-side.",
      type: "practice",
    },
    {
      id: "coordinazione",
      number: 3,
      title: "Coordinazione (Gambe + Bounce)",
      description: "Uniamo i primi due step: piedi e ritmo insieme.",
      type: "practice",
    },
    {
      id: "braccia",
      number: 4,
      title: "Le Braccia",
      description: "Solo movimento delle braccia.",
      type: "practice",
    },
    {
      id: "full-body",
      number: 5,
      title: "Full Body",
      description: "Uniamo Step 3 + Step 4: gambe, bounce e braccia.",
      type: "practice",
    },
    {
      id: "passo-signature",
      number: 6,
      title: "Passo Signature",
      description: "Il primo passo da portare ovunque. Sbloccato per la tua libreria.",
      type: "passo",
    },
  ],
};
