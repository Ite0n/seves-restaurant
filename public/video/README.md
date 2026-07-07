# Cinematic walkthrough video (optional drop-in)

The homepage ships with a **live WebGL 3D walkthrough** (React Three Fiber)
that dollies the camera through the real venue photography.

If you generate a cinematic walkthrough film (e.g. with Higgsfield image→video,
recommended model `kling3_0` using `interior-pendant-room.png` as the start
frame), export it and place it here:

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
