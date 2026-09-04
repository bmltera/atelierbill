# Content Management Guide

All content is managed through central TypeScript files in `src/content/`. Since the site uses static export, modifying these files and rebuilding will instantly update the content.

## General Information (`src/content/site.ts`)
Update the `siteConfig` object to change:
- `name`, `description`
- `contact.email` and `contact.instagram`
- `bookingUrl`
- `hero.videoUrl` (The looping homepage video)
- `hero.posterUrl` (The image shown before the video loads)

## Portfolio Work (`src/content/work.ts`)
To add a new project, add an object to the `projects` array:
```ts
{
  id: "unique-slug-or-id",
  title: "Project Name",
  year: "2026",
  clientOrArtist: "Artist Name",
  description: "Optional description.",
  youtubeId: "dQw4w9WgXcQ", // The ID from a youtube.com/watch?v=ID url
  thumbnail: "/images/your-image.jpg", // Place images in the public/images folder
  featured: true, // true to show on homepage
  credits: ["Director: Bill", "Choreography: Artist A"],
}
```

## Services (`src/content/services.ts`)
Edit the `services` array to update the service titles and descriptions shown on the homepage and services page.

## Team (`src/content/team.ts`)
Edit the `team` array to add or remove members, or change their roles on the about page.
