// ---------------------------------------------------------------------------
// DangerPinky — Media source resolver for ScrapbookPlaceholder
// ---------------------------------------------------------------------------

export function resolveMediaSrc(
  tag: string,
  imgSrc?: string,
  videoSrc?: string
): { resolvedImage: string | undefined; resolvedVideo: string | undefined } {
  const lowerTag = tag.toLowerCase();

  // ── Video resolution (most specific first) ──────────────────────────
  let resolvedVideo = videoSrc;
  if (!resolvedVideo) {
    if (lowerTag.includes('cheer') || (lowerTag.includes('outreach') && lowerTag.includes('video'))) {
      resolvedVideo = './videos/vishnu_outreach_cheer.mp4';
    } else if (
      lowerTag.includes('desk video') ||
      (lowerTag.includes('vishnu') && lowerTag.includes('3 am') && lowerTag.includes('video'))
    ) {
      resolvedVideo = './videos/vishnu_night_desk.mp4';
    } else if (
      lowerTag.includes('neon video') ||
      (lowerTag.includes('smartboard') && lowerTag.includes('video'))
    ) {
      resolvedVideo = './videos/smartboard_neon_draw.mp4';
    } else if (
      lowerTag.includes('midnight lab') ||
      lowerTag.includes('lab buzz') ||
      lowerTag.includes('aisle') ||
      (lowerTag.includes('midnight') && lowerTag.includes('video'))
    ) {
      resolvedVideo = './videos/midnight_lab_buzz.mp4';
    } else if (
      lowerTag.includes('dawn') ||
      lowerTag.includes('exhaustion') ||
      lowerTag.includes('05:18') ||
      (lowerTag.includes('5 am') && lowerTag.includes('video')) ||
      lowerTag.includes('fatigue')
    ) {
      resolvedVideo = './videos/dawn_lab_exhaustion.mp4';
    }
  }

  // ── Image resolution ────────────────────────────────────────────────
  let resolvedImage = imgSrc;
  if (!resolvedImage && !resolvedVideo) {
    if (
      (lowerTag.includes('official') && lowerTag.includes('poster')) ||
      lowerTag.includes('official poster') ||
      lowerTag.includes('event poster') ||
      lowerTag.includes('call for makers') ||
      lowerTag.includes('why not') ||
      lowerTag.includes('poster 3.0') ||
      lowerTag.includes('useless projects 3.0 event')
    ) {
      resolvedImage = './images/hackathon/useless_3_official_poster.png';
    } else if (
      lowerTag.includes('hallway team') ||
      lowerTag.includes('hallway selfie') ||
      lowerTag.includes('01:34') ||
      lowerTag.includes('camaraderie')
    ) {
      resolvedImage = './images/hackathon/hallway_team_0134am.jpg';
    } else if (
      lowerTag.includes('vishnu') ||
      lowerTag.includes('solo') ||
      lowerTag.includes('3 am') ||
      lowerTag.includes('workstation') ||
      lowerTag.includes('cables') ||
      lowerTag.includes('unplugged') ||
      lowerTag.includes('tea cups') ||
      lowerTag.includes('tangled')
    ) {
      resolvedImage = './images/hackathon/vishnu_solo_night.jpg';
    } else if (lowerTag.includes('first working') || lowerTag.includes('snake eating') || lowerTag.includes('full loop')) {
      resolvedImage = './screenshots/gameplay.png';
    } else if (
      lowerTag.includes('gameplay') ||
      lowerTag.includes('hud') ||
      lowerTag.includes('landmark') ||
      lowerTag.includes('prototype') ||
      lowerTag.includes('v0.1') ||
      lowerTag.includes('lime')
    ) {
      resolvedImage = './screenshots/gameplay.png';
    } else if (lowerTag.includes('gameover') || lowerTag.includes('game over') || lowerTag.includes('audit table')) {
      resolvedImage = './screenshots/gameover.png';
    } else if (lowerTag.includes('settings') || lowerTag.includes('sensitivity')) {
      resolvedImage = './screenshots/settings.png';
    } else if (
      lowerTag.includes('danger pinky banner') ||
      lowerTag.includes('game banner') ||
      lowerTag.includes('book cover') ||
      lowerTag.includes('title cover') ||
      lowerTag.includes('banner')
    ) {
      resolvedImage = './images/danger_pinky_banner.png';
    } else if (lowerTag.includes('countdown') || lowerTag.includes('clock') || lowerTag.includes('timer')) {
      resolvedImage = './images/hackathon/countdown_clock.jpg';
    } else if (lowerTag.includes('stage') || lowerTag.includes('kickoff') || lowerTag.includes('opening')) {
      resolvedImage = './images/hackathon/kickoff_stage.jpg';
    } else if (
      lowerTag.includes('floor busy') ||
      lowerTag.includes('busy with teams') ||
      lowerTag.includes('computer lab') ||
      lowerTag.includes('teams building')
    ) {
      resolvedImage = './images/hackathon/computer_lab_wide.jpg';
    } else if (lowerTag.includes('cubicle') || lowerTag.includes('laptop') || lowerTag.includes('setting up')) {
      resolvedImage = './images/hackathon/lab_coding_cubicle.jpg';
    } else if (lowerTag.includes('dinner') || lowerTag.includes('food') || lowerTag.includes('dinner break') || lowerTag.includes('corridor dinner')) {
      resolvedImage = './images/hackathon/dinner_break_corridor.jpg';
    } else if (lowerTag.includes('outreach') || lowerTag.includes('story') || lowerTag.includes('instagram') || lowerTag.includes('cheer')) {
      resolvedImage = './images/hackathon/vishnu_outreach_story.jpg';
    } else if (lowerTag.includes('smartboard') || lowerTag.includes('neon') || lowerTag.includes('morning sun') || lowerTag.includes('sunrise') || lowerTag.includes('window')) {
      resolvedImage = './images/hackathon/smartboard_morning.jpg';
    } else if (lowerTag.includes('courtyard') || lowerTag.includes('sun') || lowerTag.includes('final push') || lowerTag.includes('10 am')) {
      resolvedImage = './images/hackathon/courtyard_morning.jpg';
    } else if (lowerTag.includes('presentation') || lowerTag.includes('demos') || lowerTag.includes('alumni')) {
      resolvedImage = './images/hackathon/alumni_hall_presentation.jpg';
    } else if (lowerTag.includes('closing') || lowerTag.includes('letter') || lowerTag.includes('coordinator')) {
      resolvedImage = './images/useless_3_closing.png';
    } else if (lowerTag.includes('thank') || lowerTag.includes('wrap') || lowerTag.includes('reflection')) {
      resolvedImage = './images/useless_3_thankyou.png';
    } else if (lowerTag.includes('group') || lowerTag.includes('teams') || lowerTag.includes('hall')) {
      resolvedImage = './images/tinkerhub_event_group.jpg';
    } else if (lowerTag.includes('ui') || lowerTag.includes('dashboard') || lowerTag.includes('landing')) {
      resolvedImage = './screenshots/landing.png';
    }
  }

  const isDev = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
  if (isDev && !resolvedImage && !resolvedVideo) {
    console.warn('[ScrapbookPlaceholder] No media resolved for tag:', tag);
  }

  return { resolvedImage, resolvedVideo };
}
