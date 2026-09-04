export interface Project {
  id: string;
  title: string;
  year: string;
  clientOrArtist: string;
  description?: string;
  youtubeId: string;
  thumbnail: string;
  featured: boolean;
  credits: string[];
}

export const projects: Project[] = [
  {
    id: "eclipse-1",
    title: "ECLIPSE Cover 1",
    year: "2024",
    clientOrArtist: "ECLIPSE",
    youtubeId: "cjMsrRjNX8U",
    thumbnail: "https://i.ytimg.com/vi/cjMsrRjNX8U/maxresdefault.jpg",
    featured: true,
    credits: ["Videographer: Bill", "Artist: ECLIPSE"],
  },
  {
    id: "eclipse-2",
    title: "ECLIPSE Cover 2",
    year: "2024",
    clientOrArtist: "ECLIPSE",
    youtubeId: "rypaUFWC2qU",
    thumbnail: "https://i.ytimg.com/vi/rypaUFWC2qU/maxresdefault.jpg",
    featured: true,
    credits: ["Videographer: Bill", "Artist: ECLIPSE"],
  },
  {
    id: "eclipse-3",
    title: "ECLIPSE Cover 3",
    year: "2024",
    clientOrArtist: "ECLIPSE",
    youtubeId: "vy_ULihzzPY",
    thumbnail: "https://i.ytimg.com/vi/vy_ULihzzPY/maxresdefault.jpg",
    featured: true,
    credits: ["Videographer: Bill", "Artist: ECLIPSE"],
  },
  {
    id: "eclipse-4",
    title: "ECLIPSE Cover 4",
    year: "2023",
    clientOrArtist: "ECLIPSE",
    youtubeId: "u_tK1W0g5Fo",
    thumbnail: "https://i.ytimg.com/vi/u_tK1W0g5Fo/maxresdefault.jpg",
    featured: true,
    credits: ["Videographer: Bill", "Artist: ECLIPSE"],
  },
  {
    id: "eclipse-5",
    title: "ECLIPSE Cover 5",
    year: "2023",
    clientOrArtist: "ECLIPSE",
    youtubeId: "OcVVeZePP5g",
    thumbnail: "https://i.ytimg.com/vi/OcVVeZePP5g/maxresdefault.jpg",
    featured: false,
    credits: ["Videographer: Bill", "Artist: ECLIPSE"],
  },
  {
    id: "eclipse-6",
    title: "ECLIPSE Cover 6",
    year: "2023",
    clientOrArtist: "ECLIPSE",
    youtubeId: "dm3u2Qsjr2M",
    thumbnail: "https://i.ytimg.com/vi/dm3u2Qsjr2M/maxresdefault.jpg",
    featured: false,
    credits: ["Videographer: Bill", "Artist: ECLIPSE"],
  },
];
