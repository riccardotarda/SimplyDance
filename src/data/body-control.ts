import type { LessonModule } from "@/types/lesson";

export const bodyControl: LessonModule = {
  id: "modulo-3",
  title: "Body Control",
  steps: [
    {
      id: "isolamenti",
      number: 1,
      title: "Isolamenti base",
      description: "Spalle, petto e bacino separati.",
      type: "video",
      duration: "50 sec",
    },
    {
      id: "head-shoulders",
      number: 2,
      title: "Head & Shoulders",
      description: "Coordinate testa e spalle sul beat.",
      type: "practice",
    },
    {
      id: "body-wave",
      number: 3,
      title: "Body Wave",
      description: "Onda fluida dal petto al bacino.",
      type: "practice",
    },
    {
      id: "control-combo",
      number: 4,
      title: "Control Combo",
      description: "Mini sequenza per allenare la precisione.",
      type: "practice",
    },
    {
      id: "passo-control",
      number: 5,
      title: "Passo Control",
      description: "Un passo tecnico per fissare il controllo.",
      type: "passo",
    },
  ],
};
