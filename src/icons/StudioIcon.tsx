import type { SVGProps } from 'react';

export type IconName =
  | 'library'
  | 'collect'
  | 'curate'
  | 'caption'
  | 'upscale'
  | 'package'
  | 'settings'
  | 'help'
  | 'search'
  | 'pin'
  | 'close'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'crop'
  | 'check'
  | 'reject'
  | 'restore'
  | 'play'
  | 'stop'
  | 'upload'
  | 'download'
  | 'refresh'
  | 'sparkles'
  | 'folder'
  | 'zoom'
  | 'arrow-right'
  | 'warning'
  | 'server'
  | 'grid'
  | 'list'
  | 'trash'
  | 'plus'
  | 'sun'
  | 'moon'
  | 'workflow';

const paths: Record<IconName, React.ReactNode> = {
  library: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  collect: <><path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" /><circle cx="12" cy="12" r="3.5" /></>,
  curate: <><path d="M4 5.5h16" /><path d="M4 12h16" /><path d="M4 18.5h10" /><circle cx="18" cy="18.5" r="2" /></>,
  caption: <><path d="M5 5h14v11H9l-4 4V5Z" /><path d="M8.5 9h7" /><path d="M8.5 12h5" /></>,
  upscale: <><path d="M4 14v6h6" /><path d="M20 10V4h-6" /><path d="m14 10 6-6" /><path d="m4 20 6-6" /></>,
  package: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5" /><path d="M12 12v9" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.97 4.6 1.7 1.7 0 0 0 10 3.08V3h4v.08A1.7 1.7 0 0 0 15.03 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.52 1H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.4 2.4 0 1 1 3.2 2.25c-.6.24-.9.69-.9 1.25v.5" /><path d="M12 17h.01" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4.5 4.5" /></>,
  pin: <path d="m14 3 7 7-3 1-4 4-.5 3.5L10 15l-6 6 6-6-3.5-3.5L10 11l4-4 1-3Z" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-left': <path d="m15 18-6-6 6-6" />,
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  crop: <><path d="M6 3v13a2 2 0 0 0 2 2h13" /><path d="M3 6h13a2 2 0 0 1 2 2v13" /></>,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  reject: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  restore: <><path d="M4 8V4h4" /><path d="M4.6 4.6A9 9 0 1 1 3 12" /></>,
  play: <path d="m8 5 11 7-11 7V5Z" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="1" />,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></>,
  download: <><path d="M12 4v12" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" /></>,
  refresh: <><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M18.4 9a7 7 0 0 0-12-2L4 12" /><path d="M5.6 15a7 7 0 0 0 12 2l2-5" /></>,
  sparkles: <><path d="m12 3 1.25 4.25L17.5 8.5l-4.25 1.25L12 14l-1.25-4.25L6.5 8.5l4.25-1.25L12 3Z" /><path d="m18.5 14 .8 2.7 2.7.8-2.7.8-.8 2.7-.8-2.7-2.7-.8 2.7-.8.8-2.7Z" /></>,
  folder: <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z" />,
  zoom: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /><path d="M11 8v6M8 11h6" /></>,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  warning: <><path d="M12 4 3 20h18L12 4Z" /><path d="M12 9v5" /><path d="M12 17.5h.01" /></>,
  server: <><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01" /></>,
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="m6 7 1 14h10l1-14" /><path d="M10 11v6M14 11v6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></>,
  moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
  workflow: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h5a4 4 0 0 1 4 4v2" /><path d="m6 9 0 5a4 4 0 0 0 4 4h2" /></>,
};

export function StudioIcon({ name, size = 16, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
