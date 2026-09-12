import { GameFile } from '../types/file';
import { classifyFile, getFileExtension } from './categories';

const RAW_DEMO_FILES = [
  { name: 'resume_2026_final_v2.pdf', size: 1024 * 185 },
  { name: 'IMG_4092_beach_sunset.jpg', size: 1024 * 1024 * 3.4 },
  { name: 'quarterly_financials_Q3.xlsx', size: 1024 * 420 },
  { name: 'synthwave_chill_master.mp3', size: 1024 * 1024 * 8.2 },
  { name: 'FileSnake_PRD.docx', size: 1024 * 43 },
  { name: 'game_engine_core.ts', size: 1024 * 18 },
  { name: 'backup_database_archive.tar.gz', size: 1024 * 1024 * 45 },
  { name: 'vacation_drone_footage.mp4', size: 1024 * 1024 * 84 },
  { name: 'presentation_deck_pitch.pptx', size: 1024 * 1024 * 12 },
  { name: 'app_icon_vector.svg', size: 1024 * 8 },
  { name: 'podcast_interview_ep42.wav', size: 1024 * 1024 * 32 },
  { name: 'neural_network_weights.bin', size: 1024 * 1024 * 128 },
  { name: 'docker-compose.production.yml', size: 1024 * 3.5 },
  { name: 'avatar_render_3d.png', size: 1024 * 890 },
  { name: 'secret_agent_trailer.mov', size: 1024 * 1024 * 112 },
  { name: 'client_contract_signed.pdf', size: 1024 * 650 },
  { name: 'funny_cat_jump_fail.gif', size: 1024 * 1024 * 4.2 },
  { name: 'user_analytics_export.csv', size: 1024 * 88 },
  { name: 'ai_pinky_gesture_model.py', size: 1024 * 14 },
  { name: 'source_bundle_release.zip', size: 1024 * 1024 * 18 },
  { name: 'lofi_study_beats_loop.flac', size: 1024 * 1024 * 24 },
  { name: 'readme_getting_started.md', size: 1024 * 5 },
  { name: 'vintage_family_scan.webp', size: 1024 * 620 },
  { name: 'firmware_update_v1.4.iso', size: 1024 * 1024 * 250 },
  { name: 'game_soundtrack_theme.ogg', size: 1024 * 1024 * 6.5 },
  { name: 'product_wireframes.sketch', size: 1024 * 1024 * 8.8 },
  { name: 'tailwind.config.js', size: 1024 * 2.1 }
];

export function getDemoFiles(): GameFile[] {
  return RAW_DEMO_FILES.map((f, index) => {
    const ext = getFileExtension(f.name);
    return {
      id: `demo-${index}-${f.name}`,
      name: f.name,
      extension: ext,
      category: classifyFile(f.name),
      size: f.size,
      relativePath: `DemoFiles/${f.name}`
    };
  });
}
