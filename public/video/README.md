# Cinematic video assets

## Hero (`hero.mp4`)

Fullscreen autoplay loop on the homepage hero. Place your file at:

```
public/video/hero.mp4
```

The hero uses the terrace still as a poster while the video loads, and falls back to the image if video fails or reduced motion is enabled.

## Walkthrough (`walkthrough.mp4`) — optional

```
public/video/walkthrough.mp4
```

Then open `src/components/Walkthrough.tsx` and set:

```ts
const WALKTHROUGH_VIDEO: string | null = "/video/walkthrough.mp4";
```

The section will automatically switch from the WebGL experience to the video.

### Suggested Higgsfield prompt

> Slow cinematic dolly through an ultra-luxury fine-dining restaurant at blue
> hour. Emerald velvet banquettes, white marble tables, cascading teardrop
> pendant lights, herringbone oak floors, warm gold accent lighting, a backlit
> feather sculpture, an open kitchen glowing behind glass. Realistic
> reflections, soft shadows, shallow depth of field, gentle handheld motion,
> Michelin-star atmosphere. No people, no text.

Compress for production before shipping, e.g.:

```
ffmpeg -i input.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 24 -preset slow \
  -movflags +faststart -an public/video/walkthrough.mp4
```
