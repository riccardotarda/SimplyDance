import type { LessonModule } from "@/types/lesson";

export const styleBuilder: LessonModule = {
  id: "modulo-4",
  title: "Style Builder",
  steps: [
    {
      id: "attitude",
      number: 1,
      title: "Attitude",
      description: "Posizione e intenzione del movimento.",
      type: "video",
      duration: "40 sec",
    },
    {
      id: "musicalita",
      number: 2,
      title: "Musicalità",
      description: "Accenti sul beat: pausa e ripartenza.",
      type: "practice",
    },
    {
      id: "style-choices",
      number: 3,
      title: "Style Choices",
      description: "Aggiungi dettagli personali alla combo.",
      type: "practice",
    },
    {
      id: "mini-routine",
      number: 4,
      title: "Mini Routine",
      description: "Sequenza completa con più groove.",
      type: "practice",
    },
    {
      id: "performance",
      number: 5,
      title: "Performance Style",
      description: "Routine finale per chiudere il livello.",
      type: "performance",
    },
  ],
};
