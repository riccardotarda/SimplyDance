import type { LessonModule } from "@/types/lesson";

export const grooveStarter: LessonModule = {
  id: "modulo-2",
  title: "Groove Starter",
  steps: [
    {
      id: "postura",
      number: 1,
      title: "Postura e presenza",
      description: "Allineamento base per muoverti con sicurezza.",
      type: "video",
      duration: "45 sec",
    },
    {
      id: "bounce-2",
      number: 2,
      title: "Bounce 2.0",
      description: "Ritmo più marcato e dinamica.",
      type: "practice",
    },
    {
      id: "groove-combo",
      number: 3,
      title: "Groove Combo",
      description: "Unisci due groove in sequenza.",
      type: "practice",
    },
    {
      id: "floor-move",
      number: 4,
      title: "Flow a terra",
      description: "Piccolo passaggio per rendere il movimento più fluido.",
      type: "practice",
    },
    {
      id: "performance",
      number: 5,
      title: "Performance Starter",
      description: "Mini routine per validare il modulo.",
      type: "performance",
    },
  ],
};
