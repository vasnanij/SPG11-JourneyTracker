import { Journey, Milestone, JournalEntry, JourneyPhoto, Profile } from '../types';

export interface UserExportBundle {
  exportedAt: string;
  application: string;
  userId: string;
  profile: Profile | null;
  journeys: Journey[];
  milestones: Milestone[];
  journalEntries: JournalEntry[];
  photos: JourneyPhoto[];
}

export function exportUserDataAsJSON(bundle: UserExportBundle): void {
  // Ensure strict user isolation in exported data
  const isolated: UserExportBundle = {
    ...bundle,
    journeys: bundle.journeys.filter((j) => j.user_id === bundle.userId),
    milestones: bundle.milestones.filter((m) => m.user_id === bundle.userId),
    journalEntries: bundle.journalEntries.filter((e) => e.user_id === bundle.userId),
    photos: bundle.photos.filter((p) => p.user_id === bundle.userId),
  };

  const jsonStr = JSON.stringify(isolated, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  triggerDownload(
    blob,
    `spg11-journey-export-${new Date().toISOString().slice(0, 10)}.json`
  );
}

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

export function exportUserDataAsCSV(bundle: UserExportBundle): void {
  const journeys = bundle.journeys.filter((j) => j.user_id === bundle.userId);
  const milestones = bundle.milestones.filter((m) => m.user_id === bundle.userId);
  const journalEntries = bundle.journalEntries.filter((e) => e.user_id === bundle.userId);

  const rows: string[] = [];
  rows.push(
    [
      'Record Type',
      'ID',
      'Journey ID',
      'Title',
      'Category / Status',
      'Start / Milestone / Entry Date',
      'End Date',
      'Progress / Completed',
      'Description / Content',
      'Personal Notes / Tags',
      'Created At',
    ]
      .map(escapeCsvCell)
      .join(',')
  );

  for (const j of journeys) {
    rows.push(
      [
        'Journey',
        j.id,
        j.id,
        j.title,
        `${j.category} (${j.status})`,
        j.start_date,
        j.end_date || '',
        `${j.progress_percentage}%`,
        j.description,
        `${j.personal_notes || ''} [Tags: ${(j.tags || []).join('; ')}]`,
        j.created_at,
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  }

  for (const m of milestones) {
    rows.push(
      [
        'Milestone',
        m.id,
        m.journey_id,
        m.title,
        m.is_completed ? 'Completed' : 'Pending',
        m.milestone_date,
        m.completed_at || '',
        m.is_completed ? '100%' : '0%',
        m.description,
        m.personal_notes || '',
        m.created_at,
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  }

  for (const e of journalEntries) {
    rows.push(
      [
        'Journal Entry',
        e.id,
        e.journey_id || '',
        e.title,
        'Private Entry',
        e.entry_date,
        '',
        '',
        e.content,
        '',
        e.created_at,
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  }

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(
    blob,
    `spg11-journey-export-${new Date().toISOString().slice(0, 10)}.csv`
  );
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
