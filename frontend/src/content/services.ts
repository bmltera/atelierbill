export interface Service {
  id: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    id: "dance-covers",
    title: "DANCE COVERS",
    description: "2-hour shoot, including editing.",
  },
  {
    id: "other-projects",
    title: "OTHER PROJECTS",
    description: "Please inquire for all other projects.",
  },
];
